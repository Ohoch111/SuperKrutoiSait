import type { TaskType } from '../../types';
import { getMinimumWords } from '../../utils/wordCount';

interface WordCounterProps {
  wordCount: number;
  taskType: TaskType;
}

export default function WordCounter({ wordCount, taskType }: WordCounterProps) {
  const minimum = getMinimumWords(taskType);
  const meetsMinimum = wordCount >= minimum;
  const percentage = Math.min((wordCount / minimum) * 100, 100);

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-300">Word Count</span>
        <span
          className={
            meetsMinimum
              ? 'font-semibold text-emerald-600 dark:text-emerald-400'
              : 'font-semibold text-amber-600 dark:text-amber-400'
          }
        >
          {wordCount} / {minimum} min
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-full rounded-full transition-all ${
            meetsMinimum ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {!meetsMinimum && (
        <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
          Below minimum word count. Evaluation is still available, but Task Achievement/Task
          Response will be penalised.
        </p>
      )}
    </div>
  );
}
