#!/usr/bin/env npx tsx

import * as fs from 'fs';
import * as path from 'path';

interface ProjectConfig {
  name: string;
  description: string;
  outputDir: string;
}

function parseArgs(): ProjectConfig {
  const args = process.argv.slice(2);
  let name = 'Nuovo Progetto';
  let description = 'Descrizione del progetto';
  let outputDir = './';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--name' && i + 1 < args.length) {
      name = args[i + 1];
      i++;
    } else if (args[i] === '--description' && i + 1 < args.length) {
      description = args[i + 1];
      i++;
    } else if (args[i] === '--output-dir' && i + 1 < args.length) {
      outputDir = args[i + 1];
      i++;
    }
  }

  return { name, description, outputDir };
}

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeTemplate(filePath: string, title: string): void {
  const content = `# ${title}

## Descrizione
Contenuto della sezione ${title}.

## Sezioni
- [ ] Punto 1
- [ ] Punto 2
- [ ] Punto 3

---

_Generato automaticamente da init-project.ts_
`;
  fs.writeFileSync(filePath, content, 'utf-8');
}

function main() {
  const config = parseArgs();
  const baseDir = path.join(config.outputDir, 'specs');

  // Create directory structure
  const dirs = [
    baseDir,
    path.join(baseDir, 'technical'),
    path.join(baseDir, 'database'),
    path.join(baseDir, 'ux'),
    path.join(baseDir, 'sprint-reviews'),
  ];

  dirs.forEach(dir => ensureDir(dir));

  // Create template files
  const templates: [string, string][] = [
    ('01-vision.md', 'Visione e Obiettivi'),
    ('02-prd.md', 'Product Requirements Document'),
    ('03-user-stories.md', 'User Stories'),
    ('04-tech-spec.md', 'Specifica Tecnica'),
    ('05-implementation.md', 'Pianificazione Implementazione'),
    ('06-testing.md', 'Strategia Testing'),
    ('07-deployment.md', 'Deployment e Rilascio'),
    ('08-validation.md', 'Validazione e Chiusura'),
  ];

  templates.forEach(([filename, title]) => {
    const filePath = path.join(baseDir, filename);
    if (!fs.existsSync(filePath)) {
      writeTemplate(filePath, title);
    }
  });

  // Create _status.md
  const statusPath = path.join(baseDir, '_status.md');
  const statusContent = `# Status Progetto: ${config.name}

## Fasi Sviluppo
| Fase | File | Status | Progresso |
|------|------|--------|-----------|
| 1 | 01-vision.md | ⏳ In attesa | 0% |
| 2 | 02-prd.md | ⏳ In attesa | 0% |
| 3 | 03-user-stories.md | ⏳ In attesa | 0% |
| 4 | 04-tech-spec.md | ⏳ In attesa | 0% |
| 5 | 05-implementation.md | ⏳ In attesa | 0% |
| 6 | 06-testing.md | ⏳ In attesa | 0% |
| 7 | 07-deployment.md | ⏳ In attesa | 0% |
| 8 | 08-validation.md | ⏳ In attesa | 0% |

## Fase Attuale
Non ancora iniziato.

## Prossimi Passi
1. Compilare 01-vision.md con descrizione della visione
2. Definire obiettivi e scope del progetto
3. Identificare stakeholder principali

---
_Ultimo aggiornamento: ${new Date().toISOString()}_
`;
  fs.writeFileSync(statusPath, statusContent, 'utf-8');

  // Create _changelog.md
  const changelogPath = path.join(baseDir, '_changelog.md');
  const changelogContent = `# Changelog

## Formato
- **Data**: ISO timestamp
- **Fase**: numero fase
- **Agente**: nome agente/persona
- **Decisione**: cosa è stato deciso/fatto
- **Contesto**: motivo/background

---

### Inizializzazione Progetto
- **Data**: ${new Date().toISOString()}
- **Fase**: 0
- **Agente**: init-project.ts
- **Decisione**: Creazione struttura iniziale specs/
- **Contesto**: Progetto: ${config.name}

---
`;
  fs.writeFileSync(changelogPath, changelogContent, 'utf-8');

  // Copy CONFIG-EXAMPLE.json to llm-config.json if not exists
  const llmConfigPath = path.join(config.outputDir, 'llm-config.json');
  if (!fs.existsSync(llmConfigPath)) {
    const examplePath = path.join(
      path.dirname(__filename),
      '..',
      'CONFIG-EXAMPLE.json'
    );
    if (fs.existsSync(examplePath)) {
      const configContent = fs.readFileSync(examplePath, 'utf-8');
      const config = JSON.parse(configContent);
      config.project_name = config.name;
      fs.writeFileSync(llmConfigPath, JSON.stringify(config, null, 2), 'utf-8');
    }
  }

  // Print summary
  console.log('\n✅ Progetto inizializzato con successo!\n');
  console.log(`📁 Nome: ${config.name}`);
  console.log(`📝 Descrizione: ${config.description}`);
  console.log(`📂 Percorso base: ${baseDir}\n`);
  console.log('File creati:');
  templates.forEach(([filename]) => {
    console.log(`  ✓ ${filename}`);
  });
  console.log(`  ✓ _status.md`);
  console.log(`  ✓ _changelog.md`);
  if (!fs.existsSync(llmConfigPath)) {
    console.log(`  ✓ llm-config.json`);
  }
  console.log('\nDirectory creati:');
  dirs.forEach(dir => {
    console.log(`  ✓ ${dir}`);
  });
  console.log('\n→ Inizia con: npx tsx scripts/update-status.ts --specs-dir ./specs');
}

main();
