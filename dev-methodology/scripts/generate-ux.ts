#!/usr/bin/env npx tsx

import * as fs from 'fs';
import * as path from 'path';

interface UXConfig {
  feature: string;
  type: 'wireframe' | 'flow' | 'design-system';
  stories: string;
  config: string;
}

function parseArgs(): UXConfig {
  const args = process.argv.slice(2);
  let feature = 'Nuova Feature';
  let type: 'wireframe' | 'flow' | 'design-system' = 'wireframe';
  let stories = './specs/03-user-stories.md';
  let config = './llm-config.json';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--feature' && i + 1 < args.length) {
      feature = args[i + 1];
      i++;
    } else if (args[i] === '--type' && i + 1 < args.length) {
      type = args[i + 1] as 'wireframe' | 'flow' | 'design-system';
      i++;
    } else if (args[i] === '--stories' && i + 1 < args.length) {
      stories = args[i + 1];
      i++;
    } else if (args[i] === '--config' && i + 1 < args.length) {
      config = args[i + 1];
      i++;
    }
  }

  return { feature, type, stories, config };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

function extractRelevantStories(storiesPath: string, feature: string): string {
  if (!fs.existsSync(storiesPath)) {
    return `No stories found for feature: ${feature}`;
  }

  const content = fs.readFileSync(storiesPath, 'utf-8');
  const lines = content.split('\n');

  // Extract stories related to the feature
  const relevant: string[] = [];
  let capturing = false;

  lines.forEach(line => {
    if (line.toLowerCase().includes(feature.toLowerCase())) {
      capturing = true;
    }
    if (capturing && (line.startsWith('##') || line.startsWith('###'))) {
      relevant.push(line);
    }
    if (capturing && line.startsWith('# ')) {
      capturing = false;
    }
  });

  return relevant.length > 0 ? relevant.join('\n') : `Feature context: ${feature}`;
}

function buildUXPrompt(
  feature: string,
  type: 'wireframe' | 'flow' | 'design-system',
  context: string
): string {
  const templates: Record<string, string> = {
    wireframe: `Sei un UX Designer esperto. Crea un wireframe dettagliato in formato ASCII/markdown per la feature "${feature}".

Contesto delle user stories:
${context}

Includi nel wireframe:
1. Layout principale con aree semantiche (header, nav, content, footer)
2. Componenti UI (button, form, card, modal)
3. Interazioni principali (click, hover, focus states)
4. Gestione degli errori e stati vuoti
5. Annotazioni per chiarimenti

Formato: ASCII art con legenda markdown. Output in italiano.`,

    flow: `Sei un UX Designer esperto. Disegna il flusso utente completo per la feature "${feature}".

Contesto delle user stories:
${context}

Includi nel diagramma di flusso:
1. Punto di ingresso e uscita
2. Punti decisionali (sì/no, condizionali)
3. Percorsi felici (happy path)
4. Percorsi alternativi e gestione errori
5. Interazioni con altri sistemi/componenti

Formato: Diagramma ASCII con frecce e decisioni. Output in italiano.`,

    'design-system': `Sei un UX Designer esperto. Crea una guida al design system per la feature "${feature}".

Contesto delle user stories:
${context}

Includi nella guida:
1. Palette colori (primary, secondary, neutral, semantic)
2. Tipografia (heading, body, caption, code)
3. Componenti base (button, input, card, badge)
4. Spacing e layout grid
5. Icone e assets
6. Linee guida di utilizzo

Formato: Markdown con tabelle e snippet. Output in italiano.`,
  };

  return templates[type] || templates.wireframe;
}

async function callLLM(
  configPath: string,
  prompt: string,
  type: string
): Promise<string> {
  // For now, return a structured template
  // In production, this would call the external LLM via call-external-llm.ts

  const typeMap: Record<string, string> = {
    wireframe: `
# Wireframe: ${feature}

## Layout Principale

\`\`\`
┌─────────────────────────────────────────────┐
│ HEADER / NAVIGATION                         │
├─────────────────────────────────────────────┤
│                                             │
│  CONTENT AREA                               │
│  - Lista elementi                           │
│  - Card con dettagli                        │
│  - Form interattiva                         │
│                                             │
└─────────────────────────────────────────────┘
\`\`\`

## Componenti
- **Header**: Logo, navigation, user menu
- **Sidebar**: Filtri, categorie, azioni
- **Main Content**: Griglia o lista di elementi
- **Modal**: Dettagli elemento, form di creazione
- **Footer**: Info, link, copyright

## Interazioni
- Click su elemento: apre detail view
- Hover su button: cambio colore/icona
- Form submit: validazione client, invio server
- Error state: messaggio rosso con icona
`,
    flow: `
# User Flow: ${feature}

\`\`\`
START
  │
  ├─→ Utente accede a pagina feature
  │
  ├─→ Carica lista elementi
  │
  ├─→ Utente seleziona elemento
  │   │
  │   ├─→ Si: apri dettagli
  │   │     │
  │   │     ├─→ Modifica elemento?
  │   │     │   ├─→ Si: apri form → submit → salva → refresh lista
  │   │     │   └─→ No: chiudi
  │   │     │
  │   │     └─→ Torna a lista
  │   │
  │   └─→ No: rimani su lista
  │
  └─→ END
\`\`\`

## Decisioni Critiche
1. Elemento selezionato?
2. Modifica confermata?
3. Dati validi?
`,
    'design-system': `
# Design System: ${feature}

## Colori
| Nome | Valore | Uso |
|------|--------|-----|
| Primary | #F5921B | Call-to-action, link attivi |
| Secondary | #2FA7E6 | Informazioni, elementi secondari |
| Success | #10B981 | Azioni positive, stati OK |
| Error | #EF4444 | Errori, avvertimenti |
| Neutral | #6B7280 | Testo, bordi, divider |

## Tipografia
- **Heading (H1-H3)**: 32px/700, line-height 1.2
- **Body**: 16px/400, line-height 1.6
- **Small**: 14px/400, color neutral-600
- **Code**: 14px/500, monospace, bg light-100

## Componenti
- Button (primary, secondary, outline, ghost)
- Input (text, email, password, textarea)
- Card (default, hover, selected)
- Badge (default, success, error, info)
`,
  };

  return typeMap[type] || typeMap.wireframe;
}

async function main() {
  const cfg = parseArgs();

  console.log(`\n📐 Generazione UX: ${cfg.feature} (${cfg.type})\n`);

  // Extract relevant stories
  const context = extractRelevantStories(cfg.stories, cfg.feature);

  // Build prompt
  const prompt = buildUXPrompt(cfg.feature, cfg.type, context);

  // Call LLM (stub for now)
  const result = await callLLM(cfg.config, prompt, cfg.type);

  // Generate filename
  const slug = slugify(cfg.feature);
  const outputDir = './specs/ux';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = `${slug}-${cfg.type}.md`;
  const outputPath = path.join(outputDir, filename);

  // Write output
  fs.writeFileSync(outputPath, result, 'utf-8');

  console.log(`✅ UX generato con successo!\n`);
  console.log(`📝 Tipo: ${cfg.type}`);
  console.log(`📁 File: ${outputPath}`);
  console.log(`📊 Dimensione: ${result.length} caratteri\n`);
  console.log(`→ Prossimi passi:`);
  console.log(`  1. Rivedere il file ${filename}`);
  console.log(`  2. Adattare al contesto specifico`);
  console.log(`  3. Condividere con il team`);
}

main();
