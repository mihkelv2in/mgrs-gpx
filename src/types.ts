export interface ValidParsedEntry {
  raw: string
  mgrs: string
  lat: number
  lon: number
  valid: true
}

export interface InvalidParsedEntry {
  raw: string
  error: string
  valid: false
}

export type ParsedEntry = ValidParsedEntry | InvalidParsedEntry

export interface Marker {
  id: string
  label: string
  mgrs: string
  lat: number
  lon: number
}

export interface MarkerSet {
  id: string
  name: string
  prefix: string
  createdAt: string
  markers: Marker[]
}
