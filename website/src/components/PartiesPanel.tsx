"use client";
import { useState } from "react";
import { useStore, roleLabels } from "@/lib/store";
import type { MetaEntry, Party, Role } from "@/lib/types";
import { ColorPicker } from "./ColorPicker";
import { IdeologySelect } from "./IdeologyPicker";
import { Bar, Empty, Field, NumInput, Swatch } from "./ui";
import { PALETTE } from "@/lib/color";
import { freeSeats, partyDeputies } from "@/lib/parliament";

export function PartyForm({ value, onChange }: { value: Partial<Party>; onChange: (p: Partial<Party>) => void }) {
  const meta = value.meta ?? [];
  const setMeta = (m: MetaEntry[]) => onChange({ meta: m });
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <Field label="Party name" className="col-span-2">
          <input className="input" value={value.name ?? ""} onChange={(e) => onChange({ name: e.target.value })} placeholder="People's Democratic Union" />
        </Field>
        <Field label="Abbr.">
          <input className="input" maxLength={8} value={value.abbr ?? ""} onChange={(e) => onChange({ abbr: e.target.value })} placeholder="PDU" />
        </Field>
      </div>
      <Field label="Colour">
        <ColorPicker value={value.color ?? "#64748b"} onChange={(c) => onChange({ color: c })} />
      </Field>
      <Field label="Party leader">
        <input className="input" value={value.leader ?? ""} onChange={(e) => onChange({ leader: e.target.value })} placeholder="Alexander Morgan" />
      </Field>
      <Field label="Ideology">
        <IdeologySelect value={value.ideologyId ?? null} onChange={(id) => onChange({ ideologyId: id })} />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Government designation">
          <select className="select" value={value.role ?? "neutral"} onChange={(e) => onChange({ role: e.target.value as Role })}>
            {(Object.keys(roleLabels) as Role[]).map((r) => (
              <option key={r} value={r}>
                {roleLabels[r]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Logo / symbol" hint="Emoji, short text or image URL">
          <input className="input" value={value.symbol ?? ""} onChange={(e) => onChange({ symbol: e.target.value })} placeholder="🌳" />
        </Field>
      </div>
      <Field label="Description">
        <textarea className="textarea" value={value.description ?? ""} onChange={(e) => onChange({ description: e.target.value })} />
      </Field>
      <Field label="Additional metadata">
        <div className="space-y-1.5">
          {meta.map((m, i) => (
            <div key={i} className="flex gap-1.5">
              <input className="input" placeholder="Key (e.g. Founded)" value={m.key} onChange={(e) => setMeta(meta.map((x, j) => (j === i ? { ...x, key: e.target.value } : x)))} />
              <input className="input" placeholder="Value" value={m.value} onChange={(e) => setMeta(meta.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
              <button className="btn btn-sm" onClick={() => setMeta(meta.filter((_, j) => j !== i))} aria-label="Remove field">
                ✕
              </button>
            </div>
          ))}
          <button className="btn btn-sm" onClick={() => setMeta([...meta, { key: "", value: "" }])}>
            + Add field
          </button>
        </div>
      </Field>
    </div>
  );
}

function PartySymbol({ p }: { p: Party }) {
  if (/^https?:\/\//.test(p.symbol)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={p.symbol} alt="" className="h-5 w-5 rounded object-cover" />;
  }
  return p.symbol ? <span className="text-base leading-none">{p.symbol}</span> : null;
}

export function PartiesPanel() {
  const data = useStore((s) => s.data);
  const focus = useStore((s) => s.ui.focus);
  const patchUI = useStore((s) => s.patchUI);
  const addParty = useStore((s) => s.addParty);
  const updateParty = useStore((s) => s.updateParty);
  const deleteParty = useStore((s) => s.deleteParty);
  const duplicateParty = useStore((s) => s.duplicateParty);
  const setPartySeats = useStore((s) => s.setPartySeats);
  const moveParty = useStore((s) => s.moveParty);
  const distribute = useStore((s) => s.distribute);
  const sortByIdeology = useStore((s) => s.sortPartiesByIdeology);
  const mergeParties = useStore((s) => s.mergeParties);
  const toast = useStore((s) => s.toast);

  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Partial<Party>>({});
  const [draftSeats, setDraftSeats] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const [pctMode, setPctMode] = useState(false);
  const [pcts, setPcts] = useState<Record<string, number>>({});
  const [mergeOpen, setMergeOpen] = useState(false);
  const [mergeTarget, setMergeTarget] = useState("");
  const [mergeSrc, setMergeSrc] = useState<string[]>([]);

  const total = data.settings.totalSeats;
  const free = freeSeats(data);
  const allocated = total - free;

  const startCreate = () => {
    setDraft({ name: "", abbr: "", color: PALETTE[data.parties.length % PALETTE.length], leader: "", ideologyId: null, role: "neutral", meta: [] });
    setDraftSeats(Math.min(free, 10));
    setCreating(true);
  };
  const submit = () => {
    if (!draft.name?.trim()) return toast("Give the party a name.", "error");
    const r = addParty({ ...draft, name: draft.name.trim(), abbr: (draft.abbr || draft.name.slice(0, 3)).toUpperCase() }, draftSeats);
    if (r.ok) {
      setCreating(false);
      toast(`Created ${draft.name}.`, "ok");
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="card p-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <b>Seat allocation</b>
          <span className={free === 0 ? "font-bold" : "muted"}>
            {allocated} / {total} allocated · {free} free
          </span>
        </div>
        <Bar parts={[...data.parties.map((p) => ({ v: partyDeputies(data, p.id).length, color: p.color, title: p.name })), { v: data.deputies && Object.values(data.deputies).filter((x) => !x.partyId).length, color: "#94a3b8", title: "Independents" }, { v: free, color: "var(--border)" }]} />
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button className="btn btn-sm btn-primary" onClick={startCreate}>
            + New party
          </button>
          <button
            className="btn btn-sm"
            title="Split all non-independent seats evenly"
            onClick={() => {
              const w: Record<string, number> = {};
              data.parties.forEach((p) => (w[p.id] = 1));
              const r = distribute(w);
              if (r.ok) toast("Seats distributed evenly.", "ok");
            }}
            disabled={!data.parties.length}
          >
            Distribute evenly
          </button>
          <button
            className="btn btn-sm"
            onClick={() => {
              const p: Record<string, number> = {};
              data.parties.forEach((x) => (p[x.id] = Math.round((partyDeputies(data, x.id).length / total) * 1000) / 10));
              setPcts(p);
              setPctMode(!pctMode);
            }}
            disabled={!data.parties.length}
          >
            By percentages…
          </button>
          <button className="btn btn-sm" onClick={sortByIdeology} disabled={data.parties.length < 2} title="Order parties from left to right by ideology and re-arrange seats">
            Sort by ideology
          </button>
          <button className="btn btn-sm" onClick={() => setMergeOpen(!mergeOpen)} disabled={data.parties.length < 2}>
            Merge…
          </button>
        </div>
        {pctMode && (
          <div className="anim-in mt-3 space-y-1.5 border-t pt-3" style={{ borderColor: "var(--border)" }}>
            <p className="muted text-xs">Enter vote shares; seats are apportioned among parties with the largest-remainder method (independents keep their seats).</p>
            {data.parties.map((p) => (
              <div key={p.id} className="flex items-center gap-2 text-xs">
                <Swatch color={p.color} /> <span className="w-12 font-bold">{p.abbr}</span>
                <NumInput value={pcts[p.id] ?? 0} min={0} max={100} step={0.1} onCommit={(n) => setPcts({ ...pcts, [p.id]: n })} />
                <span>%</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-xs">
              <span className={Math.abs(Object.values(pcts).reduce((a, b) => a + b, 0) - 100) > 0.05 ? "font-bold text-[var(--warn)]" : "muted"}>Sum: {Object.values(pcts).reduce((a, b) => a + b, 0).toFixed(1)}% (normalised automatically)</span>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                  const r = distribute(pcts);
                  if (r.ok) {
                    toast("Seats apportioned by percentage.", "ok");
                    setPctMode(false);
                  }
                }}
              >
                Apply
              </button>
            </div>
          </div>
        )}
        {mergeOpen && (
          <div className="anim-in mt-3 space-y-2 border-t pt-3" style={{ borderColor: "var(--border)" }}>
            <p className="muted text-xs">Merge selected parties (and their factions and deputies) into the target party. Coalition memberships are transferred.</p>
            <select className="select" value={mergeTarget} onChange={(e) => setMergeTarget(e.target.value)}>
              <option value="">Target party…</option>
              {data.parties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2">
              {data.parties
                .filter((p) => p.id !== mergeTarget)
                .map((p) => (
                  <label key={p.id} className="flex items-center gap-1 text-xs">
                    <input type="checkbox" checked={mergeSrc.includes(p.id)} onChange={(e) => setMergeSrc(e.target.checked ? [...mergeSrc, p.id] : mergeSrc.filter((x) => x !== p.id))} />
                    {p.abbr}
                  </label>
                ))}
            </div>
            <button
              className="btn btn-sm btn-primary"
              disabled={!mergeTarget || !mergeSrc.length}
              onClick={() => {
                if (!window.confirm("Merge the selected parties into the target? This cannot be undone.")) return;
                const r = mergeParties(mergeSrc, mergeTarget);
                if (r.ok) {
                  setMergeOpen(false);
                  setMergeSrc([]);
                  toast("Parties merged.", "ok");
                }
              }}
            >
              Merge parties
            </button>
          </div>
        )}
      </div>

      {creating && (
        <div className="card anim-in space-y-3 p-3">
          <h3 className="text-sm font-bold">New party</h3>
          <PartyForm value={draft} onChange={(p) => setDraft({ ...draft, ...p })} />
          <Field label="Seats" hint={`${free} unallocated seats available`}>
            <NumInput value={draftSeats} min={0} int onCommit={setDraftSeats} />
          </Field>
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={submit}>
              Create party
            </button>
            <button className="btn" onClick={() => setCreating(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {data.parties.length === 0 && !creating && <Empty>No parties yet. Create the first one to start filling the chamber.</Empty>}

      <div className="space-y-2">
        {data.parties.map((p, idx) => {
          const seats = partyDeputies(data, p.id).length;
          const isOpen = open === p.id;
          const focused = focus?.type === "party" && focus.id === p.id;
          return (
            <div key={p.id} className="card anim-in overflow-hidden" style={focused ? { borderColor: "var(--accent)" } : undefined}>
              <div className="flex items-center gap-2 p-2">
                <div className="flex flex-col">
                  <button className="text-[10px] leading-none muted hover:text-[var(--text)] disabled:opacity-30" onClick={() => moveParty(p.id, -1)} disabled={idx === 0} aria-label="Move up">
                    ▲
                  </button>
                  <button className="text-[10px] leading-none muted hover:text-[var(--text)] disabled:opacity-30" onClick={() => moveParty(p.id, 1)} disabled={idx === data.parties.length - 1} aria-label="Move down">
                    ▼
                  </button>
                </div>
                <Swatch color={p.color} size={18} />
                <PartySymbol p={p} />
                <button className="min-w-0 flex-1 text-left" onClick={() => setOpen(isOpen ? null : p.id)}>
                  <div className="truncate text-[13px] font-bold">
                    {p.name} <span className="muted font-normal">({p.abbr})</span>
                  </div>
                  <div className="muted truncate text-[11px]">{p.leader || "no leader"} · {roleLabels[p.role]}</div>
                </button>
                <div className="w-16">
                  <NumInput value={seats} min={0} int onCommit={(n) => setPartySeats(p.id, n)} />
                </div>
                <button className="btn btn-sm btn-icon" title="Highlight this party in the chamber" onClick={() => patchUI({ focus: focused ? null : { type: "party", id: p.id } })} style={focused ? { background: "var(--accent-soft)" } : undefined}>
                  ◎
                </button>
              </div>
              {isOpen && (
                <div className="anim-in space-y-3 border-t p-3" style={{ borderColor: "var(--border)" }}>
                  <PartyForm value={p} onChange={(patch) => updateParty(p.id, patch)} />
                  <div className="flex gap-2">
                    <button className="btn btn-sm" onClick={() => duplicateParty(p.id)}>
                      Duplicate
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        if (window.confirm(`Delete ${p.name}? Its ${seats} deputies and factions will be removed and seats become unallocated.`)) deleteParty(p.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
