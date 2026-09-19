import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { env } from '../../config/env.js';
import { buildRiskExplanationPrompt } from './prompt.service.js';

const client = new BedrockRuntimeClient({ region: env.AWS_REGION });

export async function explainWithBedrock(input: any) {
  const command = new ConverseCommand({
    modelId: env.BEDROCK_MODEL_ID,
    system: [{ text: 'Return valid JSON only. Never claim certainty. Never invent payment facts.' }],
    messages: [{ role: 'user', content: [{ text: buildRiskExplanationPrompt(input) }] }],
    inferenceConfig: { maxTokens: 500, temperature: 0.1 }
  });
  const response = await client.send(command);
  const text = response.output?.message?.content?.map(x => 'text' in x ? x.text : '').join('') ?? '{}';
  return JSON.parse(text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim());
}
