import { useState } from 'react';
import type { SavedPattern } from '../lib/storage';

interface SavedPatternsPanelProps {
  patterns: SavedPattern[];
  onLoadCode: (code: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function SavedPatternsPanel({ patterns, onLoadCode, onDelete, onRename }: SavedPatternsPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  if (patterns.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Aún no has guardado ningún patrón. Usa el botón 💾 Guardar del Playground para guardar lo que estés tocando —
        se guarda en este navegador (localStorage), no en la nube.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {patterns.map((pattern) => (
        <div key={pattern.id} className="rounded-lg border border-zinc-800 px-3 py-2">
          {editingId === pattern.id ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                value={editingName}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onRename(pattern.id, editingName.trim() || pattern.name);
                    setEditingId(null);
                  }
                  if (e.key === 'Escape') setEditingId(null);
                }}
                aria-label={`Renombrar patrón ${pattern.name}`}
                className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-200 outline-none focus:border-purple-600 focus-visible:ring-2 focus-visible:ring-purple-400"
              />
              <button
                type="button"
                onClick={() => {
                  onRename(pattern.id, editingName.trim() || pattern.name);
                  setEditingId(null);
                }}
                className="text-xs text-purple-400 hover:text-purple-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                OK
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-medium text-zinc-200">{pattern.name}</span>
              <span className="shrink-0 text-[10px] text-zinc-600">
                {new Date(pattern.updatedAt).toLocaleDateString('es-ES')}
              </span>
            </div>
          )}
          <pre className="mt-1 overflow-x-auto rounded bg-black/40 px-2 py-1 font-mono text-xs text-zinc-400">
            {pattern.code}
          </pre>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onLoadCode(pattern.code)}
              className="rounded bg-purple-600 px-2 py-1 text-xs font-medium text-white hover:bg-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            >
              <span aria-hidden="true">▶</span> Cargar
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingId(pattern.id);
                setEditingName(pattern.name);
              }}
              className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            >
              Renombrar
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm(`¿Eliminar "${pattern.name}"? No se puede deshacer.`)) onDelete(pattern.id);
              }}
              className="rounded bg-zinc-800 px-2 py-1 text-xs text-red-400 hover:bg-red-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
