# Parliament Sandbox Simulator

Build custom parliaments, organize parties and factions, explore political ideologies, and simulate legislative votes.

Parliament Sandbox Simulator is a free, browser-based political sandbox for fictional worldbuilding, alternate history, constitutional experiments, classroom exercises, and modelling parliamentary systems.

**Live application:** https://stever0bat.github.io/Parliament-Sandbox-Simulator/  
**Repository:** https://github.com/SteveR0BAT/Parliament-Sandbox-Simulator

## Features

- **Parliament builder:** configure seat counts, chamber geometry, rows, spacing, curvature, orientation, and visualisation.
- **Parties, factions and coalitions:** define political groups, leaders, identities, ideological positions, and parliamentary relationships.
- **Independent MPs:** configure individual deputies outside party structures.
- **Deputy names:** generate deputies using configurable generic or regional name styles.
- **Ideology library:** explore 130 built-in ideology entries and add custom ideologies.
- **Voting engine:** simulate bills, resolutions, motions, amendments, and confidence votes using party, faction, ideology, individual, random, or mixed behaviour.
- **Behaviour modelling:** configure party and faction discipline, ideological adherence, randomness, abstention, and absence.
- **Constitutional rules:** configure majority thresholds, custom multi-part requirements, and quorum.
- **Results and history:** inspect individual deputy decisions, compare recorded votes, and export compositions and voting records.
- **Statistics and themes:** review political distributions and switch between supported interface languages and themes.
- **Projects:** keep multiple parliament projects in the browser and import/export complete JSON projects.

The voting engine is a configurable scenario model. Its results reflect the assumptions and rules entered by the user; they are not forecasts of real parliamentary behaviour.

## Repository structure

The application source is kept in the website/ directory as a normal Next.js project, not embedded in a compressed archive.

```text
.
├── .github/workflows/deploy.yml
├── website/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── data/
│   │   └── lib/
│   ├── tests/
│   ├── package.json
│   └── package-lock.json
├── LICENSE
├── README.md
└── CONTRIBUTING.md
```

## Run locally

Requirements: Node.js 22 or later and npm.

```bash
cd website
npm install
npm run dev
```

Open http://localhost:3000.

## Quality checks

Run these commands from website/:

```bash
npm run typecheck
npm test
npm run lint  # core logic, data and tests
npm run build
```

GitHub Actions runs type checking, automated tests, lint checks over the core logic/data and tests, and the production build before publishing the static site to GitHub Pages. Legacy UI components currently have separate lint findings; they do not block the core test/build pipeline.

## Project storage and backups

Projects are stored locally in the browser using IndexedDB. They are not uploaded to a server and do not automatically synchronize across browsers or devices.

The application retains up to three recent recovery snapshots per project. A snapshot is created when a project is first created and before a changed saved version is overwritten or restored. Use Backups in the Projects window to inspect and restore previous versions. Create backup adds a manual recovery point.

Existing projects stored by the previous localStorage-based version are migrated into IndexedDB when the updated application is first opened in that browser. The old localStorage data is intentionally left untouched during migration as an additional safety net.

Browser storage is not a substitute for an external backup. Use Export JSON regularly to keep a portable copy of important projects or transfer them to another browser or device. Clearing browser site data can delete local projects and recovery snapshots.

## Contributing

Bug reports and feature suggestions are welcome through GitHub Issues. See CONTRIBUTING.md for development guidance.

## License

This project is distributed under the Parliament Sandbox Attribution License (PSAL) 1.0. It permits non-commercial and commercial use, modification, and redistribution. Commercial use requires clear attribution to **Parliament Sandbox Simulator by SteveR0BAT** and a link to this repository.

Read the complete LICENSE before using or redistributing the project.

PSAL is a custom attribution license, not an OSI-approved open-source license. Third-party dependencies and assets remain under their respective licenses.
