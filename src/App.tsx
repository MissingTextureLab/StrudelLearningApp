import { useRef, useState } from 'react'
import { LessonPanel } from './components/LessonPanel'
import { Playground, type PlaygroundHandle } from './components/Playground'
import { ReferencePanel } from './components/ReferencePanel'

type Tab = 'lessons' | 'reference'

function App() {
  const [tab, setTab] = useState<Tab>('lessons')
  const playgroundRef = useRef<PlaygroundHandle>(null)

  const loadCode = (code: string) => playgroundRef.current?.loadCode(code)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:h-screen lg:flex-row lg:overflow-hidden lg:py-4">
      <aside className="flex min-h-0 flex-col gap-3 lg:w-96 lg:shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Strudel Learning App</h1>
          <p className="text-xs text-zinc-500">Live coding musical — strudel.cc</p>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setTab('lessons')}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium ${
              tab === 'lessons' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            Lecciones
          </button>
          <button
            type="button"
            onClick={() => setTab('reference')}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium ${
              tab === 'reference' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            Referencia
          </button>
        </div>
        <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
          {tab === 'lessons' ? <LessonPanel onLoadCode={loadCode} /> : <ReferencePanel onLoadCode={loadCode} />}
        </div>
      </aside>

      <main className="min-w-0 flex-1 lg:overflow-y-auto lg:pr-1">
        <Playground ref={playgroundRef} />
      </main>
    </div>
  )
}

export default App
