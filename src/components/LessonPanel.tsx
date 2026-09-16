import { useState } from 'react';
import { lessons } from '../data/lessons';

interface LessonPanelProps {
  onLoadCode: (code: string) => void;
}

const blocks: { name: string; lessons: typeof lessons }[] = [];
for (const l of lessons) {
  const existing = blocks.find((b) => b.name === l.block);
  if (existing) {
    existing.lessons.push(l);
  } else {
    blocks.push({ name: l.block, lessons: [l] });
  }
}

export function LessonPanel({ onLoadCode }: LessonPanelProps) {
  const [activeId, setActiveId] = useState(lessons[0].id);
  const [openHints, setOpenHints] = useState<Record<number, boolean>>({});
  const [openBlocks, setOpenBlocks] = useState<Record<string, boolean>>(() => ({
    [blocks.find((b) => b.lessons.some((l) => l.id === lessons[0].id))!.name]: true,
  }));
  const lesson = lessons.find((l) => l.id === activeId) ?? lessons[0];

  const selectLesson = (id: string) => {
    setActiveId(id);
    setOpenHints({});
  };

  return (
    <div className="flex flex-col gap-4">
      <div aria-label="Lecciones" className="flex flex-col gap-1">
        {blocks.map((block) => {
          const isOpen = !!openBlocks[block.name];
          return (
            <div key={block.name} className="rounded-md border border-zinc-800 bg-zinc-900/40">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenBlocks((prev) => ({ ...prev, [block.name]: !prev[block.name] }))}
                className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                <span aria-hidden="true" className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
                <span className="flex-1">{block.name}</span>
                <span className="text-[10px] font-normal text-zinc-600">{block.lessons.length}</span>
              </button>
              {isOpen && (
                <div role="tablist" aria-label={block.name} className="flex flex-wrap gap-1.5 px-2.5 pb-2">
                  {block.lessons.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      role="tab"
                      aria-selected={l.id === activeId}
                      onClick={() => selectLesson(l.id)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                        l.id === activeId ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                    >
                      {l.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
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
              className="group flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-left hover:border-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            >
              <span aria-hidden="true" className="text-purple-400 group-hover:text-purple-300">▶</span>
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
                    className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                  >
                    Cargar punto de partida
                  </button>
                )}
                {exercise.hint && (
                  <button
                    type="button"
                    aria-expanded={!!openHints[i]}
                    onClick={() => setOpenHints((prev) => ({ ...prev, [i]: !prev[i] }))}
                    className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
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
