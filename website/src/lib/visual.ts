// Computes how each seat is drawn for the 3 layers + vote overlay. No React here.
import type { Coalition, Deputy, Faction, Layer, Party, ProjectData, Vote, VoteRecord } from "./types";
import type { Focus } from "./store";

export interface SeatStyle {
  fill: string;
  /** fill radius as fraction of seat radius */
  fr: number;
  /** party outline ring (detailed + vote layers) */
  mid?: string;
  /** coalition (or party in vote layer) outer ring */
  ring?: string;
  /** small inner dot (coalition layer) */
  dot?: string;
  opacity: number;
  deputyId: string | null;
  vote?: Vote;
}

export interface RevealState {
  rank: Map<string, number>;
  count: number;
}

export interface SeatLookup {
  partyById: Map<string, Party>;
  factionById: Map<string, Faction>;
  coalitionOfParty: Map<string, Coalition>;
  coalitionsOfParty: Map<string, Coalition[]>;
}

export function buildLookup(d: ProjectData): SeatLookup {
  const coalitionOfParty = new Map<string, Coalition>();
  const coalitionsOfParty = new Map<string, Coalition[]>();
  for (const c of d.coalitions) {
    for (const pid of c.partyIds) {
      if (!coalitionOfParty.has(pid)) coalitionOfParty.set(pid, c);
      coalitionsOfParty.set(pid, [...(coalitionsOfParty.get(pid) ?? []), c]);
    }
  }
  return {
    partyById: new Map(d.parties.map((p) => [p.id, p])),
    factionById: new Map(d.factions.map((f) => [f.id, f])),
    coalitionOfParty,
    coalitionsOfParty,
  };
}

export function inFocus(focus: Focus, dep: Deputy | undefined, lk: SeatLookup, d: ProjectData): boolean {
  if (!focus) return true;
  if (!dep) return false;
  switch (focus.type) {
    case "party":
      return dep.partyId === focus.id;
    case "faction":
      return dep.factionId === focus.id;
    case "coalition": {
      const c = d.coalitions.find((x) => x.id === focus.id);
      return !!c && !!dep.partyId && c.partyIds.includes(dep.partyId);
    }
    case "independents":
      return !dep.partyId;
  }
}

export function computeSeatStyles(
  d: ProjectData,
  layer: Layer,
  focus: Focus,
  record: VoteRecord | null,
  showVotes: boolean,
  reveal: RevealState | null,
  lk: SeatLookup,
): SeatStyle[] {
  const prefs = d.prefs;
  const voteIdx = new Map<string, number>();
  if (showVotes && record) record.snapshot.deputies.forEach((x, i) => voteIdx.set(x.id, i));
  const dim = prefs.dimUnfocused && !!focus;

  return d.seats.map((id): SeatStyle => {
    const dep = id ? d.deputies[id] : undefined;
    if (!dep) {
      return { fill: prefs.unallocatedColor, fr: 0.7, opacity: dim ? 0.12 : 0.4, deputyId: null };
    }
    const party = dep.partyId ? lk.partyById.get(dep.partyId) : undefined;
    const faction = dep.factionId ? lk.factionById.get(dep.factionId) : undefined;
    const coalition = party ? lk.coalitionOfParty.get(party.id) : undefined;
    const baseColor = party ? party.color : dep.color || "#94a3b8";
    const opacity = dim && !inFocus(focus, dep, lk, d) ? 0.15 : 1;

    if (showVotes && record) {
      const i = voteIdx.get(dep.id);
      let fill = prefs.voteColors.pending;
      let vote: Vote | undefined;
      if (i !== undefined) {
        vote = record.votes[i];
        const revealed = !reveal || (reveal.rank.get(dep.id) ?? 0) < reveal.count;
        fill = revealed ? prefs.voteColors[vote] : prefs.voteColors.pending;
        if (!revealed) vote = undefined;
      } else {
        fill = prefs.unallocatedColor;
      }
      return { fill, fr: 0.62, ring: baseColor, opacity, deputyId: dep.id, vote };
    }

    switch (layer) {
      case "standard":
        return {
          fill: baseColor,
          fr: 0.76,
          ring: prefs.coalitionRing && coalition ? coalition.color : undefined,
          opacity,
          deputyId: dep.id,
        };
      case "coalition":
        return coalition
          ? { fill: coalition.color, fr: 0.9, dot: baseColor, opacity, deputyId: dep.id }
          : { fill: baseColor, fr: 0.9, opacity, deputyId: dep.id };
      case "detailed":
        return {
          fill: faction ? faction.color : baseColor,
          fr: 0.56,
          mid: party ? party.color : undefined,
          ring: prefs.coalitionRing && coalition ? coalition.color : undefined,
          opacity,
          deputyId: dep.id,
        };
    }
  });
}
