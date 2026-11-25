"use client";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { computeGeometry, computeViewBox } from "@/lib/geometry";
import { buildLookup, computeSeatStyles, type RevealState } from "@/lib/visual";
import { CATEGORY_MAP } from "@/data/ideologies";
import { computeTally, lookupIdeology, mulberry32, VOTE_LABELS } from "@/lib/voting";
import type { Layer, ProjectData, VoteRecord } from "@/lib/types";
import { Seg, Swatch } from "./ui";
import { SeatInspector } from "./SeatInspector";

interface SeatProps {
  i: number;
  x: number;
  y: number;
  r: number;
  fill: string;
  fr: number;
  mid?: string;
  ring?: string;
  dot?: string;
  opacity: number;
  ringW: number;
  selected: boolean;
  label: string;
}

const Seat = memo(function Seat(p: SeatProps) {
  const { r } = p;
  return (
    <g data-i={p.i} className="seat-hit" opacity={p.opacity}>
      <circle cx={p.x} cy={p.y} r={r * 1.02} fill="transparent" stroke="none" />
      {p.ring && <circle cx={p.x} cy={p.y} r={r * (1 - p.ringW / 2)} fill="none" stroke={p.ring} strokeWidth={r * p.ringW} />}
      {p.mid && <circle cx={p.x} cy={p.y} r={r * 0.7} fill="none" stroke={p.mid} strokeWidth={r * 0.14} />}
      <circle cx={p.x} cy={p.y} r={r * p.fr} fill={p.fill} />
      {p.dot && <circle cx={p.x} cy={p.y} r={r * 0.34} fill={p.dot} stroke="rgba(255,255,255,0.7)" strokeWidth={r * 0.06} />}
      {p.label && (
        <text x={p.x} y={p.y} fontSize={r * 0.62} textAnchor="middle" dominantBaseline="central" fill="#fff" stroke="rgba(0,0,0,.45)" strokeWidth={r * 0.08} paintOrder="stroke" pointerEvents="none">
          {p.label}
        </text>
      )}
      {p.selected && <circle cx={p.x} cy={p.y} r={r * 1.12} fill="none" stroke="var(--accent)" strokeWidth={r * 0.2} pointerEvents="none" />}
    </g>
  );
});

export function describeDeputy(d: ProjectData, deputyId: string, record: VoteRecord | null, showVotes: boolean) {
  const dep = d.deputies[deputyId];
  if (!dep) return null;
  const party = d.parties.find((p) => p.id === dep.partyId);
  const faction = d.factions.find((f) => f.id === dep.factionId);
  const coalitions = party ? d.coalitions.filter((c) => c.partyIds.includes(party.id)) : [];
  const own = lookupIdeology(d.customIdeologies, dep.ideologyId);
  const fac = lookupIdeology(d.customIdeologies, faction?.ideologyId);
  const par = lookupIdeology(d.customIdeologies, party?.ideologyId);
  const eff = own ?? fac ?? par;
  const via = own ? "individual" : fac ? "faction" : par ? "party" : "";
  let vote: string | null = null;
  let reason = "";
  if (showVotes && record) {
    const i = record.snapshot.deputies.findIndex((x) => x.id === deputyId);
    if (i >= 0) {
      vote = VOTE_LABELS[record.votes[i]];
      reason = record.reasons[i];
    }
  }
  return { dep, party, faction, coalitions, ideology: eff, via, vote, reason };
}

export function Chamber() {
  const data = useStore((s) => s.data);
  const ui = useStore((s) => s.ui);
  const patch = useStore((s) => s.patchUI);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);
  const [reveal, setReveal] = useState<RevealState | null>(null);

  const settings = data.settings;
  const geo = useMemo(() => computeGeometry(settings), [settings]);
  const vb = useMemo(() => computeViewBox(geo, settings), [geo, settings]);
  const lk = useMemo(() => buildLookup(data), [data]);
  const record = useMemo(() => data.history.find((r) => r.id === ui.activeRecordId) ?? null, [data.history, ui.activeRecordId]);
  const showVotes = ui.showVotes && !!record;

  const styles = useMemo(
    () => computeSeatStyles(data, ui.layer, ui.focus, record, showVotes, reveal, lk),
    [data, ui.layer, ui.focus, record, showVotes, reveal, lk],
  );

  // vote reveal animation
  const lastToken = useRef(ui.animToken);
  useEffect(() => {
    if (ui.animToken === lastToken.current) return;
    lastToken.current = ui.animToken;
    const rec = useStore.getState().data.history.find((r) => r.id === useStore.getState().ui.activeRecordId);
    const prefs = useStore.getState().data.prefs;
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!rec || !prefs.animateVotes || reduced) {
      setReveal(null);
      return;
    }
    const seats = useStore.getState().data.seats;
    const rng = mulberry32(rec.seed ^ 0x9e3779b9);
    const N = seats.length;
    const keyed: { id: string; k: number }[] = [];
    seats.forEach((id, i) => id && keyed.push({ id, k: i + rng() * N * 0.3 }));
    keyed.sort((a, b) => a.k - b.k);
    const rank = new Map(keyed.map((x, i) => [x.id, i]));
    const total = keyed.length;
    const dur = Math.min(4500, 900 + total * 6) / Math.max(0.2, prefs.animationSpeed);
    const step = Math.max(1, Math.ceil(total / 90));
    const start = performance.now();
    let raf = 0;
    let last = -1;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const count = Math.min(total, Math.floor((p * total) / step) * step);
      if (count !== last) {
        last = count;
        setReveal({ rank, count });
      }
      if (p < 1) raf = requestAnimationFrame(tick);
      else setReveal(null);
    };
    setReveal({ rank, count: 0 });
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ui.animToken]);

  const onMove = (e: React.PointerEvent) => {
    const el = (e.target as Element).closest?.("[data-i]");
    const rect = containerRef.current?.getBoundingClientRect();
    if (!el || !rect) return hover && setHover(null);
    const i = Number(el.getAttribute("data-i"));
    setHover({ i, x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const onClick = (e: React.MouseEvent) => {
    const el = (e.target as Element).closest?.("[data-i]");
    if (!el) return patch({ selectedSeat: null });
    const i = Number(el.getAttribute("data-i"));
    patch({ selectedSeat: ui.selectedSeat === i ? null : i });
  };

  const tally = useMemo(() => (showVotes && record ? computeTally(record) : null), [showVotes, record]);
  const hoverInfo = hover ? (data.seats[hover.i] ? describeDeputy(data, data.seats[hover.i]!, record, showVotes) : null) : null;
  const theta = ((({ up: 0, right: 90, down: 180, left: 270 }[settings.orientation] ?? 0) + settings.rotation) * Math.PI) / 180;
  const labelR = Math.max(0, settings.innerRadius * 0.45);
  const lx = labelR * Math.sin(theta) * 1;
  const ly = -labelR * Math.cos(theta);
  const fs = Math.min(36, Math.max(8, settings.innerRadius * 0.4));
  const selected = ui.selectedSeat;

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="panel p-3">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="label !mb-0">Layer</span>
            <Seg<Layer>
              value={ui.layer}
              onChange={(layer) => patch({ layer, showVotes: false })}
              options={[
                { v: "standard", label: "Standard", title: "Parties with coalition rings" },
                { v: "coalition", label: "Coalition", title: "Coalition colours" },
                { v: "detailed", label: "Detailed", title: "Factions, parties and coalitions" },
              ]}
            />
          </div>
          {record && (
            <button className={`btn btn-sm ${showVotes ? "btn-primary" : ""}`} onClick={() => patch({ showVotes: !ui.showVotes })} title="Toggle the vote result overlay">
              🗳 Vote overlay {showVotes ? "on" : "off"}
            </button>
          )}
          {ui.focus && (
            <button className="chip" onClick={() => patch({ focus: null })}>
              Focus active · clear ✕
            </button>
          )}
          <div className="ml-auto flex items-center gap-2 text-xs muted">
            <span>{settings.totalSeats} seats · {geo.rows} rows</span>
            {data.seatingLocked && <span className="chip" title="Manual seating is locked. Use Auto-arrange in the Parliament tab to restore party blocks.">🔒 manual seating</span>}
          </div>
        </div>
        {geo.warnings.map((w) => (
          <div key={w} className="mb-2 rounded-md px-3 py-1.5 text-xs" style={{ background: "color-mix(in srgb, var(--warn) 15%, transparent)", color: "var(--warn)" }}>
            ⚠ {w}
          </div>
        ))}
        <div ref={containerRef} className="relative mx-auto w-full overflow-hidden rounded-xl" style={{ background: "var(--chamber)", aspectRatio: `${Math.max(100, settings.width)} / ${Math.max(100, settings.height)}`, maxHeight: "68vh" }}>
          <svg
            viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
            preserveAspectRatio="xMidYMid meet"
            className={`seat-layer h-full w-full ${data.prefs.animateChanges ? "" : "no-anim"}`}
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
            onClick={onClick}
            role="img"
            aria-label="Parliament seating chart"
          >
            {settings.innerRadius >= 24 && (
              <g pointerEvents="none" style={{ fontFamily: "inherit" }}>
                {tally ? (
                  <>
                    <text x={lx} y={ly - fs * 0.15} textAnchor="middle" fontSize={fs * 0.9} fontWeight={800} fill={tally.threshold.passed ? data.prefs.voteColors.for : data.prefs.voteColors.against}>
                      {tally.threshold.passed ? "PASSED" : "FAILED"}
                    </text>
                    <text x={lx} y={ly + fs * 0.85} textAnchor="middle" fontSize={fs * 0.6} fill="var(--muted)">
                      {tally.totals.for} – {tally.totals.against}
                    </text>
                  </>
                ) : (
                  <>
                    <text x={lx} y={ly} textAnchor="middle" fontSize={fs} fontWeight={800} fill="var(--text)">
                      {settings.totalSeats}
                    </text>
                    <text x={lx} y={ly + fs * 0.7} textAnchor="middle" fontSize={fs * 0.42} fill="var(--muted)">
                      SEATS
                    </text>
                  </>
                )}
              </g>
            )}
            {styles.map((st, i) => {
              const p = geo.seats[i];
              if (!p) return null;
              return (
                <Seat
                  key={i}
                  i={i}
                  x={p.x}
                  y={p.y}
                  r={geo.r}
                  fill={st.fill}
                  fr={st.fr}
                  mid={st.mid}
                  ring={st.ring}
                  dot={st.dot}
                  opacity={st.opacity}
                  ringW={data.prefs.ringWidth}
                  selected={selected === i || hover?.i === i}
                  label={data.prefs.showSeatNumbers ? String(i + 1) : ""}
                />
              );
            })}
          </svg>
          {hover && (
            <div className="pointer-events-none absolute z-10 max-w-[260px] rounded-lg border px-3 py-2 text-xs shadow-lg anim-pop" style={{ left: Math.min(hover.x + 14, (containerRef.current?.clientWidth ?? 600) - 270), top: hover.y + 14, background: "var(--panel)", borderColor: "var(--border)" }}>
              <div className="font-bold">
                Seat {hover.i + 1}
                {hoverInfo ? ` · ${hoverInfo.dep.name}` : " · vacant"}
              </div>
              {hoverInfo && (
                <div className="mt-1 space-y-0.5">
                  <div>
                    {hoverInfo.party ? (
                      <>
                        <Swatch color={hoverInfo.party.color} /> {hoverInfo.party.name}
                      </>
                    ) : (
                      <>
                        <Swatch color={hoverInfo.dep.color ?? "#94a3b8"} /> Independent
                      </>
                    )}
                  </div>
                  {hoverInfo.party?.leader && <div className="muted">Leader: {hoverInfo.party.leader}</div>}
                  {hoverInfo.faction && <div>Faction: {hoverInfo.faction.name}</div>}
                  {hoverInfo.coalitions.length > 0 && <div>Coalition: {hoverInfo.coalitions.map((c) => c.name).join(", ")}</div>}
                  {hoverInfo.ideology && <div>Ideology: {hoverInfo.ideology.name}{hoverInfo.via ? ` (${hoverInfo.via})` : ""}</div>}
                  {hoverInfo.vote && <div className="font-bold">Vote: {hoverInfo.vote}</div>}
                </div>
              )}
            </div>
          )}
        </div>
        <Legend layer={ui.layer} showVotes={showVotes} />
      </div>
      {selected !== null && selected < settings.totalSeats && <SeatInspector seat={selected} record={record} showVotes={showVotes} />}
    </div>
  );
}

function Legend({ layer, showVotes }: { layer: Layer; showVotes: boolean }) {
  const data = useStore((s) => s.data);
  const focus = useStore((s) => s.ui.focus);
  const patch = useStore((s) => s.patchUI);
  const lg = data.prefs.legend;
  const counts = useMemo(() => {
    const party = new Map<string, number>();
    const fac = new Map<string, number>();
    let ind = 0;
    for (const dep of Object.values(data.deputies)) {
      if (dep.partyId) party.set(dep.partyId, (party.get(dep.partyId) ?? 0) + 1);
      else ind++;
      if (dep.factionId) fac.set(dep.factionId, (fac.get(dep.factionId) ?? 0) + 1);
    }
    return { party, fac, ind, total: Object.keys(data.deputies).length };
  }, [data.deputies]);
  const vc = data.prefs.voteColors;
  const toggle = (type: "party" | "faction" | "coalition" | "independents", id: string) => patch({ focus: focus?.type === type && focus.id === id ? null : { type, id } });
  const active = (type: string, id: string) => focus?.type === type && focus.id === id;
  const Item = ({ children, on, onClick, title }: { children: React.ReactNode; on?: boolean; onClick?: () => void; title?: string }) => (
    <button className="flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs transition-colors hover:bg-[var(--panel2)]" style={on ? { background: "var(--accent-soft)", outline: "1px solid var(--accent)" } : undefined} onClick={onClick} title={title ?? "Click to focus"}>
      {children}
    </button>
  );
  const coalitionOf = (pid: string) => data.coalitions.find((c) => c.partyIds.includes(pid));

  return (
    <div className="mt-3 space-y-1.5 border-t pt-2" style={{ borderColor: "var(--border)" }}>
      {showVotes && lg.voteColors && (
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <b>Votes:</b>
          {(["for", "against", "abstain", "absent"] as const).map((k) => (
            <span key={k} className="flex items-center gap-1.5">
              <Swatch color={vc[k]} /> {VOTE_LABELS[k]}
            </span>
          ))}
          <span className="muted">· seat outline = party colour</span>
        </div>
      )}
      {lg.visual && !showVotes && (
        <div className="muted text-[11px]">
          {layer === "standard" && "Fill = party · outer ring = coalition (same colour for all member parties)."}
          {layer === "coalition" && "Fill = coalition colour (small dot = party) · parties outside coalitions keep their own colour."}
          {layer === "detailed" && "Fill = faction · inner ring = party · outer ring = coalition."}
        </div>
      )}
      {lg.parties && (
        <div className="flex flex-wrap gap-x-1 gap-y-0.5">
          {data.parties.map((p) => {
            const co = coalitionOf(p.id);
            return (
              <div key={p.id} className="flex flex-col">
                <Item on={active("party", p.id)} onClick={() => toggle("party", p.id)}>
                  <span className="swatch" style={{ background: p.color, outline: co && layer !== "coalition" ? `2px solid ${co.color}` : undefined, outlineOffset: 1 }} />
                  <b>{p.abbr}</b>
                  <span className="muted">{counts.party.get(p.id) ?? 0}</span>
                </Item>
                {lg.factions && layer === "detailed" &&
                  data.factions
                    .filter((f) => f.partyId === p.id)
                    .map((f) => (
                      <Item key={f.id} on={active("faction", f.id)} onClick={() => toggle("faction", f.id)}>
                        <span className="ml-3 swatch" style={{ background: f.color, outline: `2px solid ${p.color}`, outlineOffset: -1 }} />
                        <span>{f.abbr || f.name}</span>
                        <span className="muted">{counts.fac.get(f.id) ?? 0}</span>
                      </Item>
                    ))}
              </div>
            );
          })}
          {lg.independents && counts.ind > 0 && (
            <Item on={active("independents", "x")} onClick={() => toggle("independents", "x")}>
              <span className="swatch" style={{ background: "#94a3b8" }} />
              <b>IND</b>
              <span className="muted">{counts.ind}</span>
            </Item>
          )}
          {lg.vacant && counts.total < data.settings.totalSeats && (
            <span className="flex items-center gap-1.5 px-1.5 text-xs">
              <span className="swatch" style={{ background: data.prefs.unallocatedColor }} /> vacant <span className="muted">{data.settings.totalSeats - counts.total}</span>
            </span>
          )}
        </div>
      )}
      {lg.coalitions && data.coalitions.length > 0 && (
        <div className="flex flex-wrap gap-x-1">
          {data.coalitions.map((c) => {
            const seats = data.parties.filter((p) => c.partyIds.includes(p.id)).reduce((a, p) => a + (counts.party.get(p.id) ?? 0), 0);
            return (
              <Item key={c.id} on={active("coalition", c.id)} onClick={() => toggle("coalition", c.id)}>
                <span className="inline-block h-3.5 w-3.5 rounded-full" style={{ border: `3px solid ${c.color}` }} />
                <b>{c.abbr}</b> <span className="muted">{c.name} · {seats}</span>
              </Item>
            );
          })}
        </div>
      )}
      {(["party"] as const).length > 0 && data.parties.length === 0 && Object.keys(data.deputies).length === 0 && (
        <div className="muted text-xs">No deputies yet — create parties in the Parties tab.</div>
      )}
    </div>
  );
}

export { CATEGORY_MAP };
