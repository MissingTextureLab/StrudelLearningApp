import { useState } from 'react';
import { lessons } from '../data/lessons';

interface LessonPanelProps {
  onLoadCode: (code: string) => void;
}

export function LessonPanel({ onLoadCode }: LessonPanelProps) {
  const [activeId, setActiveId] = useState(lessons[0].id);
  const [openHints, setOpenHints] = useState<Record<number, boolean>>({});
  const lesson = lessons.find((l) => l.id === activeId) ?? lessons[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-1.5">
        {lessons.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => {
              setActiveId(l.id);
              setOpenHints({});
            }}
            className={`rounded-md px-2.5 py-1 text-xs font-medium ${
              l.id === activeId ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {l.title}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {lesson.concept.map((paragraph, i) => (
          <p key={i} className="text-sm leading-relaxed text-zinc-300">
            {paragraph}
          </p>
        ))}
      </div>

      {lesson.examples.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Ejemplos</h3>
          {lesson.examples.map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => onLoadCode(example.code)}
              className="group flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-left hover:border-purple-700"
            >
              <span className="text-purple-400 group-hover:text-purple-300">▶</span>
              <span className="flex-1 truncate font-mono text-xs text-zinc-300">{example.code.split('\n')[0]}</span>
              <span className="shrink-0 text-[10px] text-zinc-600">{example.label}</span>
            </button>
          ))}
        </div>
      )}

      {lesson.exercises.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Ejercicios</h3>
          {lesson.exercises.map((exercise, i) => (
            <div key={i} className="rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2">
              <p className="text-sm text-zinc-300">{exercise.prompt}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {exercise.starterCode && (
                  <button
                    type="button"
                    onClick={() => onLoadCode(exercise.starterCode!)}
                    className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
                  >
                    Cargar punto de partida
                  </button>
                )}
                {exercise.hint && (
                  <button
                    type="button"
                    onClick={() => setOpenHints((prev) => ({ ...prev, [i]: !prev[i] }))}
                    className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
                  >
                    {openHints[i] ? 'Ocultar pista' : 'Ver pista'}
                  </button>
                )}
              </div>
              {openHints[i] && exercise.hint && (
                <pre className="mt-2 overflow-x-auto rounded bg-black/40 px-2 py-1.5 text-xs text-purple-300">
                  {exercise.hint}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
