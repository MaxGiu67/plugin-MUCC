#!/usr/bin/env npx tsx

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CliArgs {
  srcDir: string;
  specsDir: string;
  verbose: boolean;
  json: boolean;
}

type Stack = 'node' | 'python' | 'unknown';

interface LargeFile {
  file: string;
  lines: number;
}

interface TodoItem {
  file: string;
  line: number;
  text: string;
}

// --- Node.js tool results ---

interface KnipResult {
  unusedFiles: string[];
  unusedExports: string[];
  unusedDependencies: string[];
}

interface EslintMessage {
  ruleId: string | null;
  severity: number;
  message: string;
  line: number;
  column: number;
}

interface EslintFileResult {
  filePath: string;
  messages: EslintMessage[];
}

interface EslintResult {
  complexFunctions: number;   // CC > 10 (complexity rule)
  longFunctions: number;      // functions > 50 lines
}

interface TscResult {
  errors: number;
}

// --- Python tool results ---

interface RuffMessage {
  filename: string;
  message: string;
  code: string;
  location: { row: number; column: number };
}

interface RuffResult {
  unusedImports: number;
  complexFunctions: number;
  longFunctions: number;
}

interface MypyResult {
  errors: number;
}

interface VultureResult {
  unusedCode: number;
}

// --- Aggregated ---

interface TechDebtInventory {
  stack: Stack;
  unusedFiles: string[];
  unusedExports: number;
  unusedDependencies: string[];
  complexFunctions: number;
  longFunctions: number;
  filesOver1000: LargeFile[];
  files500to1000: LargeFile[];
  typeErrors: number;
  todos: TodoItem[];
  undocumentedFunctions: number;
  qualityScore: number;
  toolsRun: string[];
  toolsSkipped: string[];
}

// ---------------------------------------------------------------------------
// CLI arg parsing
// ---------------------------------------------------------------------------

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  let srcDir = './src';
  let specsDir = './specs';
  let verbose = false;
  let json = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--src-dir' && i + 1 < args.length) {
      srcDir = args[i + 1];
      i++;
    } else if (args[i] === '--specs-dir' && i + 1 < args.length) {
      specsDir = args[i + 1];
      i++;
    } else if (args[i] === '--verbose') {
      verbose = true;
    } else if (args[i] === '--json') {
      json = true;
    }
  }

  return { srcDir, specsDir, verbose, json };
}

// ---------------------------------------------------------------------------
// Stack detection
// ---------------------------------------------------------------------------

function detectStack(srcDir: string): Stack {
  const root = fs.existsSync(srcDir) ? path.dirname(srcDir) : process.cwd();

  // Walk up from srcDir to cwd looking for indicator files
  const candidates = [srcDir, root, process.cwd()];

  for (const dir of candidates) {
    if (!fs.existsSync(dir)) continue;
    if (
      fs.existsSync(path.join(dir, 'package.json'))
    ) {
      return 'node';
    }
    if (
      fs.existsSync(path.join(dir, 'requirements.txt')) ||
      fs.existsSync(path.join(dir, 'pyproject.toml')) ||
      fs.existsSync(path.join(dir, 'Pipfile'))
    ) {
      return 'python';
    }
  }

  // If srcDir itself has .py files, assume python
  if (fs.existsSync(srcDir)) {
    try {
      const entries = fs.readdirSync(srcDir);
      if (entries.some(e => e.endsWith('.py'))) return 'python';
      if (entries.some(e => e.endsWith('.ts') || e.endsWith('.js'))) return 'node';
    } catch (_) {
      // ignore
    }
  }

  return 'unknown';
}

// ---------------------------------------------------------------------------
// LOC counting
// ---------------------------------------------------------------------------

function countLinesInFile(filePath: string): number {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.split('\n').length;
  } catch (_) {
    return 0;
  }
}

function walkDir(dir: string, extensions: string[]): string[] {
  const results: string[] = [];

  if (!fs.existsSync(dir)) return results;

  function recurse(current: string): void {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch (_) {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        // Skip common non-source dirs
        const skip = ['node_modules', '.git', 'dist', 'build', '__pycache__', '.venv', 'venv', 'coverage', '.nyc_output'];
        if (skip.includes(entry.name)) continue;
        recurse(fullPath);
      } else if (entry.isFile()) {
        if (extensions.some(ext => entry.name.endsWith(ext))) {
          results.push(fullPath);
        }
      }
    }
  }

  recurse(dir);
  return results;
}

function analyzeLOC(srcDir: string, stack: Stack): { filesOver1000: LargeFile[]; files500to1000: LargeFile[] } {
  const extensions =
    stack === 'python'
      ? ['.py']
      : stack === 'node'
      ? ['.ts', '.tsx', '.js', '.jsx', '.mts', '.cts']
      : ['.ts', '.tsx', '.js', '.jsx', '.py'];

  const files = walkDir(srcDir, extensions);
  const filesOver1000: LargeFile[] = [];
  const files500to1000: LargeFile[] = [];

  for (const file of files) {
    const lines = countLinesInFile(file);
    if (lines > 1000) {
      filesOver1000.push({ file, lines });
    } else if (lines >= 500) {
      files500to1000.push({ file, lines });
    }
  }

  return { filesOver1000, files500to1000 };
}

// ---------------------------------------------------------------------------
// Undocumented public functions detection
// ---------------------------------------------------------------------------

function countUndocumentedFunctions(srcDir: string, stack: Stack): number {
  const extensions =
    stack === 'python'
      ? ['.py']
      : stack === 'node'
      ? ['.ts', '.tsx', '.js', '.jsx', '.mts', '.cts']
      : ['.ts', '.tsx', '.js', '.jsx', '.py'];

  const files = walkDir(srcDir, extensions);
  let undocumented = 0;

  for (const file of files) {
    let content: string;
    try {
      content = fs.readFileSync(file, 'utf-8');
    } catch (_) {
      continue;
    }

    const lines = content.split('\n');

    if (stack === 'python' || file.endsWith('.py')) {
      // Python: look for def/class without preceding docstring or comment
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trimStart();
        // Match public functions/classes (not starting with _)
        if (/^(def|class)\s+[a-zA-Z]/.test(trimmed) && !/^(def|class)\s+_/.test(trimmed)) {
          // Check if next non-empty line is a docstring
          let hasDoc = false;
          for (let j = i + 1; j < lines.length && j <= i + 3; j++) {
            const nextTrimmed = lines[j].trimStart();
            if (nextTrimmed === '') continue;
            if (nextTrimmed.startsWith('"""') || nextTrimmed.startsWith("'''")) {
              hasDoc = true;
            }
            break;
          }
          // Also check if preceding line is a comment/docstring
          if (!hasDoc && i > 0) {
            const prevTrimmed = lines[i - 1].trimStart();
            if (prevTrimmed.startsWith('#') || prevTrimmed.startsWith('"""') || prevTrimmed.startsWith("'''")) {
              hasDoc = true;
            }
          }
          if (!hasDoc) undocumented++;
        }
      }
    } else {
      // JS/TS: look for export function/class without preceding JSDoc /** */
      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trimStart();
        // Match exported functions, classes, and standalone function declarations
        if (/^(export\s+)?(async\s+)?function\s+\w/.test(trimmed) || /^(export\s+)?class\s+\w/.test(trimmed)) {
          // Check if any preceding line (up to 5 lines back) has a JSDoc closing */
          let hasDoc = false;
          for (let j = i - 1; j >= 0 && j >= i - 5; j--) {
            const prevTrimmed = lines[j].trimStart();
            if (prevTrimmed === '') continue;
            if (prevTrimmed.endsWith('*/') || prevTrimmed.startsWith('/**') || prevTrimmed.startsWith('//')) {
              hasDoc = true;
            }
            break;
          }
          if (!hasDoc) undocumented++;
        }
      }
    }
  }

  return undocumented;
}

// ---------------------------------------------------------------------------
// TODO/FIXME detection
// ---------------------------------------------------------------------------

function findTodos(srcDir: string, stack: Stack): TodoItem[] {
  const extensions =
    stack === 'python'
      ? ['.py']
      : stack === 'node'
      ? ['.ts', '.tsx', '.js', '.jsx', '.mts', '.cts']
      : ['.ts', '.tsx', '.js', '.jsx', '.py'];

  const files = walkDir(srcDir, extensions);
  const todos: TodoItem[] = [];
  const pattern = /TODO|FIXME/;

  for (const file of files) {
    let content: string;
    try {
      content = fs.readFileSync(file, 'utf-8');
    } catch (_) {
      continue;
    }

    const lines = content.split('\n');
    lines.forEach((lineText, idx) => {
      if (pattern.test(lineText)) {
        todos.push({ file, line: idx + 1, text: lineText.trim() });
      }
    });
  }

  return todos;
}

// ---------------------------------------------------------------------------
// Helper: run a command safely
// ---------------------------------------------------------------------------

function runCommand(cmd: string, cwd?: string): { stdout: string; ok: boolean } {
  try {
    const stdout = execSync(cmd, {
      cwd: cwd || process.cwd(),
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 120_000,
    });
    return { stdout, ok: true };
  } catch (err: unknown) {
    // execSync throws on non-zero exit; stdout is still available on the error object
    if (err && typeof err === 'object' && 'stdout' in err) {
      const stdout = (err as { stdout: string }).stdout || '';
      return { stdout, ok: false };
    }
    return { stdout: '', ok: false };
  }
}

// ---------------------------------------------------------------------------
// Node.js tools
// ---------------------------------------------------------------------------

function runKnip(cwd: string): { result: KnipResult | null; skipped: boolean } {
  const { stdout, ok } = runCommand('npx knip --reporter json --no-progress 2>/dev/null', cwd);
  if (!stdout.trim()) return { result: null, skipped: true };

  try {
    const data = JSON.parse(stdout);

    const unusedFiles: string[] = (data.files || []).map((f: string) => f);
    const unusedExports: string[] = [];
    const unusedDependencies: string[] = [];

    // knip JSON shape varies by version; try common keys
    if (Array.isArray(data.exports)) {
      for (const entry of data.exports) {
        if (entry.symbols && Array.isArray(entry.symbols)) {
          unusedExports.push(...entry.symbols.map(() => entry.file as string));
        }
      }
    }

    if (Array.isArray(data.dependencies)) {
      unusedDependencies.push(...data.dependencies.map((d: string | { name: string }) =>
        typeof d === 'string' ? d : d.name
      ));
    }
    if (Array.isArray(data.devDependencies)) {
      unusedDependencies.push(...data.devDependencies.map((d: string | { name: string }) =>
        typeof d === 'string' ? d : d.name
      ));
    }

    return {
      result: { unusedFiles, unusedExports, unusedDependencies },
      skipped: false,
    };
  } catch (_) {
    return { result: null, skipped: !ok };
  }
}

function runEslint(srcDir: string): { result: EslintResult | null; skipped: boolean } {
  const { stdout } = runCommand(
    `npx eslint "${srcDir}" --format json --no-eslintrc --rule '{"complexity": ["warn", 10], "max-lines-per-function": ["warn", {"max": 50}]}' 2>/dev/null`
  );
  if (!stdout.trim()) return { result: null, skipped: true };

  try {
    const data: EslintFileResult[] = JSON.parse(stdout);
    let complexFunctions = 0;
    let longFunctions = 0;

    for (const fileResult of data) {
      for (const msg of fileResult.messages) {
        if (msg.ruleId === 'complexity') complexFunctions++;
        if (msg.ruleId === 'max-lines-per-function') longFunctions++;
      }
    }

    return { result: { complexFunctions, longFunctions }, skipped: false };
  } catch (_) {
    return { result: null, skipped: true };
  }
}

function runTsc(cwd: string): { result: TscResult | null; skipped: boolean } {
  const { stdout } = runCommand('npx tsc --noEmit --pretty false 2>&1 || true', cwd);
  if (!stdout.trim()) {
    // No output = no errors (or tsc not found)
    // Distinguish: try checking if tsc exists
    const { ok } = runCommand('npx tsc --version 2>/dev/null', cwd);
    if (!ok) return { result: null, skipped: true };
    return { result: { errors: 0 }, skipped: false };
  }

  // Count lines that look like errors: "file(line,col): error TSxxxx:"
  const errorLines = stdout.split('\n').filter(line => / error TS\d+:/.test(line));
  return { result: { errors: errorLines.length }, skipped: false };
}

// ---------------------------------------------------------------------------
// Python tools
// ---------------------------------------------------------------------------

function runRuff(srcDir: string): { result: RuffResult | null; skipped: boolean } {
  const { stdout } = runCommand(`ruff check "${srcDir}" --output-format json 2>/dev/null`);
  if (!stdout.trim()) {
    // Check if ruff is installed
    const { ok } = runCommand('ruff --version 2>/dev/null');
    if (!ok) return { result: null, skipped: true };
    return { result: { unusedImports: 0, complexFunctions: 0, longFunctions: 0 }, skipped: false };
  }

  try {
    const data: RuffMessage[] = JSON.parse(stdout);
    let unusedImports = 0;
    let complexFunctions = 0;
    let longFunctions = 0;

    for (const msg of data) {
      const code = msg.code || '';
      // F401 = unused import
      if (code === 'F401') unusedImports++;
      // C901 = complexity
      if (code === 'C901') complexFunctions++;
      // PLR0912 / PLR0915 = too many branches/statements (proxy for long functions)
      if (code === 'PLR0912' || code === 'PLR0915') longFunctions++;
    }

    return { result: { unusedImports, complexFunctions, longFunctions }, skipped: false };
  } catch (_) {
    return { result: null, skipped: true };
  }
}

function runMypy(srcDir: string): { result: MypyResult | null; skipped: boolean } {
  const { ok: mypyInstalled } = runCommand('mypy --version 2>/dev/null');
  if (!mypyInstalled) return { result: null, skipped: true };

  const { stdout } = runCommand(`mypy "${srcDir}" --no-error-summary 2>/dev/null || true`);
  if (!stdout.trim()) return { result: { errors: 0 }, skipped: false };

  // Count lines ending with "error"
  const errorLines = stdout.split('\n').filter(line => /: error:/.test(line));
  return { result: { errors: errorLines.length }, skipped: false };
}

function runVulture(srcDir: string): { result: VultureResult | null; skipped: boolean } {
  const { ok: vultureInstalled } = runCommand('vulture --version 2>/dev/null');
  if (!vultureInstalled) return { result: null, skipped: true };

  const { stdout } = runCommand(`vulture "${srcDir}" --min-confidence 80 2>/dev/null || true`);
  if (!stdout.trim()) return { result: { unusedCode: 0 }, skipped: false };

  const lines = stdout.split('\n').filter(l => l.trim().length > 0);
  return { result: { unusedCode: lines.length }, skipped: false };
}

// ---------------------------------------------------------------------------
// Quality score calculation
// ---------------------------------------------------------------------------

function calculateScore(inventory: Omit<TechDebtInventory, 'qualityScore'>): number {
  let score = 100;

  // -5 per unused file
  score -= inventory.unusedFiles.length * 5;

  // -3 per unused export/import (max -15)
  score -= Math.min(inventory.unusedExports * 3, 15);

  // -8 per unused dependency
  score -= inventory.unusedDependencies.length * 8;

  // -5 per function with CC > 10
  score -= inventory.complexFunctions * 5;

  // -3 per function > 50 lines
  score -= inventory.longFunctions * 3;

  // -10 per file > 1000 lines
  score -= inventory.filesOver1000.length * 10;

  // -5 per file 500-1000 lines (max -20)
  score -= Math.min(inventory.files500to1000.length * 5, 20);

  // -2 per type error
  score -= inventory.typeErrors * 2;

  // -2 per funzione pubblica senza documentazione (max -10)
  score -= Math.min(inventory.undocumentedFunctions * 2, 10);

  // -1 per TODO/FIXME (max -10)
  score -= Math.min(inventory.todos.length, 10);

  return Math.max(0, score);
}

// ---------------------------------------------------------------------------
// Report generation
// ---------------------------------------------------------------------------

function formatScoreBadge(score: number): string {
  if (score >= 80) return 'BUONO';
  if (score >= 60) return 'MEDIO';
  if (score >= 40) return 'SCARSO';
  return 'CRITICO';
}

function generateMarkdownReport(inventory: TechDebtInventory, srcDir: string, runDate: string): string {
  const badge = formatScoreBadge(inventory.qualityScore);

  let md = `# Quality Report

**Data analisi**: ${runDate}
**Directory sorgente**: ${srcDir}
**Stack rilevato**: ${inventory.stack}

## Quality Score: ${inventory.qualityScore}/100 — ${badge}

### Penalita applicate

| Categoria | Trovati | Penalita |
|-----------|---------|----------|
| File inutilizzati (Knip/vulture) | ${inventory.unusedFiles.length} | -${inventory.unusedFiles.length * 5} |
| Export/import inutilizzati (max -15) | ${inventory.unusedExports} | -${Math.min(inventory.unusedExports * 3, 15)} |
| Dipendenze inutilizzate | ${inventory.unusedDependencies.length} | -${inventory.unusedDependencies.length * 8} |
| Funzioni con CC > 10 | ${inventory.complexFunctions} | -${inventory.complexFunctions * 5} |
| Funzioni > 50 righe | ${inventory.longFunctions} | -${inventory.longFunctions * 3} |
| File > 1000 righe | ${inventory.filesOver1000.length} | -${inventory.filesOver1000.length * 10} |
| File 500-1000 righe (max -20) | ${inventory.files500to1000.length} | -${Math.min(inventory.files500to1000.length * 5, 20)} |
| Errori di tipo (tsc/mypy) | ${inventory.typeErrors} | -${inventory.typeErrors * 2} |
| Funzioni senza doc (max -10) | ${inventory.undocumentedFunctions} | -${Math.min(inventory.undocumentedFunctions * 2, 10)} |
| TODO/FIXME (max -10) | ${inventory.todos.length} | -${Math.min(inventory.todos.length, 10)} |

---

## Tech Debt Inventory

### Tool eseguiti
${inventory.toolsRun.length > 0 ? inventory.toolsRun.map(t => `- ${t}`).join('\n') : '_Nessuno_'}

### Tool non disponibili (saltati)
${inventory.toolsSkipped.length > 0 ? inventory.toolsSkipped.map(t => `- ${t}`).join('\n') : '_Nessuno_'}

---

`;

  if (inventory.unusedFiles.length > 0) {
    md += `### File inutilizzati (${inventory.unusedFiles.length})\n\n`;
    inventory.unusedFiles.forEach(f => { md += `- \`${f}\`\n`; });
    md += '\n';
  }

  if (inventory.unusedDependencies.length > 0) {
    md += `### Dipendenze inutilizzate (${inventory.unusedDependencies.length})\n\n`;
    inventory.unusedDependencies.forEach(d => { md += `- \`${d}\`\n`; });
    md += '\n';
  }

  if (inventory.filesOver1000.length > 0) {
    md += `### File > 1000 righe\n\n`;
    md += '| File | Righe |\n|------|-------|\n';
    inventory.filesOver1000.forEach(f => { md += `| \`${f.file}\` | ${f.lines} |\n`; });
    md += '\n';
  }

  if (inventory.files500to1000.length > 0) {
    md += `### File 500-1000 righe\n\n`;
    md += '| File | Righe |\n|------|-------|\n';
    inventory.files500to1000.forEach(f => { md += `| \`${f.file}\` | ${f.lines} |\n`; });
    md += '\n';
  }

  if (inventory.todos.length > 0) {
    md += `### TODO/FIXME (${inventory.todos.length})\n\n`;
    md += '| File | Riga | Testo |\n|------|------|-------|\n';
    inventory.todos.slice(0, 50).forEach(t => {
      const text = t.text.replace(/\|/g, '\\|').substring(0, 80);
      md += `| \`${t.file}\` | ${t.line} | ${text} |\n`;
    });
    if (inventory.todos.length > 50) {
      md += `\n_... e altri ${inventory.todos.length - 50} elementi_\n`;
    }
    md += '\n';
  }

  md += `---\n_Generato da analyze-quality.ts il ${runDate}_\n`;

  return md;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const args = parseArgs();
  const srcDir = path.resolve(args.srcDir);
  const specsDir = path.resolve(args.specsDir);
  const runDate = new Date().toISOString();

  process.stderr.write(`\nAnalisi qualita del codice in: ${srcDir}\n\n`);

  // --- Stack detection ---
  const stack = detectStack(srcDir);
  if (args.verbose) {
    process.stderr.write(`Stack rilevato: ${stack}\n`);
  }

  const toolsRun: string[] = [];
  const toolsSkipped: string[] = [];

  // --- Cross-language analysis ---
  process.stderr.write('Conteggio LOC e analisi file...\n');
  const { filesOver1000, files500to1000 } = analyzeLOC(srcDir, stack);
  const todos = findTodos(srcDir, stack);

  // --- Per-stack tool analysis ---
  let unusedFiles: string[] = [];
  let unusedExports = 0;
  let unusedDependencies: string[] = [];
  let complexFunctions = 0;
  let longFunctions = 0;
  let typeErrors = 0;

  const projectRoot = fs.existsSync(path.join(path.dirname(srcDir), 'package.json'))
    ? path.dirname(srcDir)
    : fs.existsSync(path.join(srcDir, 'package.json'))
    ? srcDir
    : process.cwd();

  if (stack === 'node') {
    // Knip
    process.stderr.write('Esecuzione Knip...\n');
    const knip = runKnip(projectRoot);
    if (knip.skipped) {
      toolsSkipped.push('knip');
      if (args.verbose) process.stderr.write('  -> Knip non disponibile, saltato\n');
    } else {
      toolsRun.push('knip');
      if (knip.result) {
        unusedFiles = knip.result.unusedFiles;
        unusedExports = knip.result.unusedExports.length;
        unusedDependencies = knip.result.unusedDependencies;
        if (args.verbose) {
          process.stderr.write(`  -> ${unusedFiles.length} file inutilizzati, ${unusedExports} export, ${unusedDependencies.length} dipendenze\n`);
        }
      }
    }

    // ESLint
    process.stderr.write('Esecuzione ESLint...\n');
    const eslint = runEslint(srcDir);
    if (eslint.skipped) {
      toolsSkipped.push('eslint');
      if (args.verbose) process.stderr.write('  -> ESLint non disponibile, saltato\n');
    } else {
      toolsRun.push('eslint');
      if (eslint.result) {
        complexFunctions += eslint.result.complexFunctions;
        longFunctions += eslint.result.longFunctions;
        if (args.verbose) {
          process.stderr.write(`  -> ${eslint.result.complexFunctions} funzioni complesse, ${eslint.result.longFunctions} funzioni lunghe\n`);
        }
      }
    }

    // tsc
    process.stderr.write('Esecuzione tsc...\n');
    const tsc = runTsc(projectRoot);
    if (tsc.skipped) {
      toolsSkipped.push('tsc');
      if (args.verbose) process.stderr.write('  -> tsc non disponibile, saltato\n');
    } else {
      toolsRun.push('tsc');
      if (tsc.result) {
        typeErrors = tsc.result.errors;
        if (args.verbose) {
          process.stderr.write(`  -> ${typeErrors} errori di tipo\n`);
        }
      }
    }
  } else if (stack === 'python') {
    // Ruff
    process.stderr.write('Esecuzione Ruff...\n');
    const ruff = runRuff(srcDir);
    if (ruff.skipped) {
      toolsSkipped.push('ruff');
      if (args.verbose) process.stderr.write('  -> Ruff non disponibile, saltato\n');
    } else {
      toolsRun.push('ruff');
      if (ruff.result) {
        unusedExports = ruff.result.unusedImports;
        complexFunctions += ruff.result.complexFunctions;
        longFunctions += ruff.result.longFunctions;
        if (args.verbose) {
          process.stderr.write(`  -> ${ruff.result.unusedImports} import inutilizzati, ${ruff.result.complexFunctions} funzioni complesse\n`);
        }
      }
    }

    // mypy
    process.stderr.write('Esecuzione mypy...\n');
    const mypy = runMypy(srcDir);
    if (mypy.skipped) {
      toolsSkipped.push('mypy');
      if (args.verbose) process.stderr.write('  -> mypy non disponibile, saltato\n');
    } else {
      toolsRun.push('mypy');
      if (mypy.result) {
        typeErrors = mypy.result.errors;
        if (args.verbose) {
          process.stderr.write(`  -> ${typeErrors} errori di tipo\n`);
        }
      }
    }

    // vulture
    process.stderr.write('Esecuzione vulture...\n');
    const vulture = runVulture(srcDir);
    if (vulture.skipped) {
      toolsSkipped.push('vulture');
      if (args.verbose) process.stderr.write('  -> vulture non disponibile, saltato\n');
    } else {
      toolsRun.push('vulture');
      if (vulture.result) {
        // vulture counts unused code items; treat each as an unused "file" unit for scoring
        unusedFiles = Array.from({ length: vulture.result.unusedCode }, (_, i) => `unused-item-${i + 1}`);
        if (args.verbose) {
          process.stderr.write(`  -> ${vulture.result.unusedCode} elementi di codice inutilizzati\n`);
        }
      }
    }
  } else {
    process.stderr.write('Stack sconosciuto: analisi statica degli strumenti saltata.\n');
    toolsSkipped.push('knip/ruff/eslint/mypy/tsc/vulture (stack sconosciuto)');
  }

  // --- Undocumented functions (cross-language, always runs) ---
  process.stderr.write('Analisi documentazione funzioni...\n');
  const undocumentedFunctions = countUndocumentedFunctions(srcDir, stack);
  if (args.verbose) {
    process.stderr.write(`  -> ${undocumentedFunctions} funzioni pubbliche senza documentazione\n`);
  }

  // --- Assemble inventory ---
  const inventoryBase = {
    stack,
    unusedFiles,
    unusedExports,
    unusedDependencies,
    complexFunctions,
    longFunctions,
    filesOver1000,
    files500to1000,
    typeErrors,
    todos,
    undocumentedFunctions,
    toolsRun,
    toolsSkipped,
  };

  const qualityScore = calculateScore(inventoryBase);

  const inventory: TechDebtInventory = { ...inventoryBase, qualityScore };

  // --- Write Markdown report ---
  const technicalDir = path.join(specsDir, 'technical');
  if (!fs.existsSync(technicalDir)) {
    fs.mkdirSync(technicalDir, { recursive: true });
  }

  const reportPath = path.join(technicalDir, 'quality-report.md');
  const markdown = generateMarkdownReport(inventory, srcDir, runDate);
  fs.writeFileSync(reportPath, markdown, 'utf-8');

  // --- JSON output to stdout ---
  if (args.json) {
    process.stdout.write(JSON.stringify(inventory, null, 2) + '\n');
  }

  // --- Summary to stderr ---
  const badge = formatScoreBadge(qualityScore);
  process.stderr.write('\n==============================================\n');
  process.stderr.write(`  Quality Score: ${qualityScore}/100 — ${badge}\n`);
  process.stderr.write('==============================================\n');
  process.stderr.write(`  Stack:                ${stack}\n`);
  process.stderr.write(`  File inutilizzati:    ${unusedFiles.length}\n`);
  process.stderr.write(`  Export inutilizzati:  ${unusedExports}\n`);
  process.stderr.write(`  Dipendenze inutiliz.: ${unusedDependencies.length}\n`);
  process.stderr.write(`  Funzioni complesse:   ${complexFunctions}\n`);
  process.stderr.write(`  Funzioni lunghe:      ${longFunctions}\n`);
  process.stderr.write(`  File > 1000 righe:    ${filesOver1000.length}\n`);
  process.stderr.write(`  File 500-1000 righe:  ${files500to1000.length}\n`);
  process.stderr.write(`  Errori di tipo:       ${typeErrors}\n`);
  process.stderr.write(`  Funzioni senza doc:   ${undocumentedFunctions}\n`);
  process.stderr.write(`  TODO/FIXME:           ${todos.length}\n`);
  process.stderr.write('==============================================\n');
  process.stderr.write(`\nReport scritto in: ${reportPath}\n\n`);
}

main();
