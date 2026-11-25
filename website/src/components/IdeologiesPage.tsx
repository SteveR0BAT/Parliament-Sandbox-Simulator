"use client";
import { useMemo,useState } from "react";
import { IDEOLOGY_FAMILIES,IDEOLOGY_FAMILY_MAP,formatAxisPosition } from "@/data/ideologies";
import { useStore } from "@/lib/store";
import type { AxisValue,Ideology,IdeologyFamilyId } from "@/lib/types";
import { allIdeologies,FamilyBadge,searchIdeologies } from "./IdeologyPicker";
import { Empty,Field,Swatch } from "./ui";
import { uid } from "@/lib/parliament";

const blank=():Ideology=>({id:"custom-"+uid("i"),name:"",family:"unclassified",positions:{economic:null,social:null,authority:null},aliases:[],description:"",economic:"",social:"",related:[],sources:[],extra:"",custom:true});
const AXES:{id:"economic"|"social"|"authority";label:string;negative:string;positive:string}[]=[
 {id:"economic",label:"Economic orientation",negative:"Far Left",positive:"Far Right"},
 {id:"social",label:"Social orientation",negative:"Far Progressive",positive:"Far Conservative"},
 {id:"authority",label:"Political authority",negative:"Far Libertarian",positive:"Far Authoritarian"},
];
function AxisEditor({axis,value,onChange}:{axis:(typeof AXES)[number];value:AxisValue|null;onChange:(v:AxisValue|null)=>void}){
 return <div className="card space-y-2 p-3">
  <div className="flex items-center justify-between gap-2"><b className="text-xs">{axis.label}</b><span className="text-xs font-semibold">{formatAxisPosition(axis.id,value)}</span></div>
  <input aria-label={axis.label} className="w-full accent-[var(--accent)]" type="range" min={-3} max={3} step={1} disabled={value===null} value={value??0} onChange={e=>onChange(Number(e.target.value) as AxisValue)}/>
  <div className="flex items-center justify-between text-[10px] muted"><span>{axis.negative}</span><span>Centre</span><span>{axis.positive}</span></div>
  <label className="flex items-center gap-2 text-[11px]"><input type="checkbox" checked={value!==null} onChange={e=>onChange(e.target.checked?0:null)}/> Specify this dimension</label>
 </div>;
}
function AxisProfile({ideology}:{ideology:Ideology}){
 return <div className="space-y-2">
  {AXES.map(axis=>{const v=ideology.positions[axis.id];return <div key={axis.id} className="card p-3">
   <div className="mb-1 flex items-center justify-between gap-2"><span className="label">{axis.label}</span><b className="text-xs">{formatAxisPosition(axis.id,v)}</b></div>
   <div className="relative flex h-2 overflow-hidden rounded-full">
    {["#2563eb","#60a5fa","#93c5fd","#94a3b8","#fca5a5","#ef4444","#b91c1c"].map((c,i)=><div key={i} className="h-full flex-1" style={{background:c}}/>)}
    {v!==null&&<span className="absolute -top-0.5 h-3 w-1 rounded bg-[var(--text)] ring-1 ring-[var(--panel)]" style={{left:`calc(${((v+3)/6)*100}% - 2px)`}}/>}
   </div>
  </div>})}
 </div>;
}

export function IdeologiesPage(){
 const custom=useStore(s=>s.data.customIdeologies),prefs=useStore(s=>s.data.prefs.ideology),data=useStore(s=>s.data);
 const save=useStore(s=>s.saveCustomIdeology),del=useStore(s=>s.deleteCustomIdeology),toast=useStore(s=>s.toast);
 const [query,setQuery]=useState(""),[family,setFamily]=useState<IdeologyFamilyId|"all">("all"),[selected,setSelected]=useState("social-democracy"),[editing,setEditing]=useState<Ideology|null>(null);
 const all=useMemo(()=>allIdeologies(custom),[custom]);
 const results=useMemo(()=>searchIdeologies(all,query,family).filter(i=>i.family==="unclassified"||!prefs.hiddenFamilies.includes(i.family)),[all,query,family,prefs.hiddenFamilies]);
 const current=all.find(i=>i.id===selected);
 const usage=(id:string)=>data.parties.filter(p=>p.ideologyId===id).length+data.factions.filter(f=>f.ideologyId===id).length+Object.values(data.deputies).filter(d=>d.ideologyId===id).length;
 const submit=()=>{if(!editing)return;if(!editing.name.trim())return toast("An ideology needs a name.","error");if(all.some(i=>i.id!==editing.id&&i.name.toLowerCase()===editing.name.trim().toLowerCase()))return toast("An ideology with this name already exists.","error");save({...editing,name:editing.name.trim(),custom:true});setSelected(editing.id);setEditing(null);toast("Custom ideology saved.","ok");};
 const relatedLink=(name:string)=>{const found=all.find(i=>i.name.toLowerCase()===name.toLowerCase());return found?<button key={name} className="chip hover:brightness-110" onClick={()=>setSelected(found.id)}>{name}</button>:<span key={name} className="chip muted">{name}</span>;};
 return <div className="mx-auto grid h-full max-w-[1500px] gap-4 p-4 lg:grid-cols-[minmax(320px,440px)_1fr]">
  <div className="panel flex min-h-0 flex-col">
   <div className="space-y-2 border-b p-3" style={{borderColor:"var(--border)"}}>
    <div className="flex items-center justify-between"><h2 className="text-sm font-bold">Ideology database</h2><span className="muted text-xs">{all.length-custom.length} built-in · {custom.length} custom</span></div>
    <input className="input" placeholder="Search names, aliases, keywords…" value={query} onChange={e=>setQuery(e.target.value)}/>
    <div className="flex flex-wrap gap-1.5"><button className="chip" style={{opacity:family==="all"?1:0.5}} onClick={()=>setFamily("all")}>All</button>{IDEOLOGY_FAMILIES.filter(f=>!prefs.hiddenFamilies.includes(f.id)).map(f=><button key={f.id} className="chip" style={{background:f.color+"22",color:f.color,opacity:family===f.id?1:0.55}} onClick={()=>setFamily(f.id)}>{f.label}</button>)}</div>
    <button className="btn btn-primary btn-sm" onClick={()=>setEditing(blank())}>+ Create custom ideology</button>
   </div>
   <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3" style={{maxHeight:"calc(100vh - 260px)"}}>
    {IDEOLOGY_FAMILIES.filter(f=>!prefs.hiddenFamilies.includes(f.id)).map(f=>{const items=results.filter(i=>i.family===f.id);if(!items.length)return null;return <section key={f.id}>
     <div className="sticky top-0 z-[1] mb-1 flex items-center gap-2 py-1 text-xs font-extrabold uppercase tracking-wide" style={{color:f.color,background:"var(--panel)"}}><Swatch color={f.color}/>{f.label}<span className="muted font-normal normal-case">({items.length})</span></div>
     <div className="space-y-1">{items.map(i=><button key={i.id} className="w-full rounded-lg border px-2.5 py-1.5 text-left hover:border-[var(--accent)]" style={{borderColor:selected===i.id?"var(--accent)":"var(--border)",background:selected===i.id?"var(--accent-soft)":"transparent"}} onClick={()=>setSelected(i.id)}>
      <span className="font-semibold text-[13px]">{i.name}</span>{i.custom&&<span className="chip ml-2">custom</span>}{i.disputed&&prefs.showDisputed&&<span className="chip ml-2">disputed</span>}
      <div className="muted text-[10.5px]">E {formatAxisPosition("economic",i.positions.economic)} · S {formatAxisPosition("social",i.positions.social)} · A {formatAxisPosition("authority",i.positions.authority)}</div>
     </button>)}</div>
    </section>})}
    {results.some(i=>i.family==="unclassified")&&<section><div className="mb-1 text-xs font-bold">Unclassified custom ideologies</div>{results.filter(i=>i.family==="unclassified").map(i=><button key={i.id} className="w-full border-b p-2 text-left text-sm" onClick={()=>setSelected(i.id)}>{i.name}</button>)}</section>}
    {results.length===0&&<Empty>No ideologies match “{query}”.</Empty>}
   </div>
  </div>
  <div className="min-w-0 space-y-4">
   {editing?<div className="panel anim-in space-y-3 p-5">
    <h2 className="text-base font-bold">{custom.some(c=>c.id===editing.id)?"Edit custom ideology":"Create custom ideology"}</h2>
    <Field label="Name"><input className="input" value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})}/></Field>
    <Field label="Description"><textarea className="textarea" value={editing.description} onChange={e=>setEditing({...editing,description:e.target.value})}/></Field>
    <Field label="Ideological family"><select className="select" value={editing.family} onChange={e=>setEditing({...editing,family:e.target.value as IdeologyFamilyId})}><option value="unclassified">Unclassified</option>{IDEOLOGY_FAMILIES.map(f=><option key={f.id} value={f.id}>{f.label}</option>)}</select></Field>
    <div className="space-y-2"><div className="label">Multidimensional position</div>{AXES.map(axis=><AxisEditor key={axis.id} axis={axis} value={editing.positions[axis.id]} onChange={v=>setEditing({...editing,positions:{...editing.positions,[axis.id]:v}})}/>)}</div>
    <div className="grid gap-3 md:grid-cols-2"><Field label="Economic characteristics"><input className="input" value={editing.economic} onChange={e=>setEditing({...editing,economic:e.target.value})}/></Field><Field label="Social characteristics"><input className="input" value={editing.social} onChange={e=>setEditing({...editing,social:e.target.value})}/></Field></div>
    <Field label="Additional characteristics (optional)"><textarea className="textarea" value={editing.extra??""} onChange={e=>setEditing({...editing,extra:e.target.value})}/></Field>
    <Field label="Alternative names (comma-separated)"><input className="input" value={editing.aliases.join(", ")} onChange={e=>setEditing({...editing,aliases:e.target.value.split(",").map(x=>x.trim()).filter(Boolean)})}/></Field>
    <Field label="Related ideologies (comma-separated names)"><input className="input" value={editing.related.join(", ")} onChange={e=>setEditing({...editing,related:e.target.value.split(",").map(x=>x.trim()).filter(Boolean)})}/></Field>
    <div className="flex gap-2"><button className="btn btn-primary" onClick={submit}>Save ideology</button><button className="btn" onClick={()=>setEditing(null)}>Cancel</button></div>
   </div>:current?<div className="panel anim-in space-y-4 p-5" key={current.id}>
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-extrabold">{current.name}</h2>{current.aliases.length>0&&<div className="muted text-xs">Also: {current.aliases.join(" · ")}</div>}</div>
     <div className="flex items-center gap-2"><FamilyBadge id={current.family}/>{current.custom&&<><button className="btn btn-sm" onClick={()=>setEditing({...current,positions:{...current.positions}})}>Edit</button><button className="btn btn-sm btn-danger" onClick={()=>{if(window.confirm(`Delete ${current.name}? It is used by ${usage(current.id)} party/faction/deputy entries, which will become unassigned.`)){del(current.id);setSelected("social-democracy");}}}>Delete</button></>}</div>
    </div>
    <p className="text-[14px] leading-relaxed">{current.description||<span className="muted">No description.</span>}</p>
    <div className="grid gap-3 md:grid-cols-2"><div className="card p-3"><div className="label">Ideological family</div><div className="text-sm font-semibold" style={{color:IDEOLOGY_FAMILY_MAP[current.family].color}}>{IDEOLOGY_FAMILY_MAP[current.family].label}</div><p className="muted text-xs">{IDEOLOGY_FAMILY_MAP[current.family].blurb}</p></div><div className="card p-3"><div className="label">Used in this parliament</div><div className="text-sm font-semibold">{usage(current.id)} assignment(s)</div></div></div>
    <div><div className="label mb-2">Three-dimensional political profile</div><AxisProfile ideology={current}/></div>
    <div className="grid gap-3 md:grid-cols-2"><div className="card p-3"><div className="label">Economic characteristics</div><div className="text-sm">{current.economic||"—"}</div></div><div className="card p-3"><div className="label">Social characteristics</div><div className="text-sm">{current.social||"—"}</div></div></div>
    {current.extra&&<div className="card p-3"><div className="label">Additional characteristics</div><div className="text-sm">{current.extra}</div></div>}
    {current.history&&<div className="card p-3"><div className="label">Historical context</div><div className="text-sm">{current.history}</div></div>}
    {current.related.length>0&&<div><div className="label">Related ideologies</div><div className="flex flex-wrap gap-1.5">{current.related.map(relatedLink)}</div></div>}
    {current.note&&prefs.showDisputed&&<div className="rounded-lg p-3 text-[13px]" style={{background:"color-mix(in srgb, var(--warn) 12%, transparent)"}}><b>Classification note: </b>{current.note}</div>}
    {prefs.showSources&&current.sources.length>0&&<div><div className="label">Sources &amp; references</div><ul className="list-disc space-y-0.5 pl-5 text-xs">{current.sources.map(s=><li key={s.url}><a className="underline" style={{color:"var(--accent)"}} href={s.url} target="_blank" rel="noreferrer">{s.title}</a></li>)}</ul></div>}
   </div>:<Empty>Select an ideology to see details.</Empty>}
   <div className="muted px-1 text-[11px]">The original ideology descriptions and historical metadata are preserved. Positions are broad reference classifications; political movements have varied across time and place.</div>
  </div>
 </div>;
}
