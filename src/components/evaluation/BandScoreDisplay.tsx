import { formatBand } from '../../utils/formatBand';

interface BandScoreDisplayProps {
  overallBand: number;
  criteriaBands: { label: string; band: number }[];
}

export default function BandScoreDisplay({
  overallBand,
  criteriaBands,
}: BandScoreDisplayProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-600 to-indigo-700 p-6 text-white shadow-lg dark:border-brand-800">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="text-sm font-medium text-brand-100">Overall Band Score</p>
          <p className="text-5xl font-bold tracking-tight">{formatBand(overallBand)}</p>
        </div>
        <div className="grid w-full grid-cols-2 gap-3 sm:max-w-md sm:grid-cols-2">
          {criteriaBands.map(({ label, band }) => (
            <div
              key={label}
              className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm"
            >
              <p className="text-xs text-brand-100">{label}</p>
              <p className="text-xl font-semibold">{formatBand(band)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
