"use client";
import { useState } from "react";
import { useStore, roleLabels } from "@/lib/store";
import type { IndependentBehavior, Role, VoteRecord } from "@/lib/types";
import { describeDeputy } from "./Chamber";
import { IdeologySelect } from "./IdeologyPicker";
import { ColorPicker } from "./ColorPicker";
import { Field, NumInput, Swatch } from "./ui";

export function SeatInspector({ seat, record, showVotes }: { seat: number; record: VoteRecord | null; showVotes: boolean }) {
  const data = useStore((s) => s.data);
  const patch = useStore((s) => s.patchUI);
  const assignSeat = useStore((s) => s.assignSeat);
  const updateDeputy = useStore((s) => s.updateDeputy);
  const assignFaction = useStore((s) => s.assignFaction);
  const removeDeputy = useStore((s) => s.removeDeputy);
  const swapSeats = useStore((s) => s.swapSeats);
  const toast = useStore((s) => s.toast);
  const [swapTo, setSwapTo] = useState(seat + 2);
  const id = data.seats[seat];
  const info = id ? describeDeputy(data, id, record, showVotes) : null;
  const dep = info?.dep;
  const lockNote = () => !data.seatingLocked && toast("Manual seating enabled: this seat keeps its position. Use “Auto-arrange” to restore party blocks.", "info");

  const partyValue = !dep ? "vacant" : dep.partyId ?? "independent";
  const changeParty = (v: string) => {
    lockNote();
    if (v === "vacant") assignSeat(seat, { kind: "vacant" });
    else if (v === "independent") assignSeat(seat, { kind: "independent" });
    else assignSeat(seat, { kind: "party", partyId: v });
  };

  return (
    <div className="panel anim-in p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold">
          Seat {seat + 1} {dep ? `· ${dep.name}` : "· vacant"}
        </h3>
        <button className="btn btn-sm" onClick={() => patch({ selectedSeat: null })}>
          Close ✕
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-3">
          {dep && (
            <Field label="Deputy name">
              <input className="input" value={dep.name} onChange={(e) => updateDeputy(dep.id, { name: e.target.value })} />
            </Field>
          )}
          <Field label="Political affiliation" hint="Reassigning a seat switches the deputy to manual seating.">
            <select className="select" value={partyValue} onChange={(e) => changeParty(e.target.value)}>
              <option value="vacant">— Vacant seat —</option>
              <option value="independent">Independent</option>
              {data.parties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.abbr})
                </option>
              ))}
            </select>
          </Field>
          {dep?.partyId && (
            <Field label="Faction">
              <select className="select" value={dep.factionId ?? ""} onChange={(e) => assignFaction(dep.id, e.target.value || null)}>
                <option value="">No faction</option>
                {data.factions.filter((f) => f.partyId === dep.partyId).map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>
        <div className="space-y-3">
          {dep && (
            <>
              <Field label="Individual ideology" hint="Overrides faction and party ideology in ideology-based voting (default priority).">
                <IdeologySelect value={dep.ideologyId} onChange={(v) => updateDeputy(dep.id, { ideologyId: v })} placeholder="Inherit from faction / party" />
              </Field>
              {info?.ideology && (
                <p className="muted text-xs">
                  Effective ideology: <b>{info.ideology.name}</b> ({info.via})
                </p>
              )}
              {!dep.partyId && (
                <>
                  <Field label="Colour">
                    <ColorPicker compact value={dep.color ?? "#94a3b8"} onChange={(c) => updateDeputy(dep.id, { color: c })} />
                  </Field>
                </>
              )}
            </>
          )}
        </div>
        <div className="space-y-3">
          {dep && !dep.partyId && (
            <>
              <Field label="Voting behaviour">
                <select className="select" value={dep.behavior} onChange={(e) => updateDeputy(dep.id, { behavior: e.target.value as IndependentBehavior })}>
                  <option value="ideology">Follows own ideology</option>
                  <option value="random">Random</option>
                  <option value="for">Always For</option>
                  <option value="against">Always Against</option>
                  <option value="abstain">Always Abstain</option>
                </select>
              </Field>
              <Field label="Government designation">
                <select className="select" value={dep.role} onChange={(e) => updateDeputy(dep.id, { role: e.target.value as Role })}>
                  {(Object.keys(roleLabels) as Role[]).map((r) => (
                    <option key={r} value={r}>
                      {roleLabels[r]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Affiliation / notes">
                <input className="input" value={dep.affiliation} onChange={(e) => updateDeputy(dep.id, { affiliation: e.target.value })} placeholder="e.g. Local list, ex-PDU" />
              </Field>
            </>
          )}
          {dep && info?.party && (
            <div className="card p-2 text-xs">
              <div className="flex items-center gap-1.5 font-semibold">
                <Swatch color={info.party.color} /> {info.party.name}
              </div>
              {info.party.leader && <div className="muted">Leader: {info.party.leader}</div>}
              {info.coalitions.map((c) => (
                <div key={c.id} className="flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-full" style={{ border: `3px solid ${c.color}` }} /> {c.name}
                </div>
              ))}
            </div>
          )}
          <Field label="Swap with seat #">
            <div className="flex gap-1.5">
              <NumInput value={swapTo} min={1} max={data.settings.totalSeats} int onCommit={setSwapTo} />
              <button
                className="btn btn-sm"
                onClick={() => {
                  lockNote();
                  swapSeats(seat, swapTo - 1);
                }}
              >
                Swap
              </button>
            </div>
          </Field>
          {dep && (
            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                removeDeputy(dep.id);
                toast("Deputy removed; seat is now vacant.", "ok");
              }}
            >
              Remove deputy
            </button>
          )}
        </div>
      </div>
      {info?.vote && (
        <div className="card mt-3 p-3 text-xs">
          <b>Vote: {info.vote}</b>
          <div className="muted mt-1">Why: {info.reason || "—"}</div>
        </div>
      )}
    </div>
  );
}
