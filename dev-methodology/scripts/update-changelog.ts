#!/usr/bin/env npx tsx

import * as fs from 'fs';
import * as path from 'path';

interface ChangelogEntry {
  specsDir: string;
  decision: string;
  phase: number;
  agent: string;
  context: string;
}

function parseArgs(): ChangelogEntry {
  const args = process.argv.slice(2);
  let specsDir = './specs';
  let decision = 'Nessuna descrizione';
  let phase = 0;
  let agent = 'unknown';
  let context = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--specs-dir' && i + 1 < args.length) {
      specsDir = args[i + 1];
      i++;
    } else if (args[i] === '--decision' && i + 1 < args.length) {
      decision = args[i + 1];
      i++;
    } else if (args[i] === '--phase' && i + 1 < args.length) {
      phase = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--agent' && i + 1 < args.length) {
      agent = args[i + 1];
      i++;
    } else if (args[i] === '--context' && i + 1 < args.length) {
      context = args[i + 1];
      i++;
    }
  }

  return { specsDir, decision, phase, agent, context };
}

function main() {
  const config = parseArgs();
  const changelogPath = path.join(config.specsDir, '_changelog.md');

  // Ensure changelog exists
  if (!fs.existsSync(changelogPath)) {
    const initial = `# Changelog

## Formato
- **Data**: ISO timestamp
- **Fase**: numero fase
- **Agente**: nome agente/persona
- **Decisione**: cosa è stato deciso/fatto
- **Contesto**: motivo/background

---

`;
    fs.writeFileSync(changelogPath, initial, 'utf-8');
  }

  // Read existing changelog
  let content = fs.readFileSync(changelogPath, 'utf-8');

  // Create new entry
  const timestamp = new Date().toISOString();
  const entry = `### ${config.decision}
- **Data**: ${timestamp}
- **Fase**: ${config.phase}
- **Agente**: ${config.agent}
- **Decisione**: ${config.decision}
- **Contesto**: ${config.context}

`;

  // Append to changelog (after the format section)
  const splitIndex = content.lastIndexOf('---\n');
  if (splitIndex !== -1) {
    content = content.slice(0, splitIndex + 4) + '\n' + entry + content.slice(splitIndex + 4);
  } else {
    content += '\n' + entry;
  }

  fs.writeFileSync(changelogPath, content, 'utf-8');

  console.log(`\n✅ Changelog aggiornato!\n`);
  console.log(`📝 Decisione: ${config.decision}`);
  console.log(`📊 Fase: ${config.phase}`);
  console.log(`👤 Agente: ${config.agent}`);
  console.log(`📋 Contesto: ${config.context}`);
  console.log(`\n→ File: ${changelogPath}`);
}

main();
