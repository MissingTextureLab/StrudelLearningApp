import type { ReactNode } from 'react';

// Lesson/reference copy is written with `code` spans for terms like
// `.pianoroll()` — this renders those spans as styled <code> instead of
// showing the literal backticks.
export function renderInlineCode(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
      return (
        <code key={i} className="rounded-sm bg-mint-400/10 px-1 py-0.5 text-[0.9em] text-mint-300">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
