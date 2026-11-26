"use client";

import { useMemo, useState } from "react";
import { Dashboard } from "./ParliamentPanel";
import { Field } from "./ui";
import { useStore } from "@/lib/store";
import { deputyList, uid } from "@/lib/parliament";
import { lookupIdeology } from "@/lib/voting";
import { IDEOLOGY_FAMILY_MAP } from "@/data/ideologies";
import type { GovernmentPosition, IdeologyFamilyId } from "@/lib/types";

function deputyFamily(
  deputyId: string,
  data: ReturnType<typeof useStore.getState>["data"],
): IdeologyFamilyId {
  const deputy = data.deputies[deputyId];
  if (!deputy) return "unclassified";
  const party = deputy.partyId ? data.parties.find((p) => p.id === deputy.partyId) : undefined;
  const faction = deputy.factionId ? data.factions.find((f) => f.id === deputy.factionId) : undefined;
  const ideology =
    lookupIdeology(data.customIdeologies, deputy.ideologyId) ??
    lookupIdeology(data.customIdeologies, faction?.ideologyId) ??
    lookupIdeology(data.customIdeologies, party?.ideologyId);
  return ideology?.family ?? "unclassified";
}

function changePosition(
  mutate: ReturnType<typeof useStore.getState>["mutate"],
  id: string,
  change: (position: GovernmentPosition) => void,
) {
  mutate((data) => {
    const position = data.governmentPositions.find((item) => item.id === id);
    if (position) change(position);
  });
}

export function GovernmentPanel() {
  const data = useStore((state) => state.data);
  const mutate = useStore((state) => state.mutate);
  const toast = useStore((state) => state.toast);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const partyById = useMemo(() => new Map(data.parties.map((party) => [party.id, party])), [data.parties]);
  const eligibleDeputies = useMemo(
    () =>
      deputyList(data)
        .filter((deputy) => {
          if (!deputy.partyId) return false;
          return partyById.get(deputy.partyId)?.role === "government";
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
    [data, partyById],
  );

  const appointmentStats = useMemo(() => {
    const deputyAppointments = data.governmentPositions.flatMap((position) => {
      if (!position.deputyId) return [];
      const deputy = data.deputies[position.deputyId];
      const party = deputy?.partyId ? partyById.get(deputy.partyId) : undefined;
      if (!deputy || party?.role !== "government") return [];
      return [{ position, deputy, party, family: deputyFamily(deputy.id, data) }];
    });
    const externalAppointments = data.governmentPositions.filter(
      (position) => !position.deputyId && position.externalName.trim(),
    );
    const byParty = new Map<string, number>();
    const byFamily = new Map<IdeologyFamilyId, number>();
    for (const appointment of deputyAppointments) {
      byParty.set(appointment.party.id, (byParty.get(appointment.party.id) ?? 0) + 1);
      byFamily.set(appointment.family, (byFamily.get(appointment.family) ?? 0) + 1);
    }
    return {
      deputyAppointments,
      externalAppointments,
      filled: deputyAppointments.length + externalAppointments.length,
      vacant: Math.max(0, data.governmentPositions.length - deputyAppointments.length - externalAppointments.length),
      byParty: [...byParty.entries()]
        .map(([id, count]) => ({ party: partyById.get(id)!, count }))
        .sort((a, b) => b.count - a.count || a.party.name.localeCompare(b.party.name)),
      byFamily: [...byFamily.entries()]
        .map(([family, count]) => ({ family, label: IDEOLOGY_FAMILY_MAP[family].label, count }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)),
    };
  }, [data, partyById]);

  const update = (id: string, patch: Partial<GovernmentPosition>) =>
    changePosition(mutate, id, (position) => Object.assign(position, patch));

  const addPosition = () => {
    const title = newTitle.trim();
    if (!title) {
      toast("Give the custom position a name.", "error");
      return;
    }
    mutate((draft) => {
      draft.governmentPositions.push({
        id: uid("office"),
        title,
        description: newDescription.trim(),
        deputyId: null,
        externalName: "",
        custom: true,
      });
    });
    setNewTitle("");
    setNewDescription("");
    setAdding(false);
    toast("Custom government position added.", "ok");
  };

  const removePosition = (id: string) =>
    mutate((draft) => {
      draft.governmentPositions = draft.governmentPositions.filter((position) => position.id !== id);
    });

  return (
    <div className="space-y-4 p-3">
      <section className="space-y-3">
        <h3 className="px-1 text-sm font-extrabold">Parliament overview</h3>
        <Dashboard />
      </section>

      <section className="space-y-3 border-t pt-3" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-extrabold">Government offices</h3>
            <p className="muted mt-1 text-xs">
              Appoint sitting deputies from Government-designated parties, or enter an external officeholder by name.
            </p>
          </div>
          <span className="chip">{eligibleDeputies.length} eligible deputies</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="card p-2">
            <div className="label">Filled</div>
            <div className="text-xl font-extrabold tabular-nums">{appointmentStats.filled}</div>
          </div>
          <div className="card p-2">
            <div className="label">Vacant</div>
            <div className="text-xl font-extrabold tabular-nums">{appointmentStats.vacant}</div>
          </div>
          <div className="card p-2">
            <div className="label">Total offices</div>
            <div className="text-xl font-extrabold tabular-nums">{data.governmentPositions.length}</div>
          </div>
        </div>

        <div className="space-y-2">
          {data.governmentPositions.length === 0 && (
            <div className="card muted p-4 text-center text-sm">No government offices have been created yet.</div>
          )}
          {data.governmentPositions.map((position) => {
            const selectedDeputy = position.deputyId ? data.deputies[position.deputyId] : undefined;
            const selectedParty = selectedDeputy?.partyId ? partyById.get(selectedDeputy.partyId) : undefined;
            const isEligible = !!selectedDeputy && selectedParty?.role === "government";
            const hasStaleDeputy = !!position.deputyId && !isEligible;
            return (
              <article key={position.id} className="card space-y-3 p-3">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <Field label="Position name">
                      <input
                        className="input font-semibold"
                        value={position.title}
                        onChange={(event) => update(position.id, { title: event.target.value })}
                        aria-label="Position name"
                      />
                    </Field>
                  </div>
                  <button
                    className="btn btn-sm btn-danger mt-5"
                    onClick={() => removePosition(position.id)}
                    aria-label={`Remove ${position.title || "position"}`}
                    title="Remove this position"
                  >
                    Remove
                  </button>
                </div>

                <Field label="Description">
                  <textarea
                    className="textarea"
                    rows={2}
                    value={position.description}
                    onChange={(event) => update(position.id, { description: event.target.value })}
                    placeholder="Describe the responsibilities of this office…"
                  />
                </Field>

                <Field
                  label="Deputy appointment"
                  hint="Only deputies from parties marked Government are selectable. A deputy may hold more than one office."
                >
                  <select
                    className="select"
                    value={position.deputyId ?? ""}
                    onChange={(event) =>
                      update(position.id, {
                        deputyId: event.target.value || null,
                        externalName: "",
                      })
                    }
                  >
                    <option value="">No deputy selected</option>
                    {hasStaleDeputy && (
                      <option value={position.deputyId ?? ""}>
                        {selectedDeputy?.name ?? "Unknown deputy"} — no longer eligible
                      </option>
                    )}
                    {eligibleDeputies.map((deputy) => {
                      const party = deputy.partyId ? partyById.get(deputy.partyId) : undefined;
                      return (
                        <option key={deputy.id} value={deputy.id}>
                          {deputy.name} · {party?.abbr ?? party?.name ?? "Government"}
                        </option>
                      );
                    })}
                  </select>
                </Field>

                {hasStaleDeputy && (
                  <p className="text-xs font-medium" style={{ color: "var(--warn)" }}>
                    This deputy is no longer eligible because their party is not currently designated Government. Clear or replace the appointment.
                  </p>
                )}

                <Field
                  label="External / non-deputy appointee"
                  hint="Use this for presidents, monarch-appointed ministers, technocrats or other officeholders who are not sitting government deputies."
                >
                  <input
                    className="input"
                    value={position.externalName}
                    onChange={(event) =>
                      update(position.id, {
                        externalName: event.target.value,
                        deputyId: event.target.value.trim() ? null : position.deputyId,
                      })
                    }
                    placeholder="Enter a person's name"
                  />
                </Field>

                {position.custom && <span className="chip">Custom position</span>}
              </article>
            );
          })}
        </div>

        {adding ? (
          <div className="card anim-in space-y-3 p-3">
            <h4 className="text-sm font-bold">Create custom position</h4>
            <Field label="Position name">
              <input
                className="input"
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                placeholder="Ministry of Shit & Giggles"
                autoFocus
              />
            </Field>
            <Field label="Description">
              <textarea
                className="textarea"
                rows={3}
                value={newDescription}
                onChange={(event) => setNewDescription(event.target.value)}
                placeholder="Describe the office's purpose and responsibilities…"
              />
            </Field>
            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={addPosition} disabled={!newTitle.trim()}>
                Add position
              </button>
              <button className="btn" onClick={() => setAdding(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button className="btn btn-primary w-full" onClick={() => setAdding(true)}>
            + Add custom position
          </button>
        )}
      </section>

      <section className="space-y-3 border-t pt-3" style={{ borderColor: "var(--border)" }}>
        <div>
          <h3 className="text-sm font-extrabold">Appointment statistics</h3>
          <p className="muted mt-1 text-xs">
            Party and ideological-family totals count deputies currently appointed from Government-designated parties. External appointees are counted separately.
          </p>
        </div>

        <div className="space-y-2">
          <div className="card p-3">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wide">Appointments by party</h4>
            {appointmentStats.byParty.length ? (
              <div className="space-y-2">
                {appointmentStats.byParty.map(({ party, count }) => (
                  <div key={party.id}>
                    <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="swatch" style={{ background: party.color }} />
                        <span className="truncate">{party.name}</span>
                      </span>
                      <b className="tabular-nums">{count}</b>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(count / Math.max(1, appointmentStats.deputyAppointments.length)) * 100}%`,
                          background: party.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted text-xs">No deputy appointments yet.</p>
            )}
          </div>

          <div className="card p-3">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wide">Appointments by ideological family</h4>
            {appointmentStats.byFamily.length ? (
              <div className="space-y-2">
                {appointmentStats.byFamily.map(({ family, label, count }) => (
                  <div key={family} className="flex items-center justify-between gap-3 text-xs">
                    <span className="min-w-0">{label}</span>
                    <b className="tabular-nums">{count}</b>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted text-xs">No deputy appointments yet.</p>
            )}
          </div>
        </div>

        <div className="muted text-xs">
          {appointmentStats.deputyAppointments.length} deputy appointments · {appointmentStats.externalAppointments.length} external appointees · {appointmentStats.vacant} vacant offices.
        </div>
      </section>
    </div>
  );
}
