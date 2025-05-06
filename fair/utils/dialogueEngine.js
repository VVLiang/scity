import { buildPrompt } from '../prompt.js'; 
import { getAIResponse } from './deepseek.js';

export async function processPlayerInput(text, round, photoShown, messageHistory) {
  messageHistory.push({ role: 'user', content: text });

  if (!photoShown && (/photo|picture|image|contract|proof/i.test(text) || round >= 5)) {
    photoShown = true;
  }

  const prompt = buildPrompt(messageHistory, round, photoShown);
  const responseText = await getAIResponse(prompt);
  messageHistory.push({ role: 'assistant', content: responseText });

  const trustScore = extractTrustScore(responseText);
  const interestScore = extractInterestScore(responseText);
  const currentStrategy = extractCurrentStrategy(responseText);
  const formalText = extractFormalResponse(responseText);

  return {
    formalText,
    trustScore,
    interestScore,
    strategy: currentStrategy,
    photoShown,
    fullRaw: responseText
  };
}

function extractTrustScore(text) {
  const match = text.match(/Trust:\s*\d+\s*→\s*(\d+)/);
  return match ? parseInt(match[1]) : 5;
}

function extractInterestScore(text) {
  const match = text.match(/Interest:\s*\d+\s*→\s*(\d+)/);
  return match ? parseInt(match[1]) : 5;
}

function extractCurrentStrategy(text) {
  const match = text.match(/Current strategy:\s*(.*?)\*/i);
  return match ? match[1].trim() : 'unknown';
}

function extractFormalResponse(text) {
  return text.split(/[\(\*]/)[0].trim();
}
