import { describe, it, expect } from 'vitest'
import { buildGpx } from './buildGpx'
import type { Marker } from '../types'

const MARKER: Marker = { id: '1', label: 'TGT001', mgrs: '33UXP0000000000', lat: 51.5, lon: 0.1 }

describe('buildGpx', () => {
  it('produces valid XML declaration and gpx root', () => {
    const result = buildGpx([MARKER])
    expect(result).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/)
    expect(result).toContain('<gpx ')
    expect(result).toContain('</gpx>')
  })

  it('includes wpt element with correct lat/lon', () => {
    const result = buildGpx([MARKER])
    expect(result).toContain(`lat="${MARKER.lat.toFixed(8)}"`)
    expect(result).toContain(`lon="${MARKER.lon.toFixed(8)}"`)
  })

  it('includes marker label in <name> and MGRS in <desc>', () => {
    const result = buildGpx([MARKER])
    expect(result).toContain(`<name>${MARKER.label}</name>`)
    expect(result).toContain(`<desc>${MARKER.mgrs}</desc>`)
  })

  it('uses default name "markers" in metadata', () => {
    const result = buildGpx([MARKER])
    expect(result).toContain('<name>markers</name>')
  })

  it('uses provided name in metadata', () => {
    const result = buildGpx([MARKER], 'Alpha Set')
    expect(result).toContain('<name>Alpha Set</name>')
  })

  it('produces one wpt element per marker', () => {
    const second: Marker = { ...MARKER, id: '2', label: 'TGT002' }
    const result = buildGpx([MARKER, second])
    expect([...result.matchAll(/<wpt /g)]).toHaveLength(2)
  })

  it('produces no wpt elements for empty markers array', () => {
    const result = buildGpx([])
    expect(result).not.toContain('<wpt ')
  })

  it('escapes & in label', () => {
    const m: Marker = { ...MARKER, label: 'A&B' }
    expect(buildGpx([m])).toContain('<name>A&amp;B</name>')
  })

  it('escapes < and > in label', () => {
    const m: Marker = { ...MARKER, label: '<tag>' }
    expect(buildGpx([m])).toContain('<name>&lt;tag&gt;</name>')
  })

  it('escapes " and \' in label', () => {
    const m: Marker = { ...MARKER, label: `say "hello" it's fine` }
    expect(buildGpx([m])).toContain('&quot;hello&quot;')
    expect(buildGpx([m])).toContain('&apos;')
  })
})
