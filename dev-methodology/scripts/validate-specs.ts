#!/usr/bin/env npx tsx

import * as fs from 'fs';
import * as path from 'path';

interface ValidationReport {
  hasErrors: boolean;
  warnings: string[];
  successes: string[];
  recommendations: string[];
}

function parseArgs(): { specsDir: string; verbose: boolean } {
  const args = process.argv.slice(2);
  let specsDir = './specs';
  let verbose = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--specs-dir' && i + 1 < args.length) {
      specsDir = args[i + 1];
      i++;
    } else if (args[i] === '--verbose') {
      verbose = true;
    }
  }

  return { specsDir, verbose };
}

function readFile(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    return '';
  }
  return fs.readFileSync(filePath, 'utf-8');
}

function extractIds(content: string, pattern: RegExp): Set<string> {
  const matches = content.matchAll(pattern);
  const ids = new Set<string>();
  for (const match of matches) {
    ids.add(match[1]);
  }
  return ids;
}

function main() {
  const { specsDir, verbose } = parseArgs();

  if (!fs.existsSync(specsDir)) {
    console.error(`❌ Directory ${specsDir} non trovata!`);
    process.exit(1);
  }

  const report: ValidationReport = {
    hasErrors: false,
    warnings: [],
    successes: [],
    recommendations: [],
  };

  console.log(`\n🔍 Validazione specs in: ${specsDir}\n`);

  // Check file existence
  const requiredFiles = [
    '01-vision.md',
    '02-prd.md',
    '03-user-stories.md',
    '04-tech-spec.md',
  ];

  const filesStatus: Record<string, boolean> = {};

  requiredFiles.forEach(file => {
    const filePath = path.join(specsDir, file);
    const exists = fs.existsSync(filePath) && fs.statSync(filePath).size > 0;
    filesStatus[file] = exists;

    if (exists) {
      report.successes.push(`✅ ${file} esiste`);
    } else {
      report.warnings.push(`⚠️ ${file} mancante o vuoto`);
    }
  });

  // Parse IDs from key files
  const prdContent = readFile(path.join(specsDir, '02-prd.md'));
  const storiesContent = readFile(path.join(specsDir, '03-user-stories.md'));
  const techSpecContent = readFile(path.join(specsDir, '04-tech-spec.md'));

  const featureIds = extractIds(prdContent, /F-(\d+)/g);
  const storyIds = extractIds(storiesContent, /US-(\d+)/g);
  const criteriaIds = extractIds(storiesContent, /AC-(\d+)/g);
  const componentIds = extractIds(techSpecContent, /COMP-(\d+)/g);

  // Validate cross-references
  if (featureIds.size > 0) {
    report.successes.push(`✅ ${featureIds.size} feature (F-XXX) trovate in PRD`);
  }

  if (storyIds.size > 0) {
    report.successes.push(`✅ ${storyIds.size} user story (US-XXX) trovate`);

    // Check if all features have stories
    const featuresCovered = new Set<string>();
    storiesContent.match(/Related to: F-\d+/g)?.forEach(match => {
      const id = match.match(/F-(\d+)/)?.[1];
      if (id) featuresCovered.add(id);
    });

    if (featuresCovered.size < featureIds.size) {
      report.warnings.push(
        `⚠️ Solo ${featuresCovered.size}/${featureIds.size} feature hanno user story`
      );
    } else {
      report.successes.push(`✅ Tutte le feature hanno user story`);
    }
  } else {
    report.recommendations.push(`📌 Nessuna user story trovata - considera aggiungere US-XXX IDs`);
  }

  if (criteriaIds.size > 0) {
    report.successes.push(
      `✅ ${criteriaIds.size} acceptance criteria (AC-XXX) definiti`
    );
  } else if (storyIds.size > 0) {
    report.warnings.push(`⚠️ Nessun acceptance criteria trovato nelle user story`);
  }

  if (componentIds.size > 0) {
    report.successes.push(`✅ ${componentIds.size} componenti (COMP-XXX) in tech spec`);
  }

  // Check content depth
  const avgFileSize = Object.values(filesStatus)
    .filter(exists => exists)
    .reduce((sum, file) => {
      const size = fs.statSync(path.join(specsDir, file)).size;
      return sum + size;
    }, 0) / Object.values(filesStatus).filter(exists => exists).length;

  if (avgFileSize < 500) {
    report.warnings.push(`⚠️ Contenuto molto sparso - avg ${Math.round(avgFileSize)} bytes/file`);
    report.recommendations.push(`📌 Aggiungere più dettagli alle specifiche`);
  } else {
    report.successes.push(`✅ Contenuto adeguato (${Math.round(avgFileSize)} bytes/file)`);
  }

  // Check for TODO markers
  const allContent = requiredFiles
    .map(file => readFile(path.join(specsDir, file)))
    .join('\n');

  const todoCount = (allContent.match(/TODO|FIXME|XXX/g) || []).length;
  if (todoCount > 0) {
    report.recommendations.push(`📌 ${todoCount} marcatori TODO/FIXME trovati`);
  }

  // Print report
  console.log('═══════════════════════════════════════════\n');

  if (report.successes.length > 0) {
    console.log('✅ Verifiche Passate:');
    report.successes.forEach(s => console.log(`  ${s}`));
    console.log();
  }

  if (report.warnings.length > 0) {
    console.log('⚠️  Avvisi:');
    report.warnings.forEach(w => console.log(`  ${w}`));
    console.log();
  }

  if (report.recommendations.length > 0) {
    console.log('📌 Raccomandazioni:');
    report.recommendations.forEach(r => console.log(`  ${r}`));
    console.log();
  }

  console.log('═══════════════════════════════════════════\n');

  if (verbose) {
    console.log('📊 Riepilogo IDs:\n');
    console.log(`Features: ${Array.from(featureIds).join(', ') || 'nessuno'}`);
    console.log(`User Stories: ${Array.from(storyIds).join(', ') || 'nessuno'}`);
    console.log(`Acceptance Criteria: ${Array.from(criteriaIds).join(', ') || 'nessuno'}`);
    console.log(`Componenti: ${Array.from(componentIds).join(', ') || 'nessuno'}\n`);
  }

  const status = report.hasErrors ? '❌ FAILED' : '✅ OK';
  console.log(`Risultato: ${status}\n`);

  process.exit(report.hasErrors ? 1 : 0);
}

main();
