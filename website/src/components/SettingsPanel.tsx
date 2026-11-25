"use client";
import { useStore } from "@/lib/store";
import { InfoDialog } from "./InfoDialog";
import { LANGUAGES, useLanguage, type Language } from "@/lib/language";
import { CATEGORIES } from "@/data/ideologies";
import { DEFAULT_BEHAVIOR, DEFAULT_PREFS, DEFAULT_SETTINGS } from "@/lib/defaults";
import type { ChamberSettings, CategoryId, DeputyNameStyle, VotingMode } from "@/lib/types";
import { ColorPicker } from "./ColorPicker";
import { Field, NumInput, Section, Seg, SliderField, Toggle } from "./ui";

export function SettingsPanel() {
  const { language, setLanguage } = useLanguage();
  const s = useStore((st) => st.data.settings);
  const prefs = useStore((st) => st.data.prefs);
  const theme = useStore((st) => st.ui.theme);
  const patchUI = useStore((st) => st.patchUI);
  const upd = useStore((st) => st.updateSettings);
  const updPrefs = useStore((st) => st.updatePrefs);
  const toast = useStore((st) => st.toast);

  const num = (label: string, key: keyof ChamberSettings, min: number, max: number, step = 1, hint?: string, unit = "") => (
    <SliderField label={label} value={s[key] as number} min={min} max={max} step={step} unit={unit} hint={hint} onChange={(n) => upd({ [key]: n } as Partial<ChamberSettings>)} onReset={() => upd({ [key]: DEFAULT_SETTINGS[key] } as Partial<ChamberSettings>)} />
  );
  const D = prefs.defaults;

  return (
    <div>
      <Section title="Seat Geometry & Parliamentary Settings">
        <Field label="Generic deputy names" hint="Applies to newly generated deputies only. Existing names and manually entered names are unchanged. All names use Latin letters.">
          <select className="select" value={s.genericDeputyNames} onChange={(e) => upd({ genericDeputyNames: e.target.value as DeputyNameStyle })}>
            <option value="multicultural">0 · Generic Multicultural</option>
            <option value="american">1 · American</option>
            <option value="british">2 · British</option>
            <option value="french">3 · French</option>
            <option value="german">4 · German</option>
            <option value="russian">5 · Russian</option>
            <option value="italian">6 · Italian</option>
            <option value="spanish">7 · Spanish</option>
            <option value="portuguese">8 · Portuguese</option>
            <option value="turkish">9 · Turkish</option>
            <option value="georgian">10 · Georgian</option>
            <option value="hebrew">11 · Hebrew</option>
            <option value="arabic">12 · Arabic</option>
            <option value="chinese">13 · Chinese</option>
            <option value="indian">14 · Indian</option>
            <option value="korean">15 · Korean</option>
            <option value="japanese">16 · Japanese</option>
            <option value="african">17 · Generic African</option>
          </select>
        </Field>
        <p className="muted text-[11px]">Seats are positioned automatically and never overlap: if the layout cannot hold all seats, extra rows are added and a notice is shown.</p>
        <Field label="Row layout" onReset={() => upd({ rowMode: DEFAULT_SETTINGS.rowMode })}>
          <Seg value={s.rowMode} onChange={(v) => upd({ rowMode: v })} options={[{ v: "auto", label: "Auto rows" }, { v: "rows", label: "Set rows" }, { v: "perRow", label: "Seats per row" }]} />
        </Field>
        {s.rowMode === "rows" && num("Number of rows", "rows", 1, 60)}
        {s.rowMode === "perRow" && num("Target seats per row (outer row)", "seatsPerRow", 5, 400, 1, "Row count is derived from this value.")}
        {num("Seat radius", "seatRadius", 3, 30, 0.5)}
        {num("Horizontal spacing", "seatSpacing", 0, 30, 0.5, "Gap between neighbouring seats in a row.")}
        {num("Vertical row spacing", "rowSpacing", 0, 40, 0.5, "Gap between rows.")}
        {num("Distance centre → first row", "innerRadius", 0, 400, 1)}
        {num("Center padding", "centerPadding", 0, 300, 1, "Extra empty space reserved around the centre of the chamber.")}
        {num("Chamber curvature (arc)", "arcAngle", 60, 360, 1, "180° = classic hemicycle, 360° = full circle.", "°")}
        <Field label="Orientation" onReset={() => upd({ orientation: DEFAULT_SETTINGS.orientation })}>
          <Seg value={s.orientation} onChange={(v) => upd({ orientation: v })} options={[{ v: "up", label: "↑ Up" }, { v: "right", label: "→ Right" }, { v: "down", label: "↓ Down" }, { v: "left", label: "← Left" }]} />
        </Field>
        {num("Fine rotation", "rotation", -180, 180, 1, undefined, "°")}
        <Field label="Outer radius" onReset={() => upd({ outerMode: "auto", outerRadius: DEFAULT_SETTINGS.outerRadius })}>
          <Seg value={s.outerMode} onChange={(v) => upd({ outerMode: v })} options={[{ v: "auto", label: "Automatic" }, { v: "fixed", label: "Fixed" }]} />
        </Field>
        {s.outerMode === "fixed" && num("Outer radius", "outerRadius", 50, 3000, 5, "Rows stretch to fill the distance between the inner and outer radius (never below non-overlap).")}
        <Field label="Seat ordering" onReset={() => upd({ seatOrder: DEFAULT_SETTINGS.seatOrder })}>
          <Seg value={s.seatOrder} onChange={(v) => upd({ seatOrder: v })} options={[{ v: "wedge", label: "Wedges (by angle)" }, { v: "rows", label: "Row by row" }]} />
        </Field>
        <Toggle label="Seat coalition parties side by side" checked={s.groupCoalitions} onChange={(v) => upd({ groupCoalitions: v })} />
        <Toggle label="Auto-fit chamber to view" checked={s.autoFit} onChange={(v) => upd({ autoFit: v })} hint="Off = absolute scale using the width/height below (large chambers may be cropped)." />
        {num("Chamber width", "width", 200, 3000, 10)}
        {num("Chamber height", "height", 150, 3000, 10)}
        <button className="btn btn-sm" onClick={() => upd({ ...DEFAULT_SETTINGS, totalSeats: s.totalSeats })}>
          Reset all geometry to defaults
        </button>
      </Section>

      <Section title="Colours & visualisation" defaultOpen={false}>
        {(["for", "against", "abstain", "absent", "pending"] as const).map((k) => (
          <Field key={k} label={`${k === "pending" ? "Not yet voted" : "Vote: " + k}`} onReset={() => updPrefs((p) => void (p.voteColors[k] = DEFAULT_PREFS.voteColors[k]))}>
            <ColorPicker compact value={prefs.voteColors[k]} onChange={(c) => updPrefs((p) => void (p.voteColors[k] = c))} />
          </Field>
        ))}
        <Field label="Unallocated seat colour" onReset={() => updPrefs((p) => void (p.unallocatedColor = DEFAULT_PREFS.unallocatedColor))}>
          <ColorPicker compact value={prefs.unallocatedColor} onChange={(c) => updPrefs((p) => void (p.unallocatedColor = c))} />
        </Field>
        <Toggle label="Show coalition rings" checked={prefs.coalitionRing} onChange={(v) => updPrefs((p) => void (p.coalitionRing = v))} />
        <SliderField label="Ring thickness" value={prefs.ringWidth} min={0.06} max={0.3} step={0.01} onChange={(n) => updPrefs((p) => void (p.ringWidth = n))} onReset={() => updPrefs((p) => void (p.ringWidth = DEFAULT_PREFS.ringWidth))} />
        <Toggle label="Show seat numbers" checked={prefs.showSeatNumbers} onChange={(v) => updPrefs((p) => void (p.showSeatNumbers = v))} hint="Best with large seats / small parliaments." />
        <Toggle label="Dim seats outside the focused group" checked={prefs.dimUnfocused} onChange={(v) => updPrefs((p) => void (p.dimUnfocused = v))} />
        <Field label="Legend contents">
          <div className="grid grid-cols-2 gap-1.5">
            {(Object.keys(prefs.legend) as (keyof typeof prefs.legend)[]).map((k) => (
              <Toggle key={k} label={k} checked={prefs.legend[k]} onChange={(v) => updPrefs((p) => void (p.legend[k] = v))} />
            ))}
          </div>
        </Field>
      </Section>

      <Section title="Animation" defaultOpen={false}>
        <Toggle label="Animate vote reveal" checked={prefs.animateVotes} onChange={(v) => updPrefs((p) => void (p.animateVotes = v))} hint="Reduced-motion system settings are always respected." />
        <Toggle label="Animate seat/colour changes" checked={prefs.animateChanges} onChange={(v) => updPrefs((p) => void (p.animateChanges = v))} />
        <SliderField label="Animation speed" value={prefs.animationSpeed} min={0.25} max={4} step={0.25} unit="×" onChange={(n) => updPrefs((p) => void (p.animationSpeed = n))} onReset={() => updPrefs((p) => void (p.animationSpeed = 1))} />
      </Section>

      <Section title="Voting defaults (new issues)" defaultOpen={false}>
        <Field label="Default voting mode" onReset={() => updPrefs((p) => void (p.defaults.mode = DEFAULT_PREFS.defaults.mode))}>
          <select className="select" value={D.mode} onChange={(e) => updPrefs((p) => void (p.defaults.mode = e.target.value as VotingMode))}>
            {["party", "ideology", "faction", "individual", "random", "mixed"].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>
        {(["partyDiscipline", "factionDiscipline", "ideologicalAdherence", "randomness", "abstainProb", "absentProb"] as const).map((k) => (
          <SliderField key={k} label={k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())} value={D.behavior[k]} min={0} max={100} unit="%" onChange={(n) => updPrefs((p) => void (p.defaults.behavior[k] = n))} onReset={() => updPrefs((p) => void (p.defaults.behavior[k] = DEFAULT_BEHAVIOR[k]))} />
        ))}
        <Field label="Random probabilities (weights)">
          <div className="grid grid-cols-4 gap-1.5 text-[10px]">
            {(["pFor", "pAgainst", "pAbstain", "pAbsent"] as const).map((k) => (
              <div key={k}>
                <span className="muted">{k.slice(1)}</span>
                <NumInput value={D.random[k]} min={0} max={100} onCommit={(n) => updPrefs((p) => void (p.defaults.random[k] = n))} />
              </div>
            ))}
          </div>
        </Field>
        <p className="muted text-[11px]">Majority thresholds are set per issue (and can be saved as default from the issue editor).</p>
      </Section>

      <Section title="Ideology database" defaultOpen={false}>
        <Toggle label="Show sources & references" checked={prefs.ideology.showSources} onChange={(v) => updPrefs((p) => void (p.ideology.showSources = v))} />
        <Toggle label="Show classification notes (disputed placements)" checked={prefs.ideology.showDisputed} onChange={(v) => updPrefs((p) => void (p.ideology.showDisputed = v))} />
        <Field label="Show categories">
          <div className="grid grid-cols-2 gap-1.5">
            {CATEGORIES.map((c) => (
              <Toggle
                key={c.id}
                label={c.label}
                checked={!prefs.ideology.hiddenCategories.includes(c.id)}
                onChange={(v) => updPrefs((p) => void (p.ideology.hiddenCategories = v ? p.ideology.hiddenCategories.filter((x) => x !== c.id) : [...p.ideology.hiddenCategories, c.id as CategoryId]))}
              />
            ))}
          </div>
        </Field>
      </Section>

      <Section title="Interface" defaultOpen={false}>
        <Field label="About this simulator">
          <InfoDialog />
        </Field>
        <Field label="Language">
          <select className="select" value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
            {LANGUAGES.map((item) => (
              <option key={item.code} value={item.code}>{item.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Theme">
          <Seg value={theme} onChange={(v) => patchUI({ theme: v })} options={[{ v: "light", label: "☀ Light" }, { v: "dark", label: "☾ Dark" }]} />
        </Field>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => {
            if (!window.confirm("Reset ALL appearance, geometry and default settings of this project? Parties and votes are kept.")) return;
            upd({ ...DEFAULT_SETTINGS, totalSeats: s.totalSeats });
            updPrefs((p) => Object.assign(p, structuredClone(DEFAULT_PREFS)));
            toast("All settings reset to defaults.", "ok");
          }}
        >
          Reset every setting
        </button>
        <p className="muted text-[11px]">Settings are saved automatically with the project.</p>
      </Section>
    </div>
  );
}
