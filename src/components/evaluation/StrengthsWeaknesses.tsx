import Card from '../ui/Card';

interface StrengthsWeaknessesProps {
  strengths: string[];
  weaknesses: string[];
}

export default function StrengthsWeaknesses({
  strengths,
  weaknesses,
}: StrengthsWeaknessesProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-emerald-700 dark:text-emerald-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Strengths
        </h3>
        {strengths.length > 0 ? (
          <ul className="space-y-2">
            {strengths.map((item, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-slate-600 dark:text-slate-400"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No overall strengths summarised.</p>
        )}
      </Card>

      <Card>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-red-700 dark:text-red-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Weaknesses
        </h3>
        {weaknesses.length > 0 ? (
          <ul className="space-y-2">
            {weaknesses.map((item, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-slate-600 dark:text-slate-400"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No overall weaknesses summarised.</p>
        )}
      </Card>
    </div>
  );
}
