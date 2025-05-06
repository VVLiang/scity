import { API_KEY } from '../config.js';

// 配置常量
const MAX_CONTEXT = 4096;  // 模型上下文窗口
const MIN_TOKENS = 256;    // 最小生成token数

// 记忆控制
let memoryContext = null;

export function resetMemory() {
  memoryContext = Date.now();
}

function estimateTokens(text) {
  // 更精确的token估算（近似GPT-4的分词规则）
  return Math.ceil(JSON.stringify(text).length * 0.3); 
}

export async function getAIResponse(prompt) {
  // 动态token计算
  const usedTokens = estimateTokens(prompt);
  const max_tokens = Math.max(
    MIN_TOKENS,
    MAX_CONTEXT - usedTokens - 50 // 保留缓冲
  );

  // 纯API调用（无错误处理）
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      ...(memoryContext && { 'X-Session-ID': memoryContext.toString() })
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: prompt,
      temperature: 0.7,
      max_tokens: max_tokens
    })
  });

  // 直接返回原始API响应
  return (await response.json()).choices[0].message.content;
}
