export function formatMgrs(mgrs: string): string {
  const match = mgrs.match(/^(\d{1,2}[A-Z])([A-Z]{2})(\d*)$/)
  if (!match) return mgrs
  const [, gzd, square, digits] = match
  if (!digits.length) return `${gzd} ${square}`
  const half = digits.length / 2
  return `${gzd} ${square} ${digits.slice(0, half)} ${digits.slice(half)}`
}

export function buildLabel(prefix: string, index: number): string {
  return `${prefix.toUpperCase().slice(0, 5)}${String(index).padStart(3, '0')}`
}

export function defaultSetName(): string {
  const now = new Date()
  const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return `Import ${date} ${time}`
}
