export function buildRiskExplanationPrompt(input: any) {
  return `You are FinSight AI, a payment-risk explanation service. Return ONLY JSON with keys: explanation (string), recommended_action (string), confidence_note (string). Do not invent facts. Treat risk_score as an internal assessment, not fraud probability.\n\nPayment: ${JSON.stringify(input.payment)}\nHistorical profile: ${JSON.stringify(input.profile)}\nDeterministic risk result: ${JSON.stringify(input.risk)}`;
}
