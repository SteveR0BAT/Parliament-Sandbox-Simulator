// Browser-local project storage using IndexedDB.
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
