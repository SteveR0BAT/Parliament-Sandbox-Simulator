"use client";
import { useMemo, useState } from "react";
import { BUILTIN_IDEOLOGIES, CATEGORIES, CATEGORY_MAP } from "@/data/ideologies";
import type { CategoryId, Ideology } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Modal, Swatch } from "./ui";

export function allIdeologies(custom: Ideology[]): Ideology[] {
  return [...BUILTIN_IDEOLOGIES, ...custom.map((c) => ({ ...c, custom: true }))];
}

export function searchIdeologies(list: Ideology[], q: string, cat: CategoryId | "all"): Ideology[] {
  const query = q.trim().toLowerCase();
  const words = query.split(/\s+/).filter(Boolean);
  return list.filter((i) => {
    if (cat !== "all" && i.category !== cat) return false;
    if (!words.length) return true;
    const hay = [i.name, ...i.aliases, i.description, i.economic, i.social, ...i.related, i.extra ?? ""].join(" ").toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

export function CategoryBadge({ id }: { id: CategoryId }) {
  const c = CATEGORY_MAP[id];
  return (
    <span className="chip" style={{ background: c.color + "22", color: c.color }}>
      {c.label}
    </span>
  );
}

/** Compact ideology selector button that opens a searchable modal grouped by category. */
export function IdeologySelect({ value, onChange, placeholder = "No ideology", allowClear = true }: { value: string | null; onChange: (id: string | null) => void; placeholder?: string; allowClear?: boolean }) {
  const custom = useStore((s) => s.data.customIdeologies);
  const [open, setOpen] = useState(false);
  const all = useMemo(() => allIdeologies(custom), [custom]);
  const cur = all.find((i) => i.id === value);
  return (
    <>
      <div className="flex gap-1.5">
        <button type="button" className="select flex flex-1 items-center gap-2 text-left" onClick={() => setOpen(true)}>
          {cur ? (
            <>
              <Swatch color={CATEGORY_MAP[cur.category].color} />
              <span className="truncate">{cur.name}</span>
            </>
          ) : (
            <span className="muted">{placeholder}</span>
          )}
        </button>
        {allowClear && cur && (
          <button type="button" className="btn btn-sm" onClick={() => onChange(null)} title="Clear ideology">
            ✕
          </button>
        )}
      </div>
      {open && (
        <Modal title="Choose an ideology" wide onClose={() => setOpen(false)}>
          <IdeologyBrowser
            selectedId={value}
            onPick={(id) => {
              onChange(id);
              setOpen(false);
            }}
          />
        </Modal>
      )}
    </>
  );
}

function IdeologyBrowser({ selectedId, onPick }: { selectedId: string | null; onPick: (id: string) => void }) {
  const custom = useStore((s) => s.data.customIdeologies);
  const hidden = useStore((s) => s.data.prefs.ideology.hiddenCategories);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const all = useMemo(() => allIdeologies(custom), [custom]);
  const res = useMemo(() => searchIdeologies(all, q, cat).filter((i) => !hidden.includes(i.category)), [all, q, cat, hidden]);
  return (
    <div className="space-y-3">
      <input className="input" autoFocus placeholder="Search by name, alias or keyword (e.g. “liberal”)…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="flex flex-wrap gap-1.5">
        <button className="chip" style={{ opacity: cat === "all" ? 1 : 0.5 }} onClick={() => setCat("all")}>
          All
        </button>
        {CATEGORIES.filter((c) => !hidden.includes(c.id)).map((c) => (
          <button key={c.id} className="chip" style={{ background: c.color + "22", color: c.color, opacity: cat === c.id ? 1 : 0.5 }} onClick={() => setCat(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
        {CATEGORIES.map((c) => {
          const items = res.filter((i) => i.category === c.id);
          if (!items.length) return null;
          return (
            <div key={c.id}>
              <div className="mb-1 flex items-center gap-2 text-xs font-bold" style={{ color: c.color }}>
                <Swatch color={c.color} /> {c.label} <span className="muted font-normal">({items.length})</span>
              </div>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {items.map((i) => (
                  <button key={i.id} className="card p-2 text-left transition-colors hover:border-[var(--accent)]" style={selectedId === i.id ? { borderColor: "var(--accent)", background: "var(--accent-soft)" } : undefined} onClick={() => onPick(i.id)}>
                    <div className="flex items-center gap-1.5 text-[13px] font-semibold">
                      {i.name}
                      {i.custom && <span className="chip">custom</span>}
                    </div>
                    <div className="muted line-clamp-2 text-[11.5px]">{i.description}</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        {res.length === 0 && <div className="muted p-6 text-center text-sm">No ideologies match your search.</div>}
      </div>
    </div>
  );
}
