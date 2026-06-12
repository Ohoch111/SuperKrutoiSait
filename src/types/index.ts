export type TaskType = 'task1' | 'task2';

export interface CriterionScore {
  band: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  missing_requirements: string[];
  justification: string;
}

export interface EvaluationCriteria {
  task_score: CriterionScore;
  coherence: CriterionScore;
  lexical: CriterionScore;
  grammar: CriterionScore;
}

export interface GrammarCorrection {
  original: string;
  correction: string;
  explanation: string;
}

export interface TaskAnalysis {
  chart_type: string;
  key_features: string[];
}

export interface EvaluationResult {
  overall_band: number;
  criteria: EvaluationCriteria;
  overall_feedback: string;
  corrections: GrammarCorrection[];
  model_essay: string;
  strengths_summary: string[];
  weaknesses_summary: string[];
  next_band_plan: {
    current_band: number;
    target_band: number;
    actions: string[];
  };
  task_analysis?: TaskAnalysis;
}

export interface EvaluationRecord {
  id: string;
  date: string;
  taskType: TaskType;
  prompt: string;
  essay: string;
  wordCount: number;
  result: EvaluationResult;
  image?: string; // base64 string
  imageType?: string; // MIME type
}

export interface EvaluationInput {
  taskType: TaskType;
  prompt: string;
  essay: string;
  wordCount: number;
  meetsMinimum: boolean;
  image?: string; // base64 string
  imageType?: string; // MIME type
}

export const TASK_MIN_WORDS: Record<TaskType, number> = {
  task1: 150,
  task2: 250,
};

export const TASK_LABELS: Record<TaskType, string> = {
  task1: 'Academic Task 1',
  task2: 'Academic Task 2',
};

export const CRITERION_LABELS: Record<keyof EvaluationCriteria, string> = {
  task_score: 'Task Achievement / Task Response',
  coherence: 'Coherence & Cohesion',
  lexical: 'Lexical Resource',
  grammar: 'Grammatical Range & Accuracy',
};

export const CRITERION_SHORT_LABELS: Record<keyof EvaluationCriteria, string> = {
  task_score: 'Task',
  coherence: 'Coherence',
  lexical: 'Lexical',
  grammar: 'Grammar',
};

export type Theme = 'light' | 'dark';

