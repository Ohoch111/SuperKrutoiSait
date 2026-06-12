import { useState, useEffect, useRef } from 'react';

interface ImageUploadProps {
  onImageSelected: (base64: string, mimeType: string) => void;
  onImageRemoved: () => void;
}

export default function ImageUpload({ onImageSelected, onImageRemoved }: ImageUploadProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clipboard paste handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Unsupported file type. Please upload PNG, JPG, JPEG, or WEBP.';
    }
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return 'File size is too large. Maximum size is 10 MB.';
    }
    return null;
  };

  const processFile = (file: File) => {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setImageSrc(result);
        const base64Data = result.split(',')[1];
        onImageSelected(base64Data, file.type);
      }
    };
    reader.onerror = () => {
      setError('Corrupted image or failed to read file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = () => {
    setImageSrc(null);
    setError(null);
    onImageRemoved();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        Task 1 Visual Data (Chart, Graph, Map, or Diagram)
      </label>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-900 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300" role="alert">
          {error}
        </div>
      )}

      {!imageSrc ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-all duration-200 ${
            isDragOver
              ? 'border-brand-500 bg-brand-50/50 dark:border-brand-400 dark:bg-brand-950/30'
              : 'border-slate-300 bg-slate-50/50 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900/30 dark:hover:border-slate-600'
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current?.click();
            }
          }}
          aria-label="Upload visual data chart. Drag and drop file here, paste from clipboard, or click to choose file."
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/jpg,image/webp"
            className="sr-only"
          />
          <div className="mb-2 text-2xl text-slate-400 dark:text-slate-500">📊</div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Drag & drop chart image, or <span className="text-brand-600 dark:text-brand-400">browse</span>
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Supports PNG, JPG, JPEG, WEBP up to 10MB. You can also paste directly (Ctrl+V).
          </p>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
              <img
                src={imageSrc}
                alt="Uploaded IELTS Task 1 Chart Preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-semibold text-white opacity-0 transition hover:opacity-100"
                aria-label="Zoom Image"
              >
                Zoom 🔍
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                Task 1 Visual Data Loaded
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ready for evaluation with Gemini Vision.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/jpg,image/webp"
            className="sr-only"
          />
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setIsZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview zoom overlay"
        >
          <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl bg-slate-900 p-2 shadow-2xl">
            <img
              src={imageSrc || ''}
              alt="Zoomed Chart Preview"
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
            />
            <button
              type="button"
              onClick={() => setIsZoomed(false)}
              className="absolute right-4 top-4 rounded-full bg-slate-800/80 p-2 text-white hover:bg-slate-700 transition"
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
