#!/usr/bin/env npx tsx

import * as fs from 'fs';
import * as path from 'path';

interface PhaseStatus {
  phase: number;
  file: string;
  hasContent: boolean;
  progress: number;
  status: string;
}

function parseArgs(): string {
  const args = process.argv.slice(2);
  let brainstormDir = './brainstorm';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--brainstorm-dir' && i + 1 < args.length) {
      brainstormDir = args[i + 1];
      i++;
    }
  }

  return brainstormDir;
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

function analyzeFile(filePath: string): { hasContent: boolean; progress: number } {
  if (!fs.existsSync(filePath)) {
    return { hasContent: false, progress: 0 };
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const words = countWords(content);

  // Euristica: file con > 100 parole considerato significativo
  const hasContent = words > 100;
  const progress = Math.min(100, Math.round((words / 300) * 100));

  return { hasContent, progress };
}

function determineStatus(hasContent: boolean, progress: number): string {
  if (!hasContent) return '⏳ In attesa';
  if (progress < 30) return '🔄 Bozza';
  if (progress < 70) return '📝 In lavorazione';
  return '✅ Completato';
}

function main() {
  const brainstormDir = parseArgs();

  if (!fs.existsSync(brainstormDir)) {
    console.error(`❌ Directory ${brainstormDir} non trovata!`);
    process.exit(1);
  }

  // Definisci fasi
  const phases: [number, string][] = [
    [0, '00-assessment.md'],
    [1, '01-brainstorm.md'],
    [2, '02-problem-framing.md'],
    [3, '03-market-research.md'],
    [4, '04-mvp-scope.md'],
    [5, '05-ux-flows.md'],
    [6, '06-architecture.md'],
  ];

  const phaseStatuses: PhaseStatus[] = [];
  let highestPhaseWithContent = -1;

  phases.forEach(([phase, file]) => {
    const filePath = path.join(brainstormDir, file);
    const { hasContent, progress } = analyzeFile(filePath);
    const status = determineStatus(hasContent, progress);

    phaseStatuses.push({
      phase,
      file,
      hasContent,
      progress,
      status,
    });

    if (hasContent) {
      highestPhaseWithContent = phase;
    }
  });

  // Leggi info progetto dal _status.md esistente
  let projectName = 'Progetto';
  const existingStatusPath = path.join(brainstormDir, '_status.md');
  if (fs.existsSync(existingStatusPath)) {
    const existingContent = fs.readFileSync(existingStatusPath, 'utf-8');
    const nameMatch = existingContent.match(/\*\*Nome\*\*:\s*(.+)/);
    if (nameMatch) {
      projectName = nameMatch[1].trim();
    }
  }

  // Costruisci tabella status
  const now = new Date().toISOString();
  let tableContent = `# Status Brainstorming: ${projectName}\nUltimo aggiornamento: ${now}\n\n`;

  // Mantieni info progetto se disponibile
  if (fs.existsSync(existingStatusPath)) {
    const existingContent = fs.readFileSync(existingStatusPath, 'utf-8');
    const projectSection = existingContent.match(/## Progetto\n([\s\S]*?)(?=\n## Fasi)/);
    if (projectSection) {
      tableContent += `## Progetto\n${projectSection[1]}`;
    }
  }

  tableContent += '## Fasi Brainstorming\n';
  tableContent += '| Fase | File | Status | Progresso |\n';
  tableContent += '|------|------|--------|----------|\n';

  phaseStatuses.forEach(ps => {
    const progressBar = `${'█'.repeat(Math.floor(ps.progress / 10))}${'░'.repeat(10 - Math.floor(ps.progress / 10))} ${ps.progress}%`;
    tableContent += `| ${ps.phase} | ${ps.file} | ${ps.status} | ${progressBar} |\n`;
  });

  tableContent += '\n## Fase Attuale\n';

  if (highestPhaseWithContent < 0) {
    tableContent += 'Non ancora iniziato.\n\n';
    tableContent += '## Prossimi Passi\n';
    tableContent += '1. Eseguire /bs-assess per l\'assessment operativo\n';
    tableContent += '2. Seguire il workflow consigliato\n';
  } else {
    const currentPhase = phaseStatuses[highestPhaseWithContent];
    tableContent += `**Fase ${currentPhase.phase}**: ${currentPhase.file} (${currentPhase.status})\n\n`;

    if (highestPhaseWithContent < 6) {
      const nextPhase = phaseStatuses[highestPhaseWithContent + 1];
      tableContent += '## Prossimi Passi\n';
      tableContent += `1. Completare Fase ${highestPhaseWithContent} (${currentPhase.file})\n`;
      tableContent += `2. Iniziare Fase ${nextPhase.phase} (${nextPhase.file})\n`;

      if (highestPhaseWithContent >= 4) {
        tableContent += '3. Eseguire /bs-handoff per passare a dev-methodology (UMCC)\n';
      }
    } else {
      tableContent += '## Prossimi Passi\n';
      tableContent += '1. Completare architettura (Fase 6)\n';
      tableContent += '2. Eseguire /bs-handoff per passare a dev-methodology (UMCC)\n';
      tableContent += '3. Continuare con /dev-stories (UMCC)\n';
    }
  }

  tableContent += `\n---\n_Ultimo aggiornamento: ${now}_\n`;

  // Scrivi _status.md
  fs.writeFileSync(existingStatusPath, tableContent, 'utf-8');

  // Stampa riepilogo
  console.log('\n✅ Status brainstorming aggiornato!\n');
  phaseStatuses.forEach(ps => {
    console.log(`Fase ${ps.phase}: ${ps.status} (${ps.progress}%)`);
  });
  console.log(`\n→ File salvato: ${existingStatusPath}`);
}

main();
