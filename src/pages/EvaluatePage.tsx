import EvaluationForm from '../components/evaluation/EvaluationForm';
import Card from '../components/ui/Card';

export default function EvaluatePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Evaluate Your Essay
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Enter your prompt and essay. Select Task 1 or Task 2 for accurate criterion assessment.
        </p>
      </div>

      <Card padding="lg">
        <EvaluationForm />
      </Card>
    </div>
  );
}
