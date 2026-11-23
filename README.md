# Parliament Sandbox Simulator

Automatic GitHub Pages deployment for the Parliament Sandbox Simulator.

## How deployment works

The repository stores the uploaded project archive as compact base64 parts. GitHub Actions joins the parts, decodes and decompresses the archive to recover the original ZIP, extracts it, adapts the project for static hosting, builds the website, and deploys it to GitHub Pages.

The workflow is triggered by updates to `archive_parts/**`. Future source updates can replace the archive parts, after which GitHub Actions will rebuild and republish the site.

## Public website

https://stever0bat.github.io/Parliament-Sandbox-Simulator/

## Storage limitation

The original project uses a PostgreSQL API for saving projects. GitHub Pages only hosts static files, so this deployment moves the project library to each visitor's browser storage. Creating, editing, renaming, duplicating, importing, exporting, and autosaving projects work within that browser. Saved parliaments are not automatically shared between different visitors, browsers, or devices.
