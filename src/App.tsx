import { useState } from 'react'
import { useTheme } from './hooks/useTheme'
import { useSets } from './hooks/useSets'
import { parseLines } from './utils/parseMgrs'
import { buildLabel, defaultSetName } from './utils/formatters'
import { buildGpx } from './utils/buildGpx'
import TopBar from './components/TopBar'
import InstallHelpModal from './components/InstallHelpModal'
import InputSection from './components/InputSection'
import ParsedResults from './components/ParsedResults'
import SaveBar from './components/SaveBar'
import SetList from './components/SetList'
import ExportBar from './components/ExportBar'
import type { ParsedEntry } from './types'

export default function App() {
  const { dark, toggle } = useTheme()
  const { sets, addSet, deleteSet, deleteWaypoint } = useSets()

  const [tab, setTab] = useState<'input' | 'sets'>('input')
  const [raw, setRaw] = useState('')
  const [parsed, setParsed] = useState<ParsedEntry[]>([])
  const [customLabels, setCustomLabels] = useState<Record<number, string>>({})
  const [prefix, setPrefix] = useState('')
  const [setName, setSetName] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [savedMsg, setSavedMsg] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const validParsed = parsed.filter(p => p.valid)
  const invalidCount = parsed.filter(p => !p.valid).length

  function handleParse() {
    setParsed(parseLines(raw))
    setCustomLabels({})
    setSavedMsg(false)
  }

  function handleClear() {
    setRaw('')
    setParsed([])
    setCustomLabels({})
    setSetName('')
    setPrefix('')
    setSavedMsg(false)
  }

  function handleLabelChange(idx: number, value: string) {
    setCustomLabels(prev => ({ ...prev, [idx]: value }))
  }

  async function handleExport() {
    if (!validParsed.length) return
    const p = prefix.toUpperCase().slice(0, 5)
    const name = setName.trim() || defaultSetName()
    let validIdx = 0
    const waypoints = parsed.flatMap((entry, i) => {
      if (!entry.valid) return []
      const autoLabel = buildLabel(p, ++validIdx)
      return [{ id: crypto.randomUUID(), label: customLabels[i] ?? autoLabel, mgrs: entry.mgrs, lat: entry.lat, lon: entry.lon }]
    })
    const gpxStr = buildGpx(waypoints, name)
    const file = new File([gpxStr], `${name}.gpx`, { type: 'application/gpx+xml' })
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `${name}.gpx` })
        return
      }
    } catch (e) {
      if (e instanceof Error && e.name !== 'AbortError') console.error(e)
      else return
    }
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name}.gpx`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleSave() {
    if (!validParsed.length) return
    const p = prefix.toUpperCase().slice(0, 5)
    let validIdx = 0
    const waypoints = parsed.flatMap((entry, i) => {
      if (!entry.valid) return []
      const autoLabel = buildLabel(p, ++validIdx)
      return [{ id: crypto.randomUUID(), label: customLabels[i] ?? autoLabel, mgrs: entry.mgrs, lat: entry.lat, lon: entry.lon }]
    })
    addSet({
      id: crypto.randomUUID(),
      name: setName.trim() || defaultSetName(),
      prefix: p,
      createdAt: new Date().toISOString(),
      waypoints,
    })
    setParsed([])
    setRaw('')
    setSetName('')
    setPrefix('')
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 3000)
  }

  return (
    <div className={`min-h-screen bg-zinc-100 dark:bg-zinc-900 flex flex-col`}>
      <div className="max-w-lg mx-auto w-full flex flex-col min-h-screen">
        <TopBar dark={dark} onToggle={toggle} onHelp={() => setShowHelp(true)} />
        {showHelp && <InstallHelpModal onClose={() => setShowHelp(false)} />}

        <div className="flex border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          {(['input', 'sets'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t
                  ? 'border-blue-500 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900'
                  : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
              }`}
            >
              {t === 'input' ? 'Input' : `Saved sets${sets.length ? ` (${sets.length})` : ''}`}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto pb-20 bg-white dark:bg-zinc-900">
          {tab === 'input' && (
            <>
              <InputSection
                raw={raw}
                setRaw={setRaw}
                onParse={handleParse}
                onClear={handleClear}
                validCount={validParsed.length}
                invalidCount={invalidCount}
                hasParsed={parsed.length > 0}
              />
              <ParsedResults parsed={parsed} prefix={prefix} customLabels={customLabels} onLabelChange={handleLabelChange} />
              {validParsed.length > 0 && (
                <SaveBar
                  prefix={prefix}
                  setPrefix={setPrefix}
                  setName={setName}
                  onSetName={setSetName}
                  onSave={handleSave}
                  onExport={handleExport}
                />
              )}
              {savedMsg && (
                <div className="mx-4 mt-3 px-3 py-2 rounded-lg bg-green-900/20 border border-green-700/30 text-green-600 dark:text-green-400 text-sm">
                  Saved — view in Saved sets
                </div>
              )}
            </>
          )}

          {tab === 'sets' && (
            <SetList
              sets={sets}
              selected={selected}
              setSelected={setSelected}
              onDeleteSet={deleteSet}
              onDeleteWaypoint={deleteWaypoint}
            />
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto">
          <ExportBar
            selected={selected}
            sets={sets}
            onClear={() => setSelected(new Set())}
          />
        </div>
      </div>
    </div>
  )
}
