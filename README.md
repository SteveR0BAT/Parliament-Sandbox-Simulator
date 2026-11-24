# Parliament Sandbox Simulator - Build Parties, Factions & Voting Systems

> Design a custom parliament with configurable seats, parties, factions, coalitions, independents and over 100 ideologies. Simulate legislative votes with party discipline, voting behaviour and custom majority rules—all in your browser, completely free.

**[Open the live simulator](https://stever0bat.github.io/Parliament-Sandbox-Simulator/)**

Parliament Sandbox Simulator is a free, browser-based parliament builder and parliamentary voting sandbox. Create a legislature from the ground up, decide how its political groups are organized, and run votes using behaviour and passage rules that you configure.

## What you can build

- **A configurable chamber:** adjust the seat count, number of rows, seats per row, seat size, spacing, chamber curvature, orientation and other layout settings.
- **Political parties:** define party names, abbreviations, colours, leaders, descriptions and ideological positions.
- **Internal party factions:** create factions with their own names, leaders, colours and ideological identities.
- **Coalitions:** group parties into coalitions and configure coalition leadership and political orientation.
- **Independent MPs:** add deputies outside party structures and configure their individual voting behaviour.
- **Custom ideologies:** use the built-in ideology library or create your own political positions.

## 130 built-in ideology entries

The built-in library contains 130 researched ideology entries, covering political traditions from the far left to the far right, alongside centrist and third-way currents. Entries include descriptions, economic and social characteristics, related ideologies and historical context where available. You can search the library and add custom ideologies to your project.

Political classification is not always reducible to a single left–right spectrum. The simulator includes categories for disputed and third-way positions, and its ideology scores should be treated as a modelling aid rather than an authoritative scientific measurement.

## Parliamentary voting simulation

Create a bill, resolution, motion, amendment or confidence vote. Choose how deputies make decisions:

- **Party-based:** deputies follow their party's configured voting line.
- **Faction-based:** internal factions can take positions that differ from their wider party.
- **Ideology-based:** voting decisions can follow ideological positions.
- **Individual:** configure deputies' decisions separately.
- **Random:** use configurable probabilities for votes for, against, abstention and absence.
- **Mixed:** combine different decision methods in one parliamentary vote.

The behaviour model includes party discipline, faction discipline, ideological adherence, randomness, abstention and absence probabilities. Party discipline can also be adjusted for individual parties.

Configure the passage requirements with simple, absolute, qualified, two-thirds, three-fifths or custom majority rules, alongside quorum requirements. The results show whether the proposal passes under the rules you selected.

## Results, history and exports

Review the outcome of a vote and inspect individual deputy decisions. The simulator keeps a vote history, lets you compare recorded votes, and supports exports including:

- Parliament compositions in CSV.
- Voting records in CSV and JSON.
- Complete parliament projects in JSON, which can be imported later.

## Who is it for?

The sandbox can be used for alternate history, fictional elections, political worldbuilding, classroom exercises, constitutional experiments, role-playing settings, or exploring how coalition arrangements and party discipline affect parliamentary majorities.

## Data and project storage

The public website runs in your browser. Parliament projects are saved in the browser's local storage on the device and browser you use; they are not automatically synchronized across devices. Use the JSON export to back up a project or move it to another browser.

The simulator is a scenario-building tool. Its vote results are calculated from the parties, factions, deputies, behaviour settings and passage rules configured by the user. They are not forecasts of real parliamentary behaviour or future political events.

## Feedback and bug reports

Found a problem or have an idea for a feature? [Open an issue on GitHub](https://github.com/SteveR0BAT/Parliament-Sandbox-Simulator/issues).

---

**Live website:** https://stever0bat.github.io/Parliament-Sandbox-Simulator/  
**Repository:** https://github.com/SteveR0BAT/Parliament-Sandbox-Simulator
