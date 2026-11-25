// Colour utilities: HEX / RGB / HSL conversion and shade suggestions.

export interface RGB {
  r: number;
  g: number;
  b: number;
}
export interface HSL {
  h: number;
  s: number;
  l: number;
}

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

export function isHex(v: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v.trim());
}

export function normalizeHex(v: string, fallback = "#888888"): string {
  let s = v.trim();
  if (!s.startsWith("#")) s = "#" + s;
  if (/^#[0-9a-fA-F]{3}$/.test(s)) {
    s = "#" + s[1] + s[1] + s[2] + s[2] + s[3] + s[3];
  }
  return /^#[0-9a-fA-F]{6}$/.test(s) ? s.toLowerCase() : fallback;
}

export function hexToRgb(hex: string): RGB {
  const h = normalizeHex(hex);
  return {
    r: parseInt(h.slice(1, 3), 16),
    g: parseInt(h.slice(3, 5), 16),
    b: parseInt(h.slice(5, 7), 16),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const p = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return "#" + p(r) + p(g) + p(b);
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rr = r / 255,
    gg = g / 255,
    bb = b / 255;
  const max = Math.max(rr, gg, bb),
    min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  let h = 0,
    s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rr) h = (gg - bb) / d + (gg < bb ? 6 : 0);
    else if (max === gg) h = (bb - rr) / d + 2;
    else h = (rr - gg) / d + 4;
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const hh = (((h % 360) + 360) % 360) / 360;
  const ss = clamp(s, 0, 100) / 100;
  const ll = clamp(l, 0, 100) / 100;
  if (ss === 0) {
    const v = ll * 255;
    return { r: v, g: v, b: v };
  }
  const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
  const p = 2 * ll - q;
  const f = (t: number) => {
    let x = t;
    if (x < 0) x += 1;
    if (x > 1) x -= 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  return { r: f(hh + 1 / 3) * 255, g: f(hh) * 255, b: f(hh - 1 / 3) * 255 };
}

export const hexToHsl = (hex: string): HSL => rgbToHsl(hexToRgb(hex));
export const hslToHex = (hsl: HSL): string => rgbToHex(hslToRgb(hsl));

/** Parse "#abc", "rgb(1,2,3)" or "hsl(120, 50%, 40%)" into hex. Returns null if invalid. */
export function parseColor(input: string): string | null {
  const s = input.trim();
  if (isHex(s) || /^[0-9a-fA-F]{6}$/.test(s) || /^[0-9a-fA-F]{3}$/.test(s)) return normalizeHex(s);
  const rgb = s.match(/^rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})/i);
  if (rgb) return rgbToHex({ r: +rgb[1], g: +rgb[2], b: +rgb[3] });
  const hsl = s.match(/^hsla?\(\s*(-?\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)%?[\s,]+(\d+(?:\.\d+)?)%?/i);
  if (hsl) return hslToHex({ h: +hsl[1], s: +hsl[2], l: +hsl[3] });
  return null;
}

/** Relative luminance-based readable text colour */
export function contrastText(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const y = (r * 299 + g * 587 + b * 114) / 1000;
  return y > 150 ? "#111827" : "#ffffff";
}

export function lighten(hex: string, amount: number): string {
  const c = hexToHsl(hex);
  return hslToHex({ ...c, l: clamp(c.l + amount, 4, 96) });
}

/** Suggest related shades for factions of a party colour. */
export function suggestShades(hex: string, count = 6): string[] {
  const c = hexToHsl(hex);
  const out: string[] = [];
  const steps: HSL[] = [
    { h: c.h, s: c.s, l: clamp(c.l + 22, 8, 92) }, // lighter
    { h: c.h, s: c.s, l: clamp(c.l - 18, 6, 90) }, // darker
    { h: c.h + 14, s: clamp(c.s - 8, 0, 100), l: clamp(c.l + 10, 8, 92) }, // minty/warmer
    { h: c.h - 14, s: clamp(c.s + 4, 0, 100), l: clamp(c.l - 8, 8, 92) },
    { h: c.h, s: clamp(c.s - 30, 0, 100), l: clamp(c.l + 4, 8, 92) }, // muted
    { h: c.h + 28, s: c.s, l: c.l },
    { h: c.h - 28, s: c.s, l: c.l },
    { h: c.h, s: c.s, l: clamp(c.l + 34, 8, 94) },
  ];
  for (const s of steps) out.push(hslToHex(s));
  return out.slice(0, count);
}

export const PALETTE = [
  "#228b22", "#2f80ed", "#d7263d", "#f5b700", "#7c3aed", "#14b8a6", "#f97316", "#ec4899",
  "#0ea5e9", "#84cc16", "#a16207", "#64748b", "#1e3a8a", "#be123c", "#065f46", "#9333ea",
];
