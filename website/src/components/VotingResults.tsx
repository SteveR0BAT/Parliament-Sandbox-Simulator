"use client";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { computeTally, pct, VOTE_LABELS, type Counts, type GroupRow } from "@/lib/voting";
import { Bar, Empty, StatBox, Swatch } from "./ui";
import { downloadFile, safeName, voteCSV } from "@/lib/export";
import type { Vote } from "@/lib/types";

function GroupTable({ title, rows, colors }: { title: string; rows: { key: string; name: string; color?: string; counts: Counts }[]; colors: Record<Vote, string> }) {
  if (!rows.length) return null;
  return (
    <div className="card overflow-x-auto p-3">
      <h4 className="mb-2 text-sm font-bold">{title}</h4>
      <table className="tbl">
        <thead>
          <tr>
            <th>Group</th>
            <th>For</th>
            <th>Against</th>
            <th>Abstain</th>
            <th>Absent</th>
            <th style={{ width: "28%" }}>Distribution</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key}>
              <td className="font-semibold">
                {r.color && <Swatch color={r.color} />} {r.name}
              </td>
              {(["for", "against", "abstain", "absent"] as Vote[]).map((v) => (
                <td key={v}>
                  <b>{r.counts[v]}</b> <span className="muted text-[10px]">{pct(r.counts[v], r.counts.total)}</span>
                </td>
              ))}
              <td>
                <Bar height={8} parts={(["for", "against", "abstain", "absent"] as Vote[]).map((v) => ({ v: r.counts[v], color: colors[v], title: `${VOTE_LABELS[v]} ${r.counts[v]}` }))} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function VotingResults() {
  const data = useStore((s) => s.data);
  const ui = useStore((s) => s.ui);
  const patch = useStore((s) => s.patchUI);
  const repeat = useStore((s) => s.repeatVote);
  const rec = data.history.find((r) => r.id === ui.activeRecordId) ?? null;
  const tally = useMemo(() => (rec ? computeTally(rec) : null), [rec]);
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(40);

  if (!rec || !tally) {
    return (
      <div className="panel p-5">
        <Empty>Run a vote from the panel on the left to see the animated chamber, statistics and breakdowns here.</Empty>
      </div>
    );
  }
  const vc = data.prefs.voteColors;
  const t = tally.totals;
  const th = tally.threshold;
  const deputies = rec.snapshot.deputies
    .map((d, i) => ({ d, i }))
    .filter(({ d }) => !q || d.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="panel anim-in space-y-4 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="muted text-xs uppercase tracking-wide">{rec.issue.votingType} · {rec.issue.category || "uncategorised"} · {rec.issue.mode} mode</div>
          <h2 className="text-xl font-extrabold">{rec.issue.name}</h2>
          {rec.issue.description && <p className="muted mt-1 max-w-3xl text-[13px]">{rec.issue.description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-sm" onClick={() => patch({ showVotes: !ui.showVotes })}>
            Overlay {ui.showVotes ? "on" : "off"}
          </button>
          <button className="btn btn-sm" onClick={() => patch({ animToken: ui.animToken + 1, showVotes: true })}>
            ↻ Replay animation
          </button>
          <button className="btn btn-sm" onClick={() => repeat(rec.id)}>
            Repeat vote
          </button>
          <button className="btn btn-sm" onClick={() => downloadFile(`${safeName(rec.issue.name)}_vote.csv`, voteCSV(rec), "text/csv")}>
            Export CSV
          </button>
        </div>
      </div>

      <div className="rounded-xl p-4 text-center anim-pop" style={{ background: `color-mix(in srgb, ${th.passed ? "var(--good)" : "var(--bad)"} 14%, transparent)`, border: `1px solid ${th.passed ? "var(--good)" : "var(--bad)"}` }}>
        <div className="text-3xl font-black tracking-wide" style={{ color: th.passed ? "var(--good)" : "var(--bad)" }}>
          {th.passed ? "PASSED" : "FAILED"}
        </div>
        <div className="mt-2 space-y-0.5 text-xs">
          {th.quorumRequired > 0 && (
            <div>
              Quorum: {t.present} present / {th.quorumRequired} required — {th.quorumOk ? "✓ met" : "✗ NOT met"}
            </div>
          )}
          {th.lines.map((l, i) => (
            <div key={i}>
              {l.label}: needs <b>{l.required}</b> For (have <b>{l.actual}</b>, base {l.baseValue}) — {l.passed ? "✓" : "✗"}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">
        <StatBox label="Total seats" value={t.seats} sub={t.vacant ? `${t.vacant} vacant` : undefined} />
        <StatBox label="Present" value={t.present} />
        <StatBox label="Absent" value={t.absent} color={vc.absent} />
        <StatBox label="For" value={t.for} color={vc.for} sub={`${pct(t.for, t.present)} of present`} />
        <StatBox label="Against" value={t.against} color={vc.against} sub={`${pct(t.against, t.present)} of present`} />
        <StatBox label="Abstain" value={t.abstain} color={vc.abstain} />
        <StatBox label="For % valid" value={pct(t.for, t.valid)} sub="For ÷ (For+Against)" />
        <StatBox label="For % of seats" value={pct(t.for, t.seats)} />
      </div>
      <Bar height={16} parts={[{ v: t.for, color: vc.for, title: "For" }, { v: t.against, color: vc.against, title: "Against" }, { v: t.abstain, color: vc.abstain, title: "Abstain" }, { v: t.absent, color: vc.absent, title: "Absent" }, { v: t.vacant, color: "var(--border)", title: "Vacant" }]} />

      <div className="grid gap-4 xl:grid-cols-2">
        <GroupTable title="By party" colors={vc} rows={[...tally.parties.map((p) => ({ key: p.id, name: `${p.name} (${p.abbr})`, color: p.color, counts: p.counts })), ...(tally.independents.counts.total ? [{ key: "ind", name: "Independents", color: "#94a3b8", counts: tally.independents.counts }] : [])]} />
        <GroupTable title="By coalition" colors={vc} rows={tally.coalitions.map((c: GroupRow) => ({ key: c.id, name: `${c.name} (${c.abbr})`, color: c.color, counts: c.counts }))} />
        <GroupTable title="By faction" colors={vc} rows={tally.factions.filter((f) => f.counts.total).map((f) => ({ key: f.id, name: `${f.name} · ${tally.parties.find((p) => p.id === f.partyId)?.abbr ?? ""}`, color: f.color, counts: f.counts }))} />
        <GroupTable title="Ideological trends (deputy's effective ideology group)" colors={vc} rows={tally.categories.map((c) => ({ key: c.id, name: c.label, color: c.color, counts: c.counts }))} />
      </div>

      <div className="card p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h4 className="text-sm font-bold">Why did each deputy vote this way?</h4>
          <input className="input !w-56" placeholder="Search deputy…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="max-h-80 overflow-y-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Deputy</th>
                <th>Party</th>
                <th>Vote</th>
                <th>Reasoning</th>
              </tr>
            </thead>
            <tbody>
              {deputies.slice(0, limit).map(({ d, i }) => {
                const p = rec.snapshot.parties.find((x) => x.id === d.partyId);
                return (
                  <tr key={d.id}>
                    <td>{d.name}</td>
                    <td>{p ? <><Swatch color={p.color} /> {p.abbr}</> : "IND"}</td>
                    <td>
                      <span className="chip" style={{ background: vc[rec.votes[i]] + "33", color: "var(--text)" }}>
                        {VOTE_LABELS[rec.votes[i]]}
                      </span>
                    </td>
                    <td className="muted text-[11.5px]">{rec.reasons[i]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {deputies.length > limit && (
            <button className="btn btn-sm mt-2 w-full" onClick={() => setLimit(limit + 100)}>
              Show more ({deputies.length - limit} remaining)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
