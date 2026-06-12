export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export function meetsMinimumWordCount(taskType: 'task1' | 'task2', wordCount: number): boolean {
  const minimum = taskType === 'task1' ? 150 : 250;
  return wordCount >= minimum;
}

export function getMinimumWords(taskType: 'task1' | 'task2'): number {
  return taskType === 'task1' ? 150 : 250;
}
