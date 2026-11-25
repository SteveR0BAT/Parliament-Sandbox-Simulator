"use client";
import { useMemo, useState } from "react";
import { IDEOLOGY_FAMILIES } from "@/data/ideologies";
import { useStore } from "@/lib/store";
import type { IdeologyFamilyId, Issue, MixedMethod, Position, PositionSpec, Vote } from "@/lib/types";
import { POSITION_LABELS, VOTE_LABELS, normalize } from "@/lib/voting";
import { IdeologySelect, allIdeologies } from "./IdeologyPicker";
import { Empty, Field, NumInput, Swatch } from "./ui";
import { deputyList } from "@/lib/parliament";

type Upd = (fn: (i: Issue) => void) => void;

export function VoteSelect({ value, onChange, allowUnset = true }: { value: Vote | undefined; onChange: (v: Vote | undefined) => void; allowUnset?: boolean }) {
  return (
    <select className="select !py-1" value={value ?? ""} onChange={(e) => onChange((e.target.value || undefined) as Vote | undefined)}>
      {allowUnset && <option value="">— not set —</option>}
      {(Object.keys(VOTE_LABELS) as Vote[]).map((v) => (
        <option key={v} value={v}>
          {VOTE_LABELS[v]}
        </option>
      ))}
    </select>
  );
}

export function PositionPicker({ spec, onChange }: { spec: PositionSpec | undefined; onChange: (s: PositionSpec | undefined) => void }) {
  return (
    <div className="space-y-1">
      <select
        className="select !py-1"
        value={spec?.pos ?? ""}
        onChange={(e) => {
          const v = e.target.value as Position | "";
          if (!v) return onChange(undefined);
          onChange(v === "custom" ? { pos: "custom", pFor: spec?.pFor ?? 40, pAgainst: spec?.pAgainst ?? 40, pAbstain: spec?.pAbstain ?? 20 } : { pos: v });
        }}
      >
        <option value="">— unset —</option>
        {(Object.keys(POSITION_LABELS) as Position[]).map((p) => (
          <option key={p} value={p}>
            {POSITION_LABELS[p]}
          </option>
        ))}
      </select>
      {spec?.pos === "custom" && (
        <div className="grid grid-cols-3 gap-1 text-[10px]">
          {(["pFor", "pAgainst", "pAbstain"] as const).map((k) => (
            <div key={k}>
              <span className="muted">{k === "pFor" ? "For %" : k === "pAgainst" ? "Against %" : "Abstain %"}</span>
              <NumInput value={spec[k] ?? 0} min={0} max={100} onCommit={(n) => onChange({ ...spec, [k]: n })} />
            </div>
          ))}
          <div className="col-span-3 muted">
            Normalised: {normalize([spec.pFor ?? 0, spec.pAgainst ?? 0, spec.pAbstain ?? 0]).map((x) => Math.round(x * 100)).join(" / ")}
          </div>
        </div>
      )}
    </div>
  );
}

export function PartyDecisions({ issue, update }: { issue: Issue; update: Upd }) {
  const parties = useStore((s) => s.data.parties);
  if (!parties.length) return <Empty>No parties to configure.</Empty>;
  return (
    <div className="space-y-1.5">
      {parties.map((p) => (
        <div key={p.id} className="grid grid-cols-[1fr_140px] items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 truncate">
            <Swatch color={p.color} /> <b>{p.abbr}</b> <span className="muted truncate">{p.name}</span>
          </span>
          <VoteSelect value={issue.partyVotes[p.id]} onChange={(v) => update((i) => (v ? (i.partyVotes[p.id] = v) : delete i.partyVotes[p.id]))} />
        </div>
      ))}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {(["for", "against", "abstain"] as Vote[]).map((v) => (
          <button key={v} className="btn btn-sm" onClick={() => update((i) => parties.forEach((p) => (i.partyVotes[p.id] = v)))}>
            All {VOTE_LABELS[v]}
          </button>
        ))}
        <button className="btn btn-sm" onClick={() => update((i) => (i.partyVotes = {}))}>
          Clear
        </button>
      </div>
    </div>
  );
}

export function FactionDecisions({ issue, update }: { issue: Issue; update: Upd }) {
  const data = useStore((s) => s.data);
  if (!data.factions.length) return <Empty>No factions yet. Create some in the Factions tab; deputies without a faction follow their party line.</Empty>;
  return (
    <div className="space-y-2">
      {data.parties.map((p) => {
        const facs = data.factions.filter((f) => f.partyId === p.id);
        if (!facs.length) return null;
        return (
          <div key={p.id} className="card p-2">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-bold">
              <Swatch color={p.color} /> {p.abbr}
            </div>
            {facs.map((f) => (
              <div key={f.id} className="mb-1 grid grid-cols-[1fr_140px] items-center gap-2 text-xs">
                <span className="flex items-center gap-1.5 truncate">
                  <Swatch color={f.color} /> {f.name}
                </span>
                <VoteSelect value={issue.factionVotes[f.id]} onChange={(v) => update((i) => (v ? (i.factionVotes[f.id] = v) : delete i.factionVotes[f.id]))} />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export function IdeologyConfig({ issue, update }: { issue: Issue; update: Upd }) {
  const custom = useStore((s) => s.data.customIdeologies);
  const all = useMemo(() => allIdeologies(custom), [custom]);
  const [pick, setPick] = useState<string | null>(null);
  const entries = Object.entries(issue.ideologyPositions);
  return (
    <div className="space-y-3">
      <div>
        <span className="label">Position of each ideological family (all optional)</span>
        <div className="space-y-2">
          {IDEOLOGY_FAMILIES.map((family) => (
            <div key={family.id} className="grid grid-cols-[minmax(130px,1fr)_1fr] items-start gap-2 text-xs">
              <span className="flex items-center gap-1.5 pt-1 font-semibold" style={{ color: family.color }}>
                <Swatch color={family.color} /> {family.label}
              </span>
              <PositionPicker spec={issue.groupPositions[family.id]} onChange={(s) => update((i) => (s ? (i.groupPositions[family.id as IdeologyFamilyId] = s) : delete i.groupPositions[family.id as IdeologyFamilyId]))} />
            </div>
          ))}
        </div>
        <button className="btn btn-sm mt-2" onClick={() => update((i) => (i.groupPositions = {}))}>
          Clear all family positions
        </button>
      </div>
      <div>
        <span className="label">Specific ideology overrides</span>
        <p className="muted mb-1.5 text-[11px]">Overrides the group position for one ideology (also custom ideologies), including custom probabilities.</p>
        <div className="space-y-2">
          {entries.map(([id, spec]) => (
            <div key={id} className="grid grid-cols-[110px_1fr_auto] items-start gap-2 text-xs">
              <span className="truncate pt-1 font-semibold">{all.find((x) => x.id === id)?.name ?? id}</span>
              <PositionPicker spec={spec} onChange={(s) => update((i) => (s ? (i.ideologyPositions[id] = s) : delete i.ideologyPositions[id]))} />
              <button className="btn btn-sm" onClick={() => update((i) => delete i.ideologyPositions[id])}>
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-1.5">
          <div className="flex-1">
            <IdeologySelect value={pick} onChange={setPick} placeholder="Add ideology override…" allowClear={false} />
          </div>
          <button
            className="btn btn-sm"
            disabled={!pick}
            onClick={() => {
              if (pick) update((i) => void (i.ideologyPositions[pick] = { pos: "neutral" }));
              setPick(null);
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export function IndividualEditor({ issue, update }: { issue: Issue; update: Upd }) {
  const data = useStore((s) => s.data);
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(60);
  const [partyFilter, setPartyFilter] = useState("");
  const list = useMemo(
    () =>
      deputyList(data).filter((x) => (!q || x.name.toLowerCase().includes(q.toLowerCase())) && (!partyFilter || (partyFilter === "ind" ? !x.partyId : x.partyId === partyFilter))),
    [data, q, partyFilter],
  );
  const setMany = (v: Vote | undefined) =>
    update((i) => {
      for (const x of list) {
        if (v) i.individualVotes[x.id] = v;
        else delete i.individualVotes[x.id];
      }
    });
  const setCount = Object.keys(issue.individualVotes).length;
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-1.5">
        <input className="input" placeholder="Search deputies…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="select" value={partyFilter} onChange={(e) => setPartyFilter(e.target.value)}>
          <option value="">All parties</option>
          <option value="ind">Independents</option>
          {data.parties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.abbr}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="muted">Set {list.length} shown:</span>
        {(["for", "against", "abstain", "absent"] as Vote[]).map((v) => (
          <button key={v} className="btn btn-sm" onClick={() => setMany(v)}>
            {VOTE_LABELS[v]}
          </button>
        ))}
        <button className="btn btn-sm" onClick={() => setMany(undefined)}>
          Clear
        </button>
        <span className="muted ml-auto">{setCount} manual decisions</span>
      </div>
      <div className="max-h-72 space-y-0.5 overflow-y-auto rounded-md border p-1" style={{ borderColor: "var(--border)" }}>
        {list.slice(0, limit).map((x) => {
          const p = data.parties.find((y) => y.id === x.partyId);
          return (
            <div key={x.id} className="grid grid-cols-[1fr_130px] items-center gap-2 px-1 py-0.5 text-xs">
              <span className="flex items-center gap-1.5 truncate">
                <Swatch color={p?.color ?? x.color ?? "#94a3b8"} size={10} /> {x.name} <span className="muted">{p?.abbr ?? "IND"}</span>
              </span>
              <VoteSelect value={issue.individualVotes[x.id]} onChange={(v) => update((i) => (v ? (i.individualVotes[x.id] = v) : delete i.individualVotes[x.id]))} />
            </div>
          );
        })}
        {list.length > limit && (
          <button className="btn btn-sm w-full" onClick={() => setLimit(limit + 100)}>
            Show more ({list.length - limit} remaining)
          </button>
        )}
        {list.length === 0 && <div className="muted p-3 text-center text-xs">No deputies match.</div>}
      </div>
    </div>
  );
}

export function RandomEditor({ issue, update }: { issue: Issue; update: Upd }) {
  const r = issue.random;
  const n = normalize([r.pFor, r.pAgainst, r.pAbstain, r.pAbsent]);
  const rows: [keyof typeof r, string, string][] = [
    ["pFor", "For", "for"],
    ["pAgainst", "Against", "against"],
    ["pAbstain", "Abstain", "abstain"],
    ["pAbsent", "Absent", "absent"],
  ];
  const colors = useStore((s) => s.data.prefs.voteColors);
  return (
    <div className="space-y-2">
      <p className="muted text-[11px]">Weights are normalised automatically so they always sum to 100%. Absent deputies do not count as present.</p>
      {rows.map(([k, label, vk], idx) => (
        <div key={k} className="grid grid-cols-[90px_1fr_70px] items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5">
            <Swatch color={colors[vk as keyof typeof colors]} /> {label}
          </span>
          <input type="range" min={0} max={100} value={r[k]} onChange={(e) => update((i) => void (i.random[k] = Number(e.target.value)))} />
          <span className="text-right">
            <b>{(n[idx] * 100).toFixed(1)}%</b>
          </span>
        </div>
      ))}
      {r.pFor + r.pAgainst + r.pAbstain + r.pAbsent <= 0 && <div className="text-xs text-[var(--bad)]">All weights are zero — they will be treated as equal.</div>}
    </div>
  );
}

export function MixedEditor({ issue, update }: { issue: Issue; update: Upd }) {
  const data = useStore((s) => s.data);
  const methods: { v: MixedMethod; label: string }[] = [
    { v: "party", label: "Party decision" },
    { v: "faction", label: "Faction decisions" },
    { v: "ideology", label: "Ideology" },
    { v: "random", label: "Random" },
  ];
  if (!data.parties.length) return <Empty>No parties.</Empty>;
  return (
    <div className="space-y-2">
      <p className="muted text-[11px]">Choose how each party's deputies decide. Independents follow their own behaviour; individual overrides (below) always win.</p>
      {data.parties.map((p) => {
        const m = issue.mixedRules[p.id] ?? "party";
        const facs = data.factions.filter((f) => f.partyId === p.id);
        return (
          <div key={p.id} className="card space-y-1.5 p-2">
            <div className="grid grid-cols-[1fr_150px] items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 font-bold">
                <Swatch color={p.color} /> {p.abbr}
              </span>
              <select className="select !py-1" value={m} onChange={(e) => update((i) => void (i.mixedRules[p.id] = e.target.value as MixedMethod))}>
                {methods.map((x) => (
                  <option key={x.v} value={x.v}>
                    {x.label}
                  </option>
                ))}
              </select>
            </div>
            {(m === "party" || m === "faction") && (
              <div className="grid grid-cols-[1fr_140px] items-center gap-2 text-xs">
                <span className="muted">{m === "faction" ? "Party line (fallback)" : "Party line"}</span>
                <VoteSelect value={issue.partyVotes[p.id]} onChange={(v) => update((i) => (v ? (i.partyVotes[p.id] = v) : delete i.partyVotes[p.id]))} />
              </div>
            )}
            {m === "faction" &&
              facs.map((f) => (
                <div key={f.id} className="grid grid-cols-[1fr_140px] items-center gap-2 text-xs">
                  <span className="flex items-center gap-1.5 truncate">
                    <Swatch color={f.color} size={10} /> {f.name}
                  </span>
                  <VoteSelect value={issue.factionVotes[f.id]} onChange={(v) => update((i) => (v ? (i.factionVotes[f.id] = v) : delete i.factionVotes[f.id]))} />
                </div>
              ))}
            {m === "faction" && facs.length === 0 && <div className="muted text-[11px]">No factions: deputies follow the party line.</div>}
          </div>
        );
      })}
    </div>
  );
}

export function Field2({ label, children }: { label: string; children: React.ReactNode }) {
  return <Field label={label}>{children}</Field>;
}
