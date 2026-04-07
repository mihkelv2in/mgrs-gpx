import type { Marker } from '../types'

function xmlEsc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function buildGpx(markers: Marker[], name = 'markers'): string {
  const now = new Date().toISOString()
  const wpts = markers.map(w =>
    `  <wpt lat="${w.lat.toFixed(8)}" lon="${w.lon.toFixed(8)}">
    <name>${xmlEsc(w.label)}</name>
    <desc>${xmlEsc(w.mgrs)}</desc>
    <sym>Waypoint</sym>
  </wpt>`
  ).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="MGRS Exporter"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${xmlEsc(name)}</name>
    <time>${now}</time>
  </metadata>
${wpts}
</gpx>`
}
