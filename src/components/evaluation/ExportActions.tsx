import { useState } from 'react';
import type { EvaluationRecord } from '../../types';
import {
  copyReportToClipboard,
  downloadReportJson,
  exportReportToPdf,
} from '../../services/export';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

interface ExportActionsProps {
  record: EvaluationRecord;
}

export default function ExportActions({ record }: ExportActionsProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const handleCopy = async () => {
    setCopyError(null);
    try {
      await copyReportToClipboard(record);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch {
      setCopyError('Failed to copy report. Please try again or use PDF export.');
    }
  };

  return (
    <div className="space-y-3">
      {copySuccess && (
        <Alert variant="success">Report copied to clipboard.</Alert>
      )}
      {copyError && (
        <Alert variant="error">{copyError}</Alert>
      )}
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => exportReportToPdf(record)}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export PDF
        </Button>
        <Button variant="secondary" onClick={handleCopy}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Report
        </Button>
        <Button variant="secondary" onClick={() => downloadReportJson(record)}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download JSON
        </Button>
      </div>
    </div>
  );
}
