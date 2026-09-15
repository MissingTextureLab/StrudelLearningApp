import { StrudelMirror } from '@strudel/codemirror';
import { transpiler } from '@strudel/transpiler';
import { webaudioOutput } from '@strudel/webaudio';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { getAudioContext, prebake } from '../lib/strudel-setup';

interface StrudelMirrorInstance {
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

export const Playground = forwardRef<PlaygroundHandle>(function Playground(_props, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<StrudelMirrorInstance | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    loadCode: (code: string, autoplay = true) => {
      const editor = editorRef.current;
      if (!editor) return;
      editor.setCode(code);
      if (autoplay) editor.evaluate();
    },
  }));

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
          className="rounded-md bg-purple-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-purple-500"
        >
          ▶ Play
        </button>
        <button
          type="button"
          onClick={() => editorRef.current?.stop()}
          className="rounded-md bg-zinc-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-600"
        >
          ■ Stop
        </button>
        <span className="text-xs text-zinc-400">
          {isPlaying ? '● reproduciendo' : '○ detenido'} — Ctrl/Alt+Enter para evaluar, Ctrl/Alt+. para parar
        </span>
      </div>
      <div ref={containerRef} className="overflow-hidden rounded-lg border border-zinc-700" />
      {error && (
        <div className="rounded-md border border-red-800 bg-red-950/50 px-3 py-2 text-sm text-red-300">{error}</div>
      )}
    </div>
  );
});
