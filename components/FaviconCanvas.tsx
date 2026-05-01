'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const SIZE = 256;

interface FaviconCanvasProps {
  mode: 'text' | 'file' | 'emoji';
  text: string;
  bgColor: string;
  fgColor: string;
  file: File | null;
  emoji: string;
  onDataUrl?: (url: string) => void;
}

export interface FaviconCanvasHandle {
  getDataURL: () => string;
}

function drawText(
  ctx: CanvasRenderingContext2D,
  size: number,
  cfg: { text: string; fg: string }
) {
  const text = (cfg.text || '').slice(0, 3);
  const len = text.length;
  const fontSize = size * (len === 1 ? 0.7 : len === 2 ? 0.55 : 0.42);
  ctx.font = `700 ${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = cfg.fg;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size / 2, size / 2 + size * 0.02);
}

const FaviconCanvas = forwardRef<FaviconCanvasHandle, FaviconCanvasProps>(
  ({ mode, text, bgColor, fgColor, file, emoji, onDataUrl }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const previewRef = useRef<HTMLImageElement>(null);

    useImperativeHandle(ref, () => ({
      getDataURL: () => canvasRef.current?.toDataURL('image/png') ?? '',
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = SIZE * dpr;
      canvas.height = SIZE * dpr;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      const flush = () => {
        const url = canvas.toDataURL('image/png');
        if (previewRef.current) previewRef.current.src = url;
        onDataUrl?.(url);
      };

      if (mode === 'file' && file) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, SIZE, SIZE);
        flush();

        const url = URL.createObjectURL(file);
        let active = true;
        const img = new Image();

        img.onload = () => {
          URL.revokeObjectURL(url);
          if (!active) return;
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, SIZE, SIZE);
          const ratio = Math.min(SIZE / img.width, SIZE / img.height);
          const w = img.width * ratio;
          const h = img.height * ratio;
          ctx.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h);
          flush();
        };
        img.onerror = () => URL.revokeObjectURL(url);
        img.src = url;

        return () => { active = false; };
      }

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, SIZE, SIZE);

      if (mode === 'emoji') {
        ctx.font = `${SIZE * 0.78}px 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji || '', SIZE / 2, SIZE / 2);
      } else {
        drawText(ctx, SIZE, { text, fg: fgColor });
      }

      flush();
    }, [text, bgColor, fgColor, mode, file, emoji, onDataUrl]);

    return (
      <>
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', left: -9999, opacity: 0 }}
          width={SIZE}
          height={SIZE}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={previewRef}
          alt="Favicon preview"
          width={128}
          height={128}
          className="rounded-lg border border-zinc-200 dark:border-zinc-700"
        />
      </>
    );
  }
);

FaviconCanvas.displayName = 'FaviconCanvas';

export default FaviconCanvas;