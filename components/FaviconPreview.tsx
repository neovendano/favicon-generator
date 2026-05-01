'use client';

interface FaviconPreviewProps {
  dataUrl: string;
  siteTitle: string;
}

const SIZE_CONFIGS = [
  { size: 16, label: 'browser tab' },
  { size: 32, label: 'pinned tab' },
  { size: 48, label: 'taskbar' },
] as const;

export default function FaviconPreview({ dataUrl, siteTitle }: FaviconPreviewProps) {
  if (!dataUrl) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-700 flex items-center px-3 gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dataUrl} alt="" width={16} height={16} className="shrink-0" />
          <span className="text-xs text-zinc-600 dark:text-zinc-300 truncate">{siteTitle}</span>
        </div>
        <div className="h-10 bg-white dark:bg-zinc-900" />
      </div>

      <div className="flex gap-6 justify-center items-end">
        {SIZE_CONFIGS.map(({ size, label }) => (
          <div key={size} className="flex flex-col items-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dataUrl}
              alt={`${size}px favicon`}
              width={size}
              height={size}
              className="shrink-0"
            />
            <span className="text-xs text-zinc-400 dark:text-zinc-500">{size}px</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}