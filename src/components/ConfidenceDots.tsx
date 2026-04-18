type Props = {
  value: 1 | 2 | 3;
  color: string;
};

const LABELS: Record<1 | 2 | 3, string> = {
  1: 'Speculative',
  2: 'Partially cited',
  3: 'Well-cited',
};

export default function ConfidenceDots({ value, color }: Props) {
  return (
    <div
      className="flex items-center gap-[3px]"
      title={LABELS[value]}
      aria-label={`Confidence: ${LABELS[value]}`}
    >
      {([1, 2, 3] as const).map((dot) => (
        <div
          key={dot}
          className="rounded-full"
          style={{
            width: 5,
            height: 5,
            background: dot <= value ? color : 'transparent',
            border: `1px solid ${color}`,
            opacity: dot <= value ? 0.9 : 0.35,
            boxShadow: dot <= value ? `0 0 4px ${color}80` : 'none',
          }}
        />
      ))}
    </div>
  );
}
