#!/usr/bin/env npx tsx

import * as fs from 'fs';
import * as path from 'path';

interface ValidationReport {
  hasErrors: boolean;
  warnings: string[];
  successes: string[];
  recommendations: string[];
}

function parseArgs(): { specsDir: string; verbose: boolean; checkSections: boolean } {
  const args = process.argv.slice(2);
  let specsDir = './specs';
  let verbose = false;
  let checkSections = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--specs-dir' && i + 1 < args.length) {
      specsDir = args[i + 1];
      i++;
    } else if (args[i] === '--verbose') {
      verbose = true;
    } else if (args[i] === '--check-sections') {
      checkSections = true;
    }
  }

  return { specsDir, verbose, checkSections };
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

interface SectionRule {
  heading: string;
  alternatives?: string[];
  minItems?: number;
  itemPattern?: 'bullet' | 'tableRow' | 'subsection' | 'custom';
  customPattern?: RegExp;
}

interface SectionFileRules {
  file: string;
  sections: SectionRule[];
}

function countPatternLines(content: string, startIdx: number, nextHeadingIdx: number, pattern: 'bullet' | 'tableRow' | 'subsection' | 'custom', customPattern?: RegExp): number {
  const sectionContent = content.substring(startIdx, nextHeadingIdx);
  const lines = sectionContent.split('\n');

  switch (pattern) {
    case 'bullet':
      return lines.filter(l => /^\s*[-*]\s+/.test(l)).length;
    case 'tableRow':
      return lines.filter(l => /^\s*\|/.test(l) && !/^\s*\|[-:]+/.test(l)).length - 1; // exclude header row
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

function findSectionStart(content: string, heading: string, alternatives?: string[]): number {
  const candidates = [heading, ...(alternatives || [])];

  for (const candidate of candidates) {
    const candidateLower = candidate.toLowerCase();
    // Match ## or ### headings containing the text (case-insensitive)
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const lineLower = lines[i].toLowerCase();
      if (/^#{2,3}\s+/.test(lines[i]) && lineLower.includes(candidateLower)) {
        // Return char offset
        return content.indexOf(lines[i]);
      }
    }
  }
  return -1;
}

function findNextHeading(content: string, afterIdx: number): number {
  const rest = content.substring(afterIdx);
  // Find the next line starting with ## (skip the current heading line)
  const firstNewline = rest.indexOf('\n');
  if (firstNewline === -1) return content.length;
  const afterHeading = rest.substring(firstNewline + 1);
  const match = afterHeading.match(/^#{2,3}\s+/m);
  if (match && match.index !== undefined) {
    return afterIdx + firstNewline + 1 + match.index;
  }
  return content.length;
}

function validateSections(specsDir: string): string[] {
  const warnings: string[] = [];

  const fileRules: SectionFileRules[] = [
    {
      file: '01-vision.md',
      sections: [
        { heading: 'Vision Statement' },
        { heading: 'Obiettivi Strategici', minItems: 3, itemPattern: 'bullet' },
        { heading: 'Target Users', minItems: 2, itemPattern: 'subsection' },
        { heading: 'Success Metrics', minItems: 3, itemPattern: 'tableRow' },
        { heading: 'Constraints' },
      ],
    },
    {
      file: '02-prd.md',
      sections: [
        { heading: 'Personas', minItems: 2, itemPattern: 'subsection' },
        { heading: 'Requisiti Funzionali' },
        { heading: 'Requisiti Non-Funzionali' },
        { heading: 'MoSCoW', alternatives: ['Prioritization'] },
        { heading: 'Rischi', minItems: 3, itemPattern: 'tableRow' },
      ],
    },
    {
      file: '03-user-stories.md',
      sections: [
        { heading: 'Story Summary', minItems: 1, itemPattern: 'tableRow' },
        { heading: 'US-', minItems: 1, itemPattern: 'custom', customPattern: /AC-\d+/ },
      ],
    },
    {
      file: '04-tech-spec.md',
      sections: [
        { heading: 'Stack Tecnologico' },
        { heading: 'Architettura' },
        { heading: 'Schema Database', minItems: 1, itemPattern: 'custom', customPattern: /CREATE TABLE/i },
        { heading: 'API Endpoints' },
        { heading: 'Test Strategy' },
      ],
    },
    {
      file: '05-sprint-plan.md',
      sections: [
        { heading: 'Sprint Overview', minItems: 1, itemPattern: 'custom', customPattern: /velocit[àa]/i },
        { heading: 'Sprint', minItems: 1, itemPattern: 'subsection' },
        { heading: 'Rischi' },
      ],
    },
  ];

  for (const fileRule of fileRules) {
    const filePath = path.join(specsDir, fileRule.file);
    if (!fs.existsSync(filePath)) {
      continue; // file existence is already checked elsewhere
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    for (const section of fileRule.sections) {
      // Special case: US- stories are not headings but content patterns
      if (section.heading === 'US-') {
        const hasStory = /US-\d+/.test(content);
        if (!hasStory) {
          warnings.push(`⚠️ [Sezioni] ${fileRule.file}: nessuna user story (US-XXX) trovata`);
          continue;
        }
        if (section.customPattern) {
          const hasAC = section.customPattern.test(content);
          if (!hasAC) {
            warnings.push(`⚠️ [Sezioni] ${fileRule.file}: nessun acceptance criteria (AC-XXX) trovato nelle story`);
          }
        }
        continue;
      }

      const startIdx = findSectionStart(content, section.heading, section.alternatives);

      if (startIdx === -1) {
        const altText = section.alternatives ? ` (o ${section.alternatives.join(', ')})` : '';
        warnings.push(`⚠️ [Sezioni] ${fileRule.file}: sezione "${section.heading}"${altText} mancante`);
        continue;
      }

      // Check min items if specified
      if (section.minItems && section.itemPattern) {
        const nextIdx = findNextHeading(content, startIdx);
        const count = countPatternLines(content, startIdx, nextIdx, section.itemPattern, section.customPattern);

        if (count < section.minItems) {
          warnings.push(
            `⚠️ [Sezioni] ${fileRule.file}: sezione "${section.heading}" ha ${count} elementi (minimo ${section.minItems})`
          );
        }
      }
    }
  }

  return warnings;
}

function main() {
  const { specsDir, verbose, checkSections } = parseArgs();

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
  const existingFiles = requiredFiles.filter(f => filesStatus[f]);
  const avgFileSize = existingFiles.length > 0
    ? existingFiles.reduce((sum, file) => {
        return sum + fs.statSync(path.join(specsDir, file)).size;
      }, 0) / existingFiles.length
    : 0;

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

  // Section validation (only when --check-sections is passed)
  let sectionWarnings: string[] = [];
  if (checkSections) {
    sectionWarnings = validateSections(specsDir);
    report.warnings.push(...sectionWarnings);
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

  if (checkSections && sectionWarnings.length === 0) {
    console.log('✅ Sezioni: tutte le sezioni richieste sono presenti\n');
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
