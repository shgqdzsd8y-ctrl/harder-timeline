import { timeline } from '../data/timeline';
import { LABEL_WIDTH, RULER_HEIGHT, yearToX } from './Timeline';

export default function YearRuler() {
  const { minYear, maxYear } = timeline;

  const ticks: { year: number; major: boolean }[] = [];
  for (let y = minYear; y <= maxYear; y++) {
    if (y % 10 === 0) ticks.push({ year: y, major: true });
    else if (y % 5 === 0) ticks.push({ year: y, major: false });
  }

  return (
    <>
      {/* Sticky "Year" label on the left */}
      <div
        className="absolute top-0 z-30 flex items-end pb-2 pl-5 text-[11px] uppercase tracking-[0.25em] text-ink-500"
        style={{
          left: 0,
          width: LABEL_WIDTH,
          height: RULER_HEIGHT,
          position: 'sticky',
          background:
            'linear-gradient(to right, rgba(11,13,16,0.98) 70%, rgba(11,13,16,0))',
          pointerEvents: 'none',
        }}
      >
        Year
      </div>

      {/* Ruler track */}
      <div
        className="absolute top-0"
        style={{
          left: LABEL_WIDTH,
          height: RULER_HEIGHT,
          width: yearToX(maxYear) + 40,
        }}
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-ink-800" />
        {ticks.map(({ year, major }) => (
          <div
            key={year}
            className="absolute bottom-0"
            style={{ left: yearToX(year) }}
          >
            <div
              className={major ? 'bg-ink-500/70' : 'bg-ink-700'}
              style={{ width: 1, height: major ? 14 : 7 }}
            />
            {major && (
              <div
                className="absolute text-[11px] font-medium text-ink-200"
                style={{
                  left: 0,
                  transform: 'translate(-50%, -20px)',
                  whiteSpace: 'nowrap',
                }}
              >
                {year}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
