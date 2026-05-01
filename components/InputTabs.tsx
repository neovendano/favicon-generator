'use client';

type TabId = 'text' | 'file' | 'emoji';

interface InputTabsProps {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'text', label: 'Text' },
  { id: 'file', label: 'File' },
  { id: 'emoji', label: 'Emoji' },
];

export default function InputTabs({ activeTab, onChange }: InputTabsProps) {
  return (

    <div className="flex gap-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 p-1">
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            activeTab === id
              ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}