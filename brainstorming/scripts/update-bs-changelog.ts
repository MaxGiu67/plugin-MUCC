#!/usr/bin/env npx tsx

import * as fs from 'fs';
import * as path from 'path';

interface ChangelogEntry {
  phase: number;
  agent: string;
  decision: string;
  context: string;
}

function parseArgs(): { brainstormDir: string; entry: ChangelogEntry } {
  const args = process.argv.slice(2);
  let brainstormDir = './brainstorm';
  let phase = 0;
  let agent = 'unknown';
  let decision = '';
  let context = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--brainstorm-dir' && i + 1 < args.length) {
      brainstormDir = args[i + 1];
      i++;
    } else if (args[i] === '--phase' && i + 1 < args.length) {
      phase = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--agent' && i + 1 < args.length) {
      agent = args[i + 1];
      i++;
    } else if (args[i] === '--decision' && i + 1 < args.length) {
      decision = args[i + 1];
      i++;
    } else if (args[i] === '--context' && i + 1 < args.length) {
      context = args[i + 1];
      i++;
    }
  }

  return { brainstormDir, entry: { phase, agent, decision, context } };
}

function main() {
  const { brainstormDir, entry } = parseArgs();
  const changelogPath = path.join(brainstormDir, '_changelog.md');

  if (!fs.existsSync(changelogPath)) {
    console.error(`❌ File ${changelogPath} non trovato!`);
    process.exit(1);
  }

  if (!entry.decision) {
    console.error('❌ Parametro --decision obbligatorio!');
    process.exit(1);
  }

  const now = new Date().toISOString();
  const newEntry = `
### ${entry.decision}
- **Data**: ${now}
- **Fase**: ${entry.phase}
- **Agente**: ${entry.agent}
- **Decisione**: ${entry.decision}
- **Contesto**: ${entry.context || 'N/A'}

---
`;

  const existingContent = fs.readFileSync(changelogPath, 'utf-8');
  // Inserisci dopo l'ultimo "---" (prima della fine)
  const lastSeparator = existingContent.lastIndexOf('---');
  const updatedContent = existingContent.slice(0, lastSeparator + 3) + '\n' + newEntry;

  fs.writeFileSync(changelogPath, updatedContent, 'utf-8');

  console.log(`✅ Changelog aggiornato: ${entry.decision}`);
}

main();
