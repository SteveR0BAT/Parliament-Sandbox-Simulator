"use client";
import { useEffect, useState } from "react";
import { PALETTE, hexToHsl, hexToRgb, hslToHex, normalizeHex, parseColor, rgbToHex } from "@/lib/color";
import { NumInput } from "./ui";

/** Colour picker with visual picker, HEX, RGB, HSL and free-form text input. */
export function ColorPicker({ value, onChange, suggestions, compact }: { value: string; onChange: (hex: string) => void; suggestions?: string[]; compact?: boolean }) {
  const hex = normalizeHex(value);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(hex);
  const [free, setFree] = useState("");
  useEffect(() => setText(hex), [hex]);
  const rgb = hexToRgb(hex);
  const hsl = hexToHsl(hex);

  const commitText = (t: string) => {
    const c = parseColor(t);
    if (c) onChange(c);
    else setText(hex);
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <input type="color" value={hex} onChange={(e) => onChange(e.target.value)} className="h-8 w-9 cursor-pointer rounded-md border p-0.5" style={{ borderColor: "var(--border)", background: "var(--panel)" }} aria-label="Visual colour picker" />
        <input className="input !w-24 font-mono" value={text} maxLength={7} onChange={(e) => setText(e.target.value)} onBlur={() => commitText(text)} onKeyDown={(e) => e.key === "Enter" && commitText(text)} aria-label="HEX colour" />
        <button type="button" className="btn btn-sm" onClick={() => setOpen(!open)} aria-expanded={open}>
          RGB / HSL
        </button>
      </div>
      {open && (
        <div className="card anim-in mt-2 space-y-2 p-2.5">
          <div className="grid grid-cols-3 gap-2">
            {(["r", "g", "b"] as const).map((k) => (
              <div key={k}>
                <span className="label !mb-0.5">{k.toUpperCase()}</span>
                <NumInput value={rgb[k]} min={0} max={255} int onCommit={(n) => onChange(rgbToHex({ ...rgb, [k]: n }))} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="label !mb-0.5">H°</span>
              <NumInput value={hsl.h} min={0} max={360} int onCommit={(n) => onChange(hslToHex({ ...hsl, h: n }))} />
            </div>
            <div>
              <span className="label !mb-0.5">S %</span>
              <NumInput value={hsl.s} min={0} max={100} int onCommit={(n) => onChange(hslToHex({ ...hsl, s: n }))} />
            </div>
            <div>
              <span className="label !mb-0.5">L %</span>
              <NumInput value={hsl.l} min={0} max={100} int onCommit={(n) => onChange(hslToHex({ ...hsl, l: n }))} />
            </div>
          </div>
          <div>
            <span className="label !mb-0.5">Type any format</span>
            <input
              className="input font-mono"
              placeholder="rgb(34,139,34) · hsl(120 61% 34%) · #228b22"
              value={free}
              onChange={(e) => setFree(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const c = parseColor(free);
                  if (c) {
                    onChange(c);
                    setFree("");
                  }
                }
              }}
              onBlur={() => {
                const c = parseColor(free);
                if (c) {
                  onChange(c);
                  setFree("");
                }
              }}
            />
          </div>
        </div>
      )}
      {suggestions && suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="muted text-[11px]">Suggested:</span>
          {suggestions.map((c, i) => (
            <button key={c + i} type="button" className="swatch !h-5 !w-5 transition-transform hover:scale-125" style={{ background: c }} title={c} onClick={() => onChange(c)} aria-label={`Use ${c}`} />
          ))}
        </div>
      )}
      {!compact && (
        <div className="mt-2 flex flex-wrap gap-1">
          {PALETTE.map((c) => (
            <button key={c} type="button" className="swatch !h-4 !w-4 transition-transform hover:scale-125" style={{ background: c }} onClick={() => onChange(c)} title={c} aria-label={`Use ${c}`} />
          ))}
        </div>
      )}
    </div>
  );
}
