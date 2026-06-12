export default function Footer() {
  return (
    <footer className="border-t border-slate-200 py-8 dark:border-slate-800">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          IELTS Academic Writing Evaluator — Powered by Google Gemini 2.5 Flash
        </p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          Evaluations follow IELTS Writing Band Descriptors (Updated May 2023). Not affiliated with IELTS.
        </p>
      </div>
    </footer>
  );
}
