'use client';

import { useRef, useState } from 'react';
import FaviconCanvas, { FaviconCanvasHandle } from '@/components/FaviconCanvas';
import InputTabs from '@/components/InputTabs';
import FaviconPreview from '@/components/FaviconPreview';

type Mode = 'text' | 'file' | 'emoji';

export default function Home() {
  const [mode, setMode] = useState<Mode>('text');
  const [text, setText] = useState('Fv');
  const [bgColor, setBgColor] = useState('#6366f1');
  const [fgColor, setFgColor] = useState('#ffffff');
  const [file, setFile] = useState<File | null>(null);
  const [emoji, setEmoji] = useState('🚀');
  const [siteTitle, setSiteTitle] = useState('My App');
  const [dataUrl, setDataUrl] = useState('');
  const [generating, setGenerating] = useState(false);

  const canvasRef = useRef<FaviconCanvasHandle>(null);

  async function handleDownload() {
    const image = canvasRef.current?.getDataURL();
    if (!image) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, pro: false }),
      });
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = 'favicon.ico';
      a.click();
      URL.revokeObjectURL(objectUrl);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-8">
      <main className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Favicon Generator
        </h1>

        <InputTabs activeTab={mode} onChange={setMode} />

        <div className="flex flex-col gap-4">
          {mode === 'text' && (
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
          )}

          {mode === 'file' && (
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-indigo-500 file:mr-3 file:text-sm file:font-medium file:text-indigo-600 file:bg-transparent file:border-0 file:cursor-pointer"
              />
            </label>
          )}

          {mode === 'emoji' && (
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Emoji</span>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="Enter an emoji"
                className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
          )}

          <label className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Background</span>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-9 w-16 cursor-pointer rounded border border-zinc-300 dark:border-zinc-700 bg-transparent p-0.5"
            />
          </label>

          {mode === 'text' && (
            <label className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Text color</span>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="h-9 w-16 cursor-pointer rounded border border-zinc-300 dark:border-zinc-700 bg-transparent p-0.5"
              />
            </label>
          )}

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Site title</span>
            <input
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              placeholder="My App"
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>
        </div>

        <div className="flex flex-col items-center gap-3">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Preview (128×128)</span>
          <FaviconCanvas
            ref={canvasRef}
            mode={mode}
            text={text}
            bgColor={bgColor}
            fgColor={fgColor}
            file={file}
            emoji={emoji}
            onDataUrl={setDataUrl}
          />
        </div>

        {dataUrl && (
          <div className="flex flex-col gap-3">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">Browser preview</span>
            <FaviconPreview dataUrl={dataUrl} siteTitle={siteTitle} />
          </div>
        )}

        <button
          type="button"
          onClick={handleDownload}
          disabled={!dataUrl || generating}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {generating ? 'Generating...' : 'Download favicon.ico'}
        </button>
      </main>
    </div>
  );
}