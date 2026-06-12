import type { EvaluationResult } from '../../types';
import { formatBand } from '../../utils/formatBand';
import Card from '../ui/Card';

interface ImprovementPlanProps {
  plan: EvaluationResult['next_band_plan'];
}

export default function ImprovementPlan({ plan }: ImprovementPlanProps) {
  return (
    <Card className="border-brand-200 bg-brand-50/50 dark:border-brand-900 dark:bg-brand-950/20">
      <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
        How to Reach the Next Band
      </h3>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
        Current Band:{' '}
        <span className="font-semibold text-brand-700 dark:text-brand-300">
          {formatBand(plan.current_band)}
        </span>
        {' → '}
        Target:{' '}
        <span className="font-semibold text-brand-700 dark:text-brand-300">
          {formatBand(plan.target_band)}
        </span>
      </p>
      {plan.actions.length > 0 ? (
        <ul className="space-y-2">
          {plan.actions.map((action, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-lg bg-white/60 px-3 py-2 text-sm text-slate-700 dark:bg-slate-900/40 dark:text-slate-300"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              {action}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">No improvement actions provided.</p>
      )}
    </Card>
  );
}
