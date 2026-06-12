import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import type { Schema } from '@google/generative-ai';
import type { EvaluationInput, EvaluationResult, CriterionScore } from '../types';

const MODEL_NAME = 'gemini-2.5-flash';

const SYSTEM_PROMPT = `You are a certified IELTS examiner.

Use the official IELTS Writing Band Descriptors exactly.

Do not inflate scores.
Do not deflate scores.
Do not score conservatively.
Do not score aggressively.

Score exactly as a real IELTS examiner would.

If an essay satisfies most requirements of a higher band, assign the higher band.

Judge only according to IELTS descriptors.

Do not apply hidden penalties.

Do not compare essays to native-speaker writing.

Use only descriptor evidence.

Score the four criteria (Task Achievement/Response, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy) completely independently of each other. Do not let a low score in one criterion automatically drag down the scores of other criteria.

Return valid JSON only matching the requested schema.`;

const TASK1_DESCRIPTORS = `OFFICIAL IELTS ACADEMIC WRITING TASK 1 BAND DESCRIPTORS:

BAND 9:
- Task Achievement: Fully satisfies all the requirements of the task. Clearly presents a fully developed response.
- Coherence and Cohesion: Uses cohesion in such a way that it attracts no attention. Skilfully manages paragraphing.
- Lexical Resource: Uses a wide range of vocabulary with very natural and sophisticated control of lexical features; rare minor errors occur only as slips.
- Grammatical Range and Accuracy: Uses a wide range of structures with full flexibility and accuracy; rare minor errors occur only as slips.

BAND 8:
- Task Achievement: Covers all requirements of the task sufficiently. Presents, highlights and illustrates key features clearly and appropriately.
- Coherence and Cohesion: Sequences information and ideas logically. Manages all aspects of cohesion well. Uses paragraphing sufficiently and appropriately.
- Lexical Resource: Uses a wide range of vocabulary fluently and flexibly to convey precise meanings. Skilfully uses uncommon lexical items but there may be occasional inaccuracies in word choice and collocation. Produces rare errors in spelling and/or word formation.
- Grammatical Range and Accuracy: Uses a wide range of structures. The majority of sentences are error-free. Makes only very occasional errors or inaccuracies.

BAND 7:
- Task Achievement: Covers the requirements of the task. Presents a clear overview of main trends, differences or stages. Clearly presents and highlights key features but could be more fully extended.
- Coherence and Cohesion: Logically organises information and ideas; there is a clear progression throughout. Uses a range of cohesive devices appropriately although there may be some under-/over-use. Presents a clear central topic within each paragraph.
- Lexical Resource: Uses a sufficient range of vocabulary to allow some flexibility and precision. Uses less common lexical items with some awareness of style and collocation. May produce occasional errors in spelling and/or word formation, but they do not impede communication.
- Grammatical Range and Accuracy: Uses a variety of complex structures. Produces frequent error-free sentences. Has good control of grammar and punctuation but may make a few errors.

BAND 6:
- Task Achievement: Addresses the requirements of the task. Presents a relevant overview. Key features are covered and adequately highlighted, but details may be irrelevant, inappropriate or inaccurate.
- Coherence and Cohesion: Arranges information and ideas coherently; there is a clear overall progression. Uses cohesive devices effectively, but cohesion within and/or between sentences may be faulty or mechanical. May not always use paragraphing or paragraphing may not be logical.
- Lexical Resource: Uses an adequate range of vocabulary for the task. Attempts to use less common vocabulary but with some inaccuracy. Makes some errors in spelling and/or word formation, but they do not impede communication.
- Grammatical Range and Accuracy: Uses a mix of simple and complex sentence forms. Makes errors in grammar and punctuation but they rarely distort meaning.

BAND 5:
- Task Achievement: Generally addresses the task. Recounts detail mechanically; key features may be incompletely covered, or there may be a lack of a clear overview or data may be irrelevantly or inaccurately used.
- Coherence and Cohesion: Presents information with some organisation but there may be a lack of overall progression. Makes inadequate, inaccurate or overuse of cohesive devices. May be repetitive because of lack of referencing and substitution. May not write in paragraphs or paragraphing may be inadequate.
- Lexical Resource: Uses a limited range of vocabulary, but this is minimally adequate for the task. May make noticeable errors in spelling and/or word formation that may cause some difficulty for the reader.
- Grammatical Range and Accuracy: Uses only a limited range of structures. Attempts complex sentences but these tend to be less accurate than simple sentences. May make frequent grammatical errors and punctuation may be faulty; errors can cause some difficulty for the reader.

BANDS 4-0:
- Task Achievement: Attempts to address the task but does not cover all requirements (Band 4) or fails to address key requirements (Band 3-0).
- Coherence and Cohesion: Lacks logical organisation and overall progression. Cohesive devices are faulty or absent.
- Lexical Resource: Vocabulary is extremely limited, repetitive, or inappropriate, with frequent errors that impede comprehension.
- Grammatical Range and Accuracy: Grammar and punctuation errors dominate, with very limited range of sentence structures.`;

const TASK2_DESCRIPTORS = `OFFICIAL IELTS ACADEMIC WRITING TASK 2 BAND DESCRIPTORS:

BAND 9:
- Task Response: Fully addresses all parts of the task. Presents a fully developed position in answer to the question with relevant, fully extended and supported ideas.
- Coherence and Cohesion: Uses cohesion in such a way that it attracts no attention. Skilfully manages paragraphing.
- Lexical Resource: Uses a wide range of vocabulary with very natural and sophisticated control of lexical features; rare minor errors occur only as slips.
- Grammatical Range and Accuracy: Uses a wide range of structures with full flexibility and accuracy; rare minor errors occur only as slips.

BAND 8:
- Task Response: Sufficiently addresses all parts of the task. Presents a well-developed position in answer to the question with clearly formulated, addressed and supported key ideas.
- Coherence and Cohesion: Sequences information and ideas logically. Manages all aspects of cohesion well. Uses paragraphing sufficiently and appropriately.
- Lexical Resource: Uses a wide range of vocabulary fluently and flexibly to convey precise meanings. Skilfully uses uncommon lexical items but there may be occasional inaccuracies in word choice and collocation. Produces rare errors in spelling and/or word formation.
- Grammatical Range and Accuracy: Uses a wide range of structures. The majority of sentences are error-free. Makes only very occasional errors or inaccuracies.

BAND 7:
- Task Response: Addresses all parts of the task. Presents a clear position throughout the response. Presents, extends and supports key ideas, but there may be a tendency to overgeneralise and/or supporting ideas may lack focus.
- Coherence and Cohesion: Logically organises information and ideas; there is a clear progression throughout. Uses a range of cohesive devices appropriately although there may be some under-/over-use. Presents a clear central topic within each paragraph.
- Lexical Resource: Uses a sufficient range of vocabulary to allow some flexibility and precision. Uses less common lexical items with some awareness of style and collocation. May produce occasional errors in spelling and/or word formation, but they do not impede communication.
- Grammatical Range and Accuracy: Uses a variety of complex structures. Produces frequent error-free sentences. Has good control of grammar and punctuation but may make a few errors.

BAND 6:
- Task Response: Addresses all parts of the task, though some parts may be more fully covered than others. Presents a relevant position although the conclusions may be unclear or repetitive. Presents relevant main ideas but some may be inadequately developed/unclear.
- Coherence and Cohesion: Arranges information and ideas coherently; there is a clear overall progression. Uses cohesive devices effectively, but cohesion within and/or between sentences may be faulty or mechanical. May not always use paragraphing or paragraphing may not be logical.
- Lexical Resource: Uses an adequate range of vocabulary for the task. Attempts to use less common vocabulary but with some inaccuracy. Makes some errors in spelling and/or word formation, but they do not impede communication.
- Grammatical Range and Accuracy: Uses a mix of simple and complex sentence forms. Makes errors in grammar and punctuation but they rarely distort meaning.

BAND 5:
- Task Response: Addresses the task only partially; the format may be inappropriate. Expresses a position but the development is not clear; conclusions may be missing or unsupported. Presents some main ideas but these are limited and not developed; there may be irrelevant detail.
- Coherence and Cohesion: Presents information with some organisation but there may be a lack of overall progression. Makes inadequate, inaccurate or overuse of cohesive devices. May be repetitive because of lack of referencing and substitution. May not write in paragraphs or paragraphing may be inadequate.
- Lexical Resource: Uses a limited range of vocabulary, but this is minimally adequate for the task. May make noticeable errors in spelling and/or word formation that may cause some difficulty for the reader.
- Grammatical Range and Accuracy: Uses only a limited range of structures. Attempts complex sentences but these tend to be less accurate than simple sentences. May make frequent grammatical errors and punctuation may be faulty; errors can cause some difficulty for the reader.

BANDS 4-0:
- Task Response: Addresses the task only minimally or fails to write any relevant sentences (Band 4-0).
- Coherence and Cohesion: Lacks logical organisation and overall progression. Cohesive devices are faulty or absent.
- Lexical Resource: Vocabulary is extremely limited, repetitive, or inappropriate, with frequent errors that impede comprehension.
- Grammatical Range and Accuracy: Grammar and punctuation errors dominate, with very limited range of sentence structures.`;

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

  const wordCountNote = `The candidate's essay has a word count of ${input.wordCount} words (minimum required: ${minWords} words).`;

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

function roundToIeltsBand(average: number): number {
  const floor = Math.floor(average);
  const decimal = average - floor;
  if (decimal < 0.25) {
    return floor;
  } else if (decimal < 0.75) {
    return floor + 0.5;
  } else {
    return floor + 1.0;
  }
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
  const computedAverage = roundToIeltsBand(
    criteriaBands.reduce((a, b) => a + b, 0) / 4
  );

  const overallBand = computedAverage;

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

STEP 2: EVALUATION
Evaluate the Task Achievement score strictly according to the official IELTS Writing Task 1 Band Descriptors, focusing on the clarity of the overview, the accuracy of data representation, and the selection of key features.

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
