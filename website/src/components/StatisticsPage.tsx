"use client";
import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { computeStats } from "@/lib/stats";
import { CATEGORIES } from "@/data/ideologies";
import { computeTally, pct } from "@/lib/voting";
import { Bar, Empty, StatBox, Swatch } from "./ui";
import { Dashboard } from "./ParliamentPanel";
import { compositionCSV, downloadFile, safeName } from "@/lib/export";

export function StatisticsPage() {
  const data = useStore((s) => s.data);
  const name = useStore((s) => s.meta.name);
  const st = useMemo(() => computeStats(data), [data]);
  const tallies = useMemo(() => data.history.map((r) => ({ r, t: computeTally(r) })), [data.history]);
  const maxCat = Math.max(1, ...Object.values(st.categories));
  const maxParty = Math.max(1, ...st.rows.map((r) => r.seats));

  return (
    <div className="mx-auto grid max-w-[1500px] gap-4 p-4 lg:grid-cols-[380px_1fr]">
      <div className="panel p-4">
        <h2 className="mb-3 text-sm font-bold">Parliament dashboard</h2>
        <Dashboard />
      </div>
      <div className="space-y-4">
        <div className="panel p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold">Party strength</h2>
            <button className="btn btn-sm" onClick={() => downloadFile(`${safeName(name)}_composition.csv`, compositionCSV(data), "text/csv")}>
              Export composition CSV
            </button>
          </div>
          {st.rows.length === 0 ? (
            <Empty>No parties yet.</Empty>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Party</th>
                  <th>Seats</th>
                  <th>Share</th>
                  <th>Factions</th>
                  <th>Role</th>
                  <th style={{ width: "30%" }}></th>
                </tr>
              </thead>
              <tbody>
                {st.rows.map((r) => (
                  <tr key={r.party.id}>
                    <td className="font-semibold">
                      <Swatch color={r.party.color} /> {r.party.name}
                    </td>
                    <td>{r.seats}</td>
                    <td>{r.pct.toFixed(1)}%</td>
                    <td>{r.factions}</td>
                    <td className="capitalize">{r.party.role}</td>
                    <td>
                      <Bar height={8} parts={[{ v: r.seats, color: r.party.color }, { v: maxParty - r.seats, color: "transparent" }]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="panel p-4">
            <h2 className="mb-3 text-sm font-bold">Coalitions</h2>
            {st.coalitionSeats.length === 0 && <Empty>No coalitions.</Empty>}
            {st.coalitionSeats.map((c) => (
              <div key={c.id} className="mb-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span className="inline-block h-3 w-3 rounded-full" style={{ border: `3px solid ${c.color}` }} /> {c.name}
                  </span>
                  <span>
                    <b>{c.seats}</b> seats · {c.seats >= st.majority ? "majority" : `${st.majority - c.seats} short`}
                  </span>
                </div>
                <Bar parts={[{ v: c.seats, color: c.color }, { v: Math.max(0, st.total - c.seats), color: "var(--border)" }]} />
              </div>
            ))}
          </div>
          <div className="panel p-4">
            <h2 className="mb-3 text-sm font-bold">Ideological distribution (deputies)</h2>
            {CATEGORIES.map((c) => {
              const n = st.categories[c.id] ?? 0;
              if (!n && c.id === "unclassified") return null;
              return (
                <div key={c.id} className="mb-1.5 grid grid-cols-[110px_1fr_40px] items-center gap-2 text-xs">
                  <span className="font-semibold" style={{ color: c.color }}>
                    {c.id === "unclassified" ? "No ideology" : c.label}
                  </span>
                  <Bar height={8} parts={[{ v: n, color: c.color }, { v: maxCat - n, color: "transparent" }]} />
                  <span className="text-right">{n}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="panel p-4">
          <h2 className="mb-3 text-sm font-bold">Vote history overview</h2>
          {tallies.length === 0 ? (
            <Empty>No votes yet.</Empty>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Issue</th>
                  <th>Mode</th>
                  <th>For</th>
                  <th>Against</th>
                  <th>Abstain</th>
                  <th>Absent</th>
                  <th>For % present</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {tallies.map(({ r, t }) => (
                  <tr key={r.id}>
                    <td className="font-semibold">{r.issue.name}</td>
                    <td>{r.issue.mode}</td>
                    <td>{t.totals.for}</td>
                    <td>{t.totals.against}</td>
                    <td>{t.totals.abstain}</td>
                    <td>{t.totals.absent}</td>
                    <td>{pct(t.totals.for, t.totals.present)}</td>
                    <td style={{ color: t.threshold.passed ? "var(--good)" : "var(--bad)" }}>
                      <b>{t.threshold.passed ? "Passed" : "Failed"}</b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <StatBox label="Votes held" value={data.history.length} />
          <StatBox label="Passed" value={tallies.filter((x) => x.t.threshold.passed).length} color="var(--good)" />
          <StatBox label="Failed" value={tallies.filter((x) => !x.t.threshold.passed).length} color="var(--bad)" />
          <StatBox label="Custom ideologies" value={data.customIdeologies.length} />
        </div>
      </div>
    </div>
  );
}
