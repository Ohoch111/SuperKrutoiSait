import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TaskType } from '../../types';
import { evaluateEssay, GeminiEvaluationError } from '../../services/gemini';
import { saveRecord } from '../../services/storage';
import { countWords, meetsMinimumWordCount } from '../../utils/wordCount';
import { generateId } from '../../utils/formatBand';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import LoadingSpinner from '../ui/LoadingSpinner';
import WordCounter from './WordCounter';
import ImageUpload from './ImageUpload';

export default function EvaluationForm() {
  const navigate = useNavigate();
  const [taskType, setTaskType] = useState<TaskType>('task2');
  const [prompt, setPrompt] = useState('');
  const [essay, setEssay] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);
  const [imageType, setImageType] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wordCount = countWords(essay);
  const meetsMinimum = meetsMinimumWordCount(taskType, wordCount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!prompt.trim()) {
      setError('Please enter the essay prompt.');
      return;
    }
    if (!essay.trim()) {
      setError('Please enter your essay text.');
      return;
    }

    setLoading(true);

    try {
      const result = await evaluateEssay({
        taskType,
        prompt: prompt.trim(),
        essay: essay.trim(),
        wordCount,
        meetsMinimum,
        image,
        imageType,
      });

      const record = saveRecord({
        id: generateId(),
        date: new Date().toISOString(),
        taskType,
        prompt: prompt.trim(),
        essay: essay.trim(),
        wordCount,
        result,
        image,
        imageType,
      });

      navigate(`/results/${record.id}`);
    } catch (err) {
      const message =
        err instanceof GeminiEvaluationError
          ? err.message
          : 'An unexpected error occurred. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner message="Analysing your essay against IELTS band descriptors…" />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="error" title="Evaluation failed">
          {error}
        </Alert>
      )}

      <div>
        <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Task Type
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(
            [
              { value: 'task1' as TaskType, label: 'Academic Task 1', desc: 'Reports, charts, graphs, diagrams (min. 150 words)' },
              { value: 'task2' as TaskType, label: 'Academic Task 2', desc: 'Essay — opinion, discussion, problem-solution (min. 250 words)' },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className={`cursor-pointer rounded-xl border p-4 transition ${
                taskType === option.value
                  ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20 dark:border-brand-500 dark:bg-slate-800 dark:text-white dark:ring-brand-500/30'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600'
              }`}
            >
              <input
                type="radio"
                name="taskType"
                value={option.value}
                checked={taskType === option.value}
                onChange={() => {
                  setTaskType(option.value);
                  if (option.value === 'task2') {
                    setImage(undefined);
                    setImageType(undefined);
                  }
                }}
                className="sr-only"
              />
              <span className={`block font-semibold ${taskType === option.value ? 'text-brand-700 dark:text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                {option.label}
              </span>
              <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
                {option.desc}
              </span>
            </label>
          ))}
        </div>
      </div>

      {taskType === 'task1' && (
        <div className="animate-fadeIn">
          <ImageUpload
            onImageSelected={(base64, mimeType) => {
              setImage(base64);
              setImageType(mimeType);
            }}
            onImageRemoved={() => {
              setImage(undefined);
              setImageType(undefined);
            }}
          />
        </div>
      )}

      <div>
        <label
          htmlFor="prompt"
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Essay Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder={
            taskType === 'task1'
              ? 'Paste the Task 1 question (e.g. describe the chart, summarise the information…)'
              : 'Paste the Task 2 question (e.g. Some people believe that… Discuss both views…)'
          }
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

      <div>
        <label
          htmlFor="essay"
          className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Essay Text
        </label>
        <textarea
          id="essay"
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          rows={14}
          placeholder="Paste or type your IELTS Academic Writing essay here…"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <div className="mt-3">
          <WordCounter wordCount={wordCount} taskType={taskType} />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Your essay is sent directly to Google Gemini. It is stored locally in your browser only.
        </p>
        <Button type="submit" size="lg">
          Evaluate Essay
        </Button>
      </div>
    </form>
  );
}
