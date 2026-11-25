import type { IdeologyFamilyId, Party, ProjectData, Role } from "./types";
import { deputyList, freeSeats, independents, partyDeputies } from "./parliament";
import { lookupIdeology } from "./voting";

export interface PartyStat {
  party: Party;
  seats: number;
  pct: number;
  factions: number;
}

export interface Stats {
  total: number;
  allocated: number;
  free: number;
  parties: number;
  coalitions: number;
  factions: number;
  independents: number;
  rows: PartyStat[];
  roleSeats: Record<Role, number>;
  majority: number;
  govSeats: number;
  status: string;
  statusKind: "good" | "warn" | "bad" | "info";
  coalitionSeats: { id: string; name: string; abbr: string; color: string; seats: number; parties: string[] }[];
  families: Record<IdeologyFamilyId, number>;
  axes: Record<"economic" | "social" | "authority", Record<string, number>>;
}

export function computeStats(d: ProjectData): Stats {
  const total = d.settings.totalSeats;
  const allocated = deputyList(d).length;
  const rows: PartyStat[] = d.parties.map((party) => {
    const seats = partyDeputies(d, party.id).length;
    return { party, seats, pct: total ? (seats / total) * 100 : 0, factions: d.factions.filter((f) => f.partyId === party.id).length };
  });
  const roleSeats: Record<Role, number> = { government: 0, opposition: 0, confidence: 0, neutral: 0, supporter: 0 };
  for (const r of rows) roleSeats[r.party.role] += r.seats;
  const inds = independents(d);
  for (const i of inds) roleSeats[i.role === "government" || i.role === "opposition" || i.role === "confidence" || i.role === "supporter" ? i.role : "neutral"]++;

  const majority = Math.floor(total / 2) + 1;
  const govSeats = roleSeats.government;
  const support = govSeats + roleSeats.confidence + roleSeats.supporter;
  let status = "";
  let statusKind: Stats["statusKind"] = "info";
  if (govSeats === 0) {
    status = "No government designated";
  } else if (govSeats >= majority) {
    status = `Majority government (${govSeats} seats, ${govSeats - majority + 1} above the ${majority} needed)`;
    statusKind = "good";
  } else if (support >= majority) {
    status = `Minority government backed by confidence & supply (${support} of ${majority} needed)`;
    statusKind = "warn";
  } else {
    status = `Minority government: ${majority - govSeats} seats short of a majority`;
    statusKind = "bad";
  }

  const families = {} as Record<IdeologyFamilyId, number>;
  const axes: Stats["axes"] = { economic: {}, social: {}, authority: {} };
  for (const dep of deputyList(d)) {
    const party = dep.partyId ? d.parties.find((p) => p.id === dep.partyId) : undefined;
    const faction = dep.factionId ? d.factions.find((f) => f.id === dep.factionId) : undefined;
    const ideo = lookupIdeology(d.customIdeologies, dep.ideologyId) ?? lookupIdeology(d.customIdeologies, faction?.ideologyId) ?? lookupIdeology(d.customIdeologies, party?.ideologyId);
    const family: IdeologyFamilyId = ideo?.family ?? "unclassified";
    families[family] = (families[family] ?? 0) + 1;
    for (const axis of ["economic", "social", "authority"] as const) {
      const key = ideo?.positions[axis] === null || !ideo ? "unspecified" : String(ideo.positions[axis]);
      axes[axis][key] = (axes[axis][key] ?? 0) + 1;
    }
  }

  return {
    total,
    allocated,
    free: freeSeats(d),
    parties: d.parties.length,
    coalitions: d.coalitions.length,
    factions: d.factions.length,
    independents: inds.length,
    rows,
    roleSeats,
    majority,
    govSeats,
    status,
    statusKind,
    coalitionSeats: d.coalitions.map((c) => ({
      id: c.id,
      name: c.name,
      abbr: c.abbr,
      color: c.color,
      seats: rows.filter((r) => c.partyIds.includes(r.party.id)).reduce((a, r) => a + r.seats, 0),
      parties: c.partyIds,
    })),
    families,
    axes,
  };
}
