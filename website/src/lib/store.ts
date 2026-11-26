import { create } from "zustand";
import { migrateLegacyProjects, projectsStorage, type ProjectBackup } from "./projectStorage";
import { current,  produce } from "immer";
import type {
  Coalition,
  Deputy,
  Faction,
  Ideology,
  IdeologyFamilyId,
  Issue,
  Layer,
  Party,
  Prefs,
  ProjectData,
  Role,
} from "./types";
import {
  addPartyDeputies,
  deletePartyCascade,
  deputyList,
  distributeByWeights,
  freeSeats,
  makeDeputy,
  mergeParties,
  newFaction,
  partyDeputies,
  removeFactionRefs,
  resizeParliament,
  setFactionCount,
  setPartyCount,
  syncSeats,
  arrange,
  uid,
  independents,
  type Result,
} from "./parliament";
import { newIssue, normalizeProject, sampleProject } from "./defaults";
import { createRecord, lookupIdeology } from "./voting";
import { compareIdeologies } from "@/data/ideologies";
import { simulateElection } from "./elections";

export type Tab = "parliament" | "government" | "parties" | "coalitions" | "factions" | "ideologies" | "voting" | "statistics" | "settings";
export type Focus = { type: "party" | "faction" | "coalition" | "independents"; id: string } | null;
export type SaveState = "saved" | "dirty" | "saving" | "error";

export interface ProjectSummary {
  id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
  seats: number;
  parties: number;
  votes: number;
}

interface UIState {
  tab: Tab;
  layer: Layer;
  focus: Focus;
  selectedSeat: number | null;
  sideOpen: boolean;
  theme: "light" | "dark";
  saveState: SaveState;
  lastSaved: number | null;
  activeRecordId: string | null;
  showVotes: boolean;
  animToken: number;
  toast: { id: number; msg: string; kind: "ok" | "error" | "info" } | null;
  activeIssueId: string | null;
  projectsOpen: boolean;
  ready: boolean;
}

interface Store {
  meta: { id: string | null; name: string };
  data: ProjectData;
  ui: UIState;
  // lifecycle
  loadProject: (id: string, name: string, data: unknown) => void;
  setName: (name: string) => void;
  patchUI: (patch: Partial<UIState>) => void;
  toast: (msg: string, kind?: "ok" | "error" | "info") => void;
  // generic
  mutate: (fn: (d: ProjectData) => Result | void) => Result;
  updateSettings: (patch: Partial<ProjectData["settings"]>) => void;
  updatePrefs: (fn: (p: Prefs) => void) => void;
  resizeTotal: (n: number, mode: "strict" | "proportional") => Result;
  // parties
  addParty: (p: Partial<Party>, seats: number) => Result;
  updateParty: (id: string, patch: Partial<Party>) => void;
  deleteParty: (id: string) => void;
  duplicateParty: (id: string) => void;
  mergeParties: (sources: string[], target: string) => Result;
  setPartySeats: (id: string, n: number) => Result;
  moveParty: (id: string, dir: -1 | 1) => void;
  sortPartiesByIdeology: () => void;
  distribute: (weights: Record<string, number>) => Result;
  runElection: (randomness: number, momentumFamily: IdeologyFamilyId | null, momentumStrength: number) => Result;
  // deputies / seats
  addIndependents: (count: number, names: string, tpl: Partial<Deputy>) => Result;
  updateDeputy: (id: string, patch: Partial<Deputy>) => void;
  removeDeputy: (id: string) => void;
  assignSeat: (seat: number, target: { kind: "vacant" } | { kind: "party"; partyId: string } | { kind: "independent" }) => Result;
  swapSeats: (a: number, b: number) => Result;
  setLocked: (locked: boolean) => void;
  // factions
  addFaction: (partyId: string, p: Partial<Faction>, seats: number) => Result;
  updateFaction: (id: string, patch: Partial<Faction>) => void;
  deleteFaction: (id: string) => void;
  setFactionSeats: (id: string, n: number) => Result;
  assignFaction: (deputyId: string, factionId: string | null) => Result;
  // coalitions
  addCoalition: (p: Partial<Coalition>) => string;
  updateCoalition: (id: string, patch: Partial<Coalition>) => void;
  deleteCoalition: (id: string) => void;
  toggleCoalitionParty: (cid: string, pid: string) => void;
  // ideologies
  saveCustomIdeology: (i: Ideology) => void;
  deleteCustomIdeology: (id: string) => void;
  // issues & votes
  addIssue: (partial?: Partial<Issue>) => string;
  updateIssue: (id: string, fn: (i: Issue) => void) => void;
  deleteIssue: (id: string) => void;
  duplicateIssue: (id: string) => string;
  runVote: (issueId: string) => string | null;
  repeatVote: (recordId: string) => string | null;
  deleteRecord: (id: string) => void;
  renameRecord: (id: string, name: string) => void;
}

const empty = sampleProject; // placeholder initial state before a project loads

let toastId = 1;

export const useStore = create<Store>((set, get) => {
  const run = (fn: (d: ProjectData) => Result | void): Result => {
    let res: Result = { ok: true };
    const next = produce(get().data, (d) => {
      const r = fn(d);
      if (r) res = r;
    });
    if (res.ok && next !== get().data) set((s) => ({ data: next, ui: { ...s.ui, saveState: "dirty" } }));
    return res;
  };
  const notify = (r: Result) => {
    if (!r.ok) get().toast(r.error, "error");
    return r;
  };

  return {
    meta: { id: null, name: "Loading…" },
    data: empty(),
    ui: {
      tab: "parliament",
      layer: "standard",
      focus: null,
      selectedSeat: null,
      sideOpen: true,
      theme: "light",
      saveState: "saved",
      lastSaved: null,
      activeRecordId: null,
      showVotes: false,
      animToken: 0,
      toast: null,
      activeIssueId: null,
      projectsOpen: false,
      ready: false,
    },

    loadProject: (id, name, raw) => {
      const data = normalizeProject(raw);
      set((s) => ({
        meta: { id, name },
        data,
        ui: {
          ...s.ui,
          saveState: "saved",
          focus: null,
          selectedSeat: null,
          activeRecordId: data.history.length ? data.history[data.history.length - 1].id : null,
          showVotes: false,
          activeIssueId: data.issues[0]?.id ?? null,
          ready: true,
        },
      }));
    },
    setName: (name) => set((s) => ({ meta: { ...s.meta, name }, ui: { ...s.ui, saveState: "dirty" } })),
    patchUI: (patch) => set((s) => ({ ui: { ...s.ui, ...patch } })),
    toast: (msg, kind = "info") => set((s) => ({ ui: { ...s.ui, toast: { id: toastId++, msg, kind } } })),

    mutate: (fn) => notify(run(fn)),
    updateSettings: (patch) =>
      run((d) => {
        const { totalSeats: _ignored, ...rest } = patch;
        void _ignored;
        Object.assign(d.settings, rest);
        if (patch.seatOrder !== undefined || patch.groupCoalitions !== undefined) syncSeats(d);
      }),
    updatePrefs: (fn) =>
      void run((d) => {
        fn(d.prefs);
      }),
    resizeTotal: (n, mode) => notify(run((d) => resizeParliament(d, n, mode))),

    addParty: (p, seats) =>
      notify(
        run((d) => {
          const n = Math.floor(seats);
          if (!Number.isFinite(n) || n < 0) return { ok: false, error: "Seat count must be a whole number of 0 or more." };
          if (n > freeSeats(d)) return { ok: false, error: `Only ${freeSeats(d)} unallocated seats remain; cannot allocate ${n}.` };
          const party: Party = {
            id: uid("p"),
            name: "New party",
            abbr: "NEW",
            color: "#64748b",
            leader: "",
            ideologyId: null,
            description: "",
            symbol: "",
            meta: [],
            role: "neutral",
            ...p,
          };
          d.parties.push(party);
          addPartyDeputies(d, party, n);
        }),
      ),
    updateParty: (id, patch) =>
      run((d) => {
        const p = d.parties.find((x) => x.id === id);
        if (!p) return;
        Object.assign(p, patch);
        if (patch.leader !== undefined) {
          const dep = partyDeputies(d, id).find((x) => x.isLeader);
          if (dep && patch.leader.trim()) dep.name = patch.leader.trim();
        }
      }),
    deleteParty: (id) => {
      run((d) => deletePartyCascade(d, id));
      const s = get();
      if (s.ui.focus?.id === id) s.patchUI({ focus: null });
    },
    duplicateParty: (id) =>
      run((d) => {
        const p = d.parties.find((x) => x.id === id);
        if (!p) return;
        const copy: Party = { ...structuredClone(current(p)), id: uid("p"), name: p.name + " (copy)", abbr: p.abbr + "2" };
        d.parties.splice(d.parties.indexOf(p) + 1, 0, copy);
        for (const f of d.factions.filter((x) => x.partyId === id)) d.factions.push({ ...structuredClone(current(f)), id: uid("f"), partyId: copy.id });
        const n = Math.min(freeSeats(d), partyDeputies(d, id).length);
        if (n > 0) addPartyDeputies(d, copy, n);
        else syncSeats(d);
      }),
    mergeParties: (sources, target) => notify(run((d) => mergeParties(d, sources, target))),
    setPartySeats: (id, n) => notify(run((d) => setPartyCount(d, id, n))),
    moveParty: (id, dir) =>
      run((d) => {
        const i = d.parties.findIndex((p) => p.id === id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= d.parties.length) return;
        [d.parties[i], d.parties[j]] = [d.parties[j], d.parties[i]];
        syncSeats(d);
      }),
    sortPartiesByIdeology: () =>
      run((d) => {
        const ideology = (p: Party) => lookupIdeology(d.customIdeologies, p.ideologyId);
        d.parties.sort((a, b) => compareIdeologies(ideology(a), ideology(b)));
        d.seatingLocked = false;
        syncSeats(d);
      }),
    distribute: (weights) => notify(run((d) => distributeByWeights(d, weights, true))),
    runElection: (randomness, momentumFamily, momentumStrength) => notify(run((d) => simulateElection(d, randomness, momentumFamily, momentumStrength))),

    addIndependents: (count, names, tpl) =>
      notify(
        run((d) => {
          const list = names
            .split(/\n|,/)
            .map((x) => x.trim())
            .filter(Boolean);
          const n = list.length || Math.floor(count);
          if (!Number.isFinite(n) || n < 1) return { ok: false, error: "Enter a number of deputies (1 or more) or a list of names." };
          if (n > freeSeats(d)) return { ok: false, error: `Only ${freeSeats(d)} unallocated seats remain; cannot add ${n} independents.` };
          for (let i = 0; i < n; i++) {
            const dep = makeDeputy({ ...tpl, ...(list[i] ? { name: list[i] } : {}) }, d.settings.genericDeputyNames);
            d.deputies[dep.id] = dep;
          }
          syncSeats(d);
        }),
      ),
    updateDeputy: (id, patch) =>
      run((d) => {
        const dep = d.deputies[id];
        if (!dep) return;
        Object.assign(dep, patch);
      }),
    removeDeputy: (id) =>
      run((d) => {
        delete d.deputies[id];
        syncSeats(d);
      }),
    assignSeat: (seat, target) =>
      notify(
        run((d) => {
          if (seat < 0 || seat >= d.settings.totalSeats) return { ok: false, error: "Seat does not exist." };
          const cur = d.seats[seat] ? d.deputies[d.seats[seat]!] : undefined;
          d.seatingLocked = true;
          if (target.kind === "vacant") {
            if (cur) delete d.deputies[cur.id];
            d.seats[seat] = null;
          } else if (target.kind === "independent") {
            if (cur) {
              cur.partyId = null;
              cur.factionId = null;
              cur.isLeader = undefined;
            } else {
              const dep = makeDeputy({}, d.settings.genericDeputyNames);
              d.deputies[dep.id] = dep;
              d.seats[seat] = dep.id;
            }
          } else {
            const party = d.parties.find((p) => p.id === target.partyId);
            if (!party) return { ok: false, error: "Party not found." };
            if (cur) {
              if (cur.partyId !== party.id) {
                cur.partyId = party.id;
                cur.factionId = null;
                cur.isLeader = undefined;
              }
            } else {
              const dep = makeDeputy({ partyId: party.id }, d.settings.genericDeputyNames)
              d.deputies[dep.id] = dep;
              d.seats[seat] = dep.id;
            }
          }
        }),
      ),
    swapSeats: (a, b) =>
      notify(
        run((d) => {
          const n = d.settings.totalSeats;
          if (a < 0 || b < 0 || a >= n || b >= n) return { ok: false, error: "Seat number out of range." };
          [d.seats[a], d.seats[b]] = [d.seats[b], d.seats[a]];
          d.seatingLocked = true;
        }),
      ),
    setLocked: (locked) =>
      run((d) => {
        d.seatingLocked = locked;
        if (!locked) arrange(d);
      }),

    addFaction: (partyId, p, seats) =>
      notify(
        run((d) => {
          if (!d.parties.some((x) => x.id === partyId)) return { ok: false, error: "Choose a party for the faction." };
          const f = newFaction(partyId, "#64748b", p);
          d.factions.push(f);
          const r = setFactionCount(d, f.id, Math.floor(seats) || 0);
          if (!r.ok) {
            d.factions = d.factions.filter((x) => x.id !== f.id);
            return r;
          }
        }),
      ),
    updateFaction: (id, patch) =>
      run((d) => {
        const f = d.factions.find((x) => x.id === id);
        if (f) Object.assign(f, patch);
      }),
    deleteFaction: (id) =>
      run((d) => {
        d.factions = d.factions.filter((f) => f.id !== id);
        removeFactionRefs(d, id);
        syncSeats(d);
      }),
    setFactionSeats: (id, n) => notify(run((d) => setFactionCount(d, id, n))),
    assignFaction: (deputyId, factionId) =>
      notify(
        run((d) => {
          const dep = d.deputies[deputyId];
          if (!dep) return { ok: false, error: "Deputy not found." };
          if (factionId) {
            const f = d.factions.find((x) => x.id === factionId);
            if (!f) return { ok: false, error: "Faction not found." };
            if (f.partyId !== dep.partyId) return { ok: false, error: "A deputy can only join a faction of their own party." };
          }
          dep.factionId = factionId;
          syncSeats(d);
        }),
      ),

    addCoalition: (p) => {
      const id = uid("c");
      run((d) => {
        d.coalitions.push({
          id,
          name: "New coalition",
          abbr: "COA",
          color: "#f5b700",
          description: "",
          partyIds: [],
          leader: "",
          orientation: "",
          ideologyId: null,
          ...p,
        });
        syncSeats(d);
      });
      return id;
    },
    updateCoalition: (id, patch) =>
      run((d) => {
        const c = d.coalitions.find((x) => x.id === id);
        if (c) Object.assign(c, patch);
      }),
    deleteCoalition: (id) =>
      run((d) => {
        d.coalitions = d.coalitions.filter((c) => c.id !== id);
        if (d.governingCoalitionId === id) d.governingCoalitionId = null;
        syncSeats(d);
      }),
    toggleCoalitionParty: (cid, pid) =>
      run((d) => {
        const c = d.coalitions.find((x) => x.id === cid);
        if (!c) return;
        c.partyIds = c.partyIds.includes(pid) ? c.partyIds.filter((x) => x !== pid) : [...c.partyIds, pid];
        syncSeats(d);
      }),

    saveCustomIdeology: (i) =>
      run((d) => {
        const idx = d.customIdeologies.findIndex((x) => x.id === i.id);
        if (idx >= 0) d.customIdeologies[idx] = i;
        else d.customIdeologies.push(i);
      }),
    deleteCustomIdeology: (id) =>
      run((d) => {
        d.customIdeologies = d.customIdeologies.filter((i) => i.id !== id);
        for (const p of d.parties) if (p.ideologyId === id) p.ideologyId = null;
        for (const f of d.factions) if (f.ideologyId === id) f.ideologyId = null;
        for (const c of d.coalitions) if (c.ideologyId === id) c.ideologyId = null;
        for (const dep of deputyList(d)) if (dep.ideologyId === id) dep.ideologyId = null;
        for (const is of d.issues) delete is.ideologyPositions[id];
      }),

    addIssue: (partial) => {
      let id = "";
      run((d) => {
        const i = newIssue(current(d.prefs), partial);
        id = i.id;
        d.issues.push(i);
      });
      get().patchUI({ activeIssueId: id });
      return id;
    },
    updateIssue: (id, fn) =>
      run((d) => {
        const i = d.issues.find((x) => x.id === id);
        if (i) fn(i);
      }),
    deleteIssue: (id) => {
      run((d) => {
        d.issues = d.issues.filter((i) => i.id !== id);
      });
      const s = get();
      if (s.ui.activeIssueId === id) s.patchUI({ activeIssueId: s.data.issues[0]?.id ?? null });
    },
    duplicateIssue: (id) => {
      let nid = "";
      run((d) => {
        const i = d.issues.find((x) => x.id === id);
        if (!i) return;
        const c = structuredClone(current(i));
        c.id = uid("i");
        c.name = i.name + " (copy)";
        nid = c.id;
        d.issues.push(c);
      });
      if (nid) get().patchUI({ activeIssueId: nid });
      return nid;
    },
    runVote: (issueId) => {
      const issue = get().data.issues.find((i) => i.id === issueId);
      if (!issue) return null;
      if (!deputyList(get().data).length) {
        get().toast("The parliament has no deputies to vote. Create parties or independents first.", "error");
        return null;
      }
      const seed = Math.floor(Math.random() * 2 ** 31);
      const rec = createRecord(get().data, issue, seed);
      run((d) => {
        d.history.push(rec);
      });
      set((s) => ({ ui: { ...s.ui, activeRecordId: rec.id, showVotes: true, animToken: s.ui.animToken + 1 } }));
      return rec.id;
    },
    repeatVote: (recordId) => {
      const old = get().data.history.find((r) => r.id === recordId);
      if (!old) return null;
      const seed = Math.floor(Math.random() * 2 ** 31);
      const rec = createRecord(get().data, structuredClone(old.issue), seed);
      run((d) => {
        d.history.push(rec);
      });
      set((s) => ({ ui: { ...s.ui, activeRecordId: rec.id, showVotes: true, animToken: s.ui.animToken + 1 } }));
      return rec.id;
    },
    deleteRecord: (id) => {
      run((d) => {
        d.history = d.history.filter((r) => r.id !== id);
      });
      const s = get();
      if (s.ui.activeRecordId === id) s.patchUI({ activeRecordId: s.data.history[s.data.history.length - 1]?.id ?? null, showVotes: false });
    },
    renameRecord: (id, name) =>
      run((d) => {
        const r = d.history.find((x) => x.id === id);
        if (r) r.issue.name = name;
      }),
  };
});

export const roleLabels: Record<Role, string> = {
  government: "Government",
  opposition: "Opposition",
  confidence: "Confidence & supply",
  neutral: "Neutral",
  supporter: "Independent supporter",
};

// ---------------- IndexedDB API for persistent browser projects ----------------
function summarizeProject(project: Awaited<ReturnType<typeof projectsStorage.get>>): ProjectSummary {
  const data = project.data as Partial<ProjectData> | null;
  return { id: project.id, name: project.name, createdAt: project.createdAt, updatedAt: project.updatedAt,
    seats: Number(data?.settings?.totalSeats ?? 0) || 0,
    parties: Array.isArray(data?.parties) ? data.parties.length : 0,
    votes: Array.isArray(data?.history) ? data.history.length : 0 };
}
export const projectsApi = {
  async list(): Promise<ProjectSummary[]> {
    await migrateLegacyProjects(); return (await projectsStorage.list()).map(summarizeProject);
  },
  async create(name: string, data: unknown): Promise<{ id: string; name: string }> {
    await migrateLegacyProjects(); return projectsStorage.create(name, data);
  },
  async get(id: string): Promise<{ id: string; name: string; data: unknown }> {
    await migrateLegacyProjects(); const p = await projectsStorage.get(id); return { id: p.id, name: p.name, data: p.data };
  },
  async save(id: string, name: string, data: unknown): Promise<void> { return projectsStorage.save(id, name, data); },
  async rename(id: string, name: string): Promise<void> { return projectsStorage.rename(id, name); },
  async remove(id: string): Promise<void> { return projectsStorage.remove(id); },
  async listBackups(id: string): Promise<ProjectBackup[]> { return projectsStorage.listBackups(id); },
  async createBackup(id: string): Promise<void> { return projectsStorage.createBackup(id); },
  async restoreBackup(id: string, backupId: string): Promise<void> { return projectsStorage.restoreBackup(id, backupId); },
};
export async function saveNow(): Promise<boolean> {
  const { meta, data } = useStore.getState();
  if (!meta.id) return false;
  useStore.getState().patchUI({ saveState: "saving" });
  try {
    await projectsApi.save(meta.id, meta.name, data);
    const still = useStore.getState();
    useStore.getState().patchUI({ saveState: still.data === data && still.meta.name === meta.name ? "saved" : "dirty", lastSaved: Date.now() });
    return true;
  } catch {
    useStore.getState().patchUI({ saveState: "error" });
    return false;
  }
}

export const deputyListOf = (d: ProjectData) => deputyList(d);
export const independentsOf = (d: ProjectData) => independents(d);
