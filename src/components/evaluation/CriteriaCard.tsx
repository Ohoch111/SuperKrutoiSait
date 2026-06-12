import type { CriterionScore } from '../../types';
import { formatBand } from '../../utils/formatBand';
import Card from '../ui/Card';

interface CriteriaCardProps {
  title: string;
  criterion: CriterionScore;
}

function ListSection({
  title,
  items,
  emptyText,
  colorClass,
}: {
  title: string;
  items: string[];
  emptyText: string;
  colorClass: string;
}) {
  return (
    <div>
      <h4 className={`mb-2 text-sm font-semibold ${colorClass}`}>{title}</h4>
      {items.length > 0 ? (
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400 dark:text-slate-500">{emptyText}</p>
      )}
    </div>
  );
}

export default function CriteriaCard({ title, criterion }: CriteriaCardProps) {
  return (
    <Card>
      <div className="mb-4 flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        <span className="shrink-0 rounded-xl bg-brand-100 px-3 py-1 text-lg font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
          {formatBand(criterion.band)}
        </span>
      </div>

      {criterion.justification && (
        <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {criterion.justification}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <ListSection
          title="Strengths"
          items={criterion.strengths}
          emptyText="No specific strengths noted."
          colorClass="text-emerald-600 dark:text-emerald-400"
        />
        <ListSection
          title="Weaknesses"
          items={criterion.weaknesses}
          emptyText="No specific weaknesses noted."
          colorClass="text-red-600 dark:text-red-400"
        />
        <ListSection
          title="Missing Requirements"
          items={criterion.missing_requirements}
          emptyText="No missing requirements identified."
          colorClass="text-amber-600 dark:text-amber-400"
        />
        <ListSection
          title="Improvements for Next Band"
          items={criterion.improvements}
          emptyText="No specific improvements listed."
          colorClass="text-brand-600 dark:text-brand-400"
        />
      </div>
    </Card>
  );
}
