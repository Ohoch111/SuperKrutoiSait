import type { GrammarCorrection } from '../../types';
import Card from '../ui/Card';

interface CorrectionsTableProps {
  corrections: GrammarCorrection[];
}

export default function CorrectionsTable({ corrections }: CorrectionsTableProps) {
  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
        Grammar and Vocabulary Corrections
      </h3>

      {corrections.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No grammar or vocabulary errors were identified in this essay.
        </p>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-3 py-3 font-semibold text-slate-700 dark:text-slate-300">
                    Original
                  </th>
                  <th className="px-3 py-3 font-semibold text-slate-700 dark:text-slate-300">
                    Correction
                  </th>
                  <th className="px-3 py-3 font-semibold text-slate-700 dark:text-slate-300">
                    Explanation
                  </th>
                </tr>
              </thead>
              <tbody>
                {corrections.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-100 dark:border-slate-800"
                  >
                    <td className="px-3 py-3 align-top text-red-700 dark:text-red-400">
                      {row.original}
                    </td>
                    <td className="px-3 py-3 align-top text-emerald-700 dark:text-emerald-400">
                      {row.correction}
                    </td>
                    <td className="px-3 py-3 align-top text-slate-600 dark:text-slate-400">
                      {row.explanation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 md:hidden">
            {corrections.map((row, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
              >
                <p className="text-xs font-medium uppercase text-slate-500">Original</p>
                <p className="mt-1 text-sm text-red-700 dark:text-red-400">{row.original}</p>
                <p className="mt-3 text-xs font-medium uppercase text-slate-500">Correction</p>
                <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                  {row.correction}
                </p>
                <p className="mt-3 text-xs font-medium uppercase text-slate-500">Explanation</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {row.explanation}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
