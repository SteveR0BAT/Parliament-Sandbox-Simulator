"use client";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import type { Issue, IdeologySource, Threshold, ThresholdBasis, ThresholdType, VotingMode } from "@/lib/types";
import { Empty, Field, NumInput, Section, Seg, SliderField, Swatch } from "./ui";
import { FactionDecisions, IdeologyConfig, IndividualEditor, MixedEditor, PartyDecisions, RandomEditor } from "./VotingModes";
import { computeTally, pct } from "@/lib/voting";
import { downloadFile, safeName, voteCSV } from "@/lib/export";
import { DEFAULT_BEHAVIOR } from "@/lib/defaults";

const MODES: { v: VotingMode; label: string; desc: string }[] = [
  { v: "party", label: "A · Party-based", desc: "Every deputy follows the party's decision (subject to party discipline)." },
  { v: "ideology", label: "B · Ideology-based", desc: "Deputies vote according to their ideology (individual → faction → party by default) and the position configured for this issue." },
  { v: "faction", label: "C · Faction-based", desc: "Each faction has its own decision; deputies without a faction follow their party." },
  { v: "individual", label: "D · Individual", desc: "You decide how each single deputy votes." },
  { v: "random", label: "E · Fully random", desc: "Each deputy votes independently using the probabilities you set." },
  { v: "mixed", label: "F · Mixed", desc: "Choose a method per party; independents and individual overrides are handled too." },
];

const BASIS_LABEL: Record<ThresholdBasis, string> = { all: "All parliamentary seats", present: "Deputies present", valid: "Valid votes (For + Against)" };

function ThresholdEditor({ t, onChange }: { t: Threshold; onChange: (t: Threshold) => void }) {
  const needsBasis = t.type === "qualified" || t.type === "twoThirds" || t.type === "threeFifths" || t.type === "custom";
  return (
    <div className="space-y-3">
      <Field label="Majority type">
        <select className="select" value={t.type} onChange={(e) => onChange({ ...t, type: e.target.value as ThresholdType })}>
          <option value="simple">Simple majority (more For than Against)</option>
          <option value="absolute">Absolute majority (&gt; 50% of all seats)</option>
          <option value="qualified">Qualified majority (custom %)</option>
          <option value="twoThirds">Two-thirds majority</option>
          <option value="threeFifths">Three-fifths majority</option>
          <option value="custom">Custom constitutional rules</option>
        </select>
      </Field>
      {needsBasis && t.type !== "custom" && (
        <>
          {t.type === "qualified" && (
            <Field label="Required percentage">
              <NumInput value={t.percent} min={1} max={100} step={0.5} onCommit={(n) => onChange({ ...t, percent: n })} />
            </Field>
          )}
          <Field label="Calculated from">
            <select className="select" value={t.basis} onChange={(e) => onChange({ ...t, basis: e.target.value as ThresholdBasis })}>
              {(Object.keys(BASIS_LABEL) as ThresholdBasis[]).map((b) => (
                <option key={b} value={b}>
                  {BASIS_LABEL[b]}
                </option>
              ))}
            </select>
          </Field>
          {t.type === "qualified" && (
            <label className="flex items-center gap-2 text-[13px]">
              <input type="checkbox" checked={t.inclusive} onChange={(e) => onChange({ ...t, inclusive: e.target.checked })} /> “At least” instead of “more than”
            </label>
          )}
        </>
      )}
      {t.type === "custom" && (
        <div className="space-y-2">
          <p className="muted text-[11px]">All rules must be satisfied (e.g. 60% of present AND 40% of all seats).</p>
          {t.rules.map((r, i) => (
            <div key={i} className="card space-y-1.5 p-2">
              <input className="input" placeholder="Rule name" value={r.label} onChange={(e) => onChange({ ...t, rules: t.rules.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} />
              <div className="grid grid-cols-[70px_1fr] gap-2">
                <NumInput value={r.percent} min={0} max={100} step={0.5} onCommit={(n) => onChange({ ...t, rules: t.rules.map((x, j) => (j === i ? { ...x, percent: n } : x)) })} />
                <select className="select" value={r.basis} onChange={(e) => onChange({ ...t, rules: t.rules.map((x, j) => (j === i ? { ...x, basis: e.target.value as ThresholdBasis } : x)) })}>
                  {(Object.keys(BASIS_LABEL) as ThresholdBasis[]).map((b) => (
                    <option key={b} value={b}>
                      {BASIS_LABEL[b]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={r.inclusive} onChange={(e) => onChange({ ...t, rules: t.rules.map((x, j) => (j === i ? { ...x, inclusive: e.target.checked } : x)) })} /> at least (≥)
                </label>
                <button className="btn btn-sm btn-danger" onClick={() => onChange({ ...t, rules: t.rules.filter((_, j) => j !== i) })}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button className="btn btn-sm" onClick={() => onChange({ ...t, rules: [...t.rules, { label: `Rule ${t.rules.length + 1}`, percent: 50, basis: "present", inclusive: false }] })}>
            + Add rule
          </button>
        </div>
      )}
      <Field label="Quorum (% of all seats that must be present)" hint="0 = no quorum requirement. If quorum is not met, the vote fails.">
        <NumInput value={t.quorum} min={0} max={100} onCommit={(n) => onChange({ ...t, quorum: n })} />
      </Field>
    </div>
  );
}

function PriorityEditor({ value, onChange }: { value: IdeologySource[]; onChange: (v: IdeologySource[]) => void }) {
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const n = [...value];
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };
  return (
    <div className="space-y-1">
      {value.map((s, i) => (
        <div key={s} className="flex items-center gap-2 text-xs">
          <span className="chip">{i + 1}</span>
          <span className="flex-1 capitalize">{s} ideology</span>
          <button className="btn btn-sm btn-icon" onClick={() => move(i, -1)} disabled={i === 0}>
            ▲
          </button>
          <button className="btn btn-sm btn-icon" onClick={() => move(i, 1)} disabled={i === value.length - 1}>
            ▼
          </button>
        </div>
      ))}
    </div>
  );
}

function BehaviorEditor({ issue, update }: { issue: Issue; update: (fn: (i: Issue) => void) => void }) {
  const parties = useStore((s) => s.data.parties);
  const b = issue.behavior;
  const D = DEFAULT_BEHAVIOR;
  const set = <K extends keyof typeof b>(k: K, v: (typeof b)[K]) => update((i) => void (i.behavior[k] = v));
  return (
    <div className="space-y-3">
      <SliderField label="Party discipline" value={b.partyDiscipline} min={0} max={100} unit="%" onChange={(n) => set("partyDiscipline", n)} onReset={() => set("partyDiscipline", D.partyDiscipline)} hint="Chance that a deputy follows the party line. 90% = most follow, a few dissent." />
      <SliderField label="Faction discipline" value={b.factionDiscipline} min={0} max={100} unit="%" onChange={(n) => set("factionDiscipline", n)} onReset={() => set("factionDiscipline", D.factionDiscipline)} />
      <SliderField label="Ideological adherence" value={b.ideologicalAdherence} min={0} max={100} unit="%" onChange={(n) => set("ideologicalAdherence", n)} onReset={() => set("ideologicalAdherence", D.ideologicalAdherence)} hint="100% = vote follows the configured ideological position probabilities; lower values blend with the random distribution." />
      <SliderField label="Randomness" value={b.randomness} min={0} max={100} unit="%" onChange={(n) => set("randomness", n)} onReset={() => set("randomness", D.randomness)} hint="Chance a deputy ignores all guidance and votes randomly (uses the random probabilities)." />
      <SliderField label="Abstention probability" value={b.abstainProb} min={0} max={100} unit="%" onChange={(n) => set("abstainProb", n)} onReset={() => set("abstainProb", D.abstainProb)} />
      <SliderField label="Absence probability" value={b.absentProb} min={0} max={100} unit="%" onChange={(n) => set("absentProb", n)} onReset={() => set("absentProb", D.absentProb)} />
      <Field label="Ideology priority (first match wins)">
        <PriorityEditor value={b.priority} onChange={(v) => set("priority", v)} />
      </Field>
      <Field label="When nothing is configured for a deputy">
        <select className="select" value={b.unsetDecision} onChange={(e) => set("unsetDecision", e.target.value as typeof b.unsetDecision)}>
          <option value="abstain">Abstain</option>
          <option value="absent">Absent</option>
          <option value="for">For</option>
          <option value="against">Against</option>
          <option value="random">Random (random probabilities)</option>
        </select>
      </Field>
      {issue.mode !== "random" && (
        <Field label="Random distribution used for randomness / unset (For / Against / Abstain)">
          <RandomMini issue={issue} update={update} />
        </Field>
      )}
      <Field label="Per-party discipline overrides">
        <div className="space-y-1">
          {parties.map((p) => (
            <div key={p.id} className="grid grid-cols-[1fr_80px_auto] items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5">
                <Swatch color={p.color} /> {p.abbr}
              </span>
              <NumInput value={b.partyDisciplineOverrides[p.id] ?? b.partyDiscipline} min={0} max={100} onCommit={(n) => update((i) => void (i.behavior.partyDisciplineOverrides[p.id] = n))} />
              {b.partyDisciplineOverrides[p.id] !== undefined ? (
                <button className="btn btn-sm" onClick={() => update((i) => delete i.behavior.partyDisciplineOverrides[p.id])}>
                  reset
                </button>
              ) : (
                <span className="muted text-[10px]">global</span>
              )}
            </div>
          ))}
        </div>
      </Field>
    </div>
  );
}

function RandomMini({ issue, update }: { issue: Issue; update: (fn: (i: Issue) => void) => void }) {
  const r = issue.random;
  return (
    <div className="grid grid-cols-3 gap-2 text-[10px]">
      {(["pFor", "pAgainst", "pAbstain"] as const).map((k) => (
        <div key={k}>
          <span className="muted">{k === "pFor" ? "For" : k === "pAgainst" ? "Against" : "Abstain"} weight</span>
          <NumInput value={r[k]} min={0} max={100} onCommit={(n) => update((i) => void (i.random[k] = n))} />
        </div>
      ))}
    </div>
  );
}

function Editor({ issue }: { issue: Issue }) {
  const updateIssue = useStore((s) => s.updateIssue);
  const runVote = useStore((s) => s.runVote);
  const updatePrefs = useStore((s) => s.updatePrefs);
  const toast = useStore((s) => s.toast);
  const update = (fn: (i: Issue) => void) => updateIssue(issue.id, fn);
  const mode = issue.mode;
  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b px-4 py-2.5" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
        <div className="min-w-0 flex-1 truncate text-sm font-bold">{issue.name || "Untitled issue"}</div>
        <button className="btn btn-primary" onClick={() => runVote(issue.id)}>
          ▶ Run vote
        </button>
      </div>
      <Section title="Issue details">
        <Field label="Issue name">
          <input className="input" value={issue.name} onChange={(e) => update((i) => void (i.name = e.target.value))} placeholder="AI Regulations Act" />
        </Field>
        <Field label="Description">
          <textarea className="textarea" value={issue.description} onChange={(e) => update((i) => void (i.description = e.target.value))} />
        </Field>
        <Field label="Background / context (optional)">
          <textarea className="textarea" value={issue.background} onChange={(e) => update((i) => void (i.background = e.target.value))} />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Category (optional)">
            <input className="input" value={issue.category} onChange={(e) => update((i) => void (i.category = e.target.value))} placeholder="Technology" />
          </Field>
          <Field label="Voting type">
            <select className="select" value={issue.votingType} onChange={(e) => update((i) => void (i.votingType = e.target.value as Issue["votingType"]))}>
              {["bill", "resolution", "motion", "amendment", "confidence", "other"].map((t) => (
                <option key={t} value={t}>
                  {t[0].toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Additional notes">
          <textarea className="textarea" value={issue.notes} onChange={(e) => update((i) => void (i.notes = e.target.value))} />
        </Field>
      </Section>
      <Section title="Voting mode">
        <select className="select" value={mode} onChange={(e) => update((i) => void (i.mode = e.target.value as VotingMode))}>
          {MODES.map((m) => (
            <option key={m.v} value={m.v}>
              {m.label}
            </option>
          ))}
        </select>
        <p className="muted text-xs">{MODES.find((m) => m.v === mode)?.desc}</p>
      </Section>
      {(mode === "party") && (
        <Section title="Party decisions">
          <PartyDecisions issue={issue} update={update} />
        </Section>
      )}
      {mode === "faction" && (
        <>
          <Section title="Faction decisions">
            <FactionDecisions issue={issue} update={update} />
          </Section>
          <Section title="Party lines (fallback for deputies without a faction)" defaultOpen={false}>
            <PartyDecisions issue={issue} update={update} />
          </Section>
        </>
      )}
      {mode === "ideology" && (
        <Section title="Ideological positions">
          <IdeologyConfig issue={issue} update={update} />
        </Section>
      )}
      {mode === "individual" && (
        <Section title="Individual decisions">
          <IndividualEditor issue={issue} update={update} />
        </Section>
      )}
      {mode === "random" && (
        <Section title="Random probabilities">
          <RandomEditor issue={issue} update={update} />
        </Section>
      )}
      {mode === "mixed" && (
        <>
          <Section title="Method per party">
            <MixedEditor issue={issue} update={update} />
          </Section>
          <Section title="Ideological positions (for parties using ideology)" defaultOpen={false}>
            <IdeologyConfig issue={issue} update={update} />
          </Section>
          <Section title="Individual overrides" defaultOpen={false}>
            <IndividualEditor issue={issue} update={update} />
          </Section>
        </>
      )}
      {(mode === "party" || mode === "ideology" || mode === "faction" || mode === "mixed") && (
        <Section title="Voting behaviour" defaultOpen={false}>
          <BehaviorEditor issue={issue} update={update} />
          <button
            className="btn btn-sm"
            onClick={() => {
              updatePrefs((p) => {
                p.defaults.behavior = structuredClone(issue.behavior);
                p.defaults.random = structuredClone(issue.random);
              });
              toast("Saved as default behaviour for new issues.", "ok");
            }}
          >
            Use as default for new issues
          </button>
        </Section>
      )}
      {mode !== "individual" && mode !== "random" && null}
      {mode === "individual" && (
        <Section title="Default for deputies without a decision" defaultOpen={false}>
          <select className="select" value={issue.behavior.unsetDecision} onChange={(e) => update((i) => void (i.behavior.unsetDecision = e.target.value as Issue["behavior"]["unsetDecision"]))}>
            <option value="abstain">Abstain</option>
            <option value="absent">Absent</option>
            <option value="for">For</option>
            <option value="against">Against</option>
            <option value="random">Random</option>
          </select>
        </Section>
      )}
      <Section title="Majority threshold">
        <ThresholdEditor t={issue.threshold} onChange={(t) => update((i) => void (i.threshold = t))} />
        <button
          className="btn btn-sm"
          onClick={() => {
            updatePrefs((p) => void (p.defaults.threshold = structuredClone(issue.threshold)));
            toast("Saved as default threshold for new issues.", "ok");
          }}
        >
          Use as default for new issues
        </button>
      </Section>
    </div>
  );
}

function History() {
  const data = useStore((s) => s.data);
  const ui = useStore((s) => s.ui);
  const patch = useStore((s) => s.patchUI);
  const repeat = useStore((s) => s.repeatVote);
  const del = useStore((s) => s.deleteRecord);
  const rename = useStore((s) => s.renameRecord);
  const [cmp, setCmp] = useState<string[]>([]);
  const recs = useMemo(() => [...data.history].reverse(), [data.history]);
  const tallies = useMemo(() => new Map(data.history.map((r) => [r.id, computeTally(r)])), [data.history]);
  const [a, b] = cmp.map((id) => data.history.find((r) => r.id === id));
  const ta = a ? tallies.get(a.id) : undefined;
  const tb = b ? tallies.get(b.id) : undefined;

  if (!recs.length) return <div className="p-4"><Empty>No votes yet. Run a vote to build the history.</Empty></div>;
  return (
    <div className="space-y-3 p-4">
      {recs.map((r) => {
        const t = tallies.get(r.id)!;
        const active = ui.activeRecordId === r.id;
        return (
          <div key={r.id} className="card anim-in space-y-2 p-3" style={active ? { borderColor: "var(--accent)" } : undefined}>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={cmp.includes(r.id)} onChange={(e) => setCmp(e.target.checked ? [...cmp.slice(-1), r.id] : cmp.filter((x) => x !== r.id))} title="Select to compare (max 2)" />
              <input className="input !py-1 font-semibold" value={r.issue.name} onChange={(e) => rename(r.id, e.target.value)} aria-label="Rename vote" />
              <span className="chip" style={{ background: t.threshold.passed ? "color-mix(in srgb, var(--good) 20%, transparent)" : "color-mix(in srgb, var(--bad) 20%, transparent)", color: t.threshold.passed ? "var(--good)" : "var(--bad)" }}>
                {t.threshold.passed ? "PASSED" : "FAILED"}
              </span>
            </div>
            <div className="muted text-xs">
              {new Date(r.createdAt).toLocaleString()} · {r.issue.mode} mode · For {t.totals.for} · Against {t.totals.against} · Abstain {t.totals.abstain} · Absent {t.totals.absent}
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button className="btn btn-sm" onClick={() => patch({ activeRecordId: r.id, showVotes: true, animToken: ui.animToken + 1 })}>
                Open
              </button>
              <button className="btn btn-sm" onClick={() => repeat(r.id)} title="Re-run the same issue configuration with a new random draw">
                Repeat
              </button>
              <button className="btn btn-sm" onClick={() => downloadFile(`${safeName(r.issue.name)}_vote.csv`, voteCSV(r), "text/csv")}>
                CSV
              </button>
              <button className="btn btn-sm" onClick={() => downloadFile(`${safeName(r.issue.name)}_vote.json`, JSON.stringify(r, null, 2), "application/json")}>
                JSON
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => window.confirm("Delete this vote from history?") && del(r.id)}>
                Delete
              </button>
            </div>
          </div>
        );
      })}
      {a && b && ta && tb && (
        <div className="card anim-in p-3">
          <h3 className="mb-2 text-sm font-bold">Comparison</h3>
          <table className="tbl">
            <thead>
              <tr>
                <th></th>
                <th>{a.issue.name}</th>
                <th>{b.issue.name}</th>
                <th>Δ</th>
              </tr>
            </thead>
            <tbody>
              {(["for", "against", "abstain", "absent"] as const).map((k) => (
                <tr key={k}>
                  <td className="capitalize">{k}</td>
                  <td>{ta.totals[k]}</td>
                  <td>{tb.totals[k]}</td>
                  <td>{tb.totals[k] - ta.totals[k] > 0 ? "+" : ""}{tb.totals[k] - ta.totals[k]}</td>
                </tr>
              ))}
              <tr>
                <td>For % (present)</td>
                <td>{pct(ta.totals.for, ta.totals.present)}</td>
                <td>{pct(tb.totals.for, tb.totals.present)}</td>
                <td></td>
              </tr>
              <tr>
                <td>Outcome</td>
                <td>{ta.threshold.passed ? "Passed" : "Failed"}</td>
                <td>{tb.threshold.passed ? "Passed" : "Failed"}</td>
                <td></td>
              </tr>
              {ta.parties.map((p, i) => {
                const q = tb.parties.find((x) => x.id === p.id) ?? tb.parties[i];
                return (
                  <tr key={p.id}>
                    <td>
                      <Swatch color={p.color} /> {p.abbr} For
                    </td>
                    <td>{p.counts.for}</td>
                    <td>{q ? q.counts.for : "–"}</td>
                    <td>{q ? `${q.counts.for - p.counts.for > 0 ? "+" : ""}${q.counts.for - p.counts.for}` : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {cmp.length === 1 && <p className="muted text-xs">Select one more vote to compare.</p>}
    </div>
  );
}

export function VotingPanel() {
  const data = useStore((s) => s.data);
  const ui = useStore((s) => s.ui);
  const patch = useStore((s) => s.patchUI);
  const addIssue = useStore((s) => s.addIssue);
  const dupIssue = useStore((s) => s.duplicateIssue);
  const delIssue = useStore((s) => s.deleteIssue);
  const runVote = useStore((s) => s.runVote);
  const [sub, setSub] = useState<"issues" | "configure" | "history">("issues");
  const issue = data.issues.find((i) => i.id === ui.activeIssueId);

  return (
    <div>
      <div className="flex items-center justify-between gap-2 border-b px-4 py-2.5" style={{ borderColor: "var(--border)" }}>
        <Seg<"issues" | "configure" | "history"> value={sub} onChange={setSub} options={[{ v: "issues", label: "Issues" }, { v: "configure", label: "Configure" }, { v: "history", label: `History (${data.history.length})` }]} />
      </div>
      {sub === "issues" && (
        <div className="space-y-2 p-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              try {
                const issueId = addIssue({ name: `Issue ${data.issues.length + 1}` });
                const current = useStore.getState();
                if (!current.data.issues.some((item) => item.id === issueId)) {
                  current.toast("The new voting issue could not be created.", "error");
                  return;
                }
                current.patchUI({ activeIssueId: issueId });
                setSub("configure");
              } catch (error) {
                const message = error instanceof Error ? error.message : "Unknown error";
                useStore.getState().toast(`Could not create voting issue: ${message}`, "error");
              }
            }}
          >
            + New voting issue
          </button>
          {data.issues.length === 0 && <Empty>Create a parliamentary question, bill or resolution to vote on.</Empty>}
          {data.issues.map((i) => (
            <div key={i.id} className="card anim-in space-y-1.5 p-3" style={ui.activeIssueId === i.id ? { borderColor: "var(--accent)" } : undefined}>
              <button
                className="w-full text-left"
                onClick={() => {
                  patch({ activeIssueId: i.id });
                  setSub("configure");
                }}
              >
                <div className="text-[13px] font-bold">{i.name || "Untitled"}</div>
                <div className="muted line-clamp-2 text-xs">{i.description || "No description"}</div>
              </button>
              <div className="flex flex-wrap gap-1.5">
                <span className="chip">{i.mode}</span>
                {i.category && <span className="chip">{i.category}</span>}
                <span className="flex-1" />
                <button className="btn btn-sm btn-primary" onClick={() => runVote(i.id)}>
                  ▶ Run
                </button>
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    patch({ activeIssueId: i.id });
                    setSub("configure");
                  }}
                >
                  Edit
                </button>
                <button className="btn btn-sm" onClick={() => dupIssue(i.id)}>
                  Duplicate
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => window.confirm(`Delete issue “${i.name}”? Past votes stay in the history.`) && delIssue(i.id)}>
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {sub === "configure" && (issue ? <Editor issue={issue} key={issue.id} /> : <div className="p-4"><Empty>Select or create an issue first.</Empty></div>)}
      {sub === "history" && <History />}
    </div>
  );
}
