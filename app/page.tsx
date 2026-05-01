'use client';

import { useRef, useState } from 'react';
import FaviconCanvas, { FaviconCanvasHandle } from '@/components/FaviconCanvas';

export default function Home() {
  const [text, setText] = useState('Fv');
  const [bgColor, setBgColor] = useState('#6366f1');
  const [fgColor, setFgColor] = useState('#ffffff');

  const canvasRef = useRef<FaviconCanvasHandle>(null);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-8">
      <main className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-8 flex flex-col gap-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Favicon Generator
        </h1>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Text</span>
            <input
              type="text"
              value={text}
              maxLength={3}
              onChange={(e) => setText(e.target.value)}
              placeholder="Up to 3 chars"
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Background color</span>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-9 w-16 cursor-pointer rounded border border-zinc-300 dark:border-zinc-700 bg-transparent p-0.5"
            />
          </label>

          <label className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Text color</span>
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="h-9 w-16 cursor-pointer rounded border border-zinc-300 dark:border-zinc-700 bg-transparent p-0.5"
            />
          </label>
        </div>

        <div className="flex flex-col items-center gap-3">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Preview (128×128)</span>
          <FaviconCanvas ref={canvasRef} text={text} bgColor={bgColor} fgColor={fgColor} />
        </div>
      </main>
    </div>
  );
}