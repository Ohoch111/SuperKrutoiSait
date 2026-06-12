import { Link } from 'react-router-dom';
import HistoryList from '../components/history/HistoryList';
import Button from '../components/ui/Button';

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Evaluation History
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Past evaluations are stored locally in your browser.
          </p>
        </div>
        <Link to="/evaluate">
          <Button>New Evaluation</Button>
        </Link>
      </div>

      <HistoryList />
    </div>
  );
}
