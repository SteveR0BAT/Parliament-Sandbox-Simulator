import type {
  Behavior,
  ChamberSettings,
  Coalition,
  Issue,
  Party,
  Prefs,
  ProjectData,
  RandomProbs,
  Threshold,
  IdeologyFamilyId,
  LegacyCategoryId,
  GovernmentPosition,
} from "./types";
import { BUILTIN_NAME_MAP, IDEOLOGY_FAMILY_MAP } from "@/data/ideologies";
import { addPartyDeputies, deputyList, makeDeputy, newFaction, setFactionCount, syncSeats, uid } from "./parliament";
import { suggestShades } from "./color";

export const PROJECT_VERSION = 4;

// A project starts with a practical cabinet template, but every office remains editable
// and users can add or remove positions to model any constitutional system.
export function defaultGovernmentPositions(): GovernmentPosition[] {
  const templates: [string, string][] = [
    ["President", "Head of state."],
    ["Prime Minister", "Head of government and coordinator of the cabinet."],
    ["Ministry of Education", "Responsible for education policy, schools and universities."],
    ["Ministry of Economy", "Responsible for economic policy, industry and business."],
    ["Ministry of Healthcare", "Responsible for public health and healthcare services."],
    ["Ministry of Defence", "Responsible for national defence and the armed forces."],
    ["Ministry of Foreign Affairs", "Responsible for diplomacy and foreign relations."],
    ["Ministry of Finance", "Responsible for public finances, taxation and the budget."],
    ["Ministry of Justice", "Responsible for justice policy and the legal system."],
    ["Ministry of Interior", "Responsible for internal security and civil administration."],
    ["Ministry of Infrastructure & Transport", "Responsible for infrastructure and transport policy."],
    ["Ministry of Environment & Energy", "Responsible for environmental and energy policy."],
    ["Ministry of Agriculture", "Responsible for agriculture and rural development."],
    ["Ministry of Culture", "Responsible for culture, heritage and the arts."],
    ["Ministry of Labour & Social Affairs", "Responsible for labour policy and social protection."],
  ];
  return templates.map(([title, description]) => ({
    id: uid("office"),
    title,
    description,
    deputyId: null,
    externalName: "",
  }));
}

export const DEFAULT_SETTINGS: ChamberSettings = {
  genericDeputyNames: "multicultural",
  totalSeats: 200,
  rowMode: "auto",
  rows: 8,
  seatsPerRow: 30,
  seatRadius: 10,
  seatSpacing: 3,
  rowSpacing: 4,
  innerRadius: 70,
  centerPadding: 30,
  arcAngle: 180,
  rotation: 0,
  orientation: "up",
  outerMode: "auto",
  outerRadius: 400,
  width: 1000,
  height: 560,
  autoFit: true,
  seatOrder: "wedge",
  groupCoalitions: true,
};

export const DEFAULT_BEHAVIOR: Behavior = {
  partyDiscipline: 90,
  factionDiscipline: 90,
  ideologicalAdherence: 85,
  randomness: 3,
  abstainProb: 3,
  absentProb: 4,
  priority: ["individual", "faction", "party"],
  unsetDecision: "abstain",
  partyDisciplineOverrides: {},
};

export const DEFAULT_RANDOM: RandomProbs = { pFor: 40, pAgainst: 40, pAbstain: 10, pAbsent: 10 };

export const DEFAULT_THRESHOLD: Threshold = {
  type: "simple",
  percent: 55,
  basis: "present",
  inclusive: true,
  quorum: 0,
  rules: [],
};

export const DEFAULT_PREFS: Prefs = {
  voteColors: { for: "#16a34a", against: "#dc2626", abstain: "#eab308", absent: "#94a3b8", pending: "#cbd5e1" },
  unallocatedColor: "#cbd5e1",
  coalitionRing: true,
  ringWidth: 0.16,
  showSeatNumbers: false,
  animateVotes: true,
  animationSpeed: 1,
  animateChanges: true,
  dimUnfocused: true,
  legend: { parties: true, factions: true, coalitions: true, independents: true, vacant: true, visual: true, voteColors: true },
  ideology: { showSources: true, showDisputed: true, hiddenFamilies: [] },
  defaults: {
    mode: "party",
    behavior: DEFAULT_BEHAVIOR,
    random: DEFAULT_RANDOM,
    threshold: DEFAULT_THRESHOLD,
  },
};

export function newIssue(prefs: Prefs, partial: Partial<Issue> = {}): Issue {
  return {
    id: uid("i"),
    name: "New issue",
    description: "",
    background: "",
    category: "",
    notes: "",
    votingType: "bill",
    mode: prefs.defaults.mode,
    groupPositions: {},
    legacyGroupPositions: {},
    ideologyPositions: {},
    partyVotes: {},
    factionVotes: {},
    individualVotes: {},
    mixedRules: {},
    behavior: structuredClone(prefs.defaults.behavior),
    random: structuredClone(prefs.defaults.random),
    threshold: structuredClone(prefs.defaults.threshold),
    ...partial,
  };
}

export function blankProject(totalSeats = 100): ProjectData {
  return {
    version: PROJECT_VERSION,
    settings: { ...DEFAULT_SETTINGS, totalSeats },
    prefs: structuredClone(DEFAULT_PREFS),
    parties: [],
    factions: [],
    coalitions: [],
    deputies: {},
    seats: Array(totalSeats).fill(null),
    seatingLocked: false,
    customIdeologies: [],
    issues: [],
    history: [],
    governingCoalitionId: null,
    governmentPositions: defaultGovernmentPositions(),
  };
}

export function sampleProject(): ProjectData {
  const d = blankProject(200);
  const mk = (p: Partial<Party> & Pick<Party, "name" | "abbr" | "color">): Party => ({
    id: uid("p"),
    leader: "",
    ideologyId: null,
    description: "",
    symbol: "",
    meta: [],
    role: "neutral",
    ...p,
  });
  const pdu = mk({ name: "People's Democratic Union", abbr: "PDU", color: "#228b22", leader: "Alexander Morgan", ideologyId: "social-democracy", role: "government", symbol: "🌳", description: "Big-tent centre-left party of the welfare state." });
  const la = mk({ name: "Liberal Alliance", abbr: "LA", color: "#2f80ed", leader: "Sofia Lindqvist", ideologyId: "social-liberalism", role: "government", symbol: "🕊️" });
  const cu = mk({ name: "Conservative Union", abbr: "CU", color: "#1e3a8a", leader: "Henrik Weber", ideologyId: "conservatism", role: "opposition", symbol: "🦁" });
  const nr = mk({ name: "National Renewal", abbr: "NR", color: "#92400e", leader: "Viktor Petrov", ideologyId: "national-conservatism", role: "opposition", symbol: "🏛️" });
  const gf = mk({ name: "Green Future", abbr: "GF", color: "#14b8a6", leader: "Freya Berg", ideologyId: "environmentalism", role: "government", symbol: "🌿" });
  const wl = mk({ name: "Workers' Left", abbr: "WL", color: "#d7263d", leader: "Amara Okafor", ideologyId: "democratic-socialism", role: "confidence", symbol: "✊" });
  const pb = mk({ name: "Patriotic Bloc", abbr: "PB", color: "#78350f", leader: "Dmitri Novak", ideologyId: "right-wing-populism", role: "opposition", symbol: "🦅" });
  d.parties = [pdu, la, gf, wl, cu, nr, pb];
  const counts: [Party, number][] = [[pdu, 62], [la, 38], [gf, 16], [wl, 12], [cu, 44], [nr, 18], [pb, 8]];
  for (const [p, n] of counts) addPartyDeputies(d, p, n);

  const shades = suggestShades(pdu.color, 3);
  const f1 = newFaction(pdu.id, shades[1], { name: "Democratic Socialists", abbr: "DSF", ideologyId: "democratic-socialism", leader: "Yara Haddad", description: "Left wing of the PDU." });
  const f2 = newFaction(pdu.id, shades[0], { name: "Social Liberals", abbr: "SLF", ideologyId: "social-liberalism", leader: "Liam Costa" });
  const f3 = newFaction(pdu.id, "#6ee7a0", { name: "Mainstream Social Democrats", abbr: "MSD", ideologyId: "social-democracy" });
  const cs = suggestShades(cu.color, 2);
  const f4 = newFaction(cu.id, "#3b82f6", { name: "Liberal Conservatives", abbr: "LCF", ideologyId: "liberal-conservatism" });
  const f5 = newFaction(cu.id, cs[1], { name: "Traditionalists", abbr: "TRD", ideologyId: "traditionalist-conservatism" });
  d.factions = [f1, f2, f3, f4, f5];
  setFactionCount(d, f1.id, 12);
  setFactionCount(d, f2.id, 14);
  setFactionCount(d, f3.id, 26);
  setFactionCount(d, f4.id, 24);
  setFactionCount(d, f5.id, 14);

  const da: Coalition = { id: uid("c"), name: "Democratic Alliance", abbr: "DA", color: "#f5b700", description: "Governing centre-left coalition.", partyIds: [pdu.id, la.id, gf.id], leader: "Alexander Morgan", orientation: "Centre-left", ideologyId: "social-liberalism" };
  const cp: Coalition = { id: uid("c"), name: "Conservative Pact", abbr: "CP", color: "#a855f7", description: "Opposition right-wing pact.", partyIds: [cu.id, nr.id, pb.id], leader: "Henrik Weber", orientation: "Right", ideologyId: null };
  d.coalitions = [da, cp];
  d.governingCoalitionId = da.id;

  for (const [name, ideologyId, color, behavior] of [
    ["Elena Vasquez", "classical-liberalism", "#f97316", "ideology"],
    ["Samuel Mbeki", "communitarianism", "#8b5cf6", "ideology"],
  ] as const) {
    const dep = makeDeputy({ name, ideologyId, color, behavior, description: "Independent deputy" });
    d.deputies[dep.id] = dep;
  }
  syncSeats(d);

  d.issues = [
    newIssue(d.prefs, {
      name: "AI Regulations Act",
      category: "Technology",
      votingType: "bill",
      mode: "ideology",
      description:
        "The development of artificial intelligence is accelerating, raising concerns about employment, privacy, misinformation, and the potential misuse of increasingly powerful AI systems. Parliament must decide whether the technology should be regulated.",
      groupPositions: {
        "liberal-libertarian": { pos: "mostlyFor" },
        "conservative-traditionalist": { pos: "against" },
        "social-democratic-reformist": { pos: "mostlyFor" },
        "socialist-communist": { pos: "for" },
        "authoritarian-state-communist": { pos: "mostlyFor" },
        "anarchist-anti-authoritarian": { pos: "for" },
        "nationalist-sovereigntist": { pos: "against" },
        "fascist-ultranationalist": { pos: "against" },
        "religious-communitarian": { pos: "neutral" },
        "civic-ecological-crosscutting": { pos: "mostlyFor" },
      },
      partyVotes: { [pdu.id]: "for", [la.id]: "for", [gf.id]: "for", [wl.id]: "for", [cu.id]: "against", [nr.id]: "against", [pb.id]: "against" },
    }),
  ];
  return d;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

function deepMerge<T>(base: T, over: unknown): T {
  if (!isObj(base) || !isObj(over)) return (over === undefined || over === null ? base : (over as T)) as T;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const k of Object.keys(over)) {
    const b = (base as Record<string, unknown>)[k];
    out[k] = isObj(b) && isObj(over[k]) ? deepMerge(b, over[k]) : over[k] === undefined ? b : over[k];
  }
  return out as T;
}

const LEGACY_ECONOMIC_COORDINATES:Record<string,number|null>={"far-right":3,right:2,"center-right":1,center:0,"center-left":-1,left:-2,"far-left":-3,"third-way":null,unclassified:null};
const FAMILY_IDS=new Set(Object.keys(IDEOLOGY_FAMILY_MAP));
const LEGACY_CATEGORY_IDS=new Set(["far-right","right","center-right","center","center-left","left","far-left","third-way","unclassified"]);
function migrateCustomIdeology(raw:unknown):ProjectData["customIdeologies"][number]{
 const i=(isObj(raw)?raw:{}) as Record<string,unknown>,legacy=typeof i.legacyCategory==="string"?i.legacyCategory:typeof i.category==="string"?i.category:"unclassified";
 const family=typeof i.family==="string"&&FAMILY_IDS.has(i.family)?i.family as IdeologyFamilyId:"unclassified";
 const positions=isObj(i.positions)?i.positions:{economic:LEGACY_ECONOMIC_COORDINATES[legacy]??null,social:null,authority:null};
 const axisValue=(v:unknown): -3|-2|-1|0|1|2|3|null => typeof v==="number" && Number.isInteger(v) && v>=-3 && v<=3 ? v as -3|-2|-1|0|1|2|3 : null;
 return{...(i as unknown as ProjectData["customIdeologies"][number]),family,positions:{economic:axisValue(positions.economic),social:axisValue(positions.social),authority:axisValue(positions.authority)},legacyCategory:LEGACY_CATEGORY_IDS.has(legacy)?legacy as LegacyCategoryId:"unclassified"};
}
function migrateIssue(raw:unknown,splitFormerFamilies=false):Issue{
 const i=(isObj(raw)?raw:{}) as Record<string,unknown>,old=isObj(i.groupPositions)?i.groupPositions:{},groupPositions:Record<string,unknown>={},legacyGroupPositions:Record<string,unknown>=isObj(i.legacyGroupPositions)?{...i.legacyGroupPositions}:{};
 for(const[key,value]of Object.entries(old)){
  if(FAMILY_IDS.has(key)){
   groupPositions[key]=value;
   if(splitFormerFamilies&&key==="socialist-communist")groupPositions["authoritarian-state-communist"]??=value;
   if(splitFormerFamilies&&key==="nationalist-sovereigntist")groupPositions["fascist-ultranationalist"]??=value;
  }else if(LEGACY_CATEGORY_IDS.has(key))legacyGroupPositions[key]=value;
 }
 return{...i,groupPositions,legacyGroupPositions,ideologyPositions:isObj(i.ideologyPositions)?i.ideologyPositions:{}} as unknown as Issue;
}
function migrateHistory(raw:unknown,splitFormerFamilies=false):ProjectData["history"][number]{
 const r=(isObj(raw)?raw:{}) as Record<string,unknown>,s=(isObj(r.snapshot)?r.snapshot:{}) as Record<string,unknown>;
 const deputies=Array.isArray(s.deputies)?s.deputies.map(rawDep=>{
  const d=(isObj(rawDep)?rawDep:{}) as Record<string,unknown>,old=typeof d.legacyCategory==="string"?d.legacyCategory:typeof d.category==="string"?d.category:null;
  const found=typeof d.ideology==="string"?BUILTIN_NAME_MAP[d.ideology.toLowerCase()]:undefined;
  return{...d,family:found?.family??(typeof d.family==="string"&&FAMILY_IDS.has(d.family)?d.family as IdeologyFamilyId:"unclassified"),legacyCategory:old&&LEGACY_CATEGORY_IDS.has(old)?old:found?.legacyCategory??null,positions:isObj(d.positions)?d.positions:found?.positions??null};
 }):[];
 return{...(r as unknown as ProjectData["history"][number]),issue:migrateIssue(r.issue,splitFormerFamilies),snapshot:{...s,deputies} as unknown as ProjectData["history"][number]["snapshot"]};
}
export function normalizeProject(raw:unknown):ProjectData{
 const src=(isObj(raw)?raw:{}) as Record<string,unknown>,base=blankProject(100),splitFormerFamilies=Number(src.version??1)<3,rawPrefs=isObj(src.prefs)?src.prefs:{},rawIP=isObj(rawPrefs.ideology)?rawPrefs.ideology:{};
 const d:ProjectData={...base,settings:deepMerge(DEFAULT_SETTINGS,src.settings),
 prefs:deepMerge(DEFAULT_PREFS,{...rawPrefs,ideology:{...rawIP,hiddenFamilies:Array.isArray(rawIP.hiddenFamilies)?rawIP.hiddenFamilies:[]}}),
 parties:Array.isArray(src.parties)?(src.parties as Party[]).map(p=>Object.assign({symbol:"",meta:[],role:"neutral",description:"",leader:"",ideologyId:null} as Partial<Party>,p) as Party):[],
 factions:Array.isArray(src.factions)?(src.factions as ProjectData["factions"]).map(f=>Object.assign({abbr:"",description:"",leader:"",ideologyId:null} as Partial<ProjectData["factions"][number]>,f) as ProjectData["factions"][number]):[],
 coalitions:Array.isArray(src.coalitions)?(src.coalitions as Coalition[]).map(c=>Object.assign({description:"",leader:"",orientation:"",ideologyId:null,partyIds:[]} as Partial<Coalition>,c) as Coalition):[],
 deputies:{},seats:Array.isArray(src.seats)?(src.seats as (string|null)[]):[],seatingLocked:!!src.seatingLocked,
 customIdeologies:Array.isArray(src.customIdeologies)?src.customIdeologies.map(migrateCustomIdeology):[],
 issues:Array.isArray(src.issues)?src.issues.map(i=>deepMerge(newIssue(base.prefs),migrateIssue(i,splitFormerFamilies))):[],
 history:Array.isArray(src.history)?src.history.map(i=>migrateHistory(i,splitFormerFamilies)):[],governingCoalitionId:typeof src.governingCoalitionId==="string"?src.governingCoalitionId:null,
 governmentPositions:Array.isArray(src.governmentPositions)?src.governmentPositions.filter(isObj).map((p,index)=>({
  id:typeof p.id==="string"&&p.id?p.id:uid("office"),
  title:typeof p.title==="string"?p.title:`Office ${index+1}`,
  description:typeof p.description==="string"?p.description:"",
  deputyId:typeof p.deputyId==="string"?p.deputyId:null,
  externalName:typeof p.externalName==="string"?p.externalName:"",
  custom:typeof p.custom==="boolean"?p.custom:undefined,
 })):base.governmentPositions,version:PROJECT_VERSION};
 d.settings.totalSeats=Math.max(1,Math.min(20000,Math.floor(Number(d.settings.totalSeats))||100));
 if(isObj(src.deputies))for(const[id,dep]of Object.entries(src.deputies))if(isObj(dep))d.deputies[id]={...makeDeputy({},d.settings.genericDeputyNames),...(dep as object),id} as ProjectData["deputies"][string];
 const ids=new Set(d.parties.map(p=>p.id));d.factions=d.factions.filter(f=>ids.has(f.partyId));const byId=new Map(d.factions.map(f=>[f.id,f]));
 for(const dep of deputyList(d)){if(dep.partyId&&!ids.has(dep.partyId))dep.partyId=null;if(dep.factionId){const f=byId.get(dep.factionId);if(!f||f.partyId!==dep.partyId)dep.factionId=null;}}
 d.coalitions.forEach(c=>c.partyIds=c.partyIds.filter(id=>ids.has(id)));if(d.governingCoalitionId&&!d.coalitions.some(c=>c.id===d.governingCoalitionId))d.governingCoalitionId=null;
 const deps=deputyList(d);if(deps.length>d.settings.totalSeats)d.settings.totalSeats=deps.length;syncSeats(d);return d;
}
