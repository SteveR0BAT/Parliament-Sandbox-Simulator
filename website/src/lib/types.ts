// Core domain types. Political distinctions are preserved in the model:
//  - a Coalition is NOT a party (it only references party ids)
//  - a Faction is NOT a party (it belongs to exactly one party)
//  - an Independent is a Deputy with partyId === null

export type LegacyCategoryId = "far-right" | "right" | "center-right" | "center" | "center-left" | "left" | "far-left" | "third-way" | "unclassified";
export type IdeologyFamilyId = "liberal-libertarian" | "conservative-traditionalist" | "social-democratic-reformist" | "socialist-communist" | "authoritarian-state-communist" | "anarchist-anti-authoritarian" | "nationalist-sovereigntist" | "fascist-ultranationalist" | "religious-communitarian" | "civic-ecological-crosscutting" | "unclassified";
export type AxisValue = -3 | -2 | -1 | 0 | 1 | 2 | 3;
export interface IdeologyPositions { economic: AxisValue | null; social: AxisValue | null; authority: AxisValue | null; }

export interface Source {
  title: string;
  url: string;
}

export interface Ideology {
  id: string;
  name: string;
  family: IdeologyFamilyId;
  positions: IdeologyPositions;
  /** Original one-dimensional category retained only for saved-project voting compatibility. */
  legacyCategory?: LegacyCategoryId;
  aliases: string[];
  description: string;
  economic: string;
  social: string;
  related: string[];
  history?: string;
  sources: Source[];
  /** Classification is contested among scholars */
  disputed?: boolean;
  note?: string;
  custom?: boolean;
  extra?: string;
}

export type Vote = "for" | "against" | "abstain" | "absent";
export type Position =
  | "strongFor"
  | "for"
  | "mostlyFor"
  | "neutral"
  | "mostlyAgainst"
  | "against"
  | "strongAgainst"
  | "custom";

export interface PositionSpec {
  pos: Position;
  /** Only used when pos === "custom" (percentages, normalised at use time) */
  pFor?: number;
  pAgainst?: number;
  pAbstain?: number;
}

export type Role = "government" | "opposition" | "confidence" | "neutral" | "supporter";

export interface MetaEntry {
  key: string;
  value: string;
}

export interface Party {
  id: string;
  name: string;
  abbr: string;
  color: string;
  leader: string;
  ideologyId: string | null;
  description: string;
  symbol: string; // emoji / short text symbol or image URL
  meta: MetaEntry[];
  role: Role;
}

export interface Faction {
  id: string;
  partyId: string;
  name: string;
  abbr: string;
  color: string;
  ideologyId: string | null;
  description: string;
  leader: string;
}

export interface Coalition {
  id: string;
  name: string;
  abbr: string;
  color: string;
  description: string;
  partyIds: string[];
  leader: string;
  orientation: string;
  ideologyId: string | null;
}

export type IndependentBehavior = "ideology" | "random" | "for" | "against" | "abstain";

export interface Deputy {
  id: string;
  name: string;
  partyId: string | null; // null => independent
  factionId: string | null;
  ideologyId: string | null; // individual ideology
  color: string | null; // independents' own colour
  description: string;
  affiliation: string; // optional political affiliation text (independents)
  role: Role; // designation for independents
  behavior: IndependentBehavior; // voting behaviour for independents
  isLeader?: boolean;
}

export type RowMode = "auto" | "rows" | "perRow";
export type Orientation = "up" | "right" | "down" | "left";

export type DeputyNameStyle =
  | "multicultural" | "american" | "british" | "french" | "german"
  | "russian" | "italian" | "spanish" | "portuguese" | "turkish"
  | "georgian" | "hebrew" | "arabic" | "chinese" | "indian"
  | "korean" | "japanese" | "african";

export interface ChamberSettings {
  genericDeputyNames: DeputyNameStyle;
  totalSeats: number;
  rowMode: RowMode;
  rows: number;
  seatsPerRow: number;
  seatRadius: number;
  seatSpacing: number; // horizontal gap between neighbours (units)
  rowSpacing: number; // vertical gap between rows (units)
  innerRadius: number; // distance centre -> first row's inner edge
  centerPadding: number; // reserved empty space around the centre
  arcAngle: number; // degrees of sweep (curvature)
  rotation: number; // degrees
  orientation: Orientation;
  outerMode: "auto" | "fixed";
  outerRadius: number;
  width: number; // chamber view width (units)
  height: number; // chamber view height (units)
  autoFit: boolean;
  seatOrder: "wedge" | "rows";
  groupCoalitions: boolean;
}

export type ThresholdType =
  | "simple"
  | "absolute"
  | "qualified"
  | "twoThirds"
  | "threeFifths"
  | "custom";
export type ThresholdBasis = "all" | "present" | "valid";

export interface ThresholdRule {
  label: string;
  percent: number;
  basis: ThresholdBasis;
  inclusive: boolean;
}

export interface Threshold {
  type: ThresholdType;
  percent: number; // used by qualified / custom (first rule)
  basis: ThresholdBasis;
  inclusive: boolean;
  quorum: number; // % of all seats that must be present (0 = none)
  rules: ThresholdRule[]; // custom constitutional rules (all must pass)
}

export type VotingMode = "party" | "ideology" | "faction" | "individual" | "random" | "mixed";
export type MixedMethod = "party" | "faction" | "ideology" | "random";
export type IdeologySource = "individual" | "faction" | "party";

export interface Behavior {
  partyDiscipline: number; // 0-100
  factionDiscipline: number; // 0-100
  ideologicalAdherence: number; // 0-100
  randomness: number; // 0-100
  abstainProb: number; // 0-100
  absentProb: number; // 0-100
  priority: IdeologySource[];
  /** What a deputy does when nothing configured applies */
  unsetDecision: Vote | "random";
  partyDisciplineOverrides: Record<string, number>;
}

export interface RandomProbs {
  pFor: number;
  pAgainst: number;
  pAbstain: number;
  pAbsent: number;
}

export interface Issue {
  id: string;
  name: string;
  description: string;
  background: string;
  category: string;
  notes: string;
  votingType: "bill" | "resolution" | "motion" | "amendment" | "confidence" | "other";
  mode: VotingMode;
  groupPositions: Partial<Record<IdeologyFamilyId, PositionSpec>>;
  /** Old category-level voting rules are used only when no new family rule is configured. */
  legacyGroupPositions?: Partial<Record<LegacyCategoryId, PositionSpec>>;
  ideologyPositions: Record<string, PositionSpec>;
  partyVotes: Record<string, Vote>;
  factionVotes: Record<string, Vote>;
  individualVotes: Record<string, Vote>;
  mixedRules: Record<string, MixedMethod>;
  behavior: Behavior;
  random: RandomProbs;
  threshold: Threshold;
}

export interface Snapshot {
  totalSeats: number;
  parties: { id: string; name: string; abbr: string; color: string }[];
  factions: { id: string; partyId: string; name: string; abbr: string; color: string }[];
  coalitions: { id: string; name: string; abbr: string; color: string; partyIds: string[] }[];
  deputies: {
    id: string;
    name: string;
    partyId: string | null;
    factionId: string | null;
    family?: IdeologyFamilyId | null;
    legacyCategory?: LegacyCategoryId | null;
    positions?: IdeologyPositions | null;
    ideology: string;
  }[];
}

export interface VoteRecord {
  id: string;
  issueId: string;
  issue: Issue;
  createdAt: number;
  seed: number;
  snapshot: Snapshot;
  votes: Vote[]; // aligned with snapshot.deputies
  reasons: string[]; // aligned with snapshot.deputies
}

export interface VoteColors {
  for: string;
  against: string;
  abstain: string;
  absent: string;
  pending: string;
}

export interface Prefs {
  voteColors: VoteColors;
  unallocatedColor: string;
  coalitionRing: boolean;
  ringWidth: number; // 0.05 - 0.3 of radius
  showSeatNumbers: boolean;
  animateVotes: boolean;
  animationSpeed: number; // 0.25 - 3
  animateChanges: boolean;
  dimUnfocused: boolean;
  legend: {
    parties: boolean;
    factions: boolean;
    coalitions: boolean;
    independents: boolean;
    vacant: boolean;
    visual: boolean;
    voteColors: boolean;
  };
  ideology: {
    showSources: boolean;
    showDisputed: boolean;
    hiddenFamilies: IdeologyFamilyId[];
  };
  defaults: {
    mode: VotingMode;
    behavior: Behavior;
    random: RandomProbs;
    threshold: Threshold;
  };
}

export interface GovernmentPosition {
  id: string;
  title: string;
  description: string;
  /** A sitting deputy may be appointed only when their party is designated Government. */
  deputyId: string | null;
  /** Allows external appointees and non-deputy officeholders for roleplay scenarios. */
  externalName: string;
  custom?: boolean;
}

export interface ProjectData {
  version: number;
  settings: ChamberSettings;
  prefs: Prefs;
  parties: Party[];
  factions: Faction[];
  coalitions: Coalition[];
  deputies: Record<string, Deputy>;
  seats: (string | null)[];
  seatingLocked: boolean;
  customIdeologies: Ideology[];
  issues: Issue[];
  history: VoteRecord[];
  governingCoalitionId: string | null;
  governmentPositions: GovernmentPosition[];
}

export type Layer = "standard" | "coalition" | "detailed";
