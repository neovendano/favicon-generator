'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const SIZE = 256;

interface FaviconCanvasProps {
  text: string;
  bgColor: string;
  fgColor: string;
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
  ({ text, bgColor, fgColor }, ref) => {
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

      // Background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Text
      drawText(ctx, SIZE, { text, fg: fgColor });

      // Update preview
      if (previewRef.current) {
        previewRef.current.src = canvas.toDataURL('image/png');
      }
    }, [text, bgColor, fgColor]);

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