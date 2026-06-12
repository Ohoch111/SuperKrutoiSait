import { useParams, Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { getRecordById } from '../services/storage';
import {
  CRITERION_LABELS,
  CRITERION_SHORT_LABELS,
  TASK_LABELS,
  type EvaluationCriteria,
} from '../types';
import { formatDate } from '../utils/formatBand';
import BandScoreDisplay from '../components/evaluation/BandScoreDisplay';
import CriteriaCard from '../components/evaluation/CriteriaCard';
import CorrectionsTable from '../components/evaluation/CorrectionsTable';
import StrengthsWeaknesses from '../components/evaluation/StrengthsWeaknesses';
import ImprovementPlan from '../components/evaluation/ImprovementPlan';
import ModelEssay from '../components/evaluation/ModelEssay';
import ExportActions from '../components/evaluation/ExportActions';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const CRITERION_KEYS: (keyof EvaluationCriteria)[] = [
  'task_score',
  'coherence',
  'lexical',
  'grammar',
];

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const record = id ? getRecordById(id) : undefined;
  const [isZoomed, setIsZoomed] = useState(false);

  if (!record) {
    return <Navigate to="/history" replace />;
  }

  const { result } = record;

  const criteriaBands = CRITERION_KEYS.map((key) => ({
    label: CRITERION_SHORT_LABELS[key],
    band: result.criteria[key].band,
  }));

  const imageUrl = record.image && record.imageType ? `data:${record.imageType};base64,${record.image}` : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {formatDate(record.date)} · {TASK_LABELS[record.taskType]} · {record.wordCount}{' '}
            words
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Evaluation Report
          </h1>
        </div>
        <div className="flex gap-2">
          <Link to="/evaluate">
            <Button variant="secondary" size="sm">
              New Evaluation
            </Button>
          </Link>
          <Link to="/history">
            <Button variant="ghost" size="sm">
              History
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <ExportActions record={record} />
      </div>

      {result.task_analysis && (
        <Card className="mb-8 border-l-4 border-l-brand-500 bg-brand-50/20 dark:bg-brand-950/10">
          <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>📊</span> Task Analysis
          </h2>
          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <p>
              <strong className="text-slate-900 dark:text-slate-100">Detected Chart Type:</strong>{' '}
              <span className="inline-block rounded-md bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-800 dark:bg-brand-950 dark:text-brand-300">
                {result.task_analysis.chart_type}
              </span>
            </p>
            <div>
              <strong className="text-slate-900 dark:text-slate-100">Identified Key Features:</strong>
              <ul className="mt-1.5 list-disc pl-5 space-y-1">
                {result.task_analysis.key_features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {imageUrl && (
        <Card className="mb-8">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Submitted Task 1 Visual Data
          </h3>
          <div className="relative max-w-md overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <img
              src={imageUrl}
              alt="Submitted IELTS Task 1 Visual Chart"
              className="max-h-[300px] w-full object-contain cursor-zoom-in"
              onClick={() => setIsZoomed(true)}
            />
            <button
              type="button"
              onClick={() => setIsZoomed(true)}
              className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-black/80"
            >
              Zoom Image 🔍
            </button>
          </div>
        </Card>
      )}

      <div className="mb-8">
        <BandScoreDisplay overallBand={result.overall_band} criteriaBands={criteriaBands} />
      </div>

      <Card className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
          IELTS Examiner Summary
        </h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {result.overall_feedback}
        </p>
      </Card>

      <div className="mb-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Individual Criterion Scores
        </h2>
        {CRITERION_KEYS.map((key) => (
          <CriteriaCard
            key={key}
            title={CRITERION_LABELS[key]}
            criterion={result.criteria[key]}
          />
        ))}
      </div>

      <div className="mb-8">
        <StrengthsWeaknesses
          strengths={result.strengths_summary}
          weaknesses={result.weaknesses_summary}
        />
      </div>

      <div className="mb-8">
        <ImprovementPlan plan={result.next_band_plan} />
      </div>

      <div className="mb-8">
        <CorrectionsTable corrections={result.corrections} />
      </div>

      <div className="mb-8">
        <ModelEssay essay={result.model_essay} />
      </div>

      <Card className="mb-8">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Original Prompt
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300">{record.prompt}</p>
        <h3 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Your Essay
        </h3>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {record.essay}
        </p>
      </Card>

      {/* Zoom Modal */}
      {isZoomed && imageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged chart view"
        >
          <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl bg-slate-900 p-2 shadow-2xl">
            <img
              src={imageUrl}
              alt="Zoomed Chart View"
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
            />
            <button
              type="button"
              onClick={() => setIsZoomed(false)}
              className="absolute right-4 top-4 rounded-full bg-slate-800/80 p-2.5 text-white hover:bg-slate-700 transition"
              aria-label="Close zoom"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
