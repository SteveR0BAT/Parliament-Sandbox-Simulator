"use client";
import { useMemo, useState } from "react";
import { BUILTIN_IDEOLOGIES, IDEOLOGY_FAMILIES, IDEOLOGY_FAMILY_MAP, formatAxisPosition } from "@/data/ideologies";
import type { IdeologyFamilyId, Ideology } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Modal, Swatch } from "./ui";

export function allIdeologies(custom: Ideology[]): Ideology[] {
  return [...BUILTIN_IDEOLOGIES, ...custom.map((c) => ({ ...c, custom: true }))];
}

export function searchIdeologies(list: Ideology[], q: string, family: IdeologyFamilyId | "all"): Ideology[] {
  const query = q.trim().toLowerCase();
  const words = query.split(/\s+/).filter(Boolean);
  return list.filter((i) => {
    if (family !== "all" && i.family !== family) return false;
    if (!words.length) return true;
    const hay = [i.name, ...i.aliases, i.description, i.economic, i.social, ...i.related, i.extra ?? "", i.family].join(" ").toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

export function FamilyBadge({ id }: { id: IdeologyFamilyId }) {
  const f = IDEOLOGY_FAMILY_MAP[id];
  return <span className="chip" style={{ background: f.color + "22", color: f.color }}>{f.label}</span>;
}

export function IdeologyPositionLine({ ideology }: { ideology: Ideology }) {
  const p = ideology.positions;
  return <div className="muted text-[10.5px]">E: {formatAxisPosition("economic",p.economic)} · S: {formatAxisPosition("social",p.social)} · A: {formatAxisPosition("authority",p.authority)}</div>;
}

/** Compact selector shared by parties, factions, coalitions and deputies. */
export function IdeologySelect({ value, onChange, placeholder = "No ideology", allowClear = true }: { value: string | null; onChange: (id: string | null) => void; placeholder?: string; allowClear?: boolean }) {
  const custom = useStore((s) => s.data.customIdeologies);
  const [open, setOpen] = useState(false);
  const all = useMemo(() => allIdeologies(custom), [custom]);
  const current = all.find((i) => i.id === value);
  return (
    <>
      <div className="flex gap-1.5">
        <button type="button" className="select flex flex-1 flex-col items-start gap-0.5 text-left" onClick={() => setOpen(true)}>
          {current ? <><span className="flex items-center gap-2"><Swatch color={IDEOLOGY_FAMILY_MAP[current.family].color}/><span className="truncate font-semibold">{current.name}</span></span><IdeologyPositionLine ideology={current}/></> : <span className="muted">{placeholder}</span>}
        </button>
        {allowClear && current && <button type="button" className="btn btn-sm" onClick={() => onChange(null)} title="Clear ideology">✕</button>}
      </div>
      {open && <Modal title="Choose an ideology" wide onClose={() => setOpen(false)}>
        <IdeologyBrowser selectedId={value} onPick={(id) => { onChange(id); setOpen(false); }}/>
      </Modal>}
    </>
  );
}

function IdeologyBrowser({ selectedId, onPick }: { selectedId: string | null; onPick: (id: string) => void }) {
  const custom = useStore((s) => s.data.customIdeologies);
  const hidden = useStore((s) => s.data.prefs.ideology.hiddenFamilies);
  const [query,setQuery]=useState("");
  const [family,setFamily]=useState<IdeologyFamilyId|"all">("all");
  const all=useMemo(()=>allIdeologies(custom),[custom]);
  const visible=useMemo(()=>searchIdeologies(all,query,family).filter(i=>i.family==="unclassified"||!hidden.includes(i.family)),[all,query,family,hidden]);
  return <div className="space-y-3">
    <input className="input" autoFocus placeholder="Search by name, alias or keyword…" value={query} onChange={e=>setQuery(e.target.value)}/>
    <div className="flex flex-wrap gap-1.5">
      <button className="chip" style={{opacity:family==="all"?1:0.5}} onClick={()=>setFamily("all")}>All</button>
      {IDEOLOGY_FAMILIES.filter(f=>!hidden.includes(f.id)).map(f=><button key={f.id} className="chip" style={{background:f.color+"22",color:f.color,opacity:family===f.id?1:0.55}} onClick={()=>setFamily(f.id)}>{f.label}</button>)}
    </div>
    <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
      {IDEOLOGY_FAMILIES.filter(f=>!hidden.includes(f.id)).map(f=>{
        const items=visible.filter(i=>i.family===f.id);
        if(!items.length)return null;
        return <section key={f.id}>
          <div className="mb-1 flex items-center gap-2 text-xs font-bold" style={{color:f.color}}><Swatch color={f.color}/>{f.label}<span className="muted font-normal">({items.length})</span></div>
          <div className="grid gap-1.5 sm:grid-cols-2">{items.map(i=><button key={i.id} className="card p-2 text-left transition-colors hover:border-[var(--accent)]" style={selectedId===i.id?{borderColor:"var(--accent)",background:"var(--accent-soft)"}:undefined} onClick={()=>onPick(i.id)}>
            <div className="flex items-center gap-1.5 text-[13px] font-semibold">{i.name}{i.custom&&<span className="chip">custom</span>}</div>
            <div className="muted line-clamp-2 text-[11.5px]">{i.description}</div>
            <IdeologyPositionLine ideology={i}/>
          </button>)}</div>
        </section>;
      })}
      {visible.some(i=>i.family==="unclassified")&&<section><div className="mb-1 text-xs font-bold text-[var(--muted)]">Unclassified custom ideologies</div><div className="grid gap-1.5 sm:grid-cols-2">{visible.filter(i=>i.family==="unclassified").map(i=><button key={i.id} className="card p-2 text-left" onClick={()=>onPick(i.id)}><b className="text-[13px]">{i.name}</b><div className="muted line-clamp-2 text-[11.5px]">{i.description}</div><IdeologyPositionLine ideology={i}/></button>)}</div></section>}
      {visible.length===0&&<div className="muted p-6 text-center text-sm">No ideologies match your search.</div>}
    </div>
  </div>;
}
