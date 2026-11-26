"use client";
import { useState } from "react";
import { translateText, useLanguage } from "@/lib/language";
import { useStore } from "@/lib/store";
import type { Coalition } from "@/lib/types";
import { ColorPicker } from "./ColorPicker";
import { IdeologySelect } from "./IdeologyPicker";
import { Empty, Field, Swatch } from "./ui";
import { partyDeputies } from "@/lib/parliament";

export function CoalitionsPanel() {
  const { language } = useLanguage();
  const data = useStore((s) => s.data);
  const focus = useStore((s) => s.ui.focus);
  const patchUI = useStore((s) => s.patchUI);
  const addCoalition = useStore((s) => s.addCoalition);
  const updateCoalition = useStore((s) => s.updateCoalition);
  const deleteCoalition = useStore((s) => s.deleteCoalition);
  const toggleParty = useStore((s) => s.toggleCoalitionParty);
  const toast = useStore((s) => s.toast);
  const [open, setOpen] = useState<string | null>(null);

  const seatsOf = (c: Coalition) => c.partyIds.reduce((a, pid) => a + partyDeputies(data, pid).length, 0);
  const majority = Math.floor(data.settings.totalSeats / 2) + 1;

  return (
    <div className="space-y-4 p-4">
      <div className="card p-3 text-xs muted">
        A coalition is a cooperation between parties — it does <b>not</b> merge them. Member parties keep their colours and are marked with the coalition-coloured ring. Parties may belong to several coalitions; the first coalition in the list determines the ring colour.
      </div>
      <button
        className="btn btn-primary"
        onClick={() => {
          const id = addCoalition({ name: `Coalition ${data.coalitions.length + 1}`, abbr: `C${data.coalitions.length + 1}`, color: ["#f5b700", "#a855f7", "#06b6d4", "#f43f5e", "#84cc16"][data.coalitions.length % 5] });
          setOpen(id);
          toast("Coalition created — add member parties below.", "ok");
        }}
      >
        + New coalition
      </button>
      {data.coalitions.length === 0 && <Empty>No coalitions yet.</Empty>}
      {data.coalitions.map((c) => {
        const seats = seatsOf(c);
        const isOpen = open === c.id;
        const focused = focus?.type === "coalition" && focus.id === c.id;
        return (
          <div key={c.id} className="card anim-in overflow-hidden" style={focused ? { borderColor: "var(--accent)" } : undefined}>
            <div className="flex items-center gap-2 p-2.5">
              <span className="inline-block h-5 w-5 shrink-0 rounded-full" style={{ border: `4px solid ${c.color}` }} />
              <button className="min-w-0 flex-1 text-left" onClick={() => setOpen(isOpen ? null : c.id)}>
                <div className="truncate text-[13px] font-bold">
                  {c.name} <span className="muted font-normal">({c.abbr})</span>
                </div>
                <div className="muted text-[11px]">
                  {c.partyIds.length} parties · <b>{seats}</b> seats {seats >= majority ? "· majority" : `· ${majority - seats} short of majority`}
                </div>
              </button>
              <button className="btn btn-sm btn-icon" onClick={() => patchUI({ focus: focused ? null : { type: "coalition", id: c.id } })} title="Highlight in chamber" style={focused ? { background: "var(--accent-soft)" } : undefined}>
                ◎
              </button>
            </div>
            <div className="flex flex-wrap gap-1 px-2.5 pb-2.5">
              {c.partyIds.map((pid) => {
                const p = data.parties.find((x) => x.id === pid);
                return p ? (
                  <span key={pid} className="chip" style={{ background: p.color + "33", color: "var(--text)" }}>
                    <Swatch color={p.color} size={10} /> {p.abbr}
                  </span>
                ) : null;
              })}
            </div>
            {isOpen && (
              <div className="anim-in space-y-3 border-t p-3" style={{ borderColor: "var(--border)" }}>
                <div className="grid grid-cols-3 gap-2">
                  <Field label="Name" className="col-span-2">
                    <input className="input" value={c.name} onChange={(e) => updateCoalition(c.id, { name: e.target.value })} />
                  </Field>
                  <Field label="Abbr.">
                    <input className="input" maxLength={8} value={c.abbr} onChange={(e) => updateCoalition(c.id, { abbr: e.target.value })} />
                  </Field>
                </div>
                <Field label="Coalition colour (ring)">
                  <ColorPicker value={c.color} onChange={(col) => updateCoalition(c.id, { color: col })} />
                </Field>
                <Field label="Member parties">
                  <div className="grid grid-cols-2 gap-1">
                    {data.parties.map((p) => (
                      <label key={p.id} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-xs hover:bg-[var(--panel)]">
                        <input type="checkbox" checked={c.partyIds.includes(p.id)} onChange={() => toggleParty(c.id, p.id)} />
                        <Swatch color={p.color} /> {p.abbr} <span className="muted">{partyDeputies(data, p.id).length}</span>
                      </label>
                    ))}
                    {data.parties.length === 0 && <span className="muted text-xs">Create parties first.</span>}
                  </div>
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Coalition leader (optional)">
                    <input className="input" value={c.leader} onChange={(e) => updateCoalition(c.id, { leader: e.target.value })} />
                  </Field>
                  <Field label="Orientation (optional)">
                    <input className="input" value={c.orientation} placeholder="Centre-left" onChange={(e) => updateCoalition(c.id, { orientation: e.target.value })} />
                  </Field>
                </div>
                <Field label="Ideology (optional)">
                  <IdeologySelect value={c.ideologyId} onChange={(id) => updateCoalition(c.id, { ideologyId: id })} />
                </Field>
                <Field label="Description">
                  <textarea className="textarea" value={c.description} onChange={(e) => updateCoalition(c.id, { description: e.target.value })} />
                </Field>
                <div className="flex gap-2">
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      useStore.getState().mutate((d) => {
                        const co = d.coalitions.find((x) => x.id === c.id);
                        if (!co) return;
                        d.governingCoalitionId = c.id;
                        for (const p of d.parties) if (co.partyIds.includes(p.id)) p.role = "government";
                      });
                      toast(`${c.name} designated as government (member parties set to Government).`, "ok");
                    }}
                  >
                    Designate as government
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      if (window.confirm(translateText(`Delete coalition ${c.name}? Its member parties are kept.`, language))) deleteCoalition(c.id);
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
  );
}
