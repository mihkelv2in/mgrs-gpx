import type { ExportFormat, Marker } from '../types'
import { buildGpx } from './buildGpx'
import { buildKml } from './buildKml'

export async function exportMarkers(markers: Marker[], name = 'markers', format: ExportFormat = 'gpx'): Promise<void> {
  const config = format === 'kml'
    ? {
        content: buildKml(markers, name),
        fileName: `${name}.kml`,
        mime: 'application/vnd.google-earth.kml+xml',
      }
    : {
        content: buildGpx(markers, name),
        fileName: `${name}.gpx`,
        mime: 'application/gpx+xml',
      }

  const file = new File([config.content], config.fileName, { type: config.mime })

  try {
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: config.fileName })
      return
    }
  } catch (e) {
    if (e instanceof Error && e.name !== 'AbortError') console.error(e)
    else return
  }

  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = config.fileName
  a.click()
  URL.revokeObjectURL(url)
}
