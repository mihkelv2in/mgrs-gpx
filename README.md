# MGRS Exporter

A browser-based tool for converting [MGRS](https://en.wikipedia.org/wiki/Military_grid_reference_system) coordinates into GPX or KML waypoint files.

Paste a list of MGRS coordinates, label them, and export a `.gpx` or `.kml` file ready to load into any GPS device or mapping app.

## Features

- Parse one or more MGRS coordinates (one per line), with whitespace tolerance
- Auto-label waypoints with a configurable prefix + sequential number (e.g. `WP01`, `WP02`), or set custom labels per waypoint
- Save waypoint sets to the browser (localStorage) for later use
- Export directly to `.gpx` or `.kml` — uses the Web Share API on mobile, falls back to a download link on desktop
- Select and merge waypoints across multiple saved sets into a single GPX or KML export
- Dark / light theme

## Usage

1. Open the app in a browser.
2. Paste MGRS coordinates into the **Input** tab (one per line).
3. Click **Parse**. Valid entries show their labels; invalid entries are flagged with an error.
4. Optionally set a label prefix and/or custom labels per waypoint.
5. Choose **GPX** or **KML**, then click **Export** to download the file, or **Save** to store the set for later.
6. Switch to the **Saved sets** tab to manage saved sets and export waypoints across multiple sets at once.

## Stack

- [React](https://react.dev) + [Vite](https://vitejs.dev)
- [mgrs](https://www.npmjs.com/package/mgrs) — MGRS ↔ lat/lon conversion
- [Tailwind CSS](https://tailwindcss.com)
- TypeScript

## Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```
