import { StrudelMirror } from '@strudel/codemirror';
import { transpiler } from '@strudel/transpiler';
import { webaudioOutput } from '@strudel/webaudio';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { getAudioContext, prebake } from '../lib/strudel-setup';
import { savePattern } from '../lib/storage';

interface StrudelMirrorInstance {
  code: string;
  evaluate: () => void;
  stop: () => void;
  setCode: (code: string) => void;
  editor: { destroy: () => void };
  clear: () => void;
}

const DEFAULT_CODE = `s("bd sd bd sd, hh*8")`;

export interface PlaygroundHandle {
  loadCode: (code: string, autoplay?: boolean) => void;
}

interface PlaygroundProps {
  onPatternSaved?: () => void;
}

export const Playground = forwardRef<PlaygroundHandle, PlaygroundProps>(function Playground({ onPatternSaved }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<StrudelMirrorInstance | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNaming, setIsNaming] = useState(false);
  const [patternName, setPatternName] = useState('');
  const [isLoadingSamples, setIsLoadingSamples] = useState(true);

  useImperativeHandle(ref, () => ({
    loadCode: (code: string, autoplay = true) => {
      const editor = editorRef.current;
      if (!editor) return;
      editor.setCode(code);
      if (autoplay) editor.evaluate();
    },
  }));

  const confirmSave = () => {
    const code = editorRef.current?.code ?? '';
    const name = patternName.trim() || `Patrón ${new Date().toLocaleString('es-ES')}`;
    savePattern(name, code);
    setIsNaming(false);
    setPatternName('');
    onPatternSaved?.();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const editor = new StrudelMirror({
      root: container,
      initialCode: DEFAULT_CODE,
      prebake,
      transpiler,
      getTime: () => getAudioContext().currentTime,
      defaultOutput: webaudioOutput,
      onToggle: (started: boolean) => setIsPlaying(started),
      onEvalError: (err: Error) => setError(err.message),
      afterEval: () => setError(null),
    }) as unknown as StrudelMirrorInstance;
    editorRef.current = editor;
    prebake().then(() => setIsLoadingSamples(false));

    return () => {
      editor.stop();
      editor.clear();
      editor.editor.destroy();
      container.innerHTML = '';
      editorRef.current = null;
    };
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => editorRef.current?.evaluate()}
          className="rounded-md bg-purple-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <span aria-hidden="true">▶</span> Play
        </button>
        <button
          type="button"
          onClick={() => editorRef.current?.stop()}
          className="rounded-md bg-zinc-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <span aria-hidden="true">■</span> Stop
        </button>
        <button
          type="button"
          onClick={() => setIsNaming((v) => !v)}
          aria-expanded={isNaming}
          className="rounded-md bg-zinc-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <span aria-hidden="true">💾</span> Guardar
        </button>
        <span className="text-xs text-zinc-400">
          {isPlaying ? '● reproduciendo' : '○ detenido'} — Ctrl/Alt+Enter para evaluar, Ctrl/Alt+. para parar
        </span>
      </div>
      {isLoadingSamples && (
        <div className="text-xs text-purple-400">⏳ Cargando muestras y soundfonts (piano, batería, sintetizadores...) — puede tardar unos segundos la primera vez.</div>
      )}
      {isNaming && (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            type="text"
            value={patternName}
            onChange={(e) => setPatternName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') confirmSave();
              if (e.key === 'Escape') setIsNaming(false);
            }}
            onFocus={(e) => e.target.select()}
            placeholder="Nombre del patrón..."
            aria-label="Nombre del patrón a guardar"
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 outline-none focus:border-purple-600 focus-visible:ring-2 focus-visible:ring-purple-400"
          />
          <button
            type="button"
            onClick={confirmSave}
            className="rounded-md bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setIsNaming(false)}
            className="rounded-md bg-zinc-800 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            Cancelar
          </button>
        </div>
      )}
      <div ref={containerRef} className="overflow-hidden rounded-lg border border-zinc-700" />
      {error && (
        <div className="rounded-md border border-red-800 bg-red-950/50 px-3 py-2 text-sm text-red-300">{error}</div>
      )}
    </div>
  );
});
