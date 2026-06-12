import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { EvaluationRecord } from '../../types';
import { getHistory, deleteRecord, clearHistory } from '../../services/storage';
import { formatBand, formatDate, truncate } from '../../utils/formatBand';
import { TASK_LABELS } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

export default function HistoryList() {
  const [records, setRecords] = useState<EvaluationRecord[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);

  const loadHistory = () => {
    setRecords(getHistory());
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = (id: string) => {
    deleteRecord(id);
    loadHistory();
  };

  const handleClearAll = () => {
    clearHistory();
    setConfirmClear(false);
    loadHistory();
  };

  if (records.length === 0) {
    return (
      <Card className="text-center">
        <p className="text-slate-600 dark:text-slate-400">No evaluation history yet.</p>
        <Link to="/evaluate" className="mt-4 inline-block">
          <Button>Start Your First Evaluation</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {records.length} evaluation{records.length !== 1 ? 's' : ''} saved locally
        </p>
        {!confirmClear ? (
          <Button variant="danger" size="sm" onClick={() => setConfirmClear(true)}>
            Clear All History
          </Button>
        ) : (
          <Alert variant="warning" title="Confirm deletion">
            <p className="mb-3">This will permanently delete all saved evaluations.</p>
            <div className="flex gap-2">
              <Button variant="danger" size="sm" onClick={handleClearAll}>
                Yes, clear all
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setConfirmClear(false)}>
                Cancel
              </Button>
            </div>
          </Alert>
        )}
      </div>

      <div className="space-y-3">
        {records.map((record) => (
          <Card key={record.id} padding="sm" className="transition hover:shadow-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-800 dark:bg-brand-950 dark:text-brand-300">
                    {TASK_LABELS[record.taskType]}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(record.date)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {record.wordCount} words
                  </span>
                </div>
                <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                  {truncate(record.prompt, 120)}
                </p>
                <p className="mt-1 text-sm font-bold text-brand-700 dark:text-brand-400">
                  Overall Band: {formatBand(record.result.overall_band)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link to={`/results/${record.id}`}>
                  <Button variant="secondary" size="sm">
                    View
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(record.id)}
                  className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
