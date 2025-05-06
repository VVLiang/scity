import { API_KEY, API_URL } from './config.js';
import { buildPrompt } from './prompt.js';
import { getAIResponse } from './utils/deepseek.js';
import { resetMemory } from './utils/deepseek.js';

let currentRound = 1;
const maxRounds = 8;
const messageHistory = [];
let photoShown = false; 

function displayMessage(text, sender) {
  const dialogueBox = document.getElementById('dialogue-box');
  const msgElement = document.createElement('div');
  msgElement.className = sender;
  msgElement.innerHTML = `<strong>${sender === 'assistant' ? 'Samuel Chan' : 'You'}:</strong> ${text}`;
  dialogueBox.appendChild(msgElement);
  dialogueBox.scrollTop = dialogueBox.scrollHeight;
}

function updateUI(trustScore, interestScore, currentStrategy, round, photoShown) {
  document.getElementById('strategy-display').textContent = currentStrategy;
  document.getElementById('round-counter').textContent = `${round}/${maxRounds}`;
  document.getElementById('trust-score').textContent = trustScore;
  document.getElementById('interest-score').textContent = interestScore;
  document.getElementById('photo-status').textContent = photoShown ? '📷 Shown' : '❌ Hidden';
}

function triggerEnding() {
  displayMessage("⚠️ You arrived at the remote compound. All communications are cut off...", 'ending');
  document.getElementById('player-input').disabled = true;
  document.getElementById('submit-btn').disabled = true;
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
  // 去除括号和星号内部的内容，只保留对话部分
  return text.split(/[\(\*]/)[0].trim();
}

async function handleSubmit() {
  const input = document.getElementById('player-input').value.trim();
  if (!input || currentRound > maxRounds) return;

  displayMessage(input, 'player');
  messageHistory.push({ role: 'user', content: input });

  if (!photoShown && (/photo|picture|image|selfie|proof/i.test(input) || currentRound >= 6)) {photoShown = true;}

  document.getElementById('submit-btn').disabled = true;

  const prompt = buildPrompt(messageHistory, currentRound, photoShown);
  const responseText = await getAIResponse(prompt);
  messageHistory.push({ role: 'assistant', content: responseText });

  const trustScore = extractTrustScore(responseText);
  const interestScore = extractInterestScore(responseText);
  const currentStrategy = extractCurrentStrategy(responseText);
  const formalText = extractFormalResponse(responseText);

  displayMessage(formalText, 'assistant');
  updateUI(trustScore, interestScore, currentStrategy, currentRound, photoShown);

  currentRound++;
  document.getElementById('player-input').value = '';
  document.getElementById('submit-btn').disabled = false;

  if (currentRound > maxRounds) triggerEnding();
}

document.addEventListener('DOMContentLoaded', () => {
  resetMemory()
  messageHistory.length = 0
  document.getElementById('submit-btn').addEventListener('click', handleSubmit);
  document.getElementById('player-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSubmit();
  });
  
  // 初始化 UI
  updateUI(5, 5, 'initial', currentRound, false);
  const intro = "I've been working on an \"urban data platform\", mainly for site selection and traffic analysis. You should be familiar with it, like your MUA projects.";
  displayMessage(intro, 'assistant');
  messageHistory.push({ role: 'assistant', content: intro });
});
