import { useState } from 'react';
import { lessons } from '../data/lessons';
import { renderInlineCode } from '../lib/inlineCode';

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
            <div key={block.name} className="rounded-lg border border-zinc-800/80">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenBlocks((prev) => ({ ...prev, [block.name]: !prev[block.name] }))}
                className={`flex w-full items-start gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint-400/60 ${
                  isOpen ? 'text-iris-300' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`shrink-0 pt-px text-mint-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                >
                  ▶
                </span>
                <span className="flex-1">{block.name}</span>
                <span className="shrink-0 pt-px text-right text-[10px] font-normal text-zinc-600">
                  {block.lessons.length}
                </span>
              </button>
              {isOpen && (
                <div role="tablist" aria-label={block.name} className="flex flex-col gap-1 px-2.5 pb-2">
                  {block.lessons.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      role="tab"
                      aria-selected={l.id === activeId}
                      onClick={() => selectLesson(l.id)}
                      className={`w-full rounded-md border px-2.5 py-1 text-left text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint-400/60 ${
                        l.id === activeId
                          ? 'border-mint-400/30 bg-mint-400/10 text-mint-200'
                          : 'border-transparent text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'
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

      <div className="flex flex-col gap-3 border-l-2 border-iris-900/70 pl-4">
        {lesson.concept.map((paragraph, i) => (
          <p key={i} className="font-sans text-sm leading-relaxed text-zinc-300">
            {renderInlineCode(paragraph)}
          </p>
        ))}
      </div>

      {lesson.examples.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <h3 className="font-sans text-xs font-medium text-zinc-500">Ejemplos</h3>
          {lesson.examples.map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => onLoadCode(example.code)}
              className="group flex items-center gap-2 rounded-md border border-zinc-800/80 bg-zinc-900/30 px-2 py-1.5 text-left transition-colors hover:border-mint-400/30 hover:bg-mint-400/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint-400/60"
            >
              <span aria-hidden="true" className="text-mint-400 group-hover:text-mint-300">
                ▶
              </span>
              <span className="flex-1 truncate font-mono text-xs text-zinc-300">{example.code.split('\n')[0]}</span>
              <span className="shrink-0 font-sans text-[10px] text-zinc-600">{example.label}</span>
            </button>
          ))}
        </div>
      )}

      {lesson.exercises.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="font-sans text-xs font-medium text-zinc-500">Ejercicios</h3>
          {lesson.exercises.map((exercise, i) => (
            <div key={i} className="rounded-lg border border-zinc-800/80 bg-zinc-900/20 px-3 py-2">
              <p className="font-sans text-sm text-zinc-300">{renderInlineCode(exercise.prompt)}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {exercise.starterCode && (
                  <button
                    type="button"
                    onClick={() => onLoadCode(exercise.starterCode!)}
                    className="rounded-md border border-zinc-800 px-2 py-1 font-sans text-xs text-zinc-400 transition-colors hover:border-zinc-600 hover:bg-zinc-800/40 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint-400/60"
                  >
                    Cargar punto de partida
                  </button>
                )}
                {exercise.hint && (
                  <button
                    type="button"
                    aria-expanded={!!openHints[i]}
                    onClick={() => setOpenHints((prev) => ({ ...prev, [i]: !prev[i] }))}
                    className="rounded-md border border-zinc-800 px-2 py-1 font-sans text-xs text-zinc-400 transition-colors hover:border-zinc-600 hover:bg-zinc-800/40 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint-400/60"
                  >
                    {openHints[i] ? 'Ocultar pista' : 'Ver pista'}
                  </button>
                )}
              </div>
              {openHints[i] && exercise.hint && (
                <pre className="mt-2 overflow-x-auto rounded-md border border-zinc-800/80 bg-black/30 px-2 py-1.5 text-xs text-mint-300">
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
