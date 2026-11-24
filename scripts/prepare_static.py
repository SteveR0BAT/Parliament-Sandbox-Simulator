#!/usr/bin/env python3
"""Convert the supplied Parliament Sandbox Next.js project for GitHub Pages."""
from __future__ import annotations
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "website"

def replace_once(path: str, old: str, new: str) -> None:
    target = ROOT / path
    content = target.read_text(encoding="utf-8")
    if old not in content:
        raise RuntimeError(f"Expected source text was not found in {path}: {old[:120]!r}")
    target.write_text(content.replace(old, new, 1), encoding="utf-8")

def main() -> None:
    if not (ROOT / "package.json").is_file() or not (ROOT / "src/app/page.tsx").is_file():
        raise SystemExit("The ZIP must contain the Next.js project at its archive root.")

    (ROOT / "next.config.ts").write_text(
        'import type { NextConfig } from "next";\n\n'
        'const nextConfig: NextConfig = {\n'
        '  output: "export",\n'
        '  trailingSlash: true,\n'
        '  basePath: process.env.NODE_ENV === "production" ? "/Parliament-Sandbox-Simulator" : "",\n'
        '  images: { unoptimized: true },\n'
        '};\n\n'
        'export default nextConfig;\n',
        encoding="utf-8",
    )

    store_path = ROOT / "src/lib/store.ts"
    store = store_path.read_text(encoding="utf-8")
    marker = "// ---------------- Client API for persistent projects ----------------"
    if marker not in store:
        raise RuntimeError("Could not find projects API section in src/lib/store.ts")
    store = store[:store.index(marker)] + '''// ---------------- Browser-local API for persistent projects ----------------

const PROJECTS_STORAGE_KEY = "parliament-sandbox:projects:v1";

type StoredProject = {
  id: string;
  name: string;
  data: unknown;
  createdAt: string;
  updatedAt: string;
};

function readStoredProjects(): StoredProject[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(PROJECTS_STORAGE_KEY);
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((item): item is StoredProject =>
    !!item && typeof item === "object" && typeof item.id === "string" &&
    typeof item.name === "string" && typeof item.createdAt === "string" &&
    typeof item.updatedAt === "string" && "data" in item,
  );
}

function writeStoredProjects(projects: StoredProject[]): void {
  if (typeof window === "undefined") throw new Error("Project storage is only available in a browser.");
  window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
}

function makeProjectId(): string {
  return "p_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function summarizeProject(project: StoredProject): ProjectSummary {
  const data = project.data as Partial<ProjectData> | null;
  return {
    id: project.id,
    name: project.name,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    seats: Number(data?.settings?.totalSeats ?? 0) || 0,
    parties: Array.isArray(data?.parties) ? data.parties.length : 0,
    votes: Array.isArray(data?.history) ? data.history.length : 0,
  };
}

export const projectsApi = {
  async list(): Promise<ProjectSummary[]> {
    return readStoredProjects()
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map(summarizeProject);
  },
  async create(name: string, data: unknown): Promise<{ id: string; name: string }> {
    const projects = readStoredProjects();
    const id = makeProjectId();
    const now = new Date().toISOString();
    const project = { id, name: name.trim().slice(0, 120) || "Untitled parliament", data, createdAt: now, updatedAt: now };
    writeStoredProjects([project, ...projects]);
    return { id, name: project.name };
  },
  async get(id: string): Promise<{ id: string; name: string; data: unknown }> {
    const project = readStoredProjects().find((item) => item.id === id);
    if (!project) throw new Error("Project not found");
    return { id: project.id, name: project.name, data: project.data };
  },
  async save(id: string, name: string, data: unknown): Promise<void> {
    const projects = readStoredProjects();
    const index = projects.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("Project not found");
    projects[index] = { ...projects[index], name: name.trim().slice(0, 120) || "Untitled parliament", data, updatedAt: new Date().toISOString() };
    writeStoredProjects(projects);
  },
  async rename(id: string, name: string): Promise<void> {
    const projects = readStoredProjects();
    const index = projects.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("Project not found");
    projects[index] = { ...projects[index], name: name.trim().slice(0, 120) || projects[index].name, updatedAt: new Date().toISOString() };
    writeStoredProjects(projects);
  },
  async remove(id: string): Promise<void> {
    writeStoredProjects(readStoredProjects().filter((item) => item.id !== id));
  },
};

export async function saveNow(): Promise<boolean> {
  const { meta, data } = useStore.getState();
  if (!meta.id) return false;
  useStore.getState().patchUI({ saveState: "saving" });
  try {
    await projectsApi.save(meta.id, meta.name, data);
    const still = useStore.getState();
    useStore.getState().patchUI({ saveState: still.data === data && still.meta.name === meta.name ? "saved" : "dirty", lastSaved: Date.now() });
    return true;
  } catch {
    useStore.getState().patchUI({ saveState: "error" });
    return false;
  }
}

export const deputyListOf = (d: ProjectData) => deputyList(d);
export const independentsOf = (d: ProjectData) => independents(d);
'''
    # Immer draft proxies cannot be passed to the browser structuredClone API.
    # Convert draft values to plain snapshots before any structured cloning.
    store_lines = store.splitlines()
    immer_import_found = False
    for line_index, line in enumerate(store_lines):
        if 'from "immer"' in line or "from 'immer'" in line:
            open_brace = line.find("{")
            close_brace = line.find("}", open_brace + 1)
            if open_brace < 0 or close_brace < 0:
                raise RuntimeError("Could not locate named Immer imports in src/lib/store.ts")
            imported_names = [name.strip() for name in line[open_brace + 1:close_brace].split(",")]
            if "current" not in imported_names:
                store_lines[line_index] = (
                    line[:open_brace + 1] + " current, " + line[open_brace + 1:]
                )
            immer_import_found = True
            break
    if not immer_import_found:
        raise RuntimeError("Could not find Immer import in src/lib/store.ts")
    store = "\n".join(store_lines) + "\n"

    issue_creation_call = "const i = newIssue(d.prefs, partial);"
    if issue_creation_call not in store:
        raise RuntimeError("Could not find newIssue call that receives the Immer prefs draft")
    store = store.replace(
        issue_creation_call,
        "const i = newIssue(current(d.prefs), partial);",
        1,
    )

    duplicate_clone_call = "const c = structuredClone(i);"
    if duplicate_clone_call not in store:
        raise RuntimeError("Could not find issue duplication structuredClone call")
    store = store.replace(
        duplicate_clone_call,
        "const c = structuredClone(current(i));",
        1,
    )

    store_path.write_text(store, encoding="utf-8")

    replace_once("src/components/AppShell.tsx",
        "Could not connect to the database: ",
        "Could not load browser project storage: ")
    replace_once("src/components/ProjectsModal.tsx",
        "Auto-saved to the database. Status: ",
        "Auto-saved in this browser. Status: ")

    replace_once("src/components/VotingPanel.tsx",
        '''          <button
            className="btn btn-primary"
            onClick={() => {
              addIssue({ name: `Issue ${data.issues.length + 1}` });
              setSub("configure");
            }}
          >''',
        '''          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              try {
                const issueId = addIssue({ name: `Issue ${data.issues.length + 1}` });
                const current = useStore.getState();
                if (!current.data.issues.some((item) => item.id === issueId)) {
                  current.toast("The new voting issue could not be created.", "error");
                  return;
                }
                current.patchUI({ activeIssueId: issueId });
                setSub("configure");
              } catch (error) {
                const message = error instanceof Error ? error.message : "Unknown error";
                useStore.getState().toast(`Could not create voting issue: ${message}`, "error");
              }
            }}
          >''')
    voting_panel = (ROOT / "src/components/VotingPanel.tsx").read_text(encoding="utf-8")
    if 'type="button"' not in voting_panel or "const issueId = addIssue" not in voting_panel:
        raise RuntimeError("New Voting Issue hardening was not applied to VotingPanel.tsx")

    # Add crawlable, useful product information without changing the interactive app.
    layout_path = ROOT / "src/app/layout.tsx"
    layout = layout_path.read_text(encoding="utf-8")
    old_metadata = '''export const metadata: Metadata = {
  title: "Parliament Sandbox Simulator",
  description: "Build customizable parliaments, parties, coalitions and factions — and simulate parliamentary votes.",
};'''
    new_metadata = '''export const metadata: Metadata = {
  metadataBase: new URL("https://stever0bat.github.io/Parliament-Sandbox-Simulator/"),
  title: "Parliament Sandbox Simulator – Build Parties, Factions & Voting Systems",
  description: "Build a custom parliament with parties, factions, coalitions, independents and 100+ ideologies. Simulate legislative votes for free in your browser.",
  applicationName: "Parliament Sandbox Simulator",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Parliament Sandbox Simulator",
    title: "Parliament Sandbox Simulator – Build Parties, Factions & Voting Systems",
    description: "Build a custom parliament with parties, factions, coalitions, independents and 100+ ideologies. Simulate legislative votes for free in your browser.",
  },
  twitter: {
    card: "summary",
    title: "Parliament Sandbox Simulator – Build Parties, Factions & Voting Systems",
    description: "Build a custom parliament, create political factions and coalitions, and simulate legislative votes for free in your browser.",
  },
  robots: {
    index: true,
    follow: true,
  },
};'''
    if old_metadata not in layout:
        raise RuntimeError("Could not find the original metadata block in src/app/layout.tsx")
    layout_path.write_text(layout.replace(old_metadata, new_metadata, 1), encoding="utf-8")

    page_path = ROOT / "src/app/page.tsx"
    old_page = '''import { AppShell } from "@/components/AppShell";

export default function Home() {
  return <AppShell />;
}
'''
    new_page = '''import { AppShell } from "@/components/AppShell";
import { SeoContent } from "@/components/SeoContent";

const applicationStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Parliament Sandbox Simulator",
  url: "https://stever0bat.github.io/Parliament-Sandbox-Simulator/",
  description: "Design a custom parliament with parties, factions, coalitions, independent MPs, more than 100 ideologies and configurable parliamentary voting rules.",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function Home() {
  return (
    <>
      <div id="simulator">
        <AppShell />
      </div>
      <SeoContent />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(applicationStructuredData).replace(/</g, "\\\\u003c"),
        }}
      />
    </>
  );
}
'''
    if old_page not in page_path.read_text(encoding="utf-8"):
        raise RuntimeError("Could not find the expected original src/app/page.tsx")
    page_path.write_text(new_page, encoding="utf-8")

    seo_component = ROOT / "src/components/SeoContent.tsx"
    seo_component.write_text('''const sections = [
  {
    title: "Design the parliamentary chamber",
    text: "Set the total number of seats and control the chamber's geometry: row layout, seats per row, seat size, spacing, curvature, orientation and the central area. Build anything from a compact assembly to a very large legislature.",
  },
  {
    title: "Create parties, factions and coalitions",
    text: "Define parties with their own names, abbreviations, colours, leaders and ideological positions. Add internal factions with separate leaders and political identities, form coalitions across parties, and place independent MPs in the chamber.",
  },
  {
    title: "Explore more than 100 political ideologies",
    text: "Use a built-in library of 130 researched ideology entries covering the far left, left, centre-left, centre, centre-right, right, far right and third-way traditions. Search entries, review descriptions and historical context, or create custom ideologies for your own political setting.",
  },
  {
    title: "Simulate parliamentary votes",
    text: "Configure a bill, resolution, motion, amendment or confidence vote. Deputies can vote according to party instructions, faction positions, ideology, individual decisions, random probabilities or mixed rules.",
  },
  {
    title: "Model political discipline and constitutional rules",
    text: "Adjust party and faction discipline, ideological adherence, randomness, abstention and absence probabilities. Set quorum requirements and simple, absolute, qualified, two-thirds, three-fifths or custom majority rules.",
  },
  {
    title: "Review results and export your work",
    text: "Inspect vote totals and deputy-level outcomes, keep a history of votes, compare two recorded votes, and export parliament compositions or voting records in CSV and JSON formats.",
  },
];

export function SeoContent() {
  return (
    <section className="seo-section" aria-labelledby="seo-title">
      <div className="seo-container">
        <div className="seo-intro">
          <p className="seo-eyebrow">FREE · BROWSER-BASED POLITICAL SANDBOX</p>
          <h1 id="seo-title">Parliament Sandbox Simulator – Build Parties, Factions &amp; Voting Systems</h1>
          <p className="seo-lead">
            Design a custom parliament with configurable seats, parties, factions, coalitions, independents and over 100 ideologies. Simulate legislative votes with party discipline, voting behaviour and custom majority rules—all in your browser, completely free.
          </p>
          <p>
            Build a fictional legislature or model a real parliamentary structure. Arrange the chamber, define its political forces and test how legislation moves through a voting system shaped by your own assumptions.
          </p>
          <div className="seo-actions">
            <a className="seo-button" href="#simulator">Open the simulator</a>
            <a className="seo-text-link" href="https://github.com/SteveR0BAT/Parliament-Sandbox-Simulator">View the project on GitHub</a>
          </div>
        </div>

        <div className="seo-feature-grid">
          {sections.map((section) => (
            <article className="seo-feature" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </article>
          ))}
        </div>

        <section className="seo-explainer" aria-labelledby="seo-voting-title">
          <h2 id="seo-voting-title">A parliamentary voting simulator with faction-level detail</h2>
          <p>
            A parliamentary voting simulator is only as useful as the political assumptions behind its results. Here, voting behaviour can be configured at several levels: a party can issue a voting line, factions within that party can take different positions, ideologies can guide deputies, and individual MPs can receive their own decisions. Mixed mode lets different groups follow different decision methods in the same vote.
          </p>
          <p>
            The result is a configurable scenario model, not a prediction of how a real parliament will vote. It calculates outcomes from the parties, factions, deputies, voting behaviour and passage rules that you define.
          </p>
        </section>

        <section className="seo-explainer" aria-labelledby="seo-uses-title">
          <h2 id="seo-uses-title">Who is it for?</h2>
          <p>
            Use the parliament builder for alternate history, fictional elections, political worldbuilding, classroom exercises, constitutional experiments, role-playing settings or exploring how changes in party discipline and coalition structure affect a parliamentary majority.
          </p>
          <p>
            Whether you are designing a fragmented coalition parliament or a fictional assembly with hundreds of deputies, the sandbox gives you control over both the chamber's composition and its voting rules.
          </p>
        </section>

        <section className="seo-faq" aria-labelledby="seo-faq-title">
          <h2 id="seo-faq-title">Frequently asked questions</h2>
          <details>
            <summary>Is Parliament Sandbox Simulator free?</summary>
            <p>Yes. The simulator is free to use in your browser and does not require registration.</p>
          </details>
          <details>
            <summary>Do I need to install anything?</summary>
            <p>No installation is required. Open the website in a modern browser with JavaScript enabled.</p>
          </details>
          <details>
            <summary>How many ideologies are included?</summary>
            <p>The built-in library contains 130 researched ideology entries. You can also create and save custom ideologies in your parliament project.</p>
          </details>
          <details>
            <summary>Where are my parliament projects saved?</summary>
            <p>Projects are saved in your browser's local storage on the device and browser you use. They do not automatically sync to other devices. Export a project as JSON to keep a backup or transfer it to another browser.</p>
          </details>
          <details>
            <summary>Does the voting simulator predict real parliamentary behaviour?</summary>
            <p>No. It is a sandbox that calculates votes from the rules and behaviour settings you configure. Its results represent your scenario assumptions, not a forecast of real MPs or future political events.</p>
          </details>
          <details>
            <summary>Can I export parliamentary data and voting results?</summary>
            <p>Yes. Project compositions and vote records can be exported in supported CSV and JSON formats.</p>
          </details>
        </section>

        <footer className="seo-footer">
          <p>Parliament Sandbox Simulator is an independent browser-based project.</p>
          <a href="#simulator">Return to the parliament builder ↑</a>
        </footer>
      </div>
    </section>
  );
}
''', encoding="utf-8")

    sitemap_path = ROOT / "src/app/sitemap.ts"
    sitemap_path.write_text('''import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://stever0bat.github.io/Parliament-Sandbox-Simulator/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
''', encoding="utf-8")

    styles_path = ROOT / "src/app/globals.css"
    styles = styles_path.read_text(encoding="utf-8")
    seo_style_marker = "/* Search-friendly information section below the interactive simulator. */"
    if seo_style_marker not in styles:
        styles += '''

/* Search-friendly information section below the interactive simulator. */
.seo-section {
  background: var(--bg);
  border-top: 1px solid var(--border);
  color: var(--text);
}
.seo-container {
  max-width: 1160px;
  margin: 0 auto;
  padding: 68px 28px 32px;
}
.seo-intro {
  max-width: 900px;
  margin-bottom: 42px;
}
.seo-eyebrow {
  margin: 0 0 14px;
  color: var(--accent);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .13em;
}
.seo-intro h1 {
  margin: 0 0 18px;
  font-size: clamp(30px, 4.5vw, 48px);
  line-height: 1.08;
  letter-spacing: -.035em;
  font-weight: 850;
}
.seo-intro p,
.seo-explainer p,
.seo-faq p {
  max-width: 820px;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.8;
}
.seo-intro .seo-lead {
  color: var(--text);
  font-size: 18px;
  line-height: 1.65;
  font-weight: 550;
}
.seo-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 24px;
}
.seo-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  padding: 10px 16px;
  background: var(--accent);
  color: var(--accent-text);
  font-size: 13px;
  font-weight: 750;
  text-decoration: none;
}
.seo-button:hover {
  filter: brightness(1.08);
}
.seo-text-link,
.seo-footer a {
  color: var(--accent);
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}
.seo-text-link:hover,
.seo-footer a:hover {
  text-decoration: underline;
}
.seo-feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 54px;
}
.seo-feature {
  padding: 22px;
  border: 1px solid var(--border);
  border-radius: 13px;
  background: var(--panel);
}
.seo-feature h2,
.seo-explainer h2,
.seo-faq h2 {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -.015em;
}
.seo-feature p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.75;
}
.seo-explainer {
  margin: 0 0 38px;
}
.seo-explainer p {
  margin: 10px 0;
}
.seo-faq {
  max-width: 900px;
  margin-top: 42px;
}
.seo-faq details {
  border-top: 1px solid var(--border);
  padding: 15px 2px;
}
.seo-faq details:last-of-type {
  border-bottom: 1px solid var(--border);
}
.seo-faq summary {
  color: var(--text);
  cursor: pointer;
  font-size: 14px;
  font-weight: 750;
}
.seo-faq details p {
  margin: 9px 0 0;
  font-size: 13px;
}
.seo-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 44px;
  padding: 20px 0 0;
  border-top: 1px solid var(--border);
}
.seo-footer p {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
}
@media (max-width: 700px) {
  .seo-container {
    padding: 46px 18px 24px;
  }
  .seo-feature-grid {
    grid-template-columns: 1fr;
  }
  .seo-intro .seo-lead {
    font-size: 16px;
  }
}
'''
    styles_path.write_text(styles, encoding="utf-8")

    shutil.rmtree(ROOT / "src/app/api", ignore_errors=True)
    shutil.rmtree(ROOT / "src/db", ignore_errors=True)
    (ROOT / "drizzle.config.json").unlink(missing_ok=True)

    package_path = ROOT / "package.json"
    package = json.loads(package_path.read_text(encoding="utf-8"))
    package["name"] = "parliament-sandbox-simulator"
    for section, dependencies in {
        "dependencies": ["dotenv", "drizzle-orm", "pg"],
        "devDependencies": [
            "@types/pg",
            "drizzle-kit",
            "typescript-eslint",
            "@typescript-eslint/eslint-plugin",
            "@typescript-eslint/parser",
        ],
    }.items():
        for dependency in dependencies:
            package.get(section, {}).pop(dependency, None)
    package_path.write_text(json.dumps(package, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    for path in (ROOT / "src").rglob("*.ts*"):
        content = path.read_text(encoding="utf-8")
        if 'fetch("/api/' in content or "fetch(`/api/" in content or 'from "@/db/' in content:
            raise RuntimeError(f"API/database dependency remains in {path.relative_to(ROOT)}")
    print("Parliament Sandbox prepared for static GitHub Pages hosting.")

if __name__ == "__main__":
    main()
