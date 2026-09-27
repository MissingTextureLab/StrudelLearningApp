import { useState } from 'react';
import { referenceCategories } from '../data/reference';
import { renderInlineCode } from '../lib/inlineCode';

interface ReferencePanelProps {
  onLoadCode: (code: string) => void;
}

export function ReferencePanel({ onLoadCode }: ReferencePanelProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(referenceCategories[0]?.id ?? null);

  return (
    <div className="flex flex-col gap-1">
      {referenceCategories.map((category) => {
        const isOpen = openCategory === category.id;
        return (
          <div key={category.id} className="rounded-lg border border-zinc-800/80">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenCategory(isOpen ? null : category.id)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint-400/60"
            >
              <span aria-hidden="true" className={`text-mint-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}>
                ▶
              </span>
              <span className="flex-1">
                <span className={`block font-sans text-sm font-medium ${isOpen ? 'text-iris-300' : 'text-zinc-200'}`}>
                  {category.title}
                </span>
                <span className="block font-sans text-xs text-zinc-500">{category.summary}</span>
              </span>
            </button>
            {isOpen && (
              <div className="flex flex-col gap-3 border-t border-zinc-800/80 px-3 py-3">
                {category.entries.map((entry) => (
                  <div key={entry.name}>
                    <div className="flex items-baseline gap-2">
                      <code className="text-sm text-mint-300">{entry.name}</code>
                      <span className="font-sans text-xs text-zinc-500">{entry.syntax}</span>
                    </div>
                    <p className="mt-1 font-sans text-xs leading-relaxed text-zinc-400">
                      {renderInlineCode(entry.description)}
                    </p>
                    <div className="mt-2 flex flex-col gap-1">
                      {entry.examples.map((example) => (
                        <button
                          key={example.label}
                          type="button"
                          onClick={() => onLoadCode(example.code)}
                          className="group flex items-center gap-2 rounded-md border border-zinc-800/80 bg-zinc-900/30 px-2 py-1.5 text-left transition-colors hover:border-mint-400/30 hover:bg-mint-400/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint-400/60"
                        >
                          <span aria-hidden="true" className="text-mint-400 group-hover:text-mint-300">
                            ▶
                          </span>
                          <span className="flex-1 truncate font-mono text-xs text-zinc-300">
                            {example.code.split('\n')[0]}
                          </span>
                          <span className="shrink-0 font-sans text-[10px] text-zinc-600">{example.label}</span>
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
