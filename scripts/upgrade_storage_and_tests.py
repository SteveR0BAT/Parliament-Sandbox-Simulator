#!/usr/bin/env python3
from __future__ import annotations
import json
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1] / "website"

STORAGE = r"""// Browser-local project storage using IndexedDB.
// The old localStorage project collection is migrated but deliberately not deleted.
export interface StoredProject { id: string; name: string; data: unknown; createdAt: string; updatedAt: string; }
export interface ProjectBackup { id: string; projectId: string; projectName: string; data: unknown; createdAt: string; }
const DB = "parliament-sandbox";
const PROJECTS = "projects";
const BACKUPS = "backups";
const META = "meta";
const LEGACY_KEY = "parliament-sandbox:projects:v1";
const MAX_BACKUPS = 3;
let connection: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("IndexedDB is unavailable in this browser."));
  if (connection) return connection;
  connection = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(PROJECTS)) db.createObjectStore(PROJECTS, { keyPath: "id" });
      if (!db.objectStoreNames.contains(BACKUPS)) {
        const store = db.createObjectStore(BACKUPS, { keyPath: "id" });
        store.createIndex("projectId", "projectId", { unique: false });
      }
      if (!db.objectStoreNames.contains(META)) db.createObjectStore(META, { keyPath: "key" });
    };
    req.onsuccess = () => {
      req.result.onversionchange = () => { req.result.close(); connection = null; };
      resolve(req.result);
    };
    req.onerror = () => reject(req.error ?? new Error("Could not open IndexedDB."));
    req.onblocked = () => reject(new Error("Close other simulator tabs to finish upgrading project storage."));
  });
  return connection;
}
function result<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB request failed."));
  });
}
function done(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(tx.error ?? new Error("IndexedDB transaction aborted."));
    tx.onerror = () => reject(tx.error ?? new Error("IndexedDB transaction failed."));
  });
}
async function findProject(id: string): Promise<StoredProject | undefined> {
  const db = await openDb();
  const tx = db.transaction(PROJECTS, "readonly");
  const item = await result(tx.objectStore(PROJECTS).get(id)) as StoredProject | undefined;
  await done(tx);
  return item;
}
async function backupsFor(id: string): Promise<ProjectBackup[]> {
  const db = await openDb();
  const tx = db.transaction(BACKUPS, "readonly");
  const items = await result(tx.objectStore(BACKUPS).index("projectId").getAll(id)) as ProjectBackup[];
  await done(tx);
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
async function createSnapshot(project: StoredProject): Promise<void> {
  const existing = await backupsFor(project.id);
  const snapshot: ProjectBackup = {
    id: "b_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 9),
    projectId: project.id, projectName: project.name,
    data: structuredClone(project.data), createdAt: new Date().toISOString(),
  };
  const db = await openDb();
  const tx = db.transaction(BACKUPS, "readwrite");
  const store = tx.objectStore(BACKUPS);
  store.put(snapshot);
  for (const old of existing.slice(MAX_BACKUPS - 1)) store.delete(old.id);
  await done(tx);
}

export async function migrateLegacyProjects(): Promise<void> {
  if (typeof window === "undefined") return;
  const db = await openDb();
  const check = db.transaction(META, "readonly");
  const flag = await result(check.objectStore(META).get("legacy-localStorage-v1"));
  await done(check);
  if (flag) return;
  let legacy: unknown[] = [];
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) legacy = parsed;
  } catch { /* Keep the new store usable when old data is malformed. */ }
  const read = db.transaction(PROJECTS, "readonly");
  const oldProjects = await result(read.objectStore(PROJECTS).getAll()) as StoredProject[];
  await done(read);
  const ids = new Set(oldProjects.map((p) => p.id));
  const tx = db.transaction([PROJECTS, META], "readwrite");
  for (const value of legacy) {
    if (!value || typeof value !== "object") continue;
    const p = value as Partial<StoredProject>;
    if (typeof p.id !== "string" || ids.has(p.id) || typeof p.name !== "string" ||
        typeof p.createdAt !== "string" || typeof p.updatedAt !== "string" || !("data" in p)) continue;
    tx.objectStore(PROJECTS).put(p as StoredProject);
  }
  tx.objectStore(META).put({ key: "legacy-localStorage-v1", completedAt: new Date().toISOString() });
  await done(tx);
}

export const projectsStorage = {
  async list(): Promise<StoredProject[]> {
    const db = await openDb(); const tx = db.transaction(PROJECTS, "readonly");
    const rows = await result(tx.objectStore(PROJECTS).getAll()) as StoredProject[];
    await done(tx); return rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  async create(name: string, data: unknown): Promise<{ id: string; name: string }> {
    const now = new Date().toISOString();
    const p: StoredProject = { id: "p_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 9),
      name: name.trim().slice(0, 120) || "Untitled parliament", data: structuredClone(data), createdAt: now, updatedAt: now };
    const db = await openDb(); const tx = db.transaction(PROJECTS, "readwrite");
    tx.objectStore(PROJECTS).add(p); await done(tx); await createSnapshot(p);
    return { id: p.id, name: p.name };
  },
  async get(id: string): Promise<StoredProject> {
    const p = await findProject(id); if (!p) throw new Error("Project not found"); return p;
  },
  async save(id: string, name: string, data: unknown): Promise<void> {
    const old = await findProject(id); if (!old) throw new Error("Project not found");
    if (JSON.stringify(old.data) !== JSON.stringify(data)) await createSnapshot(old);
    const p = { ...old, name: name.trim().slice(0, 120) || "Untitled parliament",
      data: structuredClone(data), updatedAt: new Date().toISOString() };
    const db = await openDb(); const tx = db.transaction(PROJECTS, "readwrite");
    tx.objectStore(PROJECTS).put(p); await done(tx);
  },
  async rename(id: string, name: string): Promise<void> {
    const old = await findProject(id); if (!old) throw new Error("Project not found");
    const db = await openDb(); const tx = db.transaction(PROJECTS, "readwrite");
    tx.objectStore(PROJECTS).put({ ...old, name: name.trim().slice(0, 120) || old.name, updatedAt: new Date().toISOString() });
    await done(tx);
  },
  async remove(id: string): Promise<void> {
    const db = await openDb(); const tx = db.transaction([PROJECTS, BACKUPS], "readwrite");
    tx.objectStore(PROJECTS).delete(id);
    const keys = await result(tx.objectStore(BACKUPS).index("projectId").getAllKeys(id));
    for (const key of keys) tx.objectStore(BACKUPS).delete(key);
    await done(tx);
  },
  async listBackups(id: string): Promise<ProjectBackup[]> { return backupsFor(id); },
  async createBackup(id: string): Promise<void> {
    const p = await findProject(id); if (!p) throw new Error("Project not found"); await createSnapshot(p);
  },
  async restoreBackup(id: string, backupId: string): Promise<void> {
    const list = await backupsFor(id); const backup = list.find((x) => x.id === backupId);
    if (!backup) throw new Error("Recovery snapshot not found");
    const current = await findProject(id); if (!current) throw new Error("Project not found");
    await createSnapshot(current);
    const restored = { ...current, name: backup.projectName, data: structuredClone(backup.data), updatedAt: new Date().toISOString() };
    const db = await openDb(); const tx = db.transaction(PROJECTS, "readwrite");
    tx.objectStore(PROJECTS).put(restored); await done(tx);
  },
};
"""

def main() -> None:
    store_path = ROOT / "src/lib/store.ts"
    store = store_path.read_text(encoding="utf-8")
    if 'from "./projectStorage"' not in store:
        store = store.replace('import { create } from "zustand";',
            'import { create } from "zustand";\nimport { migrateLegacyProjects, projectsStorage, type ProjectBackup } from "./projectStorage";', 1)
    if 'import { current, produce } from "immer";' not in store:
        store = store.replace('import { produce } from "immer";', 'import { current, produce } from "immer";', 1)
    store = store.replace("structuredClone(p)", "structuredClone(current(p))", 1)
    store = store.replace("structuredClone(f)", "structuredClone(current(f))", 1)
    store = store.replace("structuredClone(i)", "structuredClone(current(i))", 1)
    start = "// ---------------- Browser-local API for persistent projects ----------------"
    end = "export const deputyListOf"
    a = store.find(start); b = store.find(end, a + len(start)) if a >= 0 else -1
    if a < 0 or b < 0: raise RuntimeError("Could not locate project API block in store.ts")
    replacement = r'''// ---------------- IndexedDB API for persistent browser projects ----------------
function summarizeProject(project: Awaited<ReturnType<typeof projectsStorage.get>>): ProjectSummary {
  const data = project.data as Partial<ProjectData> | null;
  return { id: project.id, name: project.name, createdAt: project.createdAt, updatedAt: project.updatedAt,
    seats: Number(data?.settings?.totalSeats ?? 0) || 0,
    parties: Array.isArray(data?.parties) ? data.parties.length : 0,
    votes: Array.isArray(data?.history) ? data.history.length : 0 };
}
export const projectsApi = {
  async list(): Promise<ProjectSummary[]> {
    await migrateLegacyProjects(); return (await projectsStorage.list()).map(summarizeProject);
  },
  async create(name: string, data: unknown): Promise<{ id: string; name: string }> {
    await migrateLegacyProjects(); return projectsStorage.create(name, data);
  },
  async get(id: string): Promise<{ id: string; name: string; data: unknown }> {
    await migrateLegacyProjects(); const p = await projectsStorage.get(id); return { id: p.id, name: p.name, data: p.data };
  },
  async save(id: string, name: string, data: unknown): Promise<void> { return projectsStorage.save(id, name, data); },
  async rename(id: string, name: string): Promise<void> { return projectsStorage.rename(id, name); },
  async remove(id: string): Promise<void> { return projectsStorage.remove(id); },
  async listBackups(id: string): Promise<ProjectBackup[]> { return projectsStorage.listBackups(id); },
  async createBackup(id: string): Promise<void> { return projectsStorage.createBackup(id); },
  async restoreBackup(id: string, backupId: string): Promise<void> { return projectsStorage.restoreBackup(id, backupId); },
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

'''
    store_path.write_text(store[:a] + replacement + store[b:], encoding="utf-8")
    (ROOT / "src/lib/projectStorage.ts").write_text(STORAGE, encoding="utf-8")

    modal_path = ROOT / "src/components/ProjectsModal.tsx"
    modal = modal_path.read_text(encoding="utf-8")
    modal = modal.replace('import { projectsApi, saveNow, useStore, type ProjectSummary } from "@/lib/store";',
        'import { projectsApi, saveNow, useStore, type ProjectSummary } from "@/lib/store";\nimport type { ProjectBackup } from "@/lib/projectStorage";', 1)
    modal = modal.replace('  const file = useRef<HTMLInputElement>(null);',
        '  const file = useRef<HTMLInputElement>(null);\n  const [backupProjectId, setBackupProjectId] = useState<string | null>(null);\n  const [backups, setBackups] = useState<ProjectBackup[]>([]);', 1)
    modal = modal.replace('''        <div className="space-y-2">
          {list.length === 0''', '''        <div className="space-y-2">
          {backupProjectId && (
            <div className="card space-y-2 p-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold">Recovery snapshots</h3>
                <button className="btn btn-sm" onClick={() => { setBackupProjectId(null); setBackups([]); }}>Close</button>
              </div>
              <p className="muted text-xs">Up to three recent recovery versions are retained for each project.</p>
              {backups.length === 0 && <p className="muted text-xs">No recovery snapshots are available.</p>}
              {backups.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between gap-2 border-t pt-2" style={{ borderColor: "var(--border)" }}>
                  <div className="min-w-0">
                    <div className="truncate text-xs font-semibold">{backup.projectName}</div>
                    <div className="muted text-[11px]">{new Date(backup.createdAt).toLocaleString()}</div>
                  </div>
                  <button className="btn btn-sm btn-primary" disabled={busy} onClick={() => guard(async () => {
                    if (!window.confirm("Restore this snapshot? The current project will first be saved as a recovery snapshot.")) return;
                    await projectsApi.restoreBackup(backupProjectId, backup.id);
                    await openProject(backupProjectId);
                    setBackups(await projectsApi.listBackups(backupProjectId));
                    await refresh();
                    toast("Recovery snapshot restored.", "ok");
                  })}>Restore</button>
                </div>
              ))}
            </div>
          )}
          {list.length === 0''', 1)
    modal = modal.replace('''                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      setRenaming(p.id);''', '''                  <button className="btn btn-sm" disabled={busy} onClick={() => guard(async () => {
                    setBackupProjectId(p.id);
                    setBackups(await projectsApi.listBackups(p.id));
                  })}>Backups</button>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      setRenaming(p.id);''', 1)
    modal = modal.replace('''              <button className="btn btn-sm" onClick={() => exportProjectJSON(meta.name, data)}>
                Export JSON
              </button>''', '''              <button className="btn btn-sm" disabled={!meta.id || busy} onClick={() => guard(async () => {
                if (!meta.id) return;
                await projectsApi.createBackup(meta.id);
                setBackupProjectId(meta.id);
                setBackups(await projectsApi.listBackups(meta.id));
                toast("Recovery snapshot created.", "ok");
              })}>Create backup</button>
              <button className="btn btn-sm" onClick={() => exportProjectJSON(meta.name, data)}>
                Export JSON
              </button>''', 1)
    modal = modal.replace("Auto-saved to the database. Status:", "Auto-saved in this browser. Status:")
    modal_path.write_text(modal, encoding="utf-8")

    shell_path = ROOT / "src/components/AppShell.tsx"
    shell = shell_path.read_text(encoding="utf-8").replace("Could not connect to the database: ", "Could not load browser project storage: ")
    shell_path.write_text(shell, encoding="utf-8")

    package_path = ROOT / "package.json"
    package = json.loads(package_path.read_text(encoding="utf-8"))
    package["name"] = "parliament-sandbox-simulator"
    package.setdefault("scripts", {})["test"] = "tsx --test tests/*.test.ts"
    package["devDependencies"] = package.get("devDependencies", {})
    package["devDependencies"]["tsx"] = "^4.20.6"
    for key in ("dotenv", "drizzle-orm", "pg"): package.get("dependencies", {}).pop(key, None)
    for key in ("@types/pg", "drizzle-kit"): package["devDependencies"].pop(key, None)
    package_path.write_text(json.dumps(package, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (ROOT / "drizzle.config.json").unlink(missing_ok=True)
    shutil.rmtree(ROOT / "src/app/api", ignore_errors=True)
    shutil.rmtree(ROOT / "src/db", ignore_errors=True)

    test_code = r'''import assert from "node:assert/strict";
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
'''
    tests = ROOT / "tests"
    tests.mkdir(parents=True, exist_ok=True)
    (tests / "parliament.test.ts").write_text(test_code, encoding="utf-8")
    print("Added IndexedDB storage, legacy migration, three recovery snapshots per project, restore UI, and unit tests.")

if __name__ == "__main__":
    main()
