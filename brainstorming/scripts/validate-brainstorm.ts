#!/usr/bin/env npx tsx

import * as fs from 'fs';
import * as path from 'path';

interface ValidationResult {
  file: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
}

function parseArgs(): { brainstormDir: string; checkSections: boolean } {
  const args = process.argv.slice(2);
  let brainstormDir = './brainstorm';
  let checkSections = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--brainstorm-dir' && i + 1 < args.length) {
      brainstormDir = args[i + 1];
      i++;
    } else if (args[i] === '--check-sections') {
      checkSections = true;
    }
  }

  return { brainstormDir, checkSections };
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

interface BsSectionRule {
  heading: string;
  alternatives?: string[];
  minItems?: number;
  itemPattern?: 'bullet' | 'tableRow' | 'subsection' | 'custom';
  customPattern?: RegExp;
}

interface BsSectionFileRules {
  file: string;
  sections: BsSectionRule[];
}

function findBsSectionStart(content: string, heading: string, alternatives?: string[]): number {
  const candidates = [heading, ...(alternatives || [])];

  for (const candidate of candidates) {
    const candidateLower = candidate.toLowerCase();
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const lineLower = lines[i].toLowerCase();
      if (/^#{2,3}\s+/.test(lines[i]) && lineLower.includes(candidateLower)) {
        return content.indexOf(lines[i]);
      }
    }
  }
  return -1;
}

function findBsNextHeading(content: string, afterIdx: number): number {
  const rest = content.substring(afterIdx);
  const firstNewline = rest.indexOf('\n');
  if (firstNewline === -1) return content.length;
  const afterHeading = rest.substring(firstNewline + 1);
  const match = afterHeading.match(/^#{2,3}\s+/m);
  if (match && match.index !== undefined) {
    return afterIdx + firstNewline + 1 + match.index;
  }
  return content.length;
}

function countBsPatternLines(content: string, startIdx: number, nextHeadingIdx: number, pattern: 'bullet' | 'tableRow' | 'subsection' | 'custom', customPattern?: RegExp): number {
  const sectionContent = content.substring(startIdx, nextHeadingIdx);
  const lines = sectionContent.split('\n');

  switch (pattern) {
    case 'bullet':
      return lines.filter(l => /^\s*[-*]\s+/.test(l)).length;
    case 'tableRow':
      return lines.filter(l => /^\s*\|/.test(l) && !/^\s*\|[-:]+/.test(l)).length - 1; // exclude header
    case 'subsection':
      return lines.filter(l => /^###\s+/.test(l)).length;
    case 'custom':
      if (customPattern) {
        return lines.filter(l => customPattern.test(l)).length;
      }
      return 0;
    default:
      return 0;
  }
}

function validateSections(brainstormDir: string): ValidationResult[] {
  const results: ValidationResult[] = [];

  const fileRules: BsSectionFileRules[] = [
    {
      file: '00-assessment.md',
      sections: [
        { heading: 'Tipo Progetto' },
        { heading: 'Scorecard', minItems: 7, itemPattern: 'tableRow' },
        { heading: 'Piano Attivazione' },
      ],
    },
    {
      file: '01-brainstorm.md',
      sections: [
        { heading: 'Divergenza', alternatives: ['Idee Generate'] },
        { heading: 'Sfida', alternatives: ['Analisi Critica'] },
        { heading: 'Sintesi', minItems: 3, itemPattern: 'subsection' },
      ],
    },
    {
      file: '02-problem-framing.md',
      sections: [
        { heading: 'Job-to-be-Done', alternatives: ['JTBD'] },
        { heading: 'Ipotesi', minItems: 3, itemPattern: 'custom', customPattern: /H[123]/ },
        { heading: 'Metriche', minItems: 3, itemPattern: 'bullet' },
      ],
    },
    {
      file: '03-market-research.md',
      sections: [
        { heading: 'Competitor', minItems: 2, itemPattern: 'subsection' },
        { heading: 'Pattern', alternatives: ['Trend'] },
        { heading: 'Posizionamento', alternatives: ['Differenziazione'] },
      ],
    },
    {
      file: '04-mvp-scope.md',
      sections: [
        { heading: 'Must Have' },
        { heading: "Won't Have", alternatives: ['Anti-Scope'] },
        { heading: 'Milestone' },
      ],
    },
    {
      file: '05-ux-flows.md',
      sections: [
        { heading: 'Journey' },
        { heading: 'Schermate' },
        { heading: 'Wireframe' },
      ],
    },
    {
      file: '06-architecture.md',
      sections: [
        { heading: 'Stack' },
        { heading: 'Architettura' },
        { heading: 'Schema', alternatives: ['Entita'] },
        { heading: 'API' },
        { heading: 'ADR' },
      ],
    },
  ];

  for (const fileRule of fileRules) {
    const filePath = path.join(brainstormDir, fileRule.file);
    if (!fs.existsSync(filePath)) {
      continue; // file existence is already checked elsewhere
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    for (const section of fileRule.sections) {
      const startIdx = findBsSectionStart(content, section.heading, section.alternatives);

      if (startIdx === -1) {
        const altText = section.alternatives ? ` (o ${section.alternatives.join(', ')})` : '';
        results.push({
          file: fileRule.file,
          status: 'warning',
          message: `Sezione "${section.heading}"${altText} mancante`,
        });
        continue;
      }

      if (section.minItems && section.itemPattern) {
        const nextIdx = findBsNextHeading(content, startIdx);
        const count = countBsPatternLines(content, startIdx, nextIdx, section.itemPattern, section.customPattern);

        if (count < section.minItems) {
          results.push({
            file: fileRule.file,
            status: 'warning',
            message: `Sezione "${section.heading}" ha ${count} elementi (minimo ${section.minItems})`,
          });
        }
      }
    }
  }

  return results;
}

function main() {
  const { brainstormDir, checkSections } = parseArgs();

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

  // Section validation (only when --check-sections is passed)
  if (checkSections) {
    const sectionResults = validateSections(brainstormDir);

    console.log('\n## Sezioni Mancanti');
    if (sectionResults.length === 0) {
      console.log('  ✅ Tutte le sezioni richieste sono presenti');
    } else {
      sectionResults.forEach(r => {
        const icon = r.status === 'warning' ? '⚠️' : '❌';
        console.log(`  ${icon} ${r.file}: ${r.message}`);
        if (r.status === 'warning') totalWarnings++;
        if (r.status === 'error') totalErrors++;
      });
    }
  }

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
