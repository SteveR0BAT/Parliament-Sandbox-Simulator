"use client";

import { useState } from "react";

const features = [
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

const faqs = [
  ["Is Parliament Sandbox Simulator free?", "Yes. The simulator is free to use in your browser and does not require registration."],
  ["Do I need to install anything?", "No installation is required. Open the website in a modern browser with JavaScript enabled."],
  ["How many ideologies are included?", "The built-in library contains 130 researched ideology entries. You can also create and save custom ideologies in your parliament project."],
  ["Where are my parliament projects saved?", "Projects are saved in your browser's local storage on the device and browser you use. They do not automatically sync to other devices. Export a project as JSON to keep a backup or transfer it to another browser."],
  ["Does the voting simulator predict real parliamentary behaviour?", "No. It is a sandbox that calculates votes from the rules and behaviour settings you configure. Its results represent your scenario assumptions, not a forecast of real MPs or future political events."],
  ["Can I export parliamentary data and voting results?", "Yes. Project compositions and vote records can be exported in supported CSV and JSON formats."],
];

export function InfoDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={() => setOpen(true)} aria-haspopup="dialog">
        FAQ &amp; Info
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-dialog-title"
            className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] text-[var(--text)] shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5 sm:p-6">
              <div>
                <p className="mb-2 text-xs font-bold tracking-widest text-[var(--accent)]">FREE · BROWSER-BASED POLITICAL SANDBOX</p>
                <h2 id="info-dialog-title" className="text-xl font-extrabold sm:text-2xl">Parliament Sandbox Simulator</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">Build Parties, Factions &amp; Voting Systems</p>
              </div>
              <button type="button" className="btn btn-primary shrink-0" onClick={() => setOpen(false)}>Close</button>
            </header>

            <div className="min-h-0 flex-1 space-y-7 overflow-y-auto p-5 sm:p-6">
              <section>
                <p className="text-base font-semibold leading-relaxed">
                  Design a custom parliament with configurable seats, parties, factions, coalitions, independents and over 100 ideologies. Simulate legislative votes with party discipline, voting behaviour and custom majority rules—all in your browser, completely free.
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  Build a fictional legislature or model a real parliamentary structure. Arrange the chamber, define its political forces and test how legislation moves through a voting system shaped by your own assumptions.
                </p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
                  <a className="text-[var(--accent)] hover:underline" href="#simulator" onClick={() => setOpen(false)}>Open the simulator</a>
                  <a className="text-[var(--accent)] hover:underline" href="https://github.com/SteveR0BAT/Parliament-Sandbox-Simulator" target="_blank" rel="noopener noreferrer">View the project on GitHub</a>
                </div>
              </section>

              <div className="grid gap-4 sm:grid-cols-2">
                {features.map((feature) => (
                  <article key={feature.title} className="rounded-xl border border-[var(--border)] p-4">
                    <h3 className="mb-2 font-bold">{feature.title}</h3>
                    <p className="text-sm leading-6 text-[var(--muted)]">{feature.text}</p>
                  </article>
                ))}
              </div>

              <section>
                <h3 className="mb-2 text-lg font-bold">A parliamentary voting simulator with faction-level detail</h3>
                <p className="text-sm leading-7 text-[var(--muted)]">
                  A parliamentary voting simulator is only as useful as the political assumptions behind its results. Here, voting behaviour can be configured at several levels: a party can issue a voting line, factions within that party can take different positions, ideologies can guide deputies, and individual MPs can receive their own decisions. Mixed mode lets different groups follow different decision methods in the same vote.
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  The result is a configurable scenario model, not a prediction of how a real parliament will vote. It calculates outcomes from the parties, factions, deputies, voting behaviour and passage rules that you define.
                </p>
              </section>

              <section>
                <h3 className="mb-2 text-lg font-bold">Who is it for?</h3>
                <p className="text-sm leading-7 text-[var(--muted)]">
                  Use the parliament builder for alternate history, fictional elections, political worldbuilding, classroom exercises, constitutional experiments, role-playing settings or exploring how changes in party discipline and coalition structure affect a parliamentary majority.
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  Whether you are designing a fragmented coalition parliament or a fictional assembly with hundreds of deputies, the sandbox gives you control over both the chamber's composition and its voting rules.
                </p>
              </section>

              <section>
                <h3 className="mb-3 text-lg font-bold">Frequently asked questions</h3>
                <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
                  {faqs.map(([question, answer]) => (
                    <details key={question} className="py-3">
                      <summary className="cursor-pointer text-sm font-semibold">{question}</summary>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{answer}</p>
                    </details>
                  ))}
                </div>
              </section>

              <footer className="border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)]">
                Parliament Sandbox Simulator is an independent browser-based project.
              </footer>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
