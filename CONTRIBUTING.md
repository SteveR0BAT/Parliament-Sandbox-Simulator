# Contributing

Thank you for considering a contribution to Parliament Sandbox Simulator.

## Development setup

Requirements: Node.js 22 or later and npm.

```bash
cd website
npm install
npm run dev
```

## Before submitting a change

Run the available checks:

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

Please include or update automated tests when changing parliamentary calculations, voting behaviour, data conversion, or project storage.

## Project architecture

- src/lib/parliament.ts: parliamentary composition and seat allocation operations.
- src/lib/voting.ts: deterministic voting engine and threshold calculations.
- src/lib/stats.ts: parliamentary statistics.
- src/lib/projectStorage.ts: browser-local IndexedDB project store and recovery snapshots.
- src/components/: interface and visualisation components.

## Pull requests

Keep changes focused, explain the user-facing impact, and note any migration or compatibility concerns. Do not include personal data or real people's private information in sample projects.

## License and attribution

Contributions are distributed under the project's Parliament Sandbox Attribution License (PSAL) 1.0 unless a different written agreement is made. Review the root LICENSE before contributing. Commercial use requires the attribution described there.
