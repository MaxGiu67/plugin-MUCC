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
  let specsDir = './specs';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--specs-dir' && i + 1 < args.length) {
      specsDir = args[i + 1];
      i++;
    }
  }

  return specsDir;
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

  // Simple heuristic: files with > 100 words considered meaningful
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
  const specsDir = parseArgs();

  if (!fs.existsSync(specsDir)) {
    console.error(`❌ Directory ${specsDir} non trovata!`);
    process.exit(1);
  }

  // Define phases
  const phases: [number, string][] = [
    [1, '01-vision.md'],
    [2, '02-prd.md'],
    [3, '03-user-stories.md'],
    [4, '04-tech-spec.md'],
    [5, '05-sprint-plan.md'],
    [6, '06-prep.md'],
    [7, '07-implementation.md'],
    [8, '08-validation.md'],
  ];

  const phaseStatuses: PhaseStatus[] = [];
  let highestPhaseWithContent = 0;

  phases.forEach(([phase, file]) => {
    const filePath = path.join(specsDir, file);
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

  // Build status table
  let tableContent = '# Status Progetto\n\n';
  tableContent += '## Fasi Sviluppo\n';
  tableContent += '| Fase | File | Status | Progresso |\n';
  tableContent += '|------|------|--------|----------|\n';

  phaseStatuses.forEach(ps => {
    const progressBar = `${'█'.repeat(Math.floor(ps.progress / 10))}${'░'.repeat(10 - Math.floor(ps.progress / 10))} ${ps.progress}%`;
    tableContent += `| ${ps.phase} | ${ps.file} | ${ps.status} | ${progressBar} |\n`;
  });

  tableContent += '\n## Fase Attuale\n';

  if (highestPhaseWithContent === 0) {
    tableContent += 'Non ancora iniziato.\n\n';
    tableContent += '## Prossimi Passi\n';
    tableContent += '1. Compilare 01-vision.md con descrizione della visione\n';
  } else {
    const currentPhase = phaseStatuses[highestPhaseWithContent - 1];
    tableContent += `**Fase ${currentPhase.phase}**: ${currentPhase.file} (${currentPhase.status})\n\n`;

    if (highestPhaseWithContent < 8) {
      const nextPhase = phaseStatuses[highestPhaseWithContent];
      tableContent += '## Prossimi Passi\n';
      tableContent += `1. Completare Fase ${highestPhaseWithContent} (${currentPhase.file})\n`;
      tableContent += `2. Iniziare Fase ${nextPhase.phase} (${nextPhase.file})\n`;
      tableContent += '3. Coinvolgere i team specializzati\n';
    } else {
      tableContent += '## Prossimi Passi\n';
      tableContent += '1. Completare validazione finale (Fase 8)\n';
      tableContent += '2. Preparare rilascio del progetto\n';
      tableContent += '3. Raccogliere feedback\n';
    }
  }

  tableContent += `\n---\n_Ultimo aggiornamento: ${new Date().toISOString()}_\n`;

  // Write to _status.md
  const statusPath = path.join(specsDir, '_status.md');
  fs.writeFileSync(statusPath, tableContent, 'utf-8');

  // Print summary
  console.log('\n✅ Status aggiornato!\n');
  phaseStatuses.forEach(ps => {
    console.log(`Fase ${ps.phase}: ${ps.status} (${ps.progress}%)`);
  });
  console.log(`\n→ File salvato: ${statusPath}`);
}

main();
