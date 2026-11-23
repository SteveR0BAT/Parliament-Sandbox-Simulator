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
    store_path.write_text(store, encoding="utf-8")

    replace_once("src/components/AppShell.tsx",
        "Could not connect to the database: ",
        "Could not load browser project storage: ")
    replace_once("src/components/ProjectsModal.tsx",
        "Auto-saved to the database. Status: ",
        "Auto-saved in this browser. Status: ")

    replace_once("src/components/VotingPanel.tsx",
        ```          <button
            className="btn btn-primary"
            onClick={() => {
              addIssue({ name: `Issue ${data.issues.length + 1}` });
              setSub("configure");
            }}
          >```,
        ```          <button
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
          >```)
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
