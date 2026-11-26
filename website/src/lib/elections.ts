import { BUILTIN_IDEOLOGIES, BUILTIN_MAP } from "@/data/ideologies";
import type { IdeologyFamilyId, ProjectData } from "./types";
import { apportion, applyPartyCounts, partyDeputies, syncSeats, type Result } from "./parliament";
type RandomSource = () => number;
const draw = (random: RandomSource) => {
  const value = random();
  return Number.isFinite(value) ? Math.max(0, Math.min(1 - Number.EPSILON, value)) : 0.5;
};
function familyOf(data: ProjectData, ideologyId: string | null): IdeologyFamilyId | null {
  if (!ideologyId) return null;
  const ideology = BUILTIN_MAP[ideologyId] ?? data.customIdeologies.find((item) => item.id === ideologyId);
  return ideology && ideology.family !== "unclassified" ? ideology.family : null;
}
function pick<T>(items: T[], random: RandomSource): T | undefined {
  return items.length ? items[Math.floor(draw(random) * items.length)] : undefined;
}
// Internal family links used only by election simulation.
const FAMILY_LINKS: Partial<Record<IdeologyFamilyId, IdeologyFamilyId[]>> = {
  "liberal-libertarian": ["conservative-traditionalist", "social-democratic-reformist", "anarchist-anti-authoritarian", "religious-communitarian", "nationalist-sovereigntist", "civic-ecological-crosscutting"],
  "conservative-traditionalist": ["liberal-libertarian", "social-democratic-reformist", "religious-communitarian", "nationalist-sovereigntist"],
  "social-democratic-reformist": ["liberal-libertarian", "conservative-traditionalist", "socialist-communist", "anarchist-anti-authoritarian", "religious-communitarian", "civic-ecological-crosscutting"],
  "socialist-communist": ["social-democratic-reformist", "anarchist-anti-authoritarian", "authoritarian-state-communist"],
  "authoritarian-state-communist": ["socialist-communist"],
  "anarchist-anti-authoritarian": ["liberal-libertarian", "social-democratic-reformist", "socialist-communist", "religious-communitarian"],
  "nationalist-sovereigntist": ["liberal-libertarian", "conservative-traditionalist", "religious-communitarian", "fascist-ultranationalist", "civic-ecological-crosscutting"],
  "fascist-ultranationalist": ["nationalist-sovereigntist", "religious-communitarian"],
  "religious-communitarian": ["liberal-libertarian", "conservative-traditionalist", "social-democratic-reformist", "anarchist-anti-authoritarian", "nationalist-sovereigntist", "fascist-ultranationalist", "civic-ecological-crosscutting"],
  "civic-ecological-crosscutting": ["liberal-libertarian", "social-democratic-reformist", "nationalist-sovereigntist", "religious-communitarian"],
};
function relatedFamilies(family: IdeologyFamilyId): IdeologyFamilyId[] {
  return FAMILY_LINKS[family] ?? [];
}
function chooseWeighted<T>(items: T[], weights: number[], random: RandomSource): T | undefined {
  if (!items.length) return undefined;
  const total = weights.reduce((sum, weight) => sum + Math.max(0, weight), 0);
  if (total <= 0) return pick(items, random);
  let point = draw(random) * total;
  for (let index = 0; index < items.length; index++) {
    point -= Math.max(0, weights[index] ?? 0);
    if (point < 0) return items[index];
  }
  return items[items.length - 1];
}

/** Apply individual attributes to new deputies and optionally adapt the gaining caucuses. */
export function adaptElectionDeputies(
  data: ProjectData,
  newDeputyIds: string[],
  gainingPartyIds: string[],
  adaptingFactions: boolean,
  random: RandomSource = Math.random,
): void {
  const allIdeologies = [...BUILTIN_IDEOLOGIES, ...data.customIdeologies];
  for (const deputyId of newDeputyIds) {
    const deputy = data.deputies[deputyId];
    if (!deputy || deputy.ideologyId || !deputy.partyId) continue;
    const party = data.parties.find((item) => item.id === deputy.partyId);
    const family = party ? familyOf(data, party.ideologyId) : null;
    if (!family || draw(random) >= 0.07) continue;
    const relatives = relatedFamilies(family);
    const useRelated = relatives.length > 0 && draw(random) < 0.3;
    const selectedFamily = useRelated ? pick(relatives, random) ?? family : family;
    let candidates = allIdeologies.filter((ideology) => ideology.family === selectedFamily);
    if (!candidates.length && useRelated) {
      const available = relatives.filter((item) => allIdeologies.some((ideology) => ideology.family === item));
      const fallbackFamily = pick(available, random);
      if (fallbackFamily) candidates = allIdeologies.filter((ideology) => ideology.family === fallbackFamily);
    }
    const ideology = pick(candidates, random);
    if (ideology) deputy.ideologyId = ideology.id;
  }

  if (!adaptingFactions) return;
  for (const partyId of gainingPartyIds) {
    const party = data.parties.find((item) => item.id === partyId);
    if (!party) continue;
    const factions = data.factions.filter((item) => item.partyId === partyId);
    if (!factions.length) continue;
    for (const deputy of partyDeputies(data, partyId)) {
      const anchor = familyOf(data, deputy.ideologyId) ?? familyOf(data, party.ideologyId);
      const weights = factions.map((faction) => {
        const factionFamily = familyOf(data, faction.ideologyId);
        if (!anchor || !factionFamily) return 1;
        if (factionFamily === anchor) return 6;
        return relatedFamilies(anchor).includes(factionFamily) ? 3 : 1;
      });
      const selected = chooseWeighted(factions, weights, random);
      if (selected) deputy.factionId = selected.id;
    }
  }
  syncSeats(data);
}

/** Reallocate party-held seats after an election; independent and vacant seats are preserved. */
export function simulateElection(data: ProjectData, randomness: number, momentumFamily: IdeologyFamilyId | null, momentumStrength: number, random: RandomSource = Math.random, adaptingFactions = false): Result {
  if (!Number.isInteger(randomness) || randomness < 1 || randomness > 10) return { ok: false, error: "Election volatility must be between 1 and 10." };
  if (!Number.isInteger(momentumStrength) || momentumStrength < 1 || momentumStrength > 10) return { ok: false, error: "Momentum strength must be between 1 and 10." };
  if (!data.parties.length) return { ok: false, error: "Create at least one party before holding an election." };
  const current = data.parties.map((party) => partyDeputies(data, party.id).length);
  const partySeats = current.reduce((sum, seats) => sum + seats, 0);
  if (partySeats < 1) return { ok: false, error: "Allocate at least one seat to a party before holding an election." };
  const families = data.parties.map((party) => familyOf(data, party.ideologyId));
  const highVolatility = randomness >= 6;
  const alternativeOutcome = highVolatility && draw(random) < 0.5;
  let rareFamily: IdeologyFamilyId | null = null;
  let leastRepresentedParty: string | null = null;
  if (alternativeOutcome) {
    const counts = new Map<IdeologyFamilyId, number>();
    families.forEach((family, index) => {
      if (family && current[index] > 0) counts.set(family, (counts.get(family) ?? 0) + 1);
    });
    const entries = [...counts.entries()];
    if (entries.length) {
      const minimumFamilyCount = Math.min(...entries.map(([, count]) => count));
      rareFamily = pick(entries.filter(([, count]) => count === minimumFamilyCount).map(([family]) => family), random) ?? null;
      if (rareFamily) {
        const eligible = data.parties.map((party, index) => ({ id: party.id, seats: current[index], family: families[index] }))
          .filter((party) => party.family === rareFamily && party.seats > 0);
        const minimumSeats = Math.min(...eligible.map((party) => party.seats));
        leastRepresentedParty = pick(eligible.filter((party) => party.seats === minimumSeats).map((party) => party.id), random) ?? null;
      }
    }
  }
  const volatility = highVolatility ? 0.48 + (randomness - 6) * 0.2 : 0.055 + randomness * 0.06;
  const weights = data.parties.map((party, index) => {
    let weight = Math.max(0.15, current[index]) * Math.exp((draw(random) * 2 - 1) * volatility);
    if (alternativeOutcome && rareFamily && families[index] === rareFamily) weight *= 1.8 + (randomness - 6) * 0.55;
    if (alternativeOutcome && leastRepresentedParty === party.id) weight *= 1.5 + (randomness - 6) * 0.25;
    if (momentumFamily && families[index] === momentumFamily) weight *= 1.08 * Math.pow(1.85, momentumStrength - 1);
    return weight;
  });
  const minimums = current.map((seats) => (randomness <= 5 && seats > 0 ? 1 : 0));
  const floorTotal = minimums.reduce<number>((sum, seats) => sum + seats, 0);
  const apportioned = apportion(weights, partySeats - floorTotal);
  const targets: Record<string, number> = {};
  data.parties.forEach((party, index) => (targets[party.id] = minimums[index] + apportioned[index]));
  data.seatingLocked = false;
  const previousDeputies = new Set(Object.keys(data.deputies));
  const result = applyPartyCounts(data, targets);
  if (!result.ok) return result;
  const newDeputyIds = Object.keys(data.deputies).filter((id) => !previousDeputies.has(id));
  const gainingPartyIds = data.parties.filter((party, index) => targets[party.id] > current[index]).map((party) => party.id);
  adaptElectionDeputies(data, newDeputyIds, gainingPartyIds, adaptingFactions, random);
  return result;
}
