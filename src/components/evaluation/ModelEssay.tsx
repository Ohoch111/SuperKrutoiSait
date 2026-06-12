import Card from '../ui/Card';

interface ModelEssayProps {
  essay: string;
}

export default function ModelEssay({ essay }: ModelEssayProps) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Band 8.5–9.0 Model Essay
        </h3>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          Reference
        </span>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {essay || 'No model essay was generated.'}
        </p>
      </div>
    </Card>
  );
}
