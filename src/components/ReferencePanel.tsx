import { useState } from 'react';
import { referenceCategories } from '../data/reference';

interface ReferencePanelProps {
  onLoadCode: (code: string) => void;
}

export function ReferencePanel({ onLoadCode }: ReferencePanelProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(referenceCategories[0]?.id ?? null);

  return (
    <div className="flex flex-col gap-2">
      {referenceCategories.map((category) => {
        const isOpen = openCategory === category.id;
        return (
          <div key={category.id} className="rounded-lg border border-zinc-800">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenCategory(isOpen ? null : category.id)}
              className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            >
              <span>
                <span className="block text-sm font-semibold text-zinc-100">{category.title}</span>
                <span className="block text-xs text-zinc-500">{category.summary}</span>
              </span>
              <span aria-hidden="true" className="shrink-0 text-zinc-500">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div className="flex flex-col gap-3 border-t border-zinc-800 px-3 py-3">
                {category.entries.map((entry) => (
                  <div key={entry.name}>
                    <div className="flex items-baseline gap-2">
                      <code className="text-sm text-purple-300">{entry.name}</code>
                      <span className="text-xs text-zinc-500">{entry.syntax}</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-400">{entry.description}</p>
                    <div className="mt-2 flex flex-col gap-1">
                      {entry.examples.map((example) => (
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
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
