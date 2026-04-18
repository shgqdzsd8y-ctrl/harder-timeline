import { useUIStore } from '../state/ui';

type Level = 1 | 2 | 3;

const options: { value: Level; label: string; title: string }[] = [
  { value: 1, label: 'All', title: 'Show all events including speculative ones' },
  { value: 2, label: '●● Partial+', title: 'Show partially cited and well-cited events' },
  { value: 3, label: '●●● Well-cited', title: 'Show only well-cited events' },
];

export default function FilterBar() {
  const { minConfidence, setMinConfidence } = useUIStore();

  return (
    <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 pb-4">
      <span className="text-[11px] uppercase tracking-[0.22em] text-ink-500">
        Filter
      </span>
      <div className="flex items-center gap-1 rounded-full border border-ink-800 bg-ink-900/60 p-0.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            title={opt.title}
            onClick={() => setMinConfidence(opt.value)}
            className={[
              'rounded-full px-3 py-1 text-[12px] font-medium transition-all duration-150',
              minConfidence === opt.value
                ? 'bg-ink-700 text-ink-100 shadow-sm'
                : 'text-ink-500 hover:text-ink-200',
            ].join(' ')}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
