"use client";
import { useMemo, useState } from "react";
import { translateText, useLanguage } from "@/lib/language";
import { useStore } from "@/lib/store";
import type { Faction } from "@/lib/types";
import { ColorPicker } from "./ColorPicker";
import { IdeologySelect } from "./IdeologyPicker";
import { Empty, Field, NumInput, Swatch } from "./ui";
import { deputyList, partyDeputies } from "@/lib/parliament";
import { suggestShades } from "@/lib/color";

function FactionForm({ f, partyColor, onChange }: { f: Partial<Faction>; partyColor: string; onChange: (p: Partial<Faction>) => void }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <Field label="Faction name" className="col-span-2">
          <input className="input" value={f.name ?? ""} onChange={(e) => onChange({ name: e.target.value })} placeholder="Progressive Faction" />
        </Field>
        <Field label="Abbr. (optional)">
          <input className="input" maxLength={8} value={f.abbr ?? ""} onChange={(e) => onChange({ abbr: e.target.value })} />
        </Field>
      </div>
      <Field label="Colour" hint="Suggested shades are derived from the party colour; you can pick anything.">
        <ColorPicker value={f.color ?? partyColor} onChange={(c) => onChange({ color: c })} suggestions={suggestShades(partyColor, 8)} compact />
      </Field>
      <Field label="Ideology (optional — independent of the party's ideology)">
        <IdeologySelect value={f.ideologyId ?? null} onChange={(id) => onChange({ ideologyId: id })} placeholder="None — assign later" />
      </Field>
      <Field label="Faction leader (optional)">
        <input className="input" value={f.leader ?? ""} onChange={(e) => onChange({ leader: e.target.value })} />
      </Field>
      <Field label="Description">
        <textarea className="textarea" value={f.description ?? ""} onChange={(e) => onChange({ description: e.target.value })} />
      </Field>
    </div>
  );
}

export function FactionsPanel() {
  const { language } = useLanguage();
  const data = useStore((s) => s.data);
  const focus = useStore((s) => s.ui.focus);
  const patchUI = useStore((s) => s.patchUI);
  const addFaction = useStore((s) => s.addFaction);
  const updateFaction = useStore((s) => s.updateFaction);
  const deleteFaction = useStore((s) => s.deleteFaction);
  const setFactionSeats = useStore((s) => s.setFactionSeats);
  const assignFaction = useStore((s) => s.assignFaction);
  const toast = useStore((s) => s.toast);

  const [creating, setCreating] = useState(false);
  const [partyId, setPartyId] = useState("");
  const [draft, setDraft] = useState<Partial<Faction>>({});
  const [seats, setSeats] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const party = data.parties.find((p) => p.id === partyId);
  const looseCount = party ? partyDeputies(data, party.id).filter((x) => !x.factionId).length : 0;

  const start = () => {
    const p = data.parties[0];
    if (!p) return toast("Create a party first — factions live inside parties.", "error");
    setPartyId(p.id);
    setDraft({ name: "", abbr: "", color: suggestShades(p.color, 1)[0], ideologyId: null });
    setSeats(0);
    setCreating(true);
  };

  const members = useMemo(() => (open ? deputyList(data).filter((x) => x.factionId === open) : []), [data, open]);

  return (
    <div className="space-y-4 p-4">
      <div className="card p-3 text-xs muted">
        Factions are internal groups of a single party. A faction can hold its own ideology, independent of the party's. Assign deputies with a seat count or pick them one by one.
      </div>
      <button className="btn btn-primary" onClick={start}>
        + New faction
      </button>
      {creating && (
        <div className="card anim-in space-y-3 p-3">
          <Field label="Parent party">
            <select
              className="select"
              value={partyId}
              onChange={(e) => {
                setPartyId(e.target.value);
                const p = data.parties.find((x) => x.id === e.target.value);
                if (p) setDraft({ ...draft, color: suggestShades(p.color, 1)[0] });
              }}
            >
              {data.parties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          <FactionForm f={draft} partyColor={party?.color ?? "#64748b"} onChange={(p) => setDraft({ ...draft, ...p })} />
          <Field label="Deputies" hint={`${looseCount} deputies of this party are not yet in a faction`}>
            <NumInput value={seats} min={0} int onCommit={setSeats} />
          </Field>
          <div className="flex gap-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                if (!draft.name?.trim()) return toast("Give the faction a name.", "error");
                const r = addFaction(partyId, { ...draft, name: draft.name.trim() }, seats);
                if (r.ok) {
                  setCreating(false);
                  toast("Faction created.", "ok");
                }
              }}
            >
              Create faction
            </button>
            <button className="btn" onClick={() => setCreating(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {data.factions.length === 0 && !creating && <Empty>No factions yet.</Empty>}
      {data.parties.map((p) => {
        const facs = data.factions.filter((f) => f.partyId === p.id);
        if (!facs.length) return null;
        const loose = partyDeputies(data, p.id).filter((x) => !x.factionId).length;
        return (
          <div key={p.id} className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold">
              <Swatch color={p.color} /> {p.name} <span className="muted font-normal">· {loose} not in a faction</span>
            </div>
            {facs.map((f) => {
              const count = deputyList(data).filter((x) => x.factionId === f.id).length;
              const isOpen = open === f.id;
              const focused = focus?.type === "faction" && focus.id === f.id;
              return (
                <div key={f.id} className="card anim-in overflow-hidden" style={focused ? { borderColor: "var(--accent)" } : undefined}>
                  <div className="flex items-center gap-2 p-2">
                    <span className="swatch" style={{ background: f.color, width: 18, height: 18, outline: `2px solid ${p.color}`, outlineOffset: 1 }} />
                    <button className="min-w-0 flex-1 text-left" onClick={() => setOpen(isOpen ? null : f.id)}>
                      <div className="truncate text-[13px] font-bold">{f.name}</div>
                      <div className="muted truncate text-[11px]">{f.leader || "no leader"}</div>
                    </button>
                    <div className="w-16">
                      <NumInput value={count} min={0} int onCommit={(n) => setFactionSeats(f.id, n)} />
                    </div>
                    <button className="btn btn-sm btn-icon" onClick={() => patchUI({ focus: focused ? null : { type: "faction", id: f.id } })} style={focused ? { background: "var(--accent-soft)" } : undefined} title="Highlight in chamber">
                      ◎
                    </button>
                  </div>
                  {isOpen && (
                    <div className="anim-in space-y-3 border-t p-3" style={{ borderColor: "var(--border)" }}>
                      <FactionForm f={f} partyColor={p.color} onChange={(patch) => updateFaction(f.id, patch)} />
                      <Field label="Assign deputies">
                        <input className="input mb-1.5" placeholder="Search deputies of this party…" value={q} onChange={(e) => setQ(e.target.value)} />
                        <div className="max-h-48 space-y-0.5 overflow-y-auto rounded-md border p-1" style={{ borderColor: "var(--border)" }}>
                          {partyDeputies(data, p.id)
                            .filter((x) => !q || x.name.toLowerCase().includes(q.toLowerCase()))
                            .slice(0, 200)
                            .map((x) => {
                              const other = x.factionId && x.factionId !== f.id ? data.factions.find((y) => y.id === x.factionId) : null;
                              return (
                                <label key={x.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-0.5 text-xs hover:bg-[var(--panel)]">
                                  <input type="checkbox" checked={x.factionId === f.id} onChange={(e) => assignFaction(x.id, e.target.checked ? f.id : null)} />
                                  <span className="flex-1 truncate">{x.name}</span>
                                  {other && <span className="muted">in {other.abbr || other.name}</span>}
                                </label>
                              );
                            })}
                        </div>
                        <p className="muted mt-1 text-[11px]">{members.length} members. Selecting a deputy who is in another faction moves them.</p>
                      </Field>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          if (window.confirm(translateText(`Delete faction ${f.name}? Its deputies stay in the party.`, language))) deleteFaction(f.id);
                        }}
                      >
                        Delete faction
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
