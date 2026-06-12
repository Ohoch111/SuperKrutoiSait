import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import type { Schema } from '@google/generative-ai';
import type { EvaluationInput, EvaluationResult, CriterionScore } from '../types';

const MODEL_NAME = 'gemini-2.5-flash';

const SYSTEM_PROMPT = `You are a certified IELTS examiner. Evaluate the essay strictly according to IELTS Writing Band Descriptors Updated May 2023. Do not inflate scores. Every criterion score must be justified using the official descriptor language. Return valid JSON only.

SCORING RULES:
- Never inflate scores. Score conservatively.
- A band score must be justified using descriptor evidence.
- Explain why higher bands were NOT achieved.
- Quote specific descriptor characteristics.
- Use 0.5 increments only (e.g., 6.0, 6.5, 7.0).
- Calculate overall_band as the average of the four criteria, rounded to nearest 0.5.
- Essays below required word count must receive penalties in Task Achievement/Task Response.
- Do not act as a tutor first; act as an official IELTS examiner first.
- Be stricter than most online IELTS checkers.`;

const TASK1_DESCRIPTORS = `IELTS Academic Writing Task 1 Band Descriptors (May 2023):
Band 9: Task Achievement - All requirements fully satisfied. Coherence - Message followed effortlessly. Lexical - Full flexibility, wide range. Grammar - Wide range with full control.
Band 8: Task Achievement - All requirements covered appropriately; key features skilfully selected. Coherence - Followed with ease. Lexical - Wide resource fluently used. Grammar - Wide range flexibly used.
Band 7: Task Achievement - Requirements covered; clear overview; key features highlighted. Coherence - Logically organised; clear progression. Lexical - Sufficient flexibility; some less common items. Grammar - Variety of complex structures.
Band 6: Task Achievement - Focuses on task; overview attempted; some irrelevant info. Coherence - Generally coherent; cohesive devices mechanical. Lexical - Generally adequate; restricted range. Grammar - Mix of simple and complex; limited flexibility.
Band 5: Task Achievement - Generally addresses task; key features not adequately covered. Coherence - Organisation not wholly logical. Lexical - Limited but minimally adequate. Grammar - Limited range; errors frequent.
Band 4-0: Progressively fails to address task requirements.`;

const TASK2_DESCRIPTORS = `IELTS Academic Writing Task 2 Band Descriptors (May 2023):
Band 9: Task Response - Prompt explored in depth; clear fully developed position. Coherence - Message followed effortlessly. Lexical - Full flexibility. Grammar - Wide range with full control.
Band 8: Task Response - Prompt sufficiently addressed; clear well-developed position. Coherence - Followed with ease. Lexical - Wide resource fluently used. Grammar - Wide range flexibly used.
Band 7: Task Response - Main parts addressed; clear developed position. Coherence - Logically organised. Lexical - Sufficient flexibility. Grammar - Variety of complex structures.
Band 6: Task Response - Main parts addressed; position relevant but conclusions unclear. Coherence - Generally coherent. Lexical - Generally adequate. Grammar - Mix of simple and complex.
Band 5: Task Response - Main parts incompletely addressed. Coherence - Organisation not wholly logical. Lexical - Limited range. Grammar - Limited structures.
Band 4-0: Progressively fails to address prompt.`;

function getApiKey(): string {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key || key === 'your_google_ai_studio_api_key_here') {
    throw new Error(
      'Gemini API key is not configured. Add VITE_GEMINI_API_KEY to your .env file. Get a key at https://aistudio.google.com/apikey'
    );
  }
  return key;
}

function buildUserPrompt(input: EvaluationInput): string {
  const taskLabel = input.taskType === 'task1' ? 'Academic Writing Task 1' : 'Academic Writing Task 2';
  const taskCriterion = input.taskType === 'task1' ? 'Task Achievement' : 'Task Response';
  const minWords = input.taskType === 'task1' ? 150 : 250;
  const descriptors = input.taskType === 'task1' ? TASK1_DESCRIPTORS : TASK2_DESCRIPTORS;

  const wordCountNote = input.meetsMinimum
    ? `Word count (${input.wordCount}) meets the minimum of ${minWords}.`
    : `WARNING: Word count (${input.wordCount}) is BELOW the minimum of ${minWords}. Apply appropriate penalties to ${taskCriterion}.`;

  return `${descriptors}

Evaluate this ${taskLabel} essay.

${wordCountNote}

ESSAY PROMPT:
${input.prompt}

CANDIDATE ESSAY:
${input.essay}

Analyze ${taskCriterion}, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy.

For each criterion provide: band (0-9 in 0.5 steps), strengths[], weaknesses[], missing_requirements[], improvements[] (specific actions to reach next band), justification (detailed explanation using descriptor language).

Also provide:
- overall_feedback: IELTS examiner summary (3-5 paragraphs)
- corrections: ALL grammar/vocabulary errors found [{original, correction, explanation}]
- model_essay: Band 8.5-9.0 model essay answering the same prompt
- strengths_summary: top 3-6 overall strengths
- weaknesses_summary: top 3-6 overall weaknesses
- next_band_plan: {current_band, target_band (current + 0.5), actions[]}

Return ONLY this JSON structure (no markdown, no code fences):
{
  "overall_band": 7.0,
  "criteria": {
    "task_score": {"band": 7.0, "strengths": [], "weaknesses": [], "missing_requirements": [], "improvements": [], "justification": ""},
    "coherence": {"band": 7.0, "strengths": [], "weaknesses": [], "missing_requirements": [], "improvements": [], "justification": ""},
    "lexical": {"band": 6.5, "strengths": [], "weaknesses": [], "missing_requirements": [], "improvements": [], "justification": ""},
    "grammar": {"band": 7.5, "strengths": [], "weaknesses": [], "missing_requirements": [], "improvements": [], "justification": ""}
  },
  "overall_feedback": "",
  "corrections": [{"original": "", "correction": "", "explanation": ""}],
  "model_essay": "",
  "strengths_summary": [],
  "weaknesses_summary": [],
  "next_band_plan": {"current_band": 6.5, "target_band": 7.0, "actions": []}
}`;
}

function extractJson(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch?.[1]) return fenceMatch[1].trim();
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    return trimmed.slice(start, end + 1);
  }
  return trimmed;
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
}

function normalizeCriterion(value: unknown): CriterionScore {
  const obj = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  return {
    band: typeof obj.band === 'number' ? obj.band : 0,
    strengths: normalizeStringArray(obj.strengths),
    weaknesses: normalizeStringArray(obj.weaknesses),
    improvements: normalizeStringArray(obj.improvements),
    missing_requirements: normalizeStringArray(obj.missing_requirements),
    justification: typeof obj.justification === 'string' ? obj.justification : '',
  };
}

function parseEvaluationResult(raw: unknown): EvaluationResult {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid evaluation response from AI.');
  }

  const data = raw as Record<string, unknown>;
  const criteriaRaw = data.criteria as Record<string, unknown> | undefined;

  if (!criteriaRaw) {
    throw new Error('Evaluation response missing criteria scores.');
  }

  const taskScore = normalizeCriterion(criteriaRaw.task_score);
  const coherence = normalizeCriterion(criteriaRaw.coherence);
  const lexical = normalizeCriterion(criteriaRaw.lexical);
  const grammar = normalizeCriterion(criteriaRaw.grammar);

  const criteriaBands = [taskScore.band, coherence.band, lexical.band, grammar.band];
  const computedAverage =
    Math.round((criteriaBands.reduce((a, b) => a + b, 0) / 4) * 2) / 2;

  const overallBand =
    typeof data.overall_band === 'number' ? data.overall_band : computedAverage;

  const nextBandRaw = data.next_band_plan as Record<string, unknown> | undefined;

  const correctionsRaw = Array.isArray(data.corrections) ? data.corrections : [];
  const corrections = correctionsRaw
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .map((item) => ({
      original: typeof item.original === 'string' ? item.original : '',
      correction: typeof item.correction === 'string' ? item.correction : '',
      explanation: typeof item.explanation === 'string' ? item.explanation : '',
    }))
    .filter((c) => c.original || c.correction);

  return {
    overall_band: overallBand,
    criteria: {
      task_score: taskScore,
      coherence,
      lexical,
      grammar,
    },
    overall_feedback:
      typeof data.overall_feedback === 'string' ? data.overall_feedback : '',
    corrections,
    model_essay: typeof data.model_essay === 'string' ? data.model_essay : '',
    strengths_summary: normalizeStringArray(data.strengths_summary),
    weaknesses_summary: normalizeStringArray(data.weaknesses_summary),
    next_band_plan: {
      current_band:
        typeof nextBandRaw?.current_band === 'number'
          ? nextBandRaw.current_band
          : overallBand,
      target_band:
        typeof nextBandRaw?.target_band === 'number'
          ? nextBandRaw.target_band
          : Math.min(overallBand + 0.5, 9),
      actions: normalizeStringArray(nextBandRaw?.actions),
    },
  };
}

export class GeminiEvaluationError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'GeminiEvaluationError';
  }
}

const CRITERION_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    band: {
      type: SchemaType.NUMBER,
      description: "Band score for this criterion, 0 to 9 in 0.5 increments."
    },
    strengths: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "List of strengths for this criterion."
    },
    weaknesses: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "List of weaknesses for this criterion."
    },
    improvements: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "List of actionable improvements to reach the next band."
    },
    missing_requirements: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "List of requirements that were missing from this criterion."
    },
    justification: {
      type: SchemaType.STRING,
      description: "Detailed justification for this score using official descriptor language."
    }
  },
  required: ["band", "strengths", "weaknesses", "improvements", "missing_requirements", "justification"]
};

const EVALUATION_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    overall_band: {
      type: SchemaType.NUMBER,
      description: "The overall IELTS band score, which is the average of the four criteria rounded to the nearest 0.5."
    },
    criteria: {
      type: SchemaType.OBJECT,
      properties: {
        task_score: CRITERION_SCHEMA,
        coherence: CRITERION_SCHEMA,
        lexical: CRITERION_SCHEMA,
        grammar: CRITERION_SCHEMA
      },
      required: ["task_score", "coherence", "lexical", "grammar"]
    },
    overall_feedback: {
      type: SchemaType.STRING,
      description: "Official examiner summary feedback, 3-5 paragraphs."
    },
    corrections: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          original: { type: SchemaType.STRING, description: "The original incorrect text from the essay." },
          correction: { type: SchemaType.STRING, description: "The suggested correction." },
          explanation: { type: SchemaType.STRING, description: "The explanation of the error." }
        },
        required: ["original", "correction", "explanation"]
      },
      description: "List of grammar and vocabulary corrections."
    },
    model_essay: {
      type: SchemaType.STRING,
      description: "A band 8.5-9.0 model essay answering the same prompt."
    },
    strengths_summary: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Top 3-6 overall strengths."
    },
    weaknesses_summary: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Top 3-6 overall weaknesses."
    },
    next_band_plan: {
      type: SchemaType.OBJECT,
      properties: {
        current_band: { type: SchemaType.NUMBER },
        target_band: { type: SchemaType.NUMBER },
        actions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
      },
      required: ["current_band", "target_band", "actions"]
    },
    task_analysis: {
      type: SchemaType.OBJECT,
      properties: {
        chart_type: { type: SchemaType.STRING, description: "Type of the chart, e.g. Bar Chart, Line Graph, Pie Chart, Table, Map, Process Diagram." },
        key_features: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Key features/trends found in the visual data." }
      },
      required: ["chart_type", "key_features"]
    }
  },
  required: [
    "overall_band",
    "criteria",
    "overall_feedback",
    "corrections",
    "model_essay",
    "strengths_summary",
    "weaknesses_summary",
    "next_band_plan"
  ]
};

export async function evaluateEssay(input: EvaluationInput): Promise<EvaluationResult> {
  try {
    const genAI = new GoogleGenerativeAI(getApiKey());
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.2,
        topP: 0.9,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
        responseSchema: EVALUATION_SCHEMA,
      },
      systemInstruction: SYSTEM_PROMPT,
    });

    const isTask1WithImage = input.taskType === 'task1' && input.image && input.imageType;
    
    // Build user prompt text
    let userPromptText = buildUserPrompt(input);
    if (isTask1WithImage) {
      userPromptText = `You have been provided with an image of the chart/diagram alongside the essay prompt and candidate essay.
Before grading the essay, perform a visual analysis of the image to check the correctness and comprehensiveness of the candidate essay.

STEP 1: TASK ANALYSIS
Examine the image and identify:
1. Chart Type (must be one of: Bar Chart, Line Graph, Pie Chart, Table, Map, Process Diagram)
2. Key Features (such as trends, highest values, lowest values, comparisons, significant changes over time)

STEP 2: STRICT EVALUATION
Check the following strictly:
1. Was a clear overview provided? (A band 7+ requires a clear overview).
2. Were key features selected and highlighted?
3. Were major trends/differences identified?
4. Were relevant comparisons made?
5. Was irrelevant or excessive detail avoided?
6. Did the essay accurately describe the visual data without misinterpreting or misstating numbers/features?

PENALTY RULES:
Apply strict penalties under Task Achievement:
- If overview is missing: limit Task Achievement band score to a maximum of 5.0 or 6.0 depending on severity.
- If key features are missed or data is misinterpreted: reduce Task Achievement score significantly.

Your JSON response must include a "task_analysis" object containing:
- "chart_type": (e.g. "Bar Chart", "Line Graph", "Pie Chart", "Table", "Map", "Process Diagram")
- "key_features": string[] of main features/trends found in the visual data.

${userPromptText}`;
    }

    let result;
    if (isTask1WithImage) {
      // Multimodal prompt
      result = await model.generateContent([
        {
          text: userPromptText,
        },
        {
          inlineData: {
            data: input.image!,
            mimeType: input.imageType!,
          },
        },
      ]);
    } else {
      result = await model.generateContent(userPromptText);
    }

    const response = result.response;
    const text = response.text();

    if (!text) {
      throw new GeminiEvaluationError('Empty response received from Gemini API.');
    }

    const jsonText = extractJson(text);
    let parsed: unknown;

    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      console.error("Gemini raw text output:", text);
      console.error("Gemini extracted JSON text:", jsonText);
      console.error("JSON parse error details:", e);
      throw new GeminiEvaluationError(
        `Failed to parse evaluation response. The AI returned invalid JSON. Error: ${e instanceof Error ? e.message : String(e)}`
      );
    }

    const evaluationResult = parseEvaluationResult(parsed);

    // Parse the optional task analysis if returned
    if (parsed && typeof parsed === 'object') {
      const parsedObj = parsed as Record<string, unknown>;
      if (parsedObj.task_analysis && typeof parsedObj.task_analysis === 'object') {
        const ta = parsedObj.task_analysis as Record<string, unknown>;
        evaluationResult.task_analysis = {
          chart_type: typeof ta.chart_type === 'string' ? ta.chart_type : 'Unknown Chart Type',
          key_features: normalizeStringArray(ta.key_features),
        };
      }
    }

    return evaluationResult;
  } catch (error) {
    if (error instanceof GeminiEvaluationError) throw error;

    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred.';

    if (message.includes('API key')) {
      throw new GeminiEvaluationError(message, error);
    }
    if (message.includes('429') || message.toLowerCase().includes('quota')) {
      throw new GeminiEvaluationError(
        'API rate limit exceeded. Please wait a moment and try again.',
        error
      );
    }
    if (message.includes('503') || message.toLowerCase().includes('overloaded')) {
      throw new GeminiEvaluationError(
        'Gemini API is temporarily unavailable. Please try again shortly.',
        error
      );
    }

    throw new GeminiEvaluationError(
      `Evaluation failed: ${message}`,
      error
    );
  }
}
