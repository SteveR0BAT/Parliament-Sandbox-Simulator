// Voting engine. Pure functions only — no React / rendering concerns.
import { BUILTIN_MAP, CATEGORY_MAP } from "@/data/ideologies";
import type {
  Behavior,
  CategoryId,
  Deputy,
  Faction,
  Ideology,
  Issue,
  Party,
  Position,
  PositionSpec,
  ProjectData,
  RandomProbs,
  Snapshot,
  Threshold,
  ThresholdBasis,
  Vote,
  VoteRecord,
} from "./types";

export const POSITION_LABELS: Record<Position, string> = {
  strongFor: "Strongly For",
  for: "For",
  mostlyFor: "Mostly For",
  neutral: "Neutral",
  mostlyAgainst: "Mostly Against",
  against: "Against",
  strongAgainst: "Strongly Against",
  custom: "Custom probability",
};

/** Probability (for, against, abstain) of an individual deputy given an ideological position. */
export const POSITION_DIST: Record<Exclude<Position, "custom">, [number, number, number]> = {
  strongFor: [0.96, 0.02, 0.02],
  for: [0.86, 0.08, 0.06],
  mostlyFor: [0.66, 0.2, 0.14],
  neutral: [0.3, 0.3, 0.4],
  mostlyAgainst: [0.2, 0.66, 0.14],
  against: [0.08, 0.86, 0.06],
  strongAgainst: [0.02, 0.96, 0.02],
};

export const VOTE_LABELS: Record<Vote, string> = {
  for: "For",
  against: "Against",
  abstain: "Abstain",
  absent: "Absent",
};

export function lookupIdeology(custom: Ideology[], id: string | null | undefined): Ideology | undefined {
  if (!id) return undefined;
  return BUILTIN_MAP[id] ?? custom.find((i) => i.id === id);
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function normalize(ps: number[]): number[] {
  const clean = ps.map((p) => (Number.isFinite(p) && p > 0 ? p : 0));
  const sum = clean.reduce((a, b) => a + b, 0);
  if (sum <= 0) return clean.map(() => 1 / clean.length);
  return clean.map((p) => p / sum);
}

export function distFromSpec(spec: PositionSpec): [number, number, number] {
  if (spec.pos === "custom") {
    const n = normalize([spec.pFor ?? 0, spec.pAgainst ?? 0, spec.pAbstain ?? 0]);
    return [n[0], n[1], n[2]];
  }
  return POSITION_DIST[spec.pos];
}

function sample3(rng: () => number, d: [number, number, number]): Vote {
  const x = rng();
  if (x < d[0]) return "for";
  if (x < d[0] + d[1]) return "against";
  return "abstain";
}

export interface VoteContext {
  deputies: Deputy[];
  parties: Record<string, Party>;
  factions: Record<string, Faction>;
  ideology: (id: string | null | undefined) => Ideology | undefined;
}

export function buildContext(data: ProjectData): VoteContext {
  return {
    deputies: Object.values(data.deputies),
    parties: Object.fromEntries(data.parties.map((p) => [p.id, p])),
    factions: Object.fromEntries(data.factions.map((f) => [f.id, f])),
    ideology: (id) => lookupIdeology(data.customIdeologies, id),
  };
}

function dissent(rng: () => number, decision: Vote, rd: [number, number, number]): Vote {
  const x = rng();
  if (decision === "for") return x < 0.6 ? "against" : "abstain";
  if (decision === "against") return x < 0.6 ? "for" : "abstain";
  if (decision === "abstain") return x < 0.5 ? "for" : "against";
  return sample3(rng, rd); // party chose to be absent: dissenters turn up and vote
}

export interface DeputyOutcome {
  vote: Vote;
  reason: string;
}

export function runVoteEngine(ctx: VoteContext, issue: Issue, seed: number): DeputyOutcome[] {
  const rng = mulberry32(seed);
  const b: Behavior = issue.behavior;
  const rp: RandomProbs = issue.random;
  const randDist3 = normalize([rp.pFor, rp.pAgainst, rp.pAbstain]) as [number, number, number];
  const pct = (n: number) => Math.min(1, Math.max(0, n / 100));

  const unset = (steps: string[]): Vote => {
    if (b.unsetDecision === "random") {
      steps.push("no rule configured → random draw");
      return sample3(rng, randDist3);
    }
    steps.push(`no rule configured → default ${VOTE_LABELS[b.unsetDecision]}`);
    return b.unsetDecision;
  };

  const out: DeputyOutcome[] = [];
  for (const dep of ctx.deputies) {
    const steps: string[] = [];
    const party = dep.partyId ? ctx.parties[dep.partyId] : undefined;
    const faction = dep.factionId ? ctx.factions[dep.factionId] : undefined;
    const done = (vote: Vote) => out.push({ vote, reason: steps.join(" → ") });

    // 1. Individual override (always honoured)
    const ov = issue.individualVotes[dep.id];
    if (ov) {
      steps.push(`individual decision: ${VOTE_LABELS[ov]}`);
      done(ov);
      continue;
    }
    if (issue.mode === "individual") {
      steps.push("individual mode");
      done(unset(steps));
      continue;
    }

    // 2. Fully random mode
    if (issue.mode === "random") {
      const d = normalize([rp.pFor, rp.pAgainst, rp.pAbstain, rp.pAbsent]);
      const x = rng();
      let v: Vote = "absent";
      if (x < d[0]) v = "for";
      else if (x < d[0] + d[1]) v = "against";
      else if (x < d[0] + d[1] + d[2]) v = "abstain";
      steps.push(`random draw (For ${(d[0] * 100).toFixed(0)}% / Against ${(d[1] * 100).toFixed(0)}% / Abstain ${(d[2] * 100).toFixed(0)}% / Absent ${(d[3] * 100).toFixed(0)}%)`);
      done(v);
      continue;
    }

    // 3. Absence roll
    if (rng() < pct(b.absentProb)) {
      steps.push(`absence roll (${b.absentProb}%) → absent`);
      done("absent");
      continue;
    }

    // 4. Randomness roll
    if (rng() < pct(b.randomness)) {
      steps.push(`randomness (${b.randomness}%) → ignores guidance`);
      let v = sample3(rng, randDist3);
      steps.push(`random draw → ${VOTE_LABELS[v]}`);
      if ((v === "for" || v === "against") && rng() < pct(b.abstainProb)) {
        v = "abstain";
        steps.push("abstention roll → abstain");
      }
      done(v);
      continue;
    }

    // 5. Resolve method
    type Method = "party" | "faction" | "ideology" | "random" | "fixed";
    let method: Method;
    let fixed: Vote | null = null;
    if (!party) {
      // independent deputy
      if (dep.behavior === "random") method = "random";
      else if (dep.behavior === "ideology") method = "ideology";
      else {
        method = "fixed";
        fixed = dep.behavior;
      }
      steps.push(`independent (behaviour: ${dep.behavior})`);
    } else if (issue.mode === "mixed") {
      method = issue.mixedRules[party.id] ?? "party";
      steps.push(`${party.abbr}: mixed rule "${method}"`);
    } else {
      method = issue.mode as Method;
    }

    let vote: Vote;
    if (method === "fixed" && fixed) {
      vote = fixed;
      steps.push(`fixed ${VOTE_LABELS[fixed]}`);
    } else if (method === "random") {
      vote = sample3(rng, randDist3);
      steps.push(`random draw → ${VOTE_LABELS[vote]}`);
    } else if (method === "ideology") {
      // which ideology applies, per configured priority
      let ideo: Ideology | undefined;
      let via = "";
      for (const src of b.priority) {
        const id = src === "individual" ? dep.ideologyId : src === "faction" ? faction?.ideologyId : party?.ideologyId;
        const found = ctx.ideology(id);
        if (found) {
          ideo = found;
          via = src;
          break;
        }
      }
      if (!ideo) {
        steps.push("no ideology assigned");
        vote = unset(steps);
      } else {
        const spec: PositionSpec | undefined = issue.ideologyPositions[ideo.id] ?? issue.groupPositions[ideo.category];
        if (!spec) {
          steps.push(`${ideo.name} (${via}) has no configured position`);
          vote = unset(steps);
        } else {
          const base = distFromSpec(spec);
          const a = pct(b.ideologicalAdherence);
          const mix: [number, number, number] = [
            a * base[0] + (1 - a) * randDist3[0],
            a * base[1] + (1 - a) * randDist3[1],
            a * base[2] + (1 - a) * randDist3[2],
          ];
          vote = sample3(rng, mix);
          steps.push(
            `ideology ${ideo.name} (via ${via}) → ${CATEGORY_MAP[ideo.category].label}: ${POSITION_LABELS[spec.pos]}; adherence ${b.ideologicalAdherence}% (P for ${(mix[0] * 100).toFixed(0)}%) → ${VOTE_LABELS[vote]}`,
          );
        }
      }
    } else {
      // party or faction
      let decision: Vote | undefined;
      let disc = b.partyDiscipline;
      let who = "";
      if (method === "faction" && faction) {
        decision = issue.factionVotes[faction.id] ?? (party ? issue.partyVotes[party.id] : undefined);
        disc = b.factionDiscipline;
        who = `faction ${faction.abbr || faction.name}`;
        if (issue.factionVotes[faction.id] === undefined && decision) who += " (no faction decision → party line)";
      } else if (party) {
        decision = issue.partyVotes[party.id];
        disc = b.partyDisciplineOverrides[party.id] ?? b.partyDiscipline;
        who = `party ${party.abbr}`;
        if (method === "faction") who += " (no faction → party line)";
      }
      if (!decision) {
        steps.push(`${who || "group"}: no decision set`);
        vote = unset(steps);
      } else if (rng() < pct(disc)) {
        vote = decision;
        steps.push(`follows ${who} line ${VOTE_LABELS[decision]} (discipline ${disc}%)`);
      } else {
        vote = dissent(rng, decision, randDist3);
        steps.push(`breaks from ${who} line ${VOTE_LABELS[decision]} (discipline ${disc}%) → ${VOTE_LABELS[vote]}`);
      }
    }

    // 6. Abstention roll
    if ((vote === "for" || vote === "against") && rng() < pct(b.abstainProb)) {
      vote = "abstain";
      steps.push(`abstention roll (${b.abstainProb}%) → abstain`);
    }
    done(vote);
  }
  return out;
}

export function buildSnapshot(data: ProjectData, priority: Behavior["priority"]): Snapshot {
  const ctx = buildContext(data);
  return {
    totalSeats: data.settings.totalSeats,
    parties: data.parties.map((p) => ({ id: p.id, name: p.name, abbr: p.abbr, color: p.color })),
    factions: data.factions.map((f) => ({ id: f.id, partyId: f.partyId, name: f.name, abbr: f.abbr, color: f.color })),
    coalitions: data.coalitions.map((c) => ({ id: c.id, name: c.name, abbr: c.abbr, color: c.color, partyIds: [...c.partyIds] })),
    deputies: ctx.deputies.map((d) => {
      const party = d.partyId ? ctx.parties[d.partyId] : undefined;
      const faction = d.factionId ? ctx.factions[d.factionId] : undefined;
      let ideo: Ideology | undefined;
      for (const src of priority) {
        const id = src === "individual" ? d.ideologyId : src === "faction" ? faction?.ideologyId : party?.ideologyId;
        ideo = ctx.ideology(id);
        if (ideo) break;
      }
      return {
        id: d.id,
        name: d.name,
        partyId: d.partyId,
        factionId: d.factionId,
        category: ideo ? ideo.category : null,
        ideology: ideo ? ideo.name : "",
      };
    }),
  };
}

export function createRecord(data: ProjectData, issue: Issue, seed: number): VoteRecord {
  const ctx = buildContext(data);
  const outcomes = runVoteEngine(ctx, issue, seed);
  return {
    id: "v_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    issueId: issue.id,
    issue: structuredClone(issue),
    createdAt: Date.now(),
    seed,
    snapshot: buildSnapshot(data, issue.behavior.priority),
    votes: outcomes.map((o) => o.vote),
    reasons: outcomes.map((o) => o.reason),
  };
}

// ---------- Tallies ----------

export interface Counts {
  for: number;
  against: number;
  abstain: number;
  absent: number;
  total: number;
}
export const emptyCounts = (): Counts => ({ for: 0, against: 0, abstain: 0, absent: 0, total: 0 });
const add = (c: Counts, v: Vote) => {
  c[v]++;
  c.total++;
};

export interface Totals extends Counts {
  seats: number;
  vacant: number;
  present: number;
  valid: number;
}

export interface GroupRow {
  id: string;
  name: string;
  abbr: string;
  color: string;
  counts: Counts;
}

export interface RuleLine {
  label: string;
  basis: ThresholdBasis | "votes";
  baseValue: number;
  required: number;
  actual: number;
  passed: boolean;
}

export interface ThresholdResult {
  passed: boolean;
  quorumOk: boolean;
  quorumRequired: number;
  lines: RuleLine[];
}

export interface TallyResult {
  totals: Totals;
  parties: GroupRow[];
  independents: GroupRow;
  factions: (GroupRow & { partyId: string })[];
  coalitions: GroupRow[];
  categories: { id: CategoryId; label: string; color: string; counts: Counts }[];
  threshold: ThresholdResult;
}

const EPS = 1e-9;

export function evaluateThreshold(t: Threshold, tt: Totals): ThresholdResult {
  const baseOf = (b: ThresholdBasis) => (b === "all" ? tt.seats : b === "present" ? tt.present : tt.valid);
  const baseName = (b: ThresholdBasis) => (b === "all" ? "all seats" : b === "present" ? "deputies present" : "valid votes (For + Against)");
  const lines: RuleLine[] = [];
  const quorumRequired = t.quorum > 0 ? Math.ceil((tt.seats * t.quorum) / 100 - EPS) : 0;
  const quorumOk = tt.present >= quorumRequired;

  const rule = (label: string, percent: number, basis: ThresholdBasis, inclusive: boolean) => {
    const base = baseOf(basis);
    const raw = (base * percent) / 100;
    const required = Math.max(1, inclusive ? Math.ceil(raw - EPS) : Math.floor(raw + EPS) + 1);
    lines.push({
      label: `${label}: ${inclusive ? "at least" : "more than"} ${+percent.toFixed(2)}% of ${baseName(basis)}`,
      basis,
      baseValue: base,
      required,
      actual: tt.for,
      passed: tt.for >= required,
    });
  };

  switch (t.type) {
    case "simple":
      lines.push({
        label: "Simple majority: more votes For than Against",
        basis: "votes",
        baseValue: tt.for + tt.against,
        required: tt.against + 1,
        actual: tt.for,
        passed: tt.for > tt.against,
      });
      break;
    case "absolute":
      rule("Absolute majority", 50, "all", false);
      break;
    case "qualified":
      rule("Qualified majority", t.percent, t.basis, t.inclusive);
      break;
    case "twoThirds":
      rule("Two-thirds majority", (2 / 3) * 100, t.basis, true);
      break;
    case "threeFifths":
      rule("Three-fifths majority", 60, t.basis, true);
      break;
    case "custom": {
      const rs = t.rules.length ? t.rules : [{ label: "Custom rule", percent: t.percent, basis: t.basis, inclusive: t.inclusive }];
      rs.forEach((r, i) => rule(r.label || `Rule ${i + 1}`, r.percent, r.basis, r.inclusive));
      break;
    }
  }
  const passed = quorumOk && lines.every((l) => l.passed);
  return { passed, quorumOk, quorumRequired, lines };
}

export function computeTally(rec: VoteRecord): TallyResult {
  const snap = rec.snapshot;
  const parties = new Map<string, GroupRow>(snap.parties.map((p) => [p.id, { ...p, counts: emptyCounts() }]));
  const factions = new Map<string, GroupRow & { partyId: string }>(
    snap.factions.map((f) => [f.id, { ...f, counts: emptyCounts() }]),
  );
  const coalitions = snap.coalitions.map((c): GroupRow => ({ id: c.id, name: c.name, abbr: c.abbr, color: c.color, counts: emptyCounts() }));
  const coalitionsByParty = new Map<string, number[]>();
  snap.coalitions.forEach((c, i) => c.partyIds.forEach((pid) => coalitionsByParty.set(pid, [...(coalitionsByParty.get(pid) ?? []), i])));
  const independents: GroupRow = { id: "independents", name: "Independents", abbr: "IND", color: "#94a3b8", counts: emptyCounts() };
  const cats = new Map<CategoryId, Counts>();
  const totalsC = emptyCounts();

  snap.deputies.forEach((d, i) => {
    const v = rec.votes[i] ?? "absent";
    add(totalsC, v);
    if (d.partyId && parties.has(d.partyId)) {
      add(parties.get(d.partyId)!.counts, v);
      (coalitionsByParty.get(d.partyId) ?? []).forEach((ci) => add(coalitions[ci].counts, v));
    } else add(independents.counts, v);
    if (d.factionId && factions.has(d.factionId)) add(factions.get(d.factionId)!.counts, v);
    const cat: CategoryId = d.category ?? "unclassified";
    if (!cats.has(cat)) cats.set(cat, emptyCounts());
    add(cats.get(cat)!, v);
  });

  const deputies = snap.deputies.length;
  const totals: Totals = {
    ...totalsC,
    seats: snap.totalSeats,
    vacant: Math.max(0, snap.totalSeats - deputies),
    present: totalsC.for + totalsC.against + totalsC.abstain,
    valid: totalsC.for + totalsC.against,
  };
  return {
    totals,
    parties: [...parties.values()],
    independents,
    factions: [...factions.values()],
    coalitions,
    categories: [...cats.entries()].map(([id, counts]) => ({ id, label: id === "unclassified" ? "No ideology" : CATEGORY_MAP[id].label, color: CATEGORY_MAP[id].color, counts })),
    threshold: evaluateThreshold(rec.issue.threshold, totals),
  };
}

export function pct(n: number, d: number): string {
  return d > 0 ? ((n / d) * 100).toFixed(1) + "%" : "–";
}
