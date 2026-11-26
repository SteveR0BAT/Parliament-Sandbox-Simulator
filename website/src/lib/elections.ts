import { BUILTIN_MAP } from "@/data/ideologies";
import type { IdeologyFamilyId, ProjectData } from "./types";
import { apportion, applyPartyCounts, partyDeputies, type Result } from "./parliament";
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
/** Reallocate party-held seats after an election; independent and vacant seats are preserved. */
export function simulateElection(data: ProjectData, randomness: number, momentumFamily: IdeologyFamilyId | null, momentumStrength: number, random: RandomSource = Math.random): Result {
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
  return applyPartyCounts(data, targets);
}
