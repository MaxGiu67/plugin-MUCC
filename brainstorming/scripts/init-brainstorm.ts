#!/usr/bin/env npx tsx

import * as fs from 'fs';
import * as path from 'path';

interface ProjectConfig {
  name: string;
  description: string;
  idea: string;
  outputDir: string;
}

function parseArgs(): ProjectConfig {
  const args = process.argv.slice(2);
  let name = 'Nuovo Progetto';
  let description = 'Descrizione del progetto';
  let idea = '';
  let outputDir = './';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--name' && i + 1 < args.length) {
      name = args[i + 1];
      i++;
    } else if (args[i] === '--description' && i + 1 < args.length) {
      description = args[i + 1];
      i++;
    } else if (args[i] === '--idea' && i + 1 < args.length) {
      idea = args[i + 1];
      i++;
    } else if (args[i] === '--output-dir' && i + 1 < args.length) {
      outputDir = args[i + 1];
      i++;
    }
  }

  return { name, description, idea, outputDir };
}

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function main() {
  const config = parseArgs();
  const baseDir = path.join(config.outputDir, 'brainstorm');
  const now = new Date().toISOString();

  // Crea struttura directory
  const dirs = [
    baseDir,
    path.join(baseDir, 'onboarding'),
    path.join(baseDir, 'specialists'),
    path.join(baseDir, 'ux'),
  ];

  dirs.forEach(dir => ensureDir(dir));

  // Crea _status.md
  const statusContent = `# Status Brainstorming: ${config.name}
Ultimo aggiornamento: ${now}

## Progetto
- **Nome**: ${config.name}
- **Descrizione**: ${config.description}
- **Idea**: ${config.idea || 'Da definire'}

## Fasi Brainstorming
| Fase | File | Status | Progresso |
|------|------|--------|-----------|
| 0 | 00-assessment.md | ⏳ In attesa | 0% |
| 1 | 01-brainstorm.md | ⏳ In attesa | 0% |
| 2 | 02-problem-framing.md | ⏳ In attesa | 0% |
| 3 | 03-market-research.md | ⏳ In attesa | 0% |
| 4 | 04-mvp-scope.md | ⏳ In attesa | 0% |
| 5 | 05-ux-flows.md | ⏳ In attesa | 0% |
| 6 | 06-architecture.md | ⏳ In attesa | 0% |

## Fase Attuale
Non ancora iniziato.

## Prossimi Passi
1. Eseguire /bs-assess per l'assessment operativo
2. Seguire il workflow consigliato

---
_Ultimo aggiornamento: ${now}_
`;
  fs.writeFileSync(path.join(baseDir, '_status.md'), statusContent, 'utf-8');

  // Crea _changelog.md
  const changelogContent = `# Changelog Brainstorming: ${config.name}

## Formato
- **Data**: ISO timestamp
- **Fase**: numero fase
- **Agente**: nome agente
- **Decisione**: cosa è stato deciso/fatto
- **Contesto**: motivo/background

---

### Inizializzazione Brainstorming
- **Data**: ${now}
- **Fase**: 0
- **Agente**: init-brainstorm.ts
- **Decisione**: Creazione struttura iniziale brainstorm/
- **Contesto**: Progetto: ${config.name} — ${config.description}

---
`;
  fs.writeFileSync(path.join(baseDir, '_changelog.md'), changelogContent, 'utf-8');

  // Crea template per ogni fase
  const templates: [string, string, string][] = [
    ['00-assessment.md', 'Assessment Operativo', 'Scorecard e piano di attivazione agenti.\n\n## Tipo Progetto\nDa definire.\n\n## Scorecard\n| Domanda | Punteggio (0-2) | Suggerisce |\n|---------|----------------|------------|\n| 1. Il problema utente è chiarissimo? | — | Problem Framer |\n| 2. Sai già "perché te" vs competitor? | — | Researcher |\n| 3. Vincoli tempo forti (≤ 2 settimane)? | — | MVP Scoper + Orchestratore |\n| 4. UX/onboarding è critica? | — | UX Flow + Copy |\n| 5. Lavori su codice non tuo? | — | Cartographer + Docs Writer |\n| 6. Repo poco testato/instabile? | — | QA + Bug Triage |\n| 7. Dati sensibili/pagamenti/ruoli? | — | Security & Privacy |\n| 8. Tante integrazioni esterne? | — | Architect + Risk Auditor |\n| 9. Problema principale = performance/costi? | — | Performance & Cost |\n| 10. Devi dimostrare traction con numeri? | — | Analytics & Experiment |\n\n## Agenti Raccomandati\nDa calcolare dopo la scorecard.\n\n## Workflow Consigliato\nDa determinare.'],
    ['01-brainstorm.md', 'Brainstorming', 'Sessione di brainstorming strutturato con trio divergente/avvocato del diavolo/sintetizzatore.\n\n## Divergenza\n_30-50 idee generate senza giudizio._\n\n## Sfida\n_Analisi critica delle idee con ragioni di mercato e tecniche._\n\n## Sintesi\n_3 concept solidi con proposta MVP per ciascuno._'],
    ['02-problem-framing.md', 'Problem Framing', 'Definizione del problema, JTBD, ipotesi testabili e metriche.\n\n## Job-to-be-Done\n_Quando [situazione], voglio [motivazione], così da [risultato atteso]._\n\n## Ipotesi Testabili\n### H1 — Critica\n_Ipotesi fondamentale che, se falsa, invalida l\'MVP._\n\n### H2 — Importante\n_Ipotesi significativa per il successo._\n\n### H3 — Nice-to-have\n_Ipotesi che arricchisce ma non è bloccante._\n\n## Metriche\n| Metrica | Target | Come misurare |\n|---------|--------|---------------|\n| Activation rate | — | — |\n| Retention D7 | — | — |\n| Retention D30 | — | — |\n| Task success rate | — | — |'],
    ['03-market-research.md', 'Ricerca di Mercato', 'Analisi competitor, pattern e differenziazione.\n\n## Competitor\n| Nome | Tipo | Target | Punti di forza | Debolezze | Pricing |\n|------|------|--------|---------------|-----------|--------|\n\n## Feature Ricorrenti\n_Pattern comuni tra i competitor._\n\n## Differenziazione Possibile\n_Opportunità di differenziazione._\n\n## Rischi Mercato\n_Saturazione, CAC, lock-in._\n\n## Fatti vs Inferenze\n| Fatto | Fonte | Inferenza |\n|-------|-------|-----------|\n'],
    ['04-mvp-scope.md', 'MVP Scope', 'Definizione scope MVP con MoSCoW e anti-scope.\n\n## MoSCoW\n### Must Have\n| Feature | Giustificazione (H/rischio) |\n|---------|---------------------------|\n\n### Should Have\n| Feature | Motivo |\n|---------|--------|\n\n### Could Have\n| Feature | Motivo |\n|---------|--------|\n\n### Won\'t Have (Anti-Scope)\n| Feature | Motivo esclusione |\n|---------|------------------|\n\n## Milestone\n### MVP (v0.1)\n_Scope minimo._\n\n### v0.2\n_Estensioni prioritarie._\n\n### v0.3\n_Evoluzione successiva._'],
    ['05-ux-flows.md', 'UX Flows', 'User journey, schermate e stati.\n\n## User Journeys\n_Flussi utente per ogni Must-have._\n\n## Schermate\n| Schermata | Descrizione | Stati |\n|-----------|-------------|-------|\n\n## Wireframe Testuali\n_Vedi brainstorm/ux/wireframes.md_'],
    ['06-architecture.md', 'Architettura', 'Stack, schema dati, API contract e ADR.\n\n## Stack Tecnologico\n| Layer | Tecnologia | Motivazione |\n|-------|-----------|-------------|\n| Frontend | — | — |\n| Backend | — | — |\n| Database | — | — |\n| Auth | — | — |\n| Hosting | — | — |\n| Storage | — | — |\n\n## Schema Dati\n_Entità e relazioni._\n\n## API Contract\n| Endpoint | Method | Auth | Request | Response |\n|----------|--------|------|---------|----------|\n\n## ADR (Architecture Decision Records)\n_Decisioni architetturali chiave._'],
  ];

  templates.forEach(([filename, title, content]) => {
    const filePath = path.join(baseDir, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, `# ${title}\n\n${content}\n\n---\n_Generato da init-brainstorm.ts — ${now}_\n`, 'utf-8');
    }
  });

  // Crea template onboarding
  const onboardingTemplates: [string, string][] = [
    ['codebase-map.md', 'Mappa Codebase'],
    ['dependency-audit.md', 'Audit Dipendenze'],
    ['bug-triage.md', 'Bug Triage'],
    ['refactor-plan.md', 'Piano Refactoring'],
    ['developer-docs.md', 'Documentazione Developer'],
  ];

  onboardingTemplates.forEach(([filename, title]) => {
    const filePath = path.join(baseDir, 'onboarding', filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, `# ${title}\n\n_Da compilare con /bs-onboarding._\n\n---\n_Generato da init-brainstorm.ts — ${now}_\n`, 'utf-8');
    }
  });

  // Crea template specialisti
  const specialistTemplates: [string, string][] = [
    ['security.md', 'Analisi Sicurezza'],
    ['performance.md', 'Analisi Performance'],
    ['accessibility.md', 'Analisi Accessibilità'],
    ['analytics.md', 'Piano Analytics'],
    ['copy-onboarding.md', 'Copy & Onboarding'],
  ];

  specialistTemplates.forEach(([filename, title]) => {
    const filePath = path.join(baseDir, 'specialists', filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, `# ${title}\n\n_Da compilare con la skill specialista corrispondente._\n\n---\n_Generato da init-brainstorm.ts — ${now}_\n`, 'utf-8');
    }
  });

  // Crea template UX
  const wireframesPath = path.join(baseDir, 'ux', 'wireframes.md');
  if (!fs.existsSync(wireframesPath)) {
    fs.writeFileSync(wireframesPath, `# Wireframe Testuali\n\n_Wireframe ASCII per ogni schermata._\n\n---\n_Generato da init-brainstorm.ts — ${now}_\n`, 'utf-8');
  }

  const componentSpecPath = path.join(baseDir, 'ux', 'component-spec.md');
  if (!fs.existsSync(componentSpecPath)) {
    fs.writeFileSync(componentSpecPath, `# Component Spec\n\n_Specifiche componenti UI._\n\n---\n_Generato da init-brainstorm.ts — ${now}_\n`, 'utf-8');
  }

  // Stampa riepilogo
  console.log('\n✅ Brainstorming inizializzato con successo!\n');
  console.log(`📁 Nome: ${config.name}`);
  console.log(`📝 Descrizione: ${config.description}`);
  console.log(`💡 Idea: ${config.idea || 'Da definire'}`);
  console.log(`📂 Percorso base: ${baseDir}\n`);
  console.log('File creati:');
  templates.forEach(([filename]) => {
    console.log(`  ✓ ${filename}`);
  });
  console.log('  ✓ _status.md');
  console.log('  ✓ _changelog.md');
  onboardingTemplates.forEach(([filename]) => {
    console.log(`  ✓ onboarding/${filename}`);
  });
  specialistTemplates.forEach(([filename]) => {
    console.log(`  ✓ specialists/${filename}`);
  });
  console.log('  ✓ ux/wireframes.md');
  console.log('  ✓ ux/component-spec.md');
  console.log('\n→ Prossimo passo: esegui /bs-assess per l\'assessment operativo');
}

main();
