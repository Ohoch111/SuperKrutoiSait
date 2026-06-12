interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

export default function LoadingSpinner({
  message = 'Evaluating your essay…',
  size = 'md',
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative">
        <div
          className={`animate-pulse-ring rounded-full bg-brand-500/20 ${sizeClasses[size]}`}
        />
        <div
          className={`absolute inset-0 animate-spin-slow rounded-full border-4 border-brand-200 border-t-brand-600 dark:border-brand-800 dark:border-t-brand-400 ${sizeClasses[size]}`}
        />
      </div>
      <div className="text-center">
        <p className="text-base font-medium text-slate-800 dark:text-slate-200">
          {message}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          This may take 15–45 seconds. Analysing against official IELTS descriptors…
        </p>
      </div>
    </div>
  );
}
