// Pure operations on a ProjectData draft (safe to call inside an immer producer).
// Deputies are the single source of truth for seat allocation: party/faction seat counts are
// always derived from them, so statistics can never get out of sync.
import type { Deputy, DeputyNameStyle, Faction, Party, ProjectData } from "./types";
import { generateDeputyName } from "./deputyNames";

let counter = 0;
export const uid = (prefix: string) =>
  `${prefix}_${Date.now().toString(36).slice(-4)}${(counter++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const randomName = (style: DeputyNameStyle = "multicultural") => generateDeputyName(style);

export const deputyList = (d: ProjectData): Deputy[] => Object.values(d.deputies);
export const deputyCount = (d: ProjectData) => Object.keys(d.deputies).length;
export const freeSeats = (d: ProjectData) => Math.max(0, d.settings.totalSeats - deputyCount(d));
export const partyDeputies = (d: ProjectData, partyId: string) => deputyList(d).filter((x) => x.partyId === partyId);
export const independents = (d: ProjectData) => deputyList(d).filter((x) => !x.partyId);

/** Parties in display order; when enabled, parties of the same coalition sit side by side. */
export function orderedParties(d: ProjectData): Party[] {
  if (!d.settings.groupCoalitions) return d.parties;
  const seen = new Set<string>();
  const out: Party[] = [];
  for (const p of d.parties) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
    const c = d.coalitions.find((co) => co.partyIds.includes(p.id));
    if (!c) continue;
    for (const q of d.parties) {
      if (!seen.has(q.id) && c.partyIds.includes(q.id)) {
        seen.add(q.id);
        out.push(q);
      }
    }
  }
  return out;
}

/** Re-sort all deputies into seats: parties (grouped), then factions inside parties, then independents. */
export function arrange(d: ProjectData) {
  const N = d.settings.totalSeats;
  const all = deputyList(d);
  const byParty = new Map<string, Deputy[]>();
  const indep: Deputy[] = [];
  for (const dep of all) {
    if (dep.partyId && d.parties.some((p) => p.id === dep.partyId)) {
      if (!byParty.has(dep.partyId)) byParty.set(dep.partyId, []);
      byParty.get(dep.partyId)!.push(dep);
    } else indep.push(dep);
  }
  const ids: string[] = [];
  for (const party of orderedParties(d)) {
    const deps = byParty.get(party.id) ?? [];
    const facs = d.factions.filter((f) => f.partyId === party.id);
    const placed = new Set<string>();
    for (const f of facs) {
      for (const dep of deps) if (dep.factionId === f.id) {
        ids.push(dep.id);
        placed.add(dep.id);
      }
    }
    for (const dep of deps) if (!placed.has(dep.id)) ids.push(dep.id);
  }
  for (const dep of indep) ids.push(dep.id);
  const seats: (string | null)[] = ids.slice(0, N);
  while (seats.length < N) seats.push(null);
  d.seats = seats;
}

/** Keep seats consistent after any composition change. */
export function syncSeats(d: ProjectData) {
  if (!d.seatingLocked) {
    arrange(d);
    return;
  }
  const N = d.settings.totalSeats;
  const seats = d.seats.slice(0, N);
  while (seats.length < N) seats.push(null);
  const present = new Set<string>();
  for (let i = 0; i < seats.length; i++) {
    const id = seats[i];
    if (id && (!d.deputies[id] || present.has(id))) seats[i] = null;
    else if (id) present.add(id);
  }
  d.seats = seats;
  for (const dep of deputyList(d)) {
    if (present.has(dep.id)) continue;
    // nearest empty seat to the deputy's party mates
    const mates = d.seats.map((s, i) => (s && d.deputies[s]?.partyId === dep.partyId ? i : -1)).filter((i) => i >= 0);
    const anchor = mates.length ? mates[mates.length - 1] : 0;
    let best = -1;
    let bestDist = Infinity;
    for (let i = 0; i < d.seats.length; i++) {
      if (d.seats[i] === null && Math.abs(i - anchor) < bestDist) {
        best = i;
        bestDist = Math.abs(i - anchor);
      }
    }
    if (best >= 0) {
      d.seats[best] = dep.id;
      present.add(dep.id);
    } else {
      // no room: drop deputy (cannot happen when capacity is validated)
      delete d.deputies[dep.id];
    }
  }
}

export function makeDeputy(partial: Partial<Deputy> = {}, nameStyle: DeputyNameStyle = "multicultural"): Deputy {
  return {
    id: uid("d"),
    name: randomName(nameStyle),
    partyId: null,
    factionId: null,
    ideologyId: null,
    color: null,
    description: "",
    affiliation: "",
    role: "neutral",
    behavior: "ideology",
    ...partial,
  };
}

/** Add n deputies to a party (capacity must be validated by the caller). */
export function addPartyDeputies(d: ProjectData, party: Party, n: number) {
  const hasLeader = partyDeputies(d, party.id).some((x) => x.isLeader);
  for (let i = 0; i < n; i++) {
    const asLeader = !hasLeader && i === 0 && !!party.leader.trim();
    const dep = makeDeputy({
      partyId: party.id,
      name: asLeader && party.leader ? party.leader : randomName(d.settings.genericDeputyNames),
      isLeader: asLeader || undefined,
    });
    d.deputies[dep.id] = dep;
  }
  syncSeats(d);
}

/** Remove n deputies from a party: unfactioned first, then from the largest faction; leaders last. */
export function removePartyDeputies(d: ProjectData, partyId: string, n: number) {
  const deps = partyDeputies(d, partyId);
  const removed = new Set<string>();
  for (const x of [...deps].reverse()) {
    if (removed.size >= n) break;
    if (!x.factionId && !x.isLeader) removed.add(x.id);
  }
  while (removed.size < n) {
    const groups = new Map<string, Deputy[]>();
    for (const x of deps) {
      if (!removed.has(x.id) && x.factionId) groups.set(x.factionId, [...(groups.get(x.factionId) ?? []), x]);
    }
    if (!groups.size) break;
    const biggest = [...groups.values()].sort((a, b) => b.length - a.length)[0];
    const pick = [...biggest].reverse().find((x) => !x.isLeader) ?? biggest[biggest.length - 1];
    removed.add(pick.id);
  }
  for (const x of deps) {
    if (removed.size >= n) break;
    removed.add(x.id);
  }
  for (const id of removed) delete d.deputies[id];
  syncSeats(d);
}

export type Result = { ok: true } | { ok: false; error: string };
const ok: Result = { ok: true };
const fail = (error: string): Result => ({ ok: false, error });

export function setPartyCount(d: ProjectData, partyId: string, n: number): Result {
  const party = d.parties.find((p) => p.id === partyId);
  if (!party) return fail("Party not found.");
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0) return fail("Seat count must be a whole number of 0 or more.");
  const cur = partyDeputies(d, partyId).length;
  const delta = n - cur;
  if (delta > freeSeats(d)) {
    return fail(`Not enough unallocated seats: ${freeSeats(d)} free, but ${delta} more requested. Increase total seats or reduce another party.`);
  }
  if (delta > 0) addPartyDeputies(d, party, delta);
  else if (delta < 0) removePartyDeputies(d, partyId, -delta);
  return ok;
}

export function setFactionCount(d: ProjectData, factionId: string, n: number): Result {
  const f = d.factions.find((x) => x.id === factionId);
  if (!f) return fail("Faction not found.");
  if (!Number.isInteger(n) || n < 0) return fail("Faction size must be a whole number of 0 or more.");
  const members = deputyList(d).filter((x) => x.factionId === factionId);
  const loose = deputyList(d).filter((x) => x.partyId === f.partyId && !x.factionId);
  const delta = n - members.length;
  if (delta > loose.length) {
    return fail(`Party only has ${loose.length} deputies not yet in a faction; ${delta} more requested. Add seats to the party first.`);
  }
  if (delta > 0) loose.slice(0, delta).forEach((x) => (d.deputies[x.id].factionId = factionId));
  else if (delta < 0) members.slice(members.length + delta).forEach((x) => (d.deputies[x.id].factionId = null));
  syncSeats(d);
  return ok;
}

/** Largest-remainder apportionment of `total` according to weights. */
export function apportion(weights: number[], total: number): number[] {
  const w = weights.map((x) => (Number.isFinite(x) && x > 0 ? x : 0));
  const sum = w.reduce((a, b) => a + b, 0);
  if (sum <= 0 || total <= 0) return w.map(() => 0);
  const ideal = w.map((x) => (x / sum) * total);
  const out = ideal.map(Math.floor);
  let rest = total - out.reduce((a, b) => a + b, 0);
  const order = ideal.map((v, i) => ({ i, f: v - Math.floor(v) })).sort((a, b) => b.f - a.f);
  for (let k = 0; rest > 0 && order.length; k = (k + 1) % order.length) {
    out[order[k].i]++;
    rest--;
  }
  return out;
}

/** Set party seat counts directly from a target map; validates capacity before mutating. */
export function applyPartyCounts(d: ProjectData, targets: Record<string, number>): Result {
  let sum = independents(d).length;
  for (const p of d.parties) sum += targets[p.id] ?? partyDeputies(d, p.id).length;
  if (sum > d.settings.totalSeats) return fail(`Allocation of ${sum} seats exceeds the parliament capacity of ${d.settings.totalSeats}.`);
  // shrink first to free capacity, then grow
  for (const p of d.parties) {
    const t = targets[p.id];
    if (t === undefined) continue;
    const cur = partyDeputies(d, p.id).length;
    if (t < cur) removePartyDeputies(d, p.id, cur - t);
  }
  for (const p of d.parties) {
    const t = targets[p.id];
    if (t === undefined) continue;
    const cur = partyDeputies(d, p.id).length;
    if (t > cur) addPartyDeputies(d, p, t - cur);
  }
  return ok;
}

/** Distribute all non-independent seats among parties by weights (e.g. vote percentages). */
export function distributeByWeights(d: ProjectData, weights: Record<string, number>, fillAll = true): Result {
  if (!d.parties.length) return fail("Create at least one party first.");
  const avail = fillAll ? d.settings.totalSeats - independents(d).length : freeSeats(d) + d.parties.reduce((a, p) => a + partyDeputies(d, p.id).length, 0);
  if (avail < 0) return fail("Independents alone exceed the parliament capacity.");
  const w = d.parties.map((p) => weights[p.id] ?? 0);
  if (w.every((x) => !(x > 0))) return fail("Enter at least one positive weight or percentage.");
  const counts = apportion(w, avail);
  const targets: Record<string, number> = {};
  d.parties.forEach((p, i) => (targets[p.id] = counts[i]));
  return applyPartyCounts(d, targets);
}

/** Change total seats. "strict" refuses to cut below allocated seats; "proportional" rescales parties. */
export function resizeParliament(d: ProjectData, newTotal: number, mode: "strict" | "proportional"): Result {
  if (!Number.isInteger(newTotal) || newTotal < 1) return fail("Total seats must be a whole number of at least 1.");
  if (newTotal > 20000) return fail("Total seats is capped at 20,000 to keep the interface responsive.");
  const allocated = deputyCount(d);
  if (newTotal >= allocated) {
    d.settings.totalSeats = newTotal;
    syncSeats(d);
    return ok;
  }
  if (mode === "strict") {
    return fail(`${allocated} seats are allocated; cannot reduce to ${newTotal}. Remove seats from parties first or use "Rescale proportionally".`);
  }
  const ind = independents(d);
  if (ind.length > newTotal) return fail(`There are ${ind.length} independent deputies; remove some first or choose a larger total.`);
  d.seatingLocked = false; // shrinking requires a full re-arrangement
  const partyCounts = d.parties.map((p) => partyDeputies(d, p.id).length);
  const target = apportion(partyCounts, newTotal - ind.length);
  const targets: Record<string, number> = {};
  d.parties.forEach((p, i) => (targets[p.id] = target[i]));
  d.settings.totalSeats = newTotal;
  // shrink parties
  for (const p of d.parties) {
    const cur = partyDeputies(d, p.id).length;
    if (targets[p.id] < cur) removePartyDeputies(d, p.id, cur - targets[p.id]);
  }
  syncSeats(d);
  return ok;
}

export function removeFactionRefs(d: ProjectData, factionId: string) {
  for (const dep of deputyList(d)) if (dep.factionId === factionId) dep.factionId = null;
}

export function deletePartyCascade(d: ProjectData, partyId: string) {
  for (const dep of deputyList(d)) if (dep.partyId === partyId) delete d.deputies[dep.id];
  d.factions = d.factions.filter((f) => f.partyId !== partyId);
  d.coalitions.forEach((c) => (c.partyIds = c.partyIds.filter((x) => x !== partyId)));
  d.parties = d.parties.filter((p) => p.id !== partyId);
  syncSeats(d);
}

export function mergeParties(d: ProjectData, sourceIds: string[], targetId: string): Result {
  const target = d.parties.find((p) => p.id === targetId);
  if (!target) return fail("Target party not found.");
  const sources = sourceIds.filter((id) => id !== targetId && d.parties.some((p) => p.id === id));
  if (!sources.length) return fail("Select at least one other party to merge into the target.");
  for (const dep of deputyList(d)) {
    if (dep.partyId && sources.includes(dep.partyId)) dep.partyId = targetId; // faction membership is kept
  }
  for (const f of d.factions) if (sources.includes(f.partyId)) f.partyId = targetId;
  d.coalitions.forEach((c) => {
    const had = c.partyIds.some((x) => sources.includes(x));
    c.partyIds = c.partyIds.filter((x) => !sources.includes(x));
    if (had && !c.partyIds.includes(targetId)) c.partyIds.push(targetId);
  });
  d.parties = d.parties.filter((p) => !sources.includes(p.id));
  syncSeats(d);
  return ok;
}

export function newFaction(partyId: string, color: string, partial: Partial<Faction> = {}): Faction {
  return { id: uid("f"), partyId, name: "New faction", abbr: "", color, ideologyId: null, description: "", leader: "", ...partial };
}
