# Parliament Sandbox Simulator

Automatic GitHub Pages publisher for the Parliament Sandbox Simulator.

## One-time GitHub Pages setup

The ZIP is already stored in this repository as compact base64 archive parts. The GitHub Actions workflow joins those parts, reconstructs the original ZIP, extracts it, prepares the Next.js project for static hosting, builds the site, and deploys it.

Before the first deployment, a repository owner must create the Pages site once:

1. Open **Settings → Pages**: https://github.com/SteveR0BAT/Parliament-Sandbox-Simulator/settings/pages
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Open **Actions → Publish Parliament Sandbox Simulator** and select **Run workflow**.

After that initial setup, changes to `archive_parts/**` automatically trigger a rebuild and deployment.

## Public website

https://stever0bat.github.io/Parliament-Sandbox-Simulator/

## Storage limitation

The original project uses a PostgreSQL API for saving projects. GitHub Pages only hosts static files, so this deployment moves the project library to each visitor's browser storage. Creating, editing, renaming, duplicating, importing, exporting, and autosaving projects work within that browser. Saved parliaments are not automatically shared between different visitors, browsers, or devices.
