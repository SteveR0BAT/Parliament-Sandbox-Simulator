import assert from "node:assert/strict";
import test from "node:test";
import { apportion } from "../src/lib/parliament";
import { simulateElection } from "../src/lib/elections";
import { BUILTIN_MAP } from "../src/data/ideologies";
import { newIssue, normalizeProject, sampleProject, PROJECT_VERSION } from "../src/lib/defaults";
import { BUILTIN_IDEOLOGIES, IDEOLOGY_FAMILIES } from "../src/data/ideologies";
import { buildContext, evaluateThreshold, runVoteEngine, type Totals } from "../src/lib/voting";
import type { Threshold } from "../src/lib/types";
const totals = (patch: Partial<Totals> = {}): Totals => ({
  for: 51, against: 49, abstain: 0, absent: 0, total: 100, seats: 100, vacant: 0, present: 100, valid: 100, ...patch,
});
const threshold = (patch: Partial<Threshold> = {}): Threshold => ({
  type: "simple", percent: 50, basis: "present", inclusive: true, quorum: 0, rules: [], ...patch,
});
test("largest-remainder apportionment preserves the requested total", () => {
  assert.deepEqual(apportion([1, 1, 1], 10), [4, 3, 3]);
});
test("apportionment ignores negative and non-finite weights", () => {
  assert.deepEqual(apportion([-5, 2, Number.NaN], 7), [0, 7, 0]);
});
test("zero positive weights allocate no seats", () => {
  assert.deepEqual(apportion([0, -1, 0], 12), [0, 0, 0]);
});
test("simple majority requires more votes for than against", () => {
  assert.equal(evaluateThreshold(threshold(), totals()).passed, true);
  assert.equal(evaluateThreshold(threshold(), totals({ for: 50, against: 50 })).passed, false);
});
test("absolute majority requires more than half of all seats", () => {
  const rule = threshold({ type: "absolute" });
  assert.equal(evaluateThreshold(rule, totals({ for: 50, against: 20 })).passed, false);
  assert.equal(evaluateThreshold(rule, totals({ for: 51, against: 20 })).passed, true);
});
test("quorum is evaluated separately from the majority threshold", () => {
  const result = evaluateThreshold(threshold({ quorum: 60 }), totals({ for: 70, against: 0, present: 55 }));
  assert.equal(result.quorumOk, false); assert.equal(result.passed, false); assert.equal(result.quorumRequired, 60);
});
test("qualified majority uses the selected voting basis", () => {
  const rule = threshold({ type: "qualified", percent: 60, basis: "valid", inclusive: true });
  assert.equal(evaluateThreshold(rule, totals({ for: 60, against: 40 })).passed, true);
  assert.equal(evaluateThreshold(rule, totals({ for: 59, against: 41 })).passed, false);
});
test("seeded deputy voting is reproducible", () => {
  const project = sampleProject(); const issue = newIssue(project.prefs, { mode: "random" });
  const context = buildContext(project);
  assert.deepEqual(runVoteEngine(context, issue, 123456), runVoteEngine(context, issue, 123456));
});
test("random voting uses the configured seed", () => {
  const project = sampleProject();
  const issue = newIssue(project.prefs, { mode: "random",
    behavior: { ...project.prefs.defaults.behavior, randomness: 100, absentProb: 0, abstainProb: 0 },
    random: { pFor: 50, pAgainst: 50, pAbstain: 0, pAbsent: 0 } });
  const context = buildContext(project);
  assert.notDeepEqual(runVoteEngine(context, issue, 1).map((x) => x.vote), runVoteEngine(context, issue, 2).map((x) => x.vote));
});

test("all built-in ideologies have one of ten families and three valid coordinates", () => {
  assert.equal(IDEOLOGY_FAMILIES.length, 10);
  assert.equal(BUILTIN_IDEOLOGIES.length, 130);
  const valid = (n: unknown) => n === null || [-3,-2,-1,0,1,2,3].includes(Number(n));
  for (const ideology of BUILTIN_IDEOLOGIES) {
    assert.ok(IDEOLOGY_FAMILIES.some((family) => family.id === ideology.family), ideology.name);
    assert.ok(valid(ideology.positions.economic), ideology.name + " economic");
    assert.ok(valid(ideology.positions.social), ideology.name + " social");
    assert.ok(valid(ideology.positions.authority), ideology.name + " authority");
  }
});

test("version 1 project migration preserves custom ideology metadata and legacy voting rules", () => {
  const old = sampleProject();
  const raw = {
    ...old,
    version: 1,
    customIdeologies: [{
      id: "custom-legacy",
      name: "Legacy Custom",
      category: "center-left",
      aliases: ["Old name"],
      description: "Keep this wording.",
      economic: "Original economic text",
      social: "Original social text",
      related: [],
      sources: [],
      custom: true,
    }],
    issues: [{
      ...old.issues[0],
      groupPositions: { "far-left": { pos: "for" }, "right": { pos: "against" } },
      legacyGroupPositions: undefined,
    }],
  };
  const migrated = normalizeProject(raw);
  assert.equal(migrated.version, PROJECT_VERSION);
  assert.equal(migrated.customIdeologies[0].family, "unclassified");
  assert.equal(migrated.customIdeologies[0].legacyCategory, "center-left");
  assert.equal(migrated.customIdeologies[0].positions.economic, -1);
  assert.equal(migrated.customIdeologies[0].positions.social, null);
  assert.equal(migrated.customIdeologies[0].positions.authority, null);
  assert.equal(migrated.customIdeologies[0].description, "Keep this wording.");
  assert.equal(migrated.customIdeologies[0].economic, "Original economic text");
  assert.equal(migrated.issues[0].legacyGroupPositions?.["far-left"]?.pos, "for");
  assert.equal(migrated.issues[0].legacyGroupPositions?.right?.pos, "against");
  assert.deepEqual(migrated.issues[0].groupPositions, {});
});

test("socialist and nationalist traditions are split into distinct voting families", () => {
  const familyOf = (id: string) => BUILTIN_IDEOLOGIES.find((i) => i.id === id)?.family;
  assert.equal(familyOf("liberal-socialism"), "socialist-communist");
  assert.equal(familyOf("eco-socialism"), "socialist-communist");
  assert.equal(familyOf("maoism"), "authoritarian-state-communist");
  assert.equal(familyOf("stalinism"), "authoritarian-state-communist");
  assert.equal(familyOf("hoxhaism"), "authoritarian-state-communist");
  assert.equal(familyOf("fascism"), "fascist-ultranationalist");
  assert.equal(familyOf("nazism"), "fascist-ultranationalist");
  assert.equal(familyOf("francoism"), "fascist-ultranationalist");
  assert.equal(familyOf("falangism"), "fascist-ultranationalist");
  assert.equal(familyOf("gaullism"), "nationalist-sovereigntist");
  assert.equal(familyOf("civic-nationalism"), "nationalist-sovereigntist");
});

test("separated ideology families can receive opposing voting instructions", () => {
  const project = sampleProject();
  project.parties = [];
  project.factions = [];
  const ideologyIds = ["liberal-socialism", "maoism", "gaullism", "fascism"];
  project.deputies = Object.fromEntries(ideologyIds.map((ideologyId, index) => {
    const id = `test-deputy-${index}`;
    return [id, {
      id, name: ideologyId, partyId: null, factionId: null, ideologyId,
      color: null, description: "", affiliation: "", role: "neutral" as const,
      behavior: "ideology" as const
    }];
  }));
  const context = buildContext(project);
  const issue = newIssue(project.prefs, {
    mode: "ideology",
    behavior: {
      ...project.prefs.defaults.behavior,
      priority: ["individual"],
      ideologicalAdherence: 100,
      randomness: 0,
      absentProb: 0,
      abstainProb: 0
    },
    groupPositions: {
      "socialist-communist": { pos: "custom", pFor: 100, pAgainst: 0, pAbstain: 0 },
      "authoritarian-state-communist": { pos: "custom", pFor: 0, pAgainst: 100, pAbstain: 0 },
      "nationalist-sovereigntist": { pos: "custom", pFor: 100, pAgainst: 0, pAbstain: 0 },
      "fascist-ultranationalist": { pos: "custom", pFor: 0, pAgainst: 100, pAbstain: 0 }
    }
  });
  assert.deepEqual(runVoteEngine(context, issue, 42).map((outcome) => outcome.vote), ["for", "against", "for", "against"]);
});

test("version 2 family voting rules migrate to both branches of each split family", () => {
  const old = sampleProject();
  const migrated = normalizeProject({
    ...old,
    version: 2,
    issues: [{
      ...old.issues[0],
      groupPositions: {
        "socialist-communist": { pos: "for" },
        "nationalist-sovereigntist": { pos: "against" }
      }
    }]
  });
  assert.equal(migrated.version, PROJECT_VERSION);
  assert.equal(migrated.issues[0].groupPositions["socialist-communist"]?.pos, "for");
  assert.equal(migrated.issues[0].groupPositions["authoritarian-state-communist"]?.pos, "for");
  assert.equal(migrated.issues[0].groupPositions["nationalist-sovereigntist"]?.pos, "against");
  assert.equal(migrated.issues[0].groupPositions["fascist-ultranationalist"]?.pos, "against");
});

test("elections redistribute party seats while preserving independent seats and chamber totals", () => {
  const project = sampleProject();
  const initialTotal = Object.keys(project.deputies).length;
  const initialIndependents = Object.values(project.deputies).filter((deputy) => !deputy.partyId).length;
  const initialPartySeats = initialTotal - initialIndependents;
  const result = simulateElection(project, 8, null, 5, () => 0.37);
  assert.equal(result.ok, true);
  const finalIndependents = Object.values(project.deputies).filter((deputy) => !deputy.partyId).length;
  const finalPartySeats = project.parties.reduce((sum, party) => sum + Object.values(project.deputies).filter((deputy) => deputy.partyId === party.id).length, 0);
  assert.equal(finalIndependents, initialIndependents);
  assert.equal(finalPartySeats, initialPartySeats);
  assert.equal(Object.keys(project.deputies).length, initialTotal);
  assert.equal(project.seatingLocked, false);
});
test("low election volatility keeps every currently represented party in the chamber", () => {
  const project = sampleProject();
  const represented = project.parties.filter((party) => Object.values(project.deputies).some((deputy) => deputy.partyId === party.id));
  const result = simulateElection(project, 1, null, 5, () => 0.5);
  assert.equal(result.ok, true);
  for (const party of represented) assert.ok(Object.values(project.deputies).some((deputy) => deputy.partyId === party.id), `Party ${party.abbr} unexpectedly lost all seats`);
});
test("strong electoral momentum increases the selected ideological family's seat share", () => {
  const source = sampleProject();
  const family = BUILTIN_MAP[source.parties[0].ideologyId!].family;
  const low = structuredClone(source), high = structuredClone(source);
  assert.equal(simulateElection(low, 4, family, 1, () => 0.5).ok, true);
  assert.equal(simulateElection(high, 4, family, 10, () => 0.5).ok, true);
  const countFamilySeats = (project: typeof source) => Object.values(project.deputies).filter((deputy) => {
    if (!deputy.partyId) return false;
    const party = project.parties.find((item) => item.id === deputy.partyId);
    const ideology = party?.ideologyId ? BUILTIN_MAP[party.ideologyId] ?? project.customIdeologies.find((item) => item.id === party.ideologyId) : undefined;
    return ideology?.family === family;
  }).length;
  assert.ok(countFamilySeats(high) > countFamilySeats(low));
});
test("elections reject a chamber with no party-allocated seats", () => {
  const project = sampleProject();
  for (const deputy of Object.values(project.deputies)) if (deputy.partyId) delete project.deputies[deputy.id];
  const result = simulateElection(project, 5, null, 5, () => 0.5);
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.error, /Allocate at least one seat/);
});
