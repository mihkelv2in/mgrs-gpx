import type { Marker } from '../types'

function xmlEsc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function buildKml(markers: Marker[], name = 'markers'): string {
  const placemarks = markers.map(w =>
    `    <Placemark>
      <name>${xmlEsc(w.label)}</name>
      <description>${xmlEsc(w.mgrs)}</description>
      <Point>
        <coordinates>${w.lon.toFixed(8)},${w.lat.toFixed(8)},0</coordinates>
      </Point>
    </Placemark>`
  ).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${xmlEsc(name)}</name>
${placemarks}
  </Document>
</kml>`
}
