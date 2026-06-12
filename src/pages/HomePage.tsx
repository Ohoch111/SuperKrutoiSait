import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const features = [
  {
    title: 'Official Band Descriptors',
    description:
      'Scores aligned with IELTS Writing Band Descriptors (Updated May 2023). Conservative, examiner-style assessment.',
    icon: '📋',
  },
  {
    title: 'Task 1 & Task 2',
    description:
      'Full support for Academic Writing Task 1 (reports, charts) and Task 2 (essays, arguments).',
    icon: '✍️',
  },
  {
    title: 'Detailed Feedback',
    description:
      'Criterion-by-criterion analysis, grammar corrections, improvement plan, and Band 8.5–9.0 model essay.',
    icon: '🎯',
  },
  {
    title: 'Private & Local',
    description:
      'No backend. History stored in your browser. API calls go directly to Google Gemini.',
    icon: '🔒',
  },
];

const criteria = [
  'Task Achievement / Task Response',
  'Coherence & Cohesion',
  'Lexical Resource',
  'Grammatical Range & Accuracy',
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="mb-16 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-950/50 dark:text-brand-300">
          Powered by Google Gemini 2.5 Flash
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          <span className="gradient-text">IELTS Academic</span>
          <br />
          Writing Evaluator
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          Get examiner-grade feedback on your IELTS Academic Writing Task 1 and Task 2 essays.
          Strict scoring based on official band descriptors — no inflated scores.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/evaluate">
            <Button size="lg">Start Evaluation</Button>
          </Link>
          <Link to="/history">
            <Button variant="secondary" size="lg">
              View History
            </Button>
          </Link>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 dark:text-slate-100">
          How It Works
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center">
              <div className="mb-3 text-3xl">{feature.icon}</div>
              <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <Card padding="lg" className="bg-gradient-to-br from-slate-50 to-brand-50/30 dark:from-slate-900 dark:to-brand-950/20">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
                Certified Examiner Approach
              </h2>
              <p className="mb-4 text-slate-600 dark:text-slate-400">
                The AI acts as a certified IELTS examiner — not a tutor. Every band score is
                justified using official descriptor language. Scores use 0.5 increments and
                the overall band is calculated as the average of four criteria.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Essays below the minimum word count (150 for Task 1, 250 for Task 2) receive
                appropriate penalties in Task Achievement / Task Response.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-slate-900 dark:text-slate-100">
                Four Assessment Criteria
              </h3>
              <ul className="space-y-3">
                {criteria.map((c) => (
                  <li
                    key={c}
                    className="flex items-center gap-3 rounded-lg bg-white/60 px-4 py-3 text-sm dark:bg-slate-900/40"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
                      ✓
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </section>

      <section className="text-center">
        <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Ready to improve your writing?
        </h2>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          Paste your essay, get detailed feedback, and track progress over time.
        </p>
        <Link to="/evaluate">
          <Button size="lg">Evaluate My Essay</Button>
        </Link>
      </section>
    </div>
  );
}
