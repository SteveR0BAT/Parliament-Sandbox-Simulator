"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { projectsApi, saveNow, useStore, type ProjectSummary } from "@/lib/store";
import type { ProjectBackup } from "@/lib/projectStorage";
import { blankProject, sampleProject } from "@/lib/defaults";
import { compositionCSV, downloadFile, exportProjectJSON, parseImport, safeName } from "@/lib/export";
import { Field, Modal, NumInput } from "./ui";

export async function openProject(id: string) {
  const st = useStore.getState();
  if (st.meta.id && st.ui.saveState !== "saved") await saveNow();
  const p = await projectsApi.get(id);
  useStore.getState().loadProject(p.id, p.name, p.data);
  try {
    localStorage.setItem("parl:last", p.id);
  } catch {}
}

export function ProjectsModal() {
  const ui = useStore((s) => s.ui);
  const meta = useStore((s) => s.meta);
  const data = useStore((s) => s.data);
  const patch = useStore((s) => s.patchUI);
  const setName = useStore((s) => s.setName);
  const toast = useStore((s) => s.toast);
  const [list, setList] = useState<ProjectSummary[]>([]);
  const [busy, setBusy] = useState(false);
  const [newName, setNewName] = useState("My parliament");
  const [newSeats, setNewSeats] = useState(100);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameText, setRenameText] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const [backupProjectId, setBackupProjectId] = useState<string | null>(null);
  const [backups, setBackups] = useState<ProjectBackup[]>([]);

  const refresh = useCallback(async () => {
    try {
      setList(await projectsApi.list());
    } catch {
      toast("Could not load the project list.", "error");
    }
  }, [toast]);
  useEffect(() => {
    if (ui.projectsOpen) void refresh();
  }, [ui.projectsOpen, refresh]);
  if (!ui.projectsOpen) return null;

  const guard = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Operation failed.", "error");
    } finally {
      setBusy(false);
    }
  };

  const create = (kind: "blank" | "sample") =>
    guard(async () => {
      if (meta.id) await saveNow();
      const r = await projectsApi.create(newName.trim() || "Untitled parliament", kind === "sample" ? sampleProject() : blankProject(newSeats));
      await openProject(r.id);
      await refresh();
      toast("New parliament created.", "ok");
    });

  return (
    <Modal title="Parliament projects" wide onClose={() => patch({ projectsOpen: false })}>
      <div className="grid gap-5 md:grid-cols-[1fr_300px]">
        <div className="space-y-2">
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
          {list.length === 0 && <div className="muted text-sm">No saved projects.</div>}
          {list.map((p) => {
            const current = p.id === meta.id;
            return (
              <div key={p.id} className="card anim-in flex flex-wrap items-center gap-2 p-3" style={current ? { borderColor: "var(--accent)" } : undefined}>
                <div className="min-w-0 flex-1">
                  {renaming === p.id ? (
                    <input
                      className="input"
                      autoFocus
                      value={renameText}
                      onChange={(e) => setRenameText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          void guard(async () => {
                            const n = renameText.trim();
                            if (!n) return;
                            await projectsApi.rename(p.id, n);
                            if (current) setName(n);
                            setRenaming(null);
                            await refresh();
                          });
                        if (e.key === "Escape") setRenaming(null);
                      }}
                    />
                  ) : (
                    <div className="truncate text-sm font-bold">
                      {p.name} {current && <span className="chip ml-1">open</span>}
                    </div>
                  )}
                  <div className="muted text-[11px]">
                    {p.seats} seats · {p.parties} parties · {p.votes} votes · saved {new Date(p.updatedAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {!current && (
                    <button
                      className="btn btn-sm btn-primary"
                      disabled={busy}
                      onClick={() =>
                        guard(async () => {
                          await openProject(p.id);
                          patch({ projectsOpen: false });
                        })
                      }
                    >
                      Open
                    </button>
                  )}
                  <button className="btn btn-sm" disabled={busy} onClick={() => guard(async () => {
                    setBackupProjectId(p.id);
                    setBackups(await projectsApi.listBackups(p.id));
                  })}>Backups</button>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      setRenaming(p.id);
                      setRenameText(p.name);
                    }}
                  >
                    Rename
                  </button>
                  <button
                    className="btn btn-sm"
                    disabled={busy}
                    onClick={() =>
                      guard(async () => {
                        if (current) await saveNow();
                        const src = await projectsApi.get(p.id);
                        await projectsApi.create(`${p.name} (copy)`, src.data);
                        await refresh();
                        toast("Project duplicated.", "ok");
                      })
                    }
                  >
                    Duplicate
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    disabled={busy}
                    onClick={() =>
                      guard(async () => {
                        if (!window.confirm(`Delete project “${p.name}” permanently?`)) return;
                        await projectsApi.remove(p.id);
                        const rest = (await projectsApi.list()).filter((x) => x.id !== p.id);
                        if (current) {
                          if (rest[0]) await openProject(rest[0].id);
                          else {
                            const r = await projectsApi.create("My parliament", sampleProject());
                            await openProject(r.id);
                          }
                        }
                        await refresh();
                      })
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="space-y-4">
          <div className="card space-y-2 p-3">
            <h3 className="text-sm font-bold">New parliament</h3>
            <Field label="Name">
              <input className="input" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </Field>
            <Field label="Seats (blank project)">
              <NumInput value={newSeats} min={1} max={20000} int onCommit={setNewSeats} />
            </Field>
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm" disabled={busy} onClick={() => create("blank")}>
                Blank
              </button>
              <button className="btn btn-sm" disabled={busy} onClick={() => create("sample")}>
                Sample parliament
              </button>
            </div>
          </div>
          <div className="card space-y-2 p-3">
            <h3 className="text-sm font-bold">Current project</h3>
            <div className="text-xs muted">Auto-saved in this browser. Status: {ui.saveState}</div>
            <div className="flex flex-wrap gap-1.5">
              <button
                className="btn btn-sm btn-primary"
                onClick={async () => {
                  const ok = await saveNow();
                  toast(ok ? "Saved." : "Save failed.", ok ? "ok" : "error");
                }}
              >
                Save now
              </button>
              <button className="btn btn-sm" disabled={!meta.id || busy} onClick={() => guard(async () => {
                if (!meta.id) return;
                await projectsApi.createBackup(meta.id);
                setBackupProjectId(meta.id);
                setBackups(await projectsApi.listBackups(meta.id));
                toast("Recovery snapshot created.", "ok");
              })}>Create backup</button>
              <button className="btn btn-sm" onClick={() => exportProjectJSON(meta.name, data)}>
                Export JSON
              </button>
              <button className="btn btn-sm" onClick={() => downloadFile(`${safeName(meta.name)}_composition.csv`, compositionCSV(data), "text/csv")}>
                Export CSV
              </button>
            </div>
          </div>
          <div className="card space-y-2 p-3">
            <h3 className="text-sm font-bold">Import</h3>
            <p className="muted text-xs">Import a previously exported .json file; it is added as a new project with the same composition and settings.</p>
            <input
              ref={file}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (!f) return;
                void guard(async () => {
                  const { name, data: d } = parseImport(await f.text());
                  const r = await projectsApi.create(name, d);
                  await openProject(r.id);
                  await refresh();
                  toast(`Imported “${name}”.`, "ok");
                });
              }}
            />
            <button className="btn btn-sm" onClick={() => file.current?.click()}>
              Choose file…
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
