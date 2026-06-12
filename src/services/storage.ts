import type { EvaluationRecord, EvaluationResult } from '../types';

const STORAGE_KEY = 'ielts-evaluation-history';
const MAX_RECORDS = 100;

function isEvaluationResult(value: unknown): value is EvaluationResult {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.overall_band === 'number' &&
    typeof obj.criteria === 'object' &&
    obj.criteria !== null
  );
}

function isEvaluationRecord(value: unknown): value is EvaluationRecord {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.date === 'string' &&
    (obj.taskType === 'task1' || obj.taskType === 'task2') &&
    typeof obj.prompt === 'string' &&
    typeof obj.essay === 'string' &&
    isEvaluationResult(obj.result) &&
    (obj.image === undefined || typeof obj.image === 'string') &&
    (obj.imageType === undefined || typeof obj.imageType === 'string')
  );
}

function readAll(): EvaluationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isEvaluationRecord);
  } catch {
    return [];
  }
}

function writeAll(records: EvaluationRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, MAX_RECORDS)));
}

export function getHistory(): EvaluationRecord[] {
  return readAll().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getRecordById(id: string): EvaluationRecord | undefined {
  return readAll().find((record) => record.id === id);
}

export function saveRecord(record: EvaluationRecord): EvaluationRecord {
  const records = readAll();
  const existingIndex = records.findIndex((r) => r.id === record.id);
  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.unshift(record);
  }
  writeAll(records);
  return record;
}

export function deleteRecord(id: string): void {
  writeAll(readAll().filter((record) => record.id !== id));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
