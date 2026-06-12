type AlertVariant = 'info' | 'warning' | 'error' | 'success';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
}

const variantClasses: Record<AlertVariant, string> = {
  info: 'border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-800 dark:bg-brand-950/50 dark:text-brand-100',
  warning:
    'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100',
  error:
    'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-100',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100',
};

export default function Alert({
  variant = 'info',
  title,
  children,
}: AlertProps) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm ${variantClasses[variant]}`}
      role="alert"
    >
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <div>{children}</div>
    </div>
  );
}
