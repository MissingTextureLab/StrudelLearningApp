import { useRef, useState } from 'react'
import { LessonPanel } from './components/LessonPanel'
import { Playground, type PlaygroundHandle } from './components/Playground'
import { ReferencePanel } from './components/ReferencePanel'
import { SavedPatternsPanel } from './components/SavedPatternsPanel'
import { deletePattern, getSavedPatterns, renamePattern, type SavedPattern } from './lib/storage'

type Tab = 'lessons' | 'reference' | 'saved'

function App() {
  const [tab, setTab] = useState<Tab>('lessons')
  const [savedPatterns, setSavedPatterns] = useState<SavedPattern[]>(() => getSavedPatterns())
  const playgroundRef = useRef<PlaygroundHandle>(null)

  const loadCode = (code: string) => playgroundRef.current?.loadCode(code)
  const refreshPatterns = () => setSavedPatterns(getSavedPatterns())

  const tabs: { id: Tab; label: string }[] = [
    { id: 'lessons', label: 'Lecciones' },
    { id: 'reference', label: 'Referencia' },
    { id: 'saved', label: `Mis patrones${savedPatterns.length ? ` (${savedPatterns.length})` : ''}` },
  ]

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:h-screen lg:flex-row lg:overflow-hidden lg:py-4">
      <aside className="flex min-h-0 flex-col gap-3 lg:w-96 lg:shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Strudel Learning App</h1>
          <p className="text-xs text-zinc-500">Live coding musical — strudel.cc</p>
        </div>
        <div role="tablist" aria-label="Secciones" className="flex gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                tab === t.id ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div role="tabpanel" className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
          {tab === 'lessons' && <LessonPanel onLoadCode={loadCode} />}
          {tab === 'reference' && <ReferencePanel onLoadCode={loadCode} />}
          {tab === 'saved' && (
            <SavedPatternsPanel
              patterns={savedPatterns}
              onLoadCode={loadCode}
              onDelete={(id) => setSavedPatterns(deletePattern(id))}
              onRename={(id, name) => setSavedPatterns(renamePattern(id, name))}
            />
          )}
        </div>
      </aside>

      <main className="min-w-0 flex-1 lg:overflow-y-auto lg:pr-1">
        <Playground ref={playgroundRef} onPatternSaved={refreshPatterns} />
      </main>
    </div>
  )
}

export default App
