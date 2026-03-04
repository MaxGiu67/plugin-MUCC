#!/usr/bin/env npx tsx

import * as fs from 'fs';
import * as path from 'path';

interface ValidationResult {
  file: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
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

function hasSection(content: string, sectionName: string): boolean {
  return content.includes(`## ${sectionName}`) || content.includes(`### ${sectionName}`);
}

function validateAssessment(brainstormDir: string): ValidationResult[] {
  const results: ValidationResult[] = [];
  const filePath = path.join(brainstormDir, '00-assessment.md');

  if (!fs.existsSync(filePath)) {
    results.push({ file: '00-assessment.md', status: 'error', message: 'File mancante' });
    return results;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  if (countWords(content) < 100) {
    results.push({ file: '00-assessment.md', status: 'warning', message: 'Contenuto insufficiente (< 100 parole)' });
  }
  if (!hasSection(content, 'Tipo Progetto') && !content.includes('T1') && !content.includes('T2')) {
    results.push({ file: '00-assessment.md', status: 'warning', message: 'Tipo progetto non definito' });
  }
  if (!hasSection(content, 'Scorecard')) {
    results.push({ file: '00-assessment.md', status: 'warning', message: 'Scorecard mancante' });
  }
  if (results.length === 0) {
    results.push({ file: '00-assessment.md', status: 'ok', message: 'Valido' });
  }

  return results;
}

function validateProblemFraming(brainstormDir: string): ValidationResult[] {
  const results: ValidationResult[] = [];
  const filePath = path.join(brainstormDir, '02-problem-framing.md');

  if (!fs.existsSync(filePath)) {
    results.push({ file: '02-problem-framing.md', status: 'error', message: 'File mancante' });
    return results;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  if (!hasSection(content, 'Job-to-be-Done') && !content.toLowerCase().includes('jtbd')) {
    results.push({ file: '02-problem-framing.md', status: 'warning', message: 'JTBD mancante' });
  }
  if (!content.includes('H1')) {
    results.push({ file: '02-problem-framing.md', status: 'warning', message: 'Ipotesi H1 mancante' });
  }
  if (!hasSection(content, 'Metriche') && !content.toLowerCase().includes('metrica')) {
    results.push({ file: '02-problem-framing.md', status: 'warning', message: 'Metriche mancanti' });
  }
  if (results.length === 0) {
    results.push({ file: '02-problem-framing.md', status: 'ok', message: 'Valido' });
  }

  return results;
}

function validateMvpScope(brainstormDir: string): ValidationResult[] {
  const results: ValidationResult[] = [];
  const filePath = path.join(brainstormDir, '04-mvp-scope.md');

  if (!fs.existsSync(filePath)) {
    results.push({ file: '04-mvp-scope.md', status: 'error', message: 'File mancante' });
    return results;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  if (!hasSection(content, 'Must Have') && !content.includes('Must')) {
    results.push({ file: '04-mvp-scope.md', status: 'warning', message: 'Must Have mancante' });
  }
  if (!content.toLowerCase().includes('anti-scope') && !hasSection(content, "Won't Have")) {
    results.push({ file: '04-mvp-scope.md', status: 'warning', message: 'Anti-scope mancante' });
  }
  if (results.length === 0) {
    results.push({ file: '04-mvp-scope.md', status: 'ok', message: 'Valido' });
  }

  return results;
}

function validateHandoffReadiness(brainstormDir: string): ValidationResult[] {
  const results: ValidationResult[] = [];

  // Prerequisiti minimi per handoff
  const requiredFiles = [
    '02-problem-framing.md',
    '04-mvp-scope.md',
  ];

  requiredFiles.forEach(file => {
    const filePath = path.join(brainstormDir, file);
    if (!fs.existsSync(filePath)) {
      results.push({ file, status: 'error', message: `Prerequisito handoff mancante: ${file}` });
    } else {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (countWords(content) < 100) {
        results.push({ file, status: 'warning', message: `Contenuto insufficiente per handoff` });
      }
    }
  });

  if (results.filter(r => r.status === 'error').length === 0) {
    results.push({ file: 'handoff', status: 'ok', message: 'Pronto per /bs-handoff' });
  }

  return results;
}

function main() {
  const brainstormDir = parseArgs();

  if (!fs.existsSync(brainstormDir)) {
    console.error(`❌ Directory ${brainstormDir} non trovata!`);
    process.exit(1);
  }

  console.log('\n🔍 Validazione brainstorm/\n');

  // Verifica esistenza file principali
  const mainFiles = [
    '_status.md', '_changelog.md',
    '00-assessment.md', '01-brainstorm.md', '02-problem-framing.md',
    '03-market-research.md', '04-mvp-scope.md', '05-ux-flows.md', '06-architecture.md',
  ];

  let totalErrors = 0;
  let totalWarnings = 0;

  console.log('## File Principali');
  mainFiles.forEach(file => {
    const filePath = path.join(brainstormDir, file);
    if (fs.existsSync(filePath)) {
      const words = countWords(fs.readFileSync(filePath, 'utf-8'));
      const icon = words > 100 ? '✅' : '⚠️';
      if (words <= 100) totalWarnings++;
      console.log(`  ${icon} ${file} (${words} parole)`);
    } else {
      console.log(`  ❌ ${file} (mancante)`);
      totalErrors++;
    }
  });

  // Validazioni specifiche
  console.log('\n## Validazioni Specifiche');

  const allResults: ValidationResult[] = [
    ...validateAssessment(brainstormDir),
    ...validateProblemFraming(brainstormDir),
    ...validateMvpScope(brainstormDir),
    ...validateHandoffReadiness(brainstormDir),
  ];

  allResults.forEach(r => {
    const icon = r.status === 'ok' ? '✅' : r.status === 'warning' ? '⚠️' : '❌';
    console.log(`  ${icon} ${r.file}: ${r.message}`);
    if (r.status === 'error') totalErrors++;
    if (r.status === 'warning') totalWarnings++;
  });

  // Riepilogo
  console.log(`\n## Riepilogo`);
  console.log(`  Errori: ${totalErrors}`);
  console.log(`  Warning: ${totalWarnings}`);

  if (totalErrors === 0 && totalWarnings === 0) {
    console.log('\n✅ Tutto in ordine!');
  } else if (totalErrors === 0) {
    console.log('\n⚠️ Alcuni warning da verificare.');
  } else {
    console.log('\n❌ Errori da correggere prima di procedere.');
  }

  process.exit(totalErrors > 0 ? 1 : 0);
}

main();
