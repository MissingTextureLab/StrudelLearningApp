import { useRef, useState } from 'react';
import { exportPatternsJson, type SavedPattern } from '../lib/storage';

interface SavedPatternsPanelProps {
  patterns: SavedPattern[];
  onLoadCode: (code: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  /** Returns an error message on failure, or null on success. */
  onImport: (json: string) => string | null;
}

export function SavedPatternsPanel({ patterns, onLoadCode, onDelete, onRename, onImport }: SavedPatternsPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const blob = new Blob([exportPatternsJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `strudel-patrones-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (file: File) => {
    setImportError(onImport(await file.text()));
  };

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2 font-sans">
      <button
        type="button"
        disabled={patterns.length === 0}
        onClick={handleExport}
        className="rounded-md border border-zinc-800 px-2 py-1 text-xs text-zinc-400 transition-colors hover:border-zinc-600 hover:bg-zinc-800/40 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint-400/60 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-zinc-800 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
      >
        ↓ exportar
      </button>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="rounded-md border border-zinc-800 px-2 py-1 text-xs text-zinc-400 transition-colors hover:border-zinc-600 hover:bg-zinc-800/40 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint-400/60"
      >
        ↑ importar
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImportFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );

  const importErrorBanner = importError && (
    <p className="rounded-md border-l-2 border-red-400/70 bg-zinc-900/40 px-3 py-2 font-sans text-xs text-red-300">
      No se pudo importar: {importError}
    </p>
  );

  if (patterns.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        {toolbar}
        {importErrorBanner}
        <p className="font-sans text-sm text-zinc-500">
          Aún no has guardado ningún patrón — usa "Guardar" en el playground para guardar lo que estés tocando (se
          guarda en este navegador, no en la nube).
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {toolbar}
      {importErrorBanner}
      <div className="flex flex-col gap-2">
        {patterns.map((pattern) => (
          <div key={pattern.id} className="rounded-lg border border-zinc-800/80 px-3 py-2">
            {editingId === pattern.id ? (
              <div className="flex items-center gap-2 font-sans">
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
                  className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-200 outline-none focus:border-mint-400/60 focus-visible:ring-1 focus-visible:ring-mint-400/60"
                />
                <button
                  type="button"
                  onClick={() => {
                    onRename(pattern.id, editingName.trim() || pattern.name);
                    setEditingId(null);
                  }}
                  className="text-xs text-mint-400 hover:text-mint-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint-400/60"
                >
                  OK
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 font-sans">
                <span className="truncate text-sm font-medium text-zinc-200">{pattern.name}</span>
                <span className="shrink-0 text-[10px] text-zinc-600">
                  {new Date(pattern.updatedAt).toLocaleDateString('es-ES')}
                </span>
              </div>
            )}
            <pre className="mt-1 overflow-x-auto rounded-md border border-zinc-800/80 bg-black/30 px-2 py-1 font-mono text-xs text-zinc-400">
              {pattern.code}
            </pre>
            <div className="mt-2 flex flex-wrap gap-2 font-sans">
              <button
                type="button"
                onClick={() => onLoadCode(pattern.code)}
                className="flex items-center gap-1 rounded-md border border-mint-400/30 bg-mint-400/10 px-2 py-1 text-xs font-medium text-mint-200 transition-colors hover:border-mint-400/50 hover:bg-mint-400/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint-400/60"
              >
                <span aria-hidden="true">▶</span> Cargar
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingId(pattern.id);
                  setEditingName(pattern.name);
                }}
                className="rounded-md border border-zinc-800 px-2 py-1 text-xs text-zinc-400 transition-colors hover:border-zinc-600 hover:bg-zinc-800/40 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint-400/60"
              >
                Renombrar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`¿Eliminar "${pattern.name}"? No se puede deshacer.`)) onDelete(pattern.id);
                }}
                className="rounded-md border border-zinc-800 px-2 py-1 text-xs text-red-400/90 transition-colors hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400/60"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
