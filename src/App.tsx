import { useRef, useState } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LessonPanel } from './components/LessonPanel'
import { Playground, type PlaygroundHandle } from './components/Playground'
import { ReferencePanel } from './components/ReferencePanel'
import { SavedPatternsPanel } from './components/SavedPatternsPanel'
import { deletePattern, getSavedPatterns, importPatternsJson, renamePattern, type SavedPattern } from './lib/storage'

type Tab = 'lessons' | 'reference' | 'saved'

function App() {
  const [tab, setTab] = useState<Tab>('lessons')
  const [savedPatterns, setSavedPatterns] = useState<SavedPattern[]>(() => getSavedPatterns())
  const playgroundRef = useRef<PlaygroundHandle>(null)

  const loadCode = (code: string) => playgroundRef.current?.loadCode(code)
  const refreshPatterns = () => setSavedPatterns(getSavedPatterns())
  const importPatterns = (json: string): string | null => {
    try {
      setSavedPatterns(importPatternsJson(json))
      return null
    } catch (err) {
      return err instanceof Error ? err.message : String(err)
    }
  }

  const tabs: { id: Tab; file: string; ext: string }[] = [
    { id: 'lessons', file: 'lecciones', ext: '.md' },
    { id: 'reference', file: 'referencia', ext: '.d.ts' },
    { id: 'saved', file: 'patrones', ext: '.json' },
  ]

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:h-screen lg:flex-row lg:overflow-hidden lg:py-4">
      <aside className="flex min-h-0 flex-col gap-3 lg:w-96 lg:shrink-0">
        <div>
          <div className="flex items-baseline gap-2">
            <span aria-hidden="true" className="text-mint-400">
              &gt;
            </span>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
              Strudel Learning App
              <span aria-hidden="true" className="blink-caret text-mint-400">
                _
              </span>
            </h1>
          </div>
          <p className="pl-4 font-sans text-xs text-zinc-500">live coding musical — strudel.cc</p>
        </div>
        <div role="tablist" aria-label="Secciones" className="flex flex-wrap gap-1">
          {tabs.map((t) => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1 whitespace-nowrap rounded-md border px-2 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint-400/60 ${
                  active
                    ? 'border-mint-400/25 bg-mint-400/10 text-zinc-100'
                    : 'border-transparent text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'
                }`}
              >
                <span>{t.file}</span>
                <span className="opacity-60">{t.ext}</span>
                {t.id === 'saved' && savedPatterns.length > 0 && (
                  <span className="rounded-full bg-mint-400/15 px-1.5 text-[10px] text-mint-300">
                    {savedPatterns.length}
                  </span>
                )}
              </button>
            )
          })}
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
              onImport={importPatterns}
            />
          )}
        </div>
      </aside>

      <main className="min-w-0 flex-1 lg:overflow-y-auto lg:pr-1">
        <ErrorBoundary>
          <Playground ref={playgroundRef} onPatternSaved={refreshPatterns} />
        </ErrorBoundary>
      </main>
    </div>
  )
}

export default App
