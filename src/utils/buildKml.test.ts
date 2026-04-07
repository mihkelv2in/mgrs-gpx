import { describe, it, expect } from 'vitest'
import { buildKml } from './buildKml'
import type { Marker } from '../types'

const MARKER: Marker = { id: '1', label: 'TGT001', mgrs: '33UXP0000000000', lat: 51.5, lon: 0.1 }

describe('buildKml', () => {
  it('produces valid XML declaration and kml root', () => {
    const result = buildKml([MARKER])
    expect(result).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/)
    expect(result).toContain('<kml ')
    expect(result).toContain('</kml>')
  })

  it('includes placemark name, description, and coordinates', () => {
    const result = buildKml([MARKER], 'Alpha Set')
    expect(result).toContain('<name>Alpha Set</name>')
    expect(result).toContain(`<name>${MARKER.label}</name>`)
    expect(result).toContain(`<description>${MARKER.mgrs}</description>`)
    expect(result).toContain(`<coordinates>${MARKER.lon.toFixed(8)},${MARKER.lat.toFixed(8)},0</coordinates>`)
  })

  it('escapes XML-sensitive characters in label', () => {
    const m: Marker = { ...MARKER, label: 'A&B <C>' }
    const result = buildKml([m])
    expect(result).toContain('<name>A&amp;B &lt;C&gt;</name>')
  })
})
