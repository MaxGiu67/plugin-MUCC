#!/usr/bin/env npx tsx

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { URL } from 'url';

interface LLMConfig {
  config: string;
  task: string;
  phase: number;
  input: string;
  format: 'markdown' | 'json';
}

interface ProviderConfig {
  type: string;
  api_key_env?: string;
  base_url?: string;
  models?: Record<string, string>;
}

interface TaskConfig {
  provider?: string;
  model?: string;
  prompt_template?: string;
}

interface ConfigFile {
  default_provider?: string;
  providers?: Record<string, ProviderConfig>;
  phase_tasks?: Record<string, Record<string, TaskConfig>>;
  [key: string]: unknown;
}

function parseArgs(): LLMConfig {
  const args = process.argv.slice(2);
  let config = './llm-config.json';
  let task = 'default';
  let phase = 0;
  let input = '';
  let format: 'markdown' | 'json' = 'markdown';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--config' && i + 1 < args.length) {
      config = args[i + 1];
      i++;
    } else if (args[i] === '--task' && i + 1 < args.length) {
      task = args[i + 1];
      i++;
    } else if (args[i] === '--phase' && i + 1 < args.length) {
      phase = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--input' && i + 1 < args.length) {
      input = args[i + 1];
      i++;
    } else if (args[i] === '--format' && i + 1 < args.length) {
      format = args[i + 1] as 'markdown' | 'json';
      i++;
    }
  }

  return { config, task, phase, input, format };
}

function httpsRequest(
  method: string,
  url: string,
  headers: Record<string, string>,
  body?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method,
      headers,
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function callGemini(
  apiKey: string,
  baseUrl: string,
  model: string,
  prompt: string
): Promise<string> {
  const url = `${baseUrl}/models/${model}:generateContent?key=${apiKey}`;

  const body = JSON.stringify({
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  });

  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body).toString(),
  };

  const response = await httpsRequest('POST', url, headers, body);
  const data = JSON.parse(response);

  if (data.candidates && data.candidates[0] && data.candidates[0].content) {
    return data.candidates[0].content.parts[0].text;
  }

  throw new Error('Unexpected Gemini response format');
}

async function callOpenAI(
  apiKey: string,
  baseUrl: string,
  model: string,
  prompt: string
): Promise<string> {
  const url = `${baseUrl}/chat/completions`;

  const body = JSON.stringify({
    model,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
    'Content-Length': Buffer.byteLength(body).toString(),
  };

  const response = await httpsRequest('POST', url, headers, body);
  const data = JSON.parse(response);

  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content;
  }

  throw new Error('Unexpected OpenAI response format');
}

async function callMistral(
  apiKey: string,
  baseUrl: string,
  model: string,
  prompt: string
): Promise<string> {
  const url = `${baseUrl}/chat/completions`;

  const body = JSON.stringify({
    model,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
    'Content-Length': Buffer.byteLength(body).toString(),
  };

  const response = await httpsRequest('POST', url, headers, body);
  const data = JSON.parse(response);

  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content;
  }

  throw new Error('Unexpected Mistral response format');
}

async function main() {
  const cfg = parseArgs();

  // Load config
  if (!fs.existsSync(cfg.config)) {
    console.error(`❌ Config file not found: ${cfg.config}`);
    process.exit(1);
  }

  const configContent = fs.readFileSync(cfg.config, 'utf-8');
  const config: ConfigFile = JSON.parse(configContent);

  // Find task config
  const phaseKey = `${cfg.phase}-*`;
  let taskConfig: TaskConfig | null = null;

  if (config.phase_tasks) {
    for (const [key, tasks] of Object.entries(config.phase_tasks)) {
      if (tasks && typeof tasks === 'object' && cfg.task in tasks) {
        taskConfig = (tasks as Record<string, TaskConfig>)[cfg.task];
        break;
      }
    }
  }

  if (!taskConfig) {
    taskConfig = {};
  }

  const provider = taskConfig.provider || config.default_provider || 'gemini';
  const modelKey = 'model' in taskConfig ? taskConfig.model : 'default';

  const providerConfig = config.providers
    ? (config.providers as Record<string, ProviderConfig>)[provider]
    : null;

  if (!providerConfig) {
    console.error(`❌ Provider ${provider} not configured`);
    process.exit(1);
  }

  const model =
    modelKey && providerConfig.models ? providerConfig.models[modelKey] : 'default';

  // Build prompt
  let prompt = cfg.input;
  if (taskConfig.prompt_template) {
    prompt = taskConfig.prompt_template.replace('{input}', cfg.input);
  }

  try {
    let result: string;

    if (providerConfig.type === 'google') {
      const apiKey = process.env[providerConfig.api_key_env || 'GEMINI_API_KEY'] || '';
      const baseUrl = providerConfig.base_url || 'https://generativelanguage.googleapis.com/v1beta';
      result = await callGemini(apiKey, baseUrl, model, prompt);
    } else if (providerConfig.type === 'openai') {
      const apiKey = process.env[providerConfig.api_key_env || 'OPENAI_API_KEY'] || '';
      const baseUrl = providerConfig.base_url || 'https://api.openai.com/v1';
      result = await callOpenAI(apiKey, baseUrl, model, prompt);
    } else if (providerConfig.type === 'mistral') {
      const apiKey = process.env[providerConfig.api_key_env || 'MISTRAL_API_KEY'] || '';
      const baseUrl = providerConfig.base_url || 'https://api.mistral.ai/v1';
      result = await callMistral(apiKey, baseUrl, model, prompt);
    } else {
      console.error(`❌ Unsupported provider type: ${providerConfig.type}`);
      process.exit(1);
    }

    console.log(result);
  } catch (error) {
    console.error(`❌ LLM Call failed:`, error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
