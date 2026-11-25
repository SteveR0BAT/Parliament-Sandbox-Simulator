"use client";
import { useMemo, useState } from "react";
import { CATEGORIES, CATEGORY_MAP } from "@/data/ideologies";
import { useStore } from "@/lib/store";
import type { CategoryId, Ideology } from "@/lib/types";
import { allIdeologies, CategoryBadge, searchIdeologies } from "./IdeologyPicker";
import { Empty, Field, Swatch } from "./ui";
import { uid } from "@/lib/parliament";

const blank = (): Ideology => ({ id: "custom-" + uid("i"), name: "", category: "unclassified", aliases: [], description: "", economic: "", social: "", related: [], sources: [], extra: "", custom: true });

export function IdeologiesPage() {
  const custom = useStore((s) => s.data.customIdeologies);
  const prefs = useStore((s) => s.data.prefs.ideology);
  const data = useStore((s) => s.data);
  const save = useStore((s) => s.saveCustomIdeology);
  const del = useStore((s) => s.deleteCustomIdeology);
  const toast = useStore((s) => s.toast);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const [sel, setSel] = useState<string>("social-democracy");
  const [editing, setEditing] = useState<Ideology | null>(null);

  const all = useMemo(() => allIdeologies(custom), [custom]);
  const results = useMemo(() => searchIdeologies(all, q, cat).filter((i) => !prefs.hiddenCategories.includes(i.category)), [all, q, cat, prefs.hiddenCategories]);
  const cur = all.find((i) => i.id === sel);
  const usage = (id: string) => data.parties.filter((p) => p.ideologyId === id).length + data.factions.filter((f) => f.ideologyId === id).length + Object.values(data.deputies).filter((x) => x.ideologyId === id).length;
  const builtinCount = all.length - custom.length;

  const submit = () => {
    if (!editing) return;
    if (!editing.name.trim()) return toast("An ideology needs a name.", "error");
    if (all.some((i) => i.id !== editing.id && i.name.toLowerCase() === editing.name.trim().toLowerCase())) return toast("An ideology with this name already exists.", "error");
    save({ ...editing, name: editing.name.trim(), custom: true });
    setSel(editing.id);
    setEditing(null);
    toast("Custom ideology saved.", "ok");
  };

  const relatedLink = (name: string) => {
    const f = all.find((i) => i.name.toLowerCase() === name.toLowerCase());
    return f ? (
      <button key={name} className="chip hover:brightness-110" onClick={() => setSel(f.id)}>
        {name}
      </button>
    ) : (
      <span key={name} className="chip muted" style={{ background: "var(--panel2)" }}>
        {name}
      </span>
    );
  };

  return (
    <div className="mx-auto grid h-full max-w-[1500px] gap-4 p-4 lg:grid-cols-[minmax(320px,440px)_1fr]">
      <div className="panel flex min-h-0 flex-col">
        <div className="space-y-2 border-b p-3" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">Ideology database</h2>
            <span className="muted text-xs">{builtinCount} researched · {custom.length} custom</span>
          </div>
          <input className="input" placeholder="Search names, aliases, keywords…" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="flex flex-wrap gap-1.5">
            <button className="chip" style={{ opacity: cat === "all" ? 1 : 0.5 }} onClick={() => setCat("all")}>
              All
            </button>
            {CATEGORIES.filter((c) => !prefs.hiddenCategories.includes(c.id)).map((c) => (
              <button key={c.id} className="chip" style={{ background: c.color + "22", color: c.color, opacity: cat === c.id ? 1 : 0.5 }} onClick={() => setCat(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setEditing(blank())}>
            + Create custom ideology
          </button>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3" style={{ maxHeight: "calc(100vh - 260px)" }}>
          {CATEGORIES.map((c) => {
            const items = results.filter((i) => i.category === c.id);
            if (!items.length) return null;
            return (
              <div key={c.id}>
                <div className="sticky top-0 z-[1] mb-1 flex items-center gap-2 py-1 text-xs font-extrabold uppercase tracking-wide" style={{ color: c.color, background: "var(--panel)" }}>
                  <Swatch color={c.color} /> {c.label} <span className="muted font-normal normal-case">({items.length})</span>
                </div>
                <div className="space-y-1">
                  {items.map((i) => (
                    <button key={i.id} className="w-full rounded-lg border px-2.5 py-1.5 text-left text-[13px] transition-colors hover:border-[var(--accent)]" style={{ borderColor: sel === i.id ? "var(--accent)" : "var(--border)", background: sel === i.id ? "var(--accent-soft)" : "transparent" }} onClick={() => setSel(i.id)}>
                      <span className="font-semibold">{i.name}</span>
                      {i.custom && <span className="chip ml-2">custom</span>}
                      {i.disputed && prefs.showDisputed && <span className="chip ml-2" style={{ background: "color-mix(in srgb, var(--warn) 18%, transparent)", color: "var(--warn)" }}>disputed</span>}
                      {i.aliases.length > 0 && <span className="muted ml-2 text-[11px]">{i.aliases[0]}</span>}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          {results.length === 0 && <Empty>No ideologies match “{q}”.</Empty>}
        </div>
      </div>

      <div className="min-w-0 space-y-4">
        {editing ? (
          <div className="panel anim-in space-y-3 p-5">
            <h2 className="text-base font-bold">{custom.some((c) => c.id === editing.id) ? "Edit custom ideology" : "Create custom ideology"}</h2>
            <Field label="Name">
              <input className="input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea className="textarea" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </Field>
            <Field label="Political group" hint="You are not forced into a left–right category: choose Third Way or Custom / Unclassified.">
              <select className="select" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as CategoryId })}>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Economic orientation">
                <input className="input" value={editing.economic} onChange={(e) => setEditing({ ...editing, economic: e.target.value })} placeholder="e.g. Mixed economy, high welfare" />
              </Field>
              <Field label="Social orientation">
                <input className="input" value={editing.social} onChange={(e) => setEditing({ ...editing, social: e.target.value })} placeholder="e.g. Socially liberal" />
              </Field>
            </div>
            <Field label="Additional characteristics (optional)">
              <textarea className="textarea" value={editing.extra ?? ""} onChange={(e) => setEditing({ ...editing, extra: e.target.value })} />
            </Field>
            <Field label="Alternative names (comma-separated)">
              <input className="input" value={editing.aliases.join(", ")} onChange={(e) => setEditing({ ...editing, aliases: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} />
            </Field>
            <Field label="Related ideologies (comma-separated names)">
              <input className="input" value={editing.related.join(", ")} onChange={(e) => setEditing({ ...editing, related: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} placeholder="Social Democracy, Environmentalism" />
            </Field>
            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={submit}>
                Save ideology
              </button>
              <button className="btn" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </div>
        ) : cur ? (
          <div className="panel anim-in space-y-4 p-5" key={cur.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold">{cur.name}</h2>
                {cur.aliases.length > 0 && <div className="muted text-xs">Also: {cur.aliases.join(" · ")}</div>}
              </div>
              <div className="flex items-center gap-2">
                <CategoryBadge id={cur.category} />
                {cur.custom && (
                  <>
                    <button className="btn btn-sm" onClick={() => setEditing({ ...cur })}>
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        if (window.confirm(`Delete ${cur.name}? It is used by ${usage(cur.id)} party/faction/deputy entries, which will become unassigned.`)) {
                          del(cur.id);
                          setSel("social-democracy");
                        }
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
            <p className="text-[14px] leading-relaxed">{cur.description || <span className="muted">No description.</span>}</p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="card p-3">
                <div className="label">Political classification</div>
                <div className="text-sm font-semibold" style={{ color: CATEGORY_MAP[cur.category].color }}>
                  {CATEGORY_MAP[cur.category].label}
                </div>
                <div className="muted text-xs">{CATEGORY_MAP[cur.category].blurb}</div>
              </div>
              <div className="card p-3">
                <div className="label">Used in this parliament</div>
                <div className="text-sm font-semibold">{usage(cur.id)} assignment(s)</div>
              </div>
              <div className="card p-3">
                <div className="label">Economic characteristics</div>
                <div className="text-sm">{cur.economic || "—"}</div>
              </div>
              <div className="card p-3">
                <div className="label">Social characteristics</div>
                <div className="text-sm">{cur.social || "—"}</div>
              </div>
            </div>
            {cur.extra && (
              <div className="card p-3">
                <div className="label">Additional characteristics</div>
                <div className="text-sm">{cur.extra}</div>
              </div>
            )}
            {cur.history && (
              <div className="card p-3">
                <div className="label">Historical context</div>
                <div className="text-sm">{cur.history}</div>
              </div>
            )}
            {cur.related.length > 0 && (
              <div>
                <div className="label">Related ideologies</div>
                <div className="flex flex-wrap gap-1.5">{cur.related.map(relatedLink)}</div>
              </div>
            )}
            {cur.note && prefs.showDisputed && (
              <div className="rounded-lg p-3 text-[13px]" style={{ background: "color-mix(in srgb, var(--warn) 12%, transparent)" }}>
                <b>Classification note: </b>
                {cur.note} <span className="muted">Placement on a single left–right spectrum is approximate.</span>
              </div>
            )}
            {prefs.showSources && cur.sources.length > 0 && (
              <div>
                <div className="label">Sources &amp; references</div>
                <ul className="list-disc space-y-0.5 pl-5 text-xs">
                  {cur.sources.map((s) => (
                    <li key={s.url}>
                      <a className="underline" style={{ color: "var(--accent)" }} href={s.url} target="_blank" rel="noreferrer">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <Empty>Select an ideology to see details.</Empty>
        )}
        <div className="muted px-1 text-[11px]">
          The researched database was compiled from Wikipedia (spectrum and category articles), Britannica, and OpenStax/LibreTexts, then checked for distinctness: synonyms are listed as alternative names rather than separate entries. Classifications are approximations, not universal definitions.
        </div>
      </div>
    </div>
  );
}
