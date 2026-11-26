import assert from "node:assert/strict";
import test from "node:test";
import { defaultGovernmentPositions, normalizeProject, sampleProject } from "../src/lib/defaults";

test("new projects include the standard government offices", () => {
  const project = sampleProject();
  const titles = project.governmentPositions.map((position) => position.title);
  for (const title of [
    "President",
    "Prime Minister",
    "Ministry of Education",
    "Ministry of Economy",
    "Ministry of Healthcare",
    "Ministry of Defence",
  ]) {
    assert.ok(titles.includes(title), `Missing standard office: ${title}`);
  }
  assert.equal(new Set(project.governmentPositions.map((position) => position.id)).size, titles.length);
});

test("legacy projects receive the default government offices during normalization", () => {
  const legacy = { ...sampleProject(), version: 3 } as Record<string, unknown>;
  delete legacy.governmentPositions;
  const normalized = normalizeProject(legacy);
  assert.ok(normalized.governmentPositions.length >= 6);
  assert.ok(normalized.governmentPositions.some((position) => position.title === "Prime Minister"));
});

test("normalization preserves custom positions and an intentionally empty office list", () => {
  const base = sampleProject();
  const custom = {
    id: "custom-office",
    title: "Ministry of Shit & Giggles",
    description: "A deliberately unconventional sandbox ministry.",
    deputyId: null,
    externalName: "",
    custom: true,
  };
  const withCustom = normalizeProject({ ...base, governmentPositions: [custom] });
  assert.deepEqual(withCustom.governmentPositions, [custom]);
  const empty = normalizeProject({ ...base, governmentPositions: [] });
  assert.deepEqual(empty.governmentPositions, []);
});

test("default government-position templates can be independently instantiated", () => {
  const a = defaultGovernmentPositions();
  const b = defaultGovernmentPositions();
  assert.notEqual(a[0].id, b[0].id);
});
