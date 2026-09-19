import { env } from '../../config/env.js';
import { explainWithBedrock } from './bedrock.service.js';

export async function getAiExplanation(input: any) {
  if (env.AI_PROVIDER === 'mock') return mockExplanation(input);
  const result = await explainWithBedrock(input);
  if (typeof result?.explanation !== 'string' || typeof result?.recommended_action !== 'string') throw new Error('Invalid Bedrock structured output');
  return `${result.explanation} ${result.confidence_note ?? ''}`.trim();
}

function mockExplanation(input: any) {
  if (!input.risk.reasons.length) return 'No deterministic anomaly signals were detected. Continue with normal human review.';
  return `Deterministic checks found: ${input.risk.reasons.join('; ')}. This explanation is generated from rule-based evidence; the risk score is an internal assessment, not a fraud probability.`;
}
