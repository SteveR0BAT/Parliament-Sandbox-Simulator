"use client";
import { useEffect, type ReactNode } from "react";
import { projectsApi, saveNow, useStore, type Tab } from "@/lib/store";
import { sampleProject } from "@/lib/defaults";
import { Toasts } from "./ui";
import { Chamber } from "./Chamber";
import { ParliamentPanel } from "./ParliamentPanel";
import { GovernmentPanel } from "./GovernmentPanel";
import { PartiesPanel } from "./PartiesPanel";
import { CoalitionsPanel } from "./CoalitionsPanel";
import { FactionsPanel } from "./FactionsPanel";
import { VotingPanel } from "./VotingPanel";
import { VotingResults } from "./VotingResults";
import { SettingsPanel } from "./SettingsPanel";
import { IdeologiesPage } from "./IdeologiesPage";
import { StatisticsPage } from "./StatisticsPage";
import { ProjectsModal, openProject } from "./ProjectsModal";
import { LanguageBridge } from "./LanguageBridge";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "parliament", label: "Parliament", icon: "🏛" },
  { id: "government", label: "Government", icon: "🏛️" },
  { id: "parties", label: "Parties", icon: "🎨" },
  { id: "coalitions", label: "Coalitions", icon: "🤝" },
  { id: "factions", label: "Factions", icon: "🧩" },
  { id: "ideologies", label: "Ideologies", icon: "📚" },
  { id: "voting", label: "Voting", icon: "🗳" },
  { id: "statistics", label: "Statistics", icon: "📊" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

const SIDE_TITLES: Partial<Record<Tab, string>> = {
  parliament: "Parliament overview",
  government: "Government",
  parties: "Political parties",
  coalitions: "Coalitions",
  factions: "Internal factions",
  voting: "Voting simulator",
  settings: "Settings",
};

function SidePanel({ tab, children }: { tab: Tab; children: ReactNode }) {
  const open = useStore((s) => s.ui.sideOpen);
  const patch = useStore((s) => s.patchUI);
  const wide = tab === "voting" || tab === "settings";
  return (
    <aside className={`panel anim-slide relative flex min-h-0 flex-col transition-[width] duration-300 ${open ? (wide ? "w-full lg:w-[480px]" : "w-full lg:w-[420px]") : "w-full lg:w-11"} shrink-0`}>
      <div className="flex items-center justify-between border-b px-3 py-2.5" style={{ borderColor: "var(--border)" }}>
        {open && <h2 className="text-sm font-extrabold">{SIDE_TITLES[tab]}</h2>}
        <button className="btn btn-sm btn-icon" onClick={() => patch({ sideOpen: !open })} title={open ? "Collapse panel" : "Expand panel"} aria-label="Toggle side panel">
          {open ? "◀" : "▶"}
        </button>
      </div>
      {open && (
        <div key={tab} className="anim-in min-h-0 flex-1 overflow-y-auto">
          {children}
        </div>
      )}
    </aside>
  );
}

export function AppShell() {
  const ui = useStore((s) => s.ui);
  const meta = useStore((s) => s.meta);
  const data = useStore((s) => s.data);
  const patch = useStore((s) => s.patchUI);

  // initial load: theme + project
  useEffect(() => {
    try {
      const t = localStorage.getItem("parl:theme");
      const theme = t === "dark" || t === "light" ? t : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      patch({ theme });
    } catch {}
    (async () => {
      try {
        const list = await projectsApi.list();
        let id: string | null = null;
        try {
          id = localStorage.getItem("parl:last");
        } catch {}
        if (!id || !list.some((p) => p.id === id)) id = list[0]?.id ?? null;
        if (!id) {
          const r = await projectsApi.create("Sample parliament", sampleProject());
          id = r.id;
        }
        await openProject(id);
      } catch (e) {
        useStore.getState().toast("Could not load browser project storage: " + (e instanceof Error ? e.message : ""), "error");
        useStore.getState().loadProject("", "Unsaved parliament", sampleProject());
      }
    })();
  }, [patch]);

  useEffect(() => {
    document.documentElement.dataset.theme = ui.theme;
    try {
      localStorage.setItem("parl:theme", ui.theme);
    } catch {}
  }, [ui.theme]);

  // autosave (debounced)
  useEffect(() => {
    if (!ui.ready || !meta.id || ui.saveState !== "dirty") return;
    const t = setTimeout(() => void saveNow(), 1200);
    return () => clearTimeout(t);
  }, [data, meta.name, meta.id, ui.saveState, ui.ready]);

  useEffect(() => {
    const h = () => {
      if (document.visibilityState === "hidden" && useStore.getState().ui.saveState === "dirty") void saveNow();
    };
    document.addEventListener("visibilitychange", h);
    return () => document.removeEventListener("visibilitychange", h);
  }, []);

  if (!ui.ready) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="pulse text-4xl">🏛</div>
          <div className="muted mt-2 text-sm">Loading parliament…</div>
        </div>
        <Toasts />
      </div>
    );
  }

  const tab = ui.tab;
  const chamberTab = tab !== "ideologies" && tab !== "statistics";
  const saveLabel = { saved: "Saved", dirty: "Unsaved changes…", saving: "Saving…", error: "Save failed" }[ui.saveState];

  return (
    <div className="flex h-screen flex-col">
      <LanguageBridge />
      <header className="flex flex-wrap items-center gap-3 border-b px-4 py-2" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">🏛</span>
          <div className="leading-tight">
            <div className="text-[13px] font-extrabold">Parliament Sandbox</div>
            <button className="muted max-w-[200px] truncate text-left text-[11px] hover:underline" onClick={() => patch({ projectsOpen: true })} title="Manage projects">
              {meta.name} ▾
            </button>
          </div>
        </div>
        <nav className="flex flex-1 items-center gap-0.5 overflow-x-auto" role="tablist" aria-label="Sections">
          {TABS.map((t) => (
            <button key={t.id} role="tab" className="navtab" aria-selected={tab === t.id} onClick={() => patch({ tab: t.id })}>
              <span className="mr-1">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <span className="text-[11px]" style={{ color: ui.saveState === "error" ? "var(--bad)" : "var(--muted)" }} aria-live="polite">
            {saveLabel}
          </span>
          <button className="btn btn-sm" onClick={() => patch({ projectsOpen: true })}>
            📁 Projects
          </button>
          <button className="btn btn-sm btn-icon" onClick={() => patch({ theme: ui.theme === "dark" ? "light" : "dark" })} title="Toggle dark / light mode" aria-label="Toggle theme">
            {ui.theme === "dark" ? "☀" : "☾"}
          </button>
        </div>
      </header>

      <main className="min-h-0 flex-1">
        {chamberTab ? (
          <div className="flex h-full flex-col gap-3 overflow-y-auto p-3 lg:flex-row lg:overflow-hidden">
            <SidePanel tab={tab}>
              {tab === "parliament" && <ParliamentPanel />}
              {tab === "government" && <GovernmentPanel />}
              {tab === "parties" && <PartiesPanel />}
              {tab === "coalitions" && <CoalitionsPanel />}
              {tab === "factions" && <FactionsPanel />}
              {tab === "voting" && <VotingPanel />}
              {tab === "settings" && <SettingsPanel />}
            </SidePanel>
            <div className="min-w-0 flex-1 space-y-3 lg:overflow-y-auto">
              <Chamber />
              {tab === "voting" && <VotingResults />}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">{tab === "ideologies" ? <IdeologiesPage /> : <StatisticsPage />}</div>
        )}
      </main>
      <ProjectsModal />
      <Toasts />
    </div>
  );
}
