// Chamber geometry. Pure functions, no React. Guarantees non-overlapping seats:
// the number of rows is automatically increased when the requested layout cannot fit all seats.
import type { ChamberSettings } from "./types";

export interface SeatPos {
  x: number;
  y: number;
  row: number;
  /** normalised position along the arc (0..1) */
  t: number;
}

export interface Geometry {
  seats: SeatPos[]; // already in seat-index order
  r: number; // effective seat radius
  rows: number;
  rowCounts: number[];
  outerRadius: number;
  bounds: { minX: number; minY: number; maxX: number; maxY: number };
  warnings: string[];
}

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

export function computeGeometry(s: ChamberSettings): Geometry {
  const N = Math.max(0, Math.floor(s.totalSeats) || 0);
  const warnings: string[] = [];
  const r = Math.max(1, Number(s.seatRadius) || 10);
  const gap = Math.max(0, Number(s.seatSpacing) || 0);
  const rowGap = Math.max(0, Number(s.rowSpacing) || 0);
  const sweepDeg = clamp(Number(s.arcAngle) || 180, 30, 360);
  const sweep = (sweepDeg * Math.PI) / 180;
  const full = sweepDeg >= 359.5;
  const inner = Math.max(0, Number(s.innerRadius) || 0);
  const seatPitch = 2 * r + gap;
  const rowPitch = 2 * r + rowGap;

  const radius = (i: number) => inner + r + i * rowPitch;
  const capAt = (rad: number) =>
    Math.max(1, full ? Math.floor((2 * Math.PI * rad) / seatPitch) : Math.floor((sweep * rad) / seatPitch) + 1);

  // Determine requested row count
  let wanted = 0;
  if (N > 0) {
    if (s.rowMode === "rows") wanted = Math.max(1, Math.floor(s.rows) || 1);
    else if (s.rowMode === "perRow") wanted = Math.max(1, Math.ceil(N / Math.max(1, Math.floor(s.seatsPerRow) || 1)));
  }

  // Build rows until capacity >= N (and at least `wanted` rows)
  const rads: number[] = [];
  const caps: number[] = [];
  let cum = 0;
  while ((cum < N || rads.length < wanted) && rads.length < 20000) {
    const i = rads.length;
    const rd = radius(i);
    rads.push(rd);
    const c = capAt(rd);
    caps.push(c);
    cum += c;
    if (N === 0) break;
  }
  const R = N === 0 ? 0 : rads.length;
  if (N > 0 && wanted > 0 && R > wanted) {
    warnings.push(`Requested layout could not fit ${N} seats without overlap; rows increased from ${wanted} to ${R}.`);
  }

  // Optionally stretch rows to a fixed outer radius (never compress below non-overlap)
  let outerRadius = R > 0 ? rads[R - 1] + r : inner;
  if (s.outerMode === "fixed" && R > 1) {
    const target = Math.max(0, Number(s.outerRadius) || 0) - r;
    const minOuter = rads[R - 1];
    if (target > minOuter) {
      const pitch = (target - rads[0]) / (R - 1);
      for (let i = 0; i < R; i++) {
        rads[i] = rads[0] + i * pitch;
        caps[i] = capAt(rads[i]);
      }
      outerRadius = target + r;
    } else if (target < minOuter - 0.5) {
      warnings.push("Outer radius is too small for this many rows without overlap; minimum non-overlapping radius used.");
    }
  }

  // Distribute seats across rows proportionally to radius (largest remainder), clamp to capacity
  const counts = new Array<number>(R).fill(0);
  if (R > 0) {
    const sumRad = rads.reduce((a, b) => a + b, 0);
    const ideal = rads.map((rd) => (N * rd) / sumRad);
    let assigned = 0;
    for (let i = 0; i < R; i++) {
      counts[i] = Math.floor(ideal[i]);
      assigned += counts[i];
    }
    const order = ideal.map((v, i) => ({ i, f: v - Math.floor(v) })).sort((a, b) => b.f - a.f);
    for (let k = 0; assigned < N; k = (k + 1) % R) {
      counts[order[k].i]++;
      assigned++;
    }
    let overflow = 0;
    for (let i = 0; i < R; i++) {
      if (counts[i] > caps[i]) {
        overflow += counts[i] - caps[i];
        counts[i] = caps[i];
      }
    }
    for (let i = R - 1; i >= 0 && overflow > 0; i--) {
      const take = Math.min(caps[i] - counts[i], overflow);
      counts[i] += take;
      overflow -= take;
    }
  }

  // Positions
  const base = { up: 0, right: 90, down: 180, left: 270 }[s.orientation] ?? 0;
  const theta = (((base + (Number(s.rotation) || 0)) % 360) * Math.PI) / 180;
  const cos = Math.cos(theta),
    sin = Math.sin(theta);
  const start = Math.PI / 2 + sweep / 2;

  const raw: (SeatPos & { rad: number })[] = [];
  for (let i = 0; i < R; i++) {
    const n = counts[i];
    const rd = rads[i];
    for (let j = 0; j < n; j++) {
      const t = n === 1 ? 0.5 : full ? j / n : j / (n - 1);
      const a = start - t * sweep;
      const x0 = rd * Math.cos(a);
      const y0 = -rd * Math.sin(a);
      raw.push({ x: x0 * cos - y0 * sin, y: x0 * sin + y0 * cos, row: i, t, rad: rd });
    }
  }
  if (s.seatOrder === "rows") raw.sort((a, b) => a.row - b.row || a.t - b.t);
  else raw.sort((a, b) => a.t - b.t || a.rad - b.rad);

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const p of raw) {
    minX = Math.min(minX, p.x - r);
    maxX = Math.max(maxX, p.x + r);
    minY = Math.min(minY, p.y - r);
    maxY = Math.max(maxY, p.y + r);
  }
  if (!isFinite(minX)) {
    minX = -50;
    maxX = 50;
    minY = -50;
    maxY = 50;
  }
  // include centre + padding (rotated) so there is room for the central label
  const cp = Math.max(0, Number(s.centerPadding) || 0);
  const px = -cp * sin,
    py = cp * cos;
  minX = Math.min(minX, px, 0);
  maxX = Math.max(maxX, px, 0);
  minY = Math.min(minY, py, 0);
  maxY = Math.max(maxY, py, 0);

  return {
    seats: raw.map(({ x, y, row, t }) => ({ x, y, row, t })),
    r,
    rows: R,
    rowCounts: counts,
    outerRadius,
    bounds: { minX, minY, maxX, maxY },
    warnings,
  };
}

export function computeViewBox(geo: Geometry, s: ChamberSettings): { x: number; y: number; w: number; h: number } {
  const b = geo.bounds;
  const pad = geo.r * 1.4;
  if (s.autoFit) {
    const w = b.maxX - b.minX + pad * 2;
    const h = b.maxY - b.minY + pad * 2;
    return { x: b.minX - pad, y: b.minY - pad, w, h };
  }
  const cx = (b.minX + b.maxX) / 2;
  const cy = (b.minY + b.maxY) / 2;
  const w = Math.max(100, s.width);
  const h = Math.max(100, s.height);
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}
