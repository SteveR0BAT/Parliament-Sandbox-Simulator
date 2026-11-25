import type { ProjectData, VoteRecord } from "./types";
import { computeTally, lookupIdeology, VOTE_LABELS } from "./voting";
import { IDEOLOGY_FAMILY_MAP, formatAxisPosition } from "@/data/ideologies";
import { deputyList } from "./parliament";

export function downloadFile(filename: string, text: string, mime = "text/plain") {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const safeName = (s: string) => s.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "").toLowerCase() || "parliament";

export function exportProjectJSON(name: string, data: ProjectData) {
  const payload = { format: "parliament-sandbox", version: data.version, name, exportedAt: new Date().toISOString(), data };
  downloadFile(`${safeName(name)}.parliament.json`, JSON.stringify(payload, null, 2), "application/json");
}

/** Accepts either the wrapped export format or a raw project data object. */
export function parseImport(text: string): { name: string; data: unknown } {
  let obj: unknown;
  try {
    obj = JSON.parse(text);
  } catch {
    throw new Error("File is not valid JSON.");
  }
  if (typeof obj !== "object" || obj === null) throw new Error("JSON does not contain a parliament project.");
  const o = obj as Record<string, unknown>;
  if (o.format === "parliament-sandbox" && typeof o.data === "object" && o.data) {
    return { name: typeof o.name === "string" ? o.name : "Imported parliament", data: o.data };
  }
  if (o.settings && o.parties) return { name: typeof o.name === "string" ? o.name : "Imported parliament", data: o };
  throw new Error("This file does not look like a Parliament Sandbox export (missing settings/parties).");
}

const esc = (v: unknown) => {
  const s = String(v ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const row = (cells: unknown[]) => cells.map(esc).join(",");

export function compositionCSV(d: ProjectData): string {
  const lines: string[] = [];
  lines.push(row(["# Parties"]));
  lines.push(row(["Party", "Abbreviation", "Leader", "Ideology", "Ideology family", "Economic position", "Social position", "Political authority", "Seats", "Share %", "Role", "Coalitions", "Color"]));
  for (const p of d.parties) {
    const seats = deputyList(d).filter((x) => x.partyId === p.id).length;
    const ideology = lookupIdeology(d.customIdeologies, p.ideologyId);
    lines.push(
      row([
        p.name, p.abbr, p.leader, ideology?.name ?? "", ideology ? IDEOLOGY_FAMILY_MAP[ideology.family].label : "",
        ideology ? formatAxisPosition("economic", ideology.positions.economic) : "",
        ideology ? formatAxisPosition("social", ideology.positions.social) : "",
        ideology ? formatAxisPosition("authority", ideology.positions.authority) : "", seats,
        ((seats / d.settings.totalSeats) * 100).toFixed(2), p.role,
        d.coalitions.filter((c) => c.partyIds.includes(p.id)).map((c) => c.abbr || c.name).join("; "), p.color,
      ]),
    );
  }
  lines.push("");
  lines.push(row(["# Seats"]));
  lines.push(row(["Seat", "Deputy", "Party", "Faction", "Coalitions", "Individual ideology", "Ideology family", "Economic position", "Social position", "Political authority", "Independent role"]));
  d.seats.forEach((id, i) => {
    const dep = id ? d.deputies[id] : undefined;
    if (!dep) return lines.push(row([i + 1, "(vacant)", "", "", "", "", ""]));
    const p = d.parties.find((x) => x.id === dep.partyId);
    const f = d.factions.find((x) => x.id === dep.factionId);
    const ideology = lookupIdeology(d.customIdeologies, dep.ideologyId);
    lines.push(
      row([
        i + 1, dep.name, p ? p.name : "Independent", f?.name ?? "",
        p ? d.coalitions.filter((c) => c.partyIds.includes(p.id)).map((c) => c.abbr || c.name).join("; ") : "",
        ideology?.name ?? "", ideology ? IDEOLOGY_FAMILY_MAP[ideology.family].label : "",
        ideology ? formatAxisPosition("economic", ideology.positions.economic) : "",
        ideology ? formatAxisPosition("social", ideology.positions.social) : "",
        ideology ? formatAxisPosition("authority", ideology.positions.authority) : "", p ? "" : dep.role,
      ]),
    );
  });
  return lines.join("\n");
}

export function voteCSV(rec: VoteRecord): string {
  const t = computeTally(rec);
  const L: string[] = [];
  L.push(row(["# Vote", rec.issue.name]));
  L.push(row(["Date", new Date(rec.createdAt).toISOString()]));
  L.push(row(["Mode", rec.issue.mode]));
  L.push(row(["Result", t.threshold.passed ? "PASSED" : "FAILED"]));
  L.push(row(["Seats", t.totals.seats, "Present", t.totals.present, "Absent", t.totals.absent, "For", t.totals.for, "Against", t.totals.against, "Abstain", t.totals.abstain]));
  L.push("");
  L.push(row(["# By party"]));
  L.push(row(["Party", "For", "Against", "Abstain", "Absent", "Total"]));
  for (const p of t.parties) L.push(row([p.name, p.counts.for, p.counts.against, p.counts.abstain, p.counts.absent, p.counts.total]));
  L.push(row(["Independents", t.independents.counts.for, t.independents.counts.against, t.independents.counts.abstain, t.independents.counts.absent, t.independents.counts.total]));
  L.push("");
  L.push(row(["# By faction"]));
  L.push(row(["Faction", "For", "Against", "Abstain", "Absent"]));
  for (const f of t.factions) L.push(row([f.name, f.counts.for, f.counts.against, f.counts.abstain, f.counts.absent]));
  L.push("");
  L.push(row(["# By coalition"]));
  L.push(row(["Coalition", "For", "Against", "Abstain", "Absent"]));
  for (const c of t.coalitions) L.push(row([c.name, c.counts.for, c.counts.against, c.counts.abstain, c.counts.absent]));
  L.push("");
  L.push(row(["# Deputies"]));
  L.push(row(["Deputy", "Party", "Faction", "Ideology", "Ideology family", "Economic position", "Social position", "Political authority", "Vote", "Why"]));
  rec.snapshot.deputies.forEach((x, i) => {
    const p = rec.snapshot.parties.find((y) => y.id === x.partyId);
    const f = rec.snapshot.factions.find((y) => y.id === x.factionId);
    const family = x.family ?? "unclassified";
    L.push(row([x.name, p?.name ?? "Independent", f?.name ?? "", x.ideology, IDEOLOGY_FAMILY_MAP[family].label,
      x.positions ? formatAxisPosition("economic", x.positions.economic) : "",
      x.positions ? formatAxisPosition("social", x.positions.social) : "",
      x.positions ? formatAxisPosition("authority", x.positions.authority) : "",
      VOTE_LABELS[rec.votes[i]], rec.reasons[i]]));
  });
  return L.join("\n");
}
