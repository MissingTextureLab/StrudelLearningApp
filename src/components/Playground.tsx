import { codemirrorSettings, StrudelMirror } from '@strudel/codemirror';
import { transpiler } from '@strudel/transpiler';
import { webaudioOutput } from '@strudel/webaudio';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { registerSoftEditorTheme } from '../lib/editorTheme';
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

// Editor chrome uses the exact same mint/iris tones as the rest of the app
// (see src/lib/editorTheme.ts) instead of a bundled theme's own palette.
codemirrorSettings.set({
  ...codemirrorSettings.get(),
  theme: registerSoftEditorTheme(),
  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
  fontSize: 15,
});

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
  const [sampleLoadError, setSampleLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

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

    // Strudel's visualizers (pianoroll, scope, spectrum...) draw to a canvas
    // with id="test-canvas". If it doesn't exist yet, Strudel creates one
    // itself as a fixed, full-viewport overlay. By creating it ourselves
    // inside the editor container first, Strudel reuses this one instead —
    // keeping the visuals confined to the editor instead of covering the
    // whole page. It's created imperatively (not as a React child) so it
    // stays in sync with the editor's own imperative mount/unmount below.
    const canvas = document.createElement('canvas');
    canvas.id = 'test-canvas';
    canvas.className = 'pointer-events-none absolute inset-0 z-10 h-full w-full';
    container.appendChild(canvas);

    const resizeCanvas = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = container.clientWidth * ratio;
      canvas.height = container.clientHeight * ratio;
    };
    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);
    // the editor's own layout settles a frame after mount, so the very
    // first ResizeObserver tick can still see a 0-height container
    const rafId = requestAnimationFrame(resizeCanvas);

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

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      editor.stop();
      editor.clear();
      editor.editor.destroy();
      container.innerHTML = '';
      editorRef.current = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    prebake()
      .then(() => {
        if (!cancelled) setIsLoadingSamples(false);
      })
      .catch((err: Error) => {
        if (!cancelled) setSampleLoadError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 font-sans">
        <button
          type="button"
          onClick={() => editorRef.current?.evaluate()}
          className="flex items-center gap-1.5 rounded-md border border-mint-400/30 bg-mint-400/10 px-4 py-1.5 text-sm font-medium text-mint-200 transition-colors hover:border-mint-400/50 hover:bg-mint-400/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint-400/60"
        >
          <span aria-hidden="true">▶</span> Play
        </button>
        <button
          type="button"
          onClick={() => editorRef.current?.stop()}
          className="flex items-center gap-1.5 rounded-md border border-zinc-700 px-4 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800/40 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint-400/60"
        >
          <span aria-hidden="true">■</span> Stop
        </button>
        <button
          type="button"
          onClick={() => setIsNaming((v) => !v)}
          aria-expanded={isNaming}
          className="rounded-md border border-zinc-700 px-4 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800/40 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint-400/60"
        >
          Guardar
        </button>
        <span className="text-xs text-zinc-500">
          <span className={isPlaying ? 'text-mint-400' : 'text-zinc-600'}>{isPlaying ? '●' : '○'}</span>{' '}
          {isPlaying ? 'reproduciendo' : 'detenido'} — Ctrl/Alt+Enter para evaluar, Ctrl/Alt+. para parar
        </span>
      </div>
      {isLoadingSamples && !sampleLoadError && (
        <div className="font-sans text-xs text-iris-300">
          <span className="animate-pulse">···</span> cargando muestras y soundfonts (piano, batería,
          sintetizadores...) — puede tardar unos segundos la primera vez
        </div>
      )}
      {sampleLoadError && (
        <div className="flex items-center gap-2 rounded-md border-l-2 border-amber-400/70 bg-zinc-900/40 px-3 py-2 font-sans text-xs text-amber-300">
          <span className="flex-1">
            No se pudieron cargar las muestras de sonido ({sampleLoadError}). Comprueba tu conexión.
          </span>
          <button
            type="button"
            onClick={() => {
              setSampleLoadError(null);
              setRetryCount((c) => c + 1);
            }}
            className="shrink-0 rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-1 font-medium text-amber-200 transition-colors hover:border-amber-400/50 hover:bg-amber-400/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/60"
          >
            Reintentar
          </button>
        </div>
      )}
      {isNaming && (
        <div className="flex items-center gap-2 font-sans">
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
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 outline-none focus:border-mint-400/60 focus-visible:ring-1 focus-visible:ring-mint-400/60"
          />
          <button
            type="button"
            onClick={confirmSave}
            className="rounded-md border border-mint-400/30 bg-mint-400/10 px-3 py-1.5 text-sm font-medium text-mint-200 transition-colors hover:border-mint-400/50 hover:bg-mint-400/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint-400/60"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setIsNaming(false)}
            className="rounded-md border border-zinc-800 px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-mint-400/60"
          >
            Cancelar
          </button>
        </div>
      )}
      <div className="rounded-lg border border-zinc-700/80">
        <div className="flex items-center gap-2 rounded-t-lg border-b border-zinc-700/80 bg-zinc-900/60 px-3 py-1.5 font-sans text-[11px] text-zinc-500">
          <span aria-hidden="true" className={isPlaying ? 'text-mint-400' : 'text-zinc-600'}>
            ●
          </span>
          <span>patrón.str</span>
        </div>
        <div ref={containerRef} className="relative overflow-hidden rounded-b-lg" />
      </div>
      {error && (
        <div className="rounded-md border-l-2 border-red-400/70 bg-zinc-900/40 px-3 py-2 font-sans text-sm text-red-300">
          {error}
        </div>
      )}
    </div>
  );
});
