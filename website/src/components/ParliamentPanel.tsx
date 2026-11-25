"use client";
import { useMemo, useState } from "react";
import { useStore, roleLabels } from "@/lib/store";
import { computeStats } from "@/lib/stats";
import type { IndependentBehavior, Role } from "@/lib/types";
import { Bar, Empty, Field, NumInput, Section, StatBox, Swatch } from "./ui";
import { ColorPicker } from "./ColorPicker";
import { IdeologySelect } from "./IdeologyPicker";
import { independents } from "@/lib/parliament";

export function Dashboard() {
  const data = useStore((s) => s.data);
  const mutate = useStore((s) => s.mutate);
  const st = useMemo(() => computeStats(data), [data]);
  const kindColor = { good: "var(--good)", warn: "var(--warn)", bad: "var(--bad)", info: "var(--muted)" }[st.statusKind];
  const gov = data.coalitions.find((c) => c.id === data.governingCoalitionId);
  const opp = st.rows.filter((r) => r.party.role === "opposition");
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <StatBox label="Total seats" value={st.total} />
        <StatBox label="Allocated" value={st.allocated} sub={`${((st.allocated / Math.max(1, st.total)) * 100).toFixed(0)}% of chamber`} />
        <StatBox label="Unallocated" value={st.free} color={st.free ? "var(--warn)" : undefined} />
        <StatBox label="Parties" value={st.parties} />
        <StatBox label="Coalitions" value={st.coalitions} />
        <StatBox label="Factions" value={st.factions} />
        <StatBox label="Independents" value={st.independents} />
        <StatBox label="Majority line" value={st.majority} sub="more than half of seats" />
      </div>
      <div className="card p-3 text-[13px]" style={{ borderLeft: `4px solid ${kindColor}` }}>
        <div className="label">Majority status</div>
        <div className="font-semibold">{st.status}</div>
        <div className="muted mt-1 text-xs">
          Government {st.roleSeats.government} · Confidence &amp; supply {st.roleSeats.confidence} · Ind. supporters {st.roleSeats.supporter} · Opposition {st.roleSeats.opposition} · Neutral {st.roleSeats.neutral}
        </div>
        <div className="mt-2">
          <Bar
            parts={[
              { v: st.roleSeats.government, color: "var(--good)", title: "Government" },
              { v: st.roleSeats.confidence + st.roleSeats.supporter, color: "var(--warn)", title: "Support" },
              { v: st.roleSeats.neutral, color: "#94a3b8", title: "Neutral" },
              { v: st.roleSeats.opposition, color: "var(--bad)", title: "Opposition" },
              { v: st.free, color: "var(--border)" },
            ]}
          />
        </div>
      </div>
      <Field label="Governing coalition (optional)" hint="Informational. Designations below are set manually and never follow coalition membership automatically.">
        <select className="select" value={data.governingCoalitionId ?? ""} onChange={(e) => mutate((d) => void (d.governingCoalitionId = e.target.value || null))}>
          <option value="">None specified</option>
          {data.coalitions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      {gov && (
        <div className="muted text-xs">
          {gov.name}: {st.coalitionSeats.find((c) => c.id === gov.id)?.seats ?? 0} seats
        </div>
      )}
      {opp.length > 0 && (
        <div className="text-xs">
          <span className="label">Opposition</span>
          {opp.map((r) => (
            <span key={r.party.id} className="mr-2 inline-flex items-center gap-1">
              <Swatch color={r.party.color} /> {r.party.abbr} {r.seats}
            </span>
          ))}
        </div>
      )}
      <div>
        <span className="label">Composition</span>
        <Bar height={14} parts={[...st.rows.map((r) => ({ v: r.seats, color: r.party.color, title: `${r.party.name}: ${r.seats}` })), { v: st.independents, color: "#94a3b8", title: "Independents" }, { v: st.free, color: "var(--border)", title: "Unallocated" }]} />
        <div className="mt-2 space-y-1">
          {st.rows.map((r) => (
            <div key={r.party.id} className="flex items-center gap-2 text-xs">
              <Swatch color={r.party.color} />
              <span className="flex-1 truncate">{r.party.name}</span>
              <b>{r.seats}</b>
              <span className="muted w-12 text-right">{r.pct.toFixed(1)}%</span>
            </div>
          ))}
          {st.independents > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <Swatch color="#94a3b8" />
              <span className="flex-1">Independents</span>
              <b>{st.independents}</b>
              <span className="muted w-12 text-right">{((st.independents / st.total) * 100).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SizeControls() {
  const total = useStore((s) => s.data.settings.totalSeats);
  const locked = useStore((s) => s.data.seatingLocked);
  const resize = useStore((s) => s.resizeTotal);
  const setLocked = useStore((s) => s.setLocked);
  const toast = useStore((s) => s.toast);
  const [n, setN] = useState(total);
  const [mode, setMode] = useState<"strict" | "proportional">("proportional");
  return (
    <div className="space-y-3">
      <Field label="Total seats" hint="Small councils to very large assemblies (up to 20,000).">
        <div className="flex gap-1.5">
          <NumInput value={n} min={1} max={20000} int onCommit={setN} />
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              const r = resize(n, mode);
              if (r.ok) toast(`Parliament resized to ${n} seats.`, "ok");
            }}
            disabled={n === total}
          >
            Apply
          </button>
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {[50, 100, 300, 650, 1000].map((x) => (
            <button key={x} className="chip" onClick={() => setN(x)}>
              {x}
            </button>
          ))}
        </div>
      </Field>
      <Field label="If shrinking below allocated seats" hint={mode === "proportional" ? "Parties are scaled down proportionally (largest remainder)." : "Resize is refused until you free seats manually."}>
        <select className="select" value={mode} onChange={(e) => setMode(e.target.value as "strict" | "proportional")}>
          <option value="proportional">Rescale parties proportionally</option>
          <option value="strict">Refuse (strict)</option>
        </select>
      </Field>
      <div className="flex items-center justify-between gap-2">
        <label className="flex items-center gap-2 text-[13px]">
          <input type="checkbox" checked={locked} onChange={(e) => setLocked(e.target.checked)} /> Lock manual seating
        </label>
        <button className="btn btn-sm" onClick={() => setLocked(false)} title="Re-sort seats into party blocks">
          Auto-arrange
        </button>
      </div>
    </div>
  );
}

function Designations() {
  const data = useStore((s) => s.data);
  const updateParty = useStore((s) => s.updateParty);
  const mutate = useStore((s) => s.mutate);
  return (
    <div className="space-y-1.5">
      {data.parties.length === 0 && <Empty>No parties.</Empty>}
      {data.parties.map((p) => (
        <div key={p.id} className="flex items-center gap-2 text-xs">
          <Swatch color={p.color} />
          <span className="w-10 font-bold">{p.abbr}</span>
          <select className="select !py-1" value={p.role} onChange={(e) => updateParty(p.id, { role: e.target.value as Role })}>
            {(Object.keys(roleLabels) as Role[]).map((r) => (
              <option key={r} value={r}>
                {roleLabels[r]}
              </option>
            ))}
          </select>
        </div>
      ))}
      <div className="flex flex-wrap gap-1.5 pt-1">
        <button className="btn btn-sm" onClick={() => mutate((d) => d.parties.forEach((p) => (p.role = "opposition")))}>
          All → opposition
        </button>
        <button className="btn btn-sm" onClick={() => mutate((d) => d.parties.forEach((p) => (p.role = "neutral")))}>
          All → neutral
        </button>
      </div>
    </div>
  );
}

function Independents() {
  const data = useStore((s) => s.data);
  const add = useStore((s) => s.addIndependents);
  const update = useStore((s) => s.updateDeputy);
  const remove = useStore((s) => s.removeDeputy);
  const toast = useStore((s) => s.toast);
  const patch = useStore((s) => s.patchUI);
  const [count, setCount] = useState(1);
  const [names, setNames] = useState("");
  const [ideo, setIdeo] = useState<string | null>(null);
  const [color, setColor] = useState("#f97316");
  const [behavior, setBehavior] = useState<IndependentBehavior>("ideology");
  const [role, setRole] = useState<Role>("neutral");
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const list = independents(data).filter((x) => !q || x.name.toLowerCase().includes(q.toLowerCase()));
  const seatOf = (id: string) => data.seats.indexOf(id);

  return (
    <div className="space-y-3">
      <div className="card space-y-2 p-3">
        <div className="grid grid-cols-3 gap-2">
          <Field label="How many">
            <NumInput value={count} min={1} int onCommit={setCount} />
          </Field>
          <Field label="Behaviour" className="col-span-2">
            <select className="select" value={behavior} onChange={(e) => setBehavior(e.target.value as IndependentBehavior)}>
              <option value="ideology">Follows own ideology</option>
              <option value="random">Random</option>
              <option value="for">Always For</option>
              <option value="against">Always Against</option>
              <option value="abstain">Always Abstain</option>
            </select>
          </Field>
        </div>
        <Field label="Names (optional, one per line — overrides the count)">
          <textarea className="textarea" value={names} onChange={(e) => setNames(e.target.value)} placeholder={"Maria Alvarez\nJonas Novak"} />
        </Field>
        <Field label="Ideology">
          <IdeologySelect value={ideo} onChange={setIdeo} />
        </Field>
        <Field label="Colour">
          <ColorPicker compact value={color} onChange={setColor} />
        </Field>
        <Field label="Designation">
          <select className="select" value={role} onChange={(e) => setRole(e.target.value as Role)}>
            {(Object.keys(roleLabels) as Role[]).map((r) => (
              <option key={r} value={r}>
                {roleLabels[r]}
              </option>
            ))}
          </select>
        </Field>
        <button
          className="btn btn-primary"
          onClick={() => {
            const r = add(count, names, { ideologyId: ideo, color, behavior, role });
            if (r.ok) {
              setNames("");
              toast("Independent deputies added.", "ok");
            }
          }}
        >
          Add independents
        </button>
      </div>
      <input className="input" placeholder="Search independents…" value={q} onChange={(e) => setQ(e.target.value)} />
      {list.length === 0 && <Empty>No independent deputies.</Empty>}
      <div className="space-y-1.5">
        {list.slice(0, 300).map((x) => (
          <div key={x.id} className="card overflow-hidden">
            <div className="flex items-center gap-2 p-2">
              <Swatch color={x.color ?? "#94a3b8"} size={16} />
              <button className="min-w-0 flex-1 truncate text-left text-[13px] font-semibold" onClick={() => setOpen(open === x.id ? null : x.id)}>
                {x.name}
              </button>
              <button className="btn btn-sm btn-icon" title="Find on chart" onClick={() => patch({ selectedSeat: seatOf(x.id), tab: "parliament" })}>
                ◎
              </button>
            </div>
            {open === x.id && (
              <div className="anim-in space-y-2 border-t p-3" style={{ borderColor: "var(--border)" }}>
                <Field label="Name">
                  <input className="input" value={x.name} onChange={(e) => update(x.id, { name: e.target.value })} />
                </Field>
                <Field label="Ideology">
                  <IdeologySelect value={x.ideologyId} onChange={(id) => update(x.id, { ideologyId: id })} />
                </Field>
                <Field label="Colour">
                  <ColorPicker compact value={x.color ?? "#94a3b8"} onChange={(c) => update(x.id, { color: c })} />
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Behaviour">
                    <select className="select" value={x.behavior} onChange={(e) => update(x.id, { behavior: e.target.value as IndependentBehavior })}>
                      <option value="ideology">Own ideology</option>
                      <option value="random">Random</option>
                      <option value="for">Always For</option>
                      <option value="against">Always Against</option>
                      <option value="abstain">Always Abstain</option>
                    </select>
                  </Field>
                  <Field label="Designation">
                    <select className="select" value={x.role} onChange={(e) => update(x.id, { role: e.target.value as Role })}>
                      {(Object.keys(roleLabels) as Role[]).map((r) => (
                        <option key={r} value={r}>
                          {roleLabels[r]}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="Affiliation / description">
                  <input className="input" value={x.affiliation} onChange={(e) => update(x.id, { affiliation: e.target.value })} />
                </Field>
                <button className="btn btn-sm btn-danger" onClick={() => remove(x.id)}>
                  Remove deputy
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ParliamentPanel() {
  return (
    <div>
      <Section title="Dashboard">
        <Dashboard />
      </Section>
      <Section title="Parliament size & seating" defaultOpen>
        <SizeControls />
      </Section>
      <Section title="Government designations" defaultOpen={false}>
        <Designations />
      </Section>
      <Section title="Independent deputies" defaultOpen={false}>
        <Independents />
      </Section>
    </div>
  );
}
