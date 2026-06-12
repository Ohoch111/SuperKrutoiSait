import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { EvaluationRecord } from '../types';
import { CRITERION_LABELS, TASK_LABELS } from '../types';
import { formatBand, formatDate } from '../utils/formatBand';

function buildReportText(record: EvaluationRecord): string {
  const { result, taskType, prompt, essay, wordCount } = record;
  const lines: string[] = [
    'IELTS Academic Writing Evaluation Report',
    '========================================',
    '',
    `Date: ${formatDate(record.date)}`,
    `Task: ${TASK_LABELS[taskType]}`,
    `Word Count: ${wordCount}`,
    '',
    'ESSAY PROMPT',
    prompt,
    '',
    'CANDIDATE ESSAY',
    essay,
    '',
    `OVERALL BAND: ${formatBand(result.overall_band)}`,
    '',
    'CRITERION SCORES',
    `${CRITERION_LABELS.task_score}: ${formatBand(result.criteria.task_score.band)}`,
    `${CRITERION_LABELS.coherence}: ${formatBand(result.criteria.coherence.band)}`,
    `${CRITERION_LABELS.lexical}: ${formatBand(result.criteria.lexical.band)}`,
    `${CRITERION_LABELS.grammar}: ${formatBand(result.criteria.grammar.band)}`,
    '',
    'EXAMINER SUMMARY',
    result.overall_feedback,
    '',
    'STRENGTHS',
    ...result.strengths_summary.map((s) => `• ${s}`),
    '',
    'WEAKNESSES',
    ...result.weaknesses_summary.map((w) => `• ${w}`),
    '',
    `HOW TO REACH BAND ${formatBand(result.next_band_plan.target_band)}`,
    `Current Band: ${formatBand(result.next_band_plan.current_band)}`,
    ...result.next_band_plan.actions.map((a) => `• ${a}`),
    '',
    'GRAMMAR & VOCABULARY CORRECTIONS',
    ...result.corrections.map(
      (c) => `Original: ${c.original}\nCorrection: ${c.correction}\nExplanation: ${c.explanation}\n`
    ),
    '',
    'MODEL ESSAY (Band 8.5–9.0)',
    result.model_essay,
  ];
  return lines.join('\n');
}

export async function copyReportToClipboard(record: EvaluationRecord): Promise<void> {
  const text = buildReportText(record);
  await navigator.clipboard.writeText(text);
}

export function downloadReportJson(record: EvaluationRecord): void {
  const blob = new Blob([JSON.stringify(record, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ielts-evaluation-${record.id.slice(0, 8)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportReportToPdf(record: EvaluationRecord): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const addText = (text: string, fontSize = 10, style: 'normal' | 'bold' = 'normal') => {
    doc.setFont('helvetica', style);
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, contentWidth);
    for (const line of lines) {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += fontSize * 0.45 + 2;
    }
  };

  const addSection = (title: string) => {
    y += 4;
    addText(title, 12, 'bold');
    y += 2;
  };

  addText('IELTS Academic Writing Evaluation Report', 16, 'bold');
  y += 4;
  addText(`Date: ${formatDate(record.date)}`);
  addText(`Task: ${TASK_LABELS[record.taskType]}`);
  addText(`Word Count: ${record.wordCount}`);
  addText(`Overall Band: ${formatBand(record.result.overall_band)}`, 14, 'bold');

  addSection('Criterion Scores');
  const criteria = record.result.criteria;
  addText(`${CRITERION_LABELS.task_score}: ${formatBand(criteria.task_score.band)}`);
  addText(`${CRITERION_LABELS.coherence}: ${formatBand(criteria.coherence.band)}`);
  addText(`${CRITERION_LABELS.lexical}: ${formatBand(criteria.lexical.band)}`);
  addText(`${CRITERION_LABELS.grammar}: ${formatBand(criteria.grammar.band)}`);

  addSection('Essay Prompt');
  addText(record.prompt);

  addSection('Candidate Essay');
  addText(record.essay);

  addSection('Examiner Summary');
  addText(record.result.overall_feedback);

  addSection('Strengths');
  record.result.strengths_summary.forEach((s) => addText(`• ${s}`));

  addSection('Weaknesses');
  record.result.weaknesses_summary.forEach((w) => addText(`• ${w}`));

  addSection(
    `How to Reach Band ${formatBand(record.result.next_band_plan.target_band)}`
  );
  addText(`Current Band: ${formatBand(record.result.next_band_plan.current_band)}`);
  record.result.next_band_plan.actions.forEach((a) => addText(`• ${a}`));

  if (record.result.corrections.length > 0) {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }
    addSection('Grammar & Vocabulary Corrections');
    autoTable(doc, {
      startY: y,
      head: [['Original', 'Correction', 'Explanation']],
      body: record.result.corrections.map((c) => [
        c.original,
        c.correction,
        c.explanation,
      ]),
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235] },
    });
    y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  }

  if (y > 220) {
    doc.addPage();
    y = 20;
  }
  addSection('Model Essay (Band 8.5–9.0)');
  addText(record.result.model_essay);

  doc.save(`ielts-evaluation-${record.id.slice(0, 8)}.pdf`);
}
