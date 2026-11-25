"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useStore } from "@/lib/store";

export function Section({ title, children, defaultOpen = true, right }: { title: string; children: ReactNode; defaultOpen?: boolean; right?: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between px-4 py-2.5">
        <button className="flex items-center gap-2 text-left text-[13px] font-bold" onClick={() => setOpen(!open)} aria-expanded={open}>
          <span className="inline-block transition-transform" style={{ transform: open ? "rotate(90deg)" : "none" }}>▸</span>
          {title}
        </button>
        {right}
      </div>
      {open && <div className="anim-in space-y-3 px-4 pb-4">{children}</div>}
    </div>
  );
}

export function Field({ label, hint, children, onReset, className = "" }: { label: string; hint?: string; children: ReactNode; onReset?: () => void; className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <span className="label">{label}</span>
        {onReset && (
          <button className="mb-1 text-[11px] muted hover:underline" onClick={onReset} title="Reset to default">
            ↺ reset
          </button>
        )}
      </div>
      {children}
      {hint && <p className="muted mt-1 text-[11px] leading-snug">{hint}</p>}
    </div>
  );
}

/** Number input that allows free typing, validates on commit and clamps. */
export function NumInput({ value, onCommit, min = -Infinity, max = Infinity, step = 1, int = false, className = "", disabled }: { value: number; onCommit: (n: number) => void; min?: number; max?: number; step?: number; int?: boolean; className?: string; disabled?: boolean }) {
  const [text, setText] = useState(String(value));
  const [focused, setFocused] = useState(false);
  const [bad, setBad] = useState(false);
  useEffect(() => {
    if (!focused) setText(String(value));
  }, [value, focused]);
  const commit = () => {
    const n = Number(text);
    if (text.trim() === "" || !Number.isFinite(n) || (int && !Number.isInteger(n))) {
      setBad(true);
      setText(String(value));
      setTimeout(() => setBad(false), 900);
      return;
    }
    const c = Math.min(max, Math.max(min, n));
    if (c !== n) setText(String(c));
    if (c !== value) onCommit(c);
  };
  return (
    <input
      className={`input ${bad ? "invalid" : ""} ${className}`}
      type="number"
      inputMode="decimal"
      value={text}
      step={step}
      min={min === -Infinity ? undefined : min}
      max={max === Infinity ? undefined : max}
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        commit();
      }}
      onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
      onChange={(e) => setText(e.target.value)}
    />
  );
}

export function SliderField({ label, value, min, max, step = 1, unit = "", onChange, onReset, hint }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (n: number) => void; onReset?: () => void; hint?: string }) {
  return (
    <Field label={label} onReset={onReset} hint={hint}>
      <div className="flex items-center gap-2">
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={label} />
        <div className="w-24 shrink-0">
          <NumInput value={value} min={min} max={max} step={step} onCommit={onChange} />
        </div>
        {unit && <span className="muted text-xs">{unit}</span>}
      </div>
    </Field>
  );
}

export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 text-[13px]">
      <input type="checkbox" className="mt-0.5 h-4 w-4" style={{ accentColor: "var(--accent)" }} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        <span className="font-medium">{label}</span>
        {hint && <span className="muted block text-[11px]">{hint}</span>}
      </span>
    </label>
  );
}

export function Seg<T extends string>({ value, options, onChange }: { value: T; options: { v: T; label: string; title?: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="seg" role="group">
      {options.map((o) => (
        <button key={o.v} aria-pressed={value === o.v} title={o.title} onClick={() => onChange(o.v)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(2,6,23,0.55)" }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`panel anim-pop flex max-h-[90vh] w-full flex-col ${wide ? "max-w-4xl" : "max-w-xl"}`} role="dialog" aria-label={title}>
        <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-base font-bold">{title}</h2>
          <button className="btn btn-sm btn-icon" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

export function Swatch({ color, size = 14 }: { color: string; size?: number }) {
  return <span className="swatch" style={{ background: color, width: size, height: size }} />;
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="card muted p-4 text-center text-[13px]">{children}</div>;
}

export function Toasts() {
  const toast = useStore((s) => s.ui.toast);
  const patch = useStore((s) => s.patchUI);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    if (!toast) return;
    if (ref.current) window.clearTimeout(ref.current);
    ref.current = window.setTimeout(() => patch({ toast: null }), toast.kind === "error" ? 6000 : 3000);
    return () => {
      if (ref.current) window.clearTimeout(ref.current);
    };
  }, [toast, patch]);
  if (!toast) return null;
  const color = toast.kind === "error" ? "var(--bad)" : toast.kind === "ok" ? "var(--good)" : "var(--accent)";
  return (
    <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2" role="status" aria-live="polite">
      <div key={toast.id} className="panel anim-pop flex max-w-xl items-start gap-3 px-4 py-3 text-[13px]" style={{ borderLeft: `4px solid ${color}` }}>
        <span className="flex-1">{toast.msg}</span>
        <button className="muted" onClick={() => patch({ toast: null })} aria-label="Dismiss">
          ✕
        </button>
      </div>
    </div>
  );
}

export function StatBox({ label, value, sub, color }: { label: string; value: ReactNode; sub?: ReactNode; color?: string }) {
  return (
    <div className="card px-3 py-2">
      <div className="label !mb-0">{label}</div>
      <div className="text-xl font-extrabold leading-tight" style={color ? { color } : undefined}>
        {value}
      </div>
      {sub && <div className="muted text-[11px]">{sub}</div>}
    </div>
  );
}

export function Bar({ parts, height = 10 }: { parts: { v: number; color: string; title?: string }[]; height?: number }) {
  const total = parts.reduce((a, b) => a + b.v, 0) || 1;
  return (
    <div className="flex w-full overflow-hidden rounded-full" style={{ height, background: "var(--border)" }}>
      {parts.map((p, i) => (
        <div key={i} title={p.title} style={{ width: `${(p.v / total) * 100}%`, background: p.color, transition: "width .4s ease" }} />
      ))}
    </div>
  );
}
