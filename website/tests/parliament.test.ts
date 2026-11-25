import assert from "node:assert/strict";
import test from "node:test";
import { apportion } from "../src/lib/parliament";
import { newIssue, sampleProject } from "../src/lib/defaults";
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
