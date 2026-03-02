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
  sastOnly: boolean;
  scaOnly: boolean;
}

type Severity = 'critical' | 'high' | 'medium' | 'low';

type OwaspCategory =
  | 'A01:2021 - Broken Access Control'
  | 'A02:2021 - Cryptographic Failures'
  | 'A03:2021 - Injection'
  | 'A04:2021 - Insecure Design'
  | 'A05:2021 - Security Misconfiguration'
  | 'A06:2021 - Vulnerable and Outdated Components'
  | 'A07:2021 - Identification and Authentication Failures'
  | 'A08:2021 - Software and Data Integrity Failures'
  | 'A09:2021 - Security Logging and Monitoring Failures'
  | 'A10:2021 - Server-Side Request Forgery'
  | 'Uncategorized';

interface Finding {
  id: string;
  tool: string;
  severity: Severity;
  title: string;
  description: string;
  file?: string;
  line?: number;
  owasp: OwaspCategory;
  cvss?: number;
  cve?: string;
  package?: string;
  installedVersion?: string;
  fixedVersion?: string;
}

interface ToolAvailability {
  semgrep: boolean;
  bearer: boolean;
  bandit: boolean;
  npmAudit: boolean;
  osvScanner: boolean;
  retire: boolean;
  pipAudit: boolean;
}

interface Stack {
  nodejs: boolean;
  python: boolean;
}

interface SecurityReport {
  timestamp: string;
  srcDir: string;
  stack: Stack;
  toolsAvailable: ToolAvailability;
  findings: Finding[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
    securityScore: number;
  };
  owaspBreakdown: Partial<Record<OwaspCategory, number>>;
}

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  let srcDir = '.';
  let specsDir = './specs';
  let verbose = false;
  let json = false;
  let sastOnly = false;
  let scaOnly = false;

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
    } else if (args[i] === '--sast-only') {
      sastOnly = true;
    } else if (args[i] === '--sca-only') {
      scaOnly = true;
    }
  }

  return { srcDir, specsDir, verbose, json, sastOnly, scaOnly };
}

// ---------------------------------------------------------------------------
// Stack detection
// ---------------------------------------------------------------------------

function detectStack(srcDir: string): Stack {
  const hasPackageJson = fs.existsSync(path.join(srcDir, 'package.json'));
  const hasRequirements = fs.existsSync(path.join(srcDir, 'requirements.txt'));
  const hasPyproject = fs.existsSync(path.join(srcDir, 'pyproject.toml'));

  return {
    nodejs: hasPackageJson,
    python: hasRequirements || hasPyproject,
  };
}

// ---------------------------------------------------------------------------
// Tool availability checks
// ---------------------------------------------------------------------------

function isCommandAvailable(cmd: string): boolean {
  try {
    execSync(`which ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function checkToolAvailability(stack: Stack): ToolAvailability {
  return {
    semgrep: isCommandAvailable('semgrep'),
    bearer: isCommandAvailable('bearer'),
    bandit: stack.python && isCommandAvailable('bandit'),
    npmAudit: stack.nodejs,
    osvScanner: isCommandAvailable('osv-scanner'),
    retire: stack.nodejs && isCommandAvailable('retire'),
    pipAudit: stack.python && isCommandAvailable('pip-audit'),
  };
}

// ---------------------------------------------------------------------------
// OWASP mapping helpers
// ---------------------------------------------------------------------------

const OWASP_KEYWORDS: Array<{ patterns: string[]; category: OwaspCategory }> = [
  {
    patterns: ['sql', 'injection', 'sqli', 'command injection', 'rce', 'remote code', 'exec', 'eval', 'xss', 'cross-site scripting', 'template injection', 'ssti', 'ldap injection', 'xpath'],
    category: 'A03:2021 - Injection',
  },
  {
    patterns: ['broken access', 'idor', 'path traversal', 'directory traversal', 'unauthorized', 'privilege escalation', 'lfi', 'rfi', 'local file inclusion'],
    category: 'A01:2021 - Broken Access Control',
  },
  {
    patterns: ['crypto', 'weak hash', 'md5', 'sha1', 'cleartext', 'plaintext password', 'hardcoded secret', 'hardcoded key', 'hardcoded credential', 'insecure random', 'weak cipher'],
    category: 'A02:2021 - Cryptographic Failures',
  },
  {
    patterns: ['ssrf', 'server-side request forgery'],
    category: 'A10:2021 - Server-Side Request Forgery',
  },
  {
    patterns: ['misconfiguration', 'default credential', 'debug mode', 'cors', 'security header', 'http header', 'csrf'],
    category: 'A05:2021 - Security Misconfiguration',
  },
  {
    patterns: ['vulnerable', 'outdated', 'deprecated', 'cve-', 'known vulnerability', 'supply chain'],
    category: 'A06:2021 - Vulnerable and Outdated Components',
  },
  {
    patterns: ['auth bypass', 'authentication', 'session', 'brute force', 'weak password', 'jwt', 'token'],
    category: 'A07:2021 - Identification and Authentication Failures',
  },
  {
    patterns: ['deserialization', 'integrity', 'tamper', 'unsigned', 'untrusted data'],
    category: 'A08:2021 - Software and Data Integrity Failures',
  },
  {
    patterns: ['logging', 'log injection', 'monitoring', 'audit'],
    category: 'A09:2021 - Security Logging and Monitoring Failures',
  },
  {
    patterns: ['insecure design', 'threat model', 'business logic'],
    category: 'A04:2021 - Insecure Design',
  },
];

function mapToOwasp(text: string): OwaspCategory {
  const normalized = text.toLowerCase();
  for (const entry of OWASP_KEYWORDS) {
    if (entry.patterns.some(p => normalized.includes(p))) {
      return entry.category;
    }
  }
  return 'Uncategorized';
}

// ---------------------------------------------------------------------------
// Severity classification
// ---------------------------------------------------------------------------

function classifySeverity(
  rawSeverity: string,
  title: string,
  cvss?: number
): Severity {
  // CVSS score takes precedence when available
  if (cvss !== undefined) {
    if (cvss >= 9.0) return 'critical';
    if (cvss >= 7.0) return 'high';
    if (cvss >= 4.0) return 'medium';
    return 'low';
  }

  const combined = (rawSeverity + ' ' + title).toLowerCase();

  // Keyword-based critical detection
  if (
    combined.includes('critical') ||
    combined.includes('rce') ||
    combined.includes('remote code') ||
    combined.includes('sql injection') ||
    combined.includes('auth bypass')
  ) {
    return 'critical';
  }

  if (
    combined.includes('high') ||
    combined.includes('xss') ||
    combined.includes('ssrf') ||
    combined.includes('path traversal')
  ) {
    return 'high';
  }

  if (
    combined.includes('medium') ||
    combined.includes('moderate') ||
    combined.includes('info disclosure') ||
    combined.includes('weak crypto')
  ) {
    return 'medium';
  }

  return 'low';
}

// ---------------------------------------------------------------------------
// Security score calculation
// ---------------------------------------------------------------------------

function calculateSecurityScore(findings: Finding[]): number {
  let score = 100;
  let lowDeduction = 0;

  for (const f of findings) {
    switch (f.severity) {
      case 'critical':
        score -= 25;
        break;
      case 'high':
        score -= 15;
        break;
      case 'medium':
        score -= 5;
        break;
      case 'low':
        lowDeduction = Math.min(lowDeduction + 1, 5);
        break;
    }
  }

  score -= lowDeduction;
  return Math.max(0, score);
}

// ---------------------------------------------------------------------------
// Run command safely
// ---------------------------------------------------------------------------

function runCommand(cmd: string, cwd?: string): string | null {
  try {
    const result = execSync(cmd, {
      cwd: cwd || process.cwd(),
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 120_000,
    });
    return result.toString('utf-8');
  } catch (err: unknown) {
    // execSync throws when exit code != 0; stdout may still contain useful data
    if (err && typeof err === 'object' && 'stdout' in err) {
      const stdout = (err as { stdout: Buffer | string }).stdout;
      if (stdout) return stdout.toString();
    }
    return null;
  }
}

function readJsonFile(filePath: string): unknown {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// SAST runners
// ---------------------------------------------------------------------------

function runSemgrep(srcDir: string, verbose: boolean): Finding[] {
  const reportPath = '/tmp/semgrep-report.json';
  if (verbose) process.stderr.write('[semgrep] Running scan...\n');

  const output = runCommand(
    `semgrep scan --config auto --json --metrics=off -o ${reportPath} ${srcDir}`
  );

  if (output === null && !fs.existsSync(reportPath)) {
    if (verbose) process.stderr.write('[semgrep] No output produced.\n');
    return [];
  }

  const data = readJsonFile(reportPath) as {
    results?: Array<{
      check_id: string;
      extra?: {
        message?: string;
        severity?: string;
        metadata?: { owasp?: string[]; cwe?: string[] };
      };
      path?: string;
      start?: { line?: number };
    }>;
  } | null;

  if (!data || !Array.isArray(data.results)) return [];

  return data.results.map((r, idx) => {
    const rawSev = r.extra?.severity ?? 'low';
    const title = r.check_id ?? 'semgrep finding';
    const description = r.extra?.message ?? title;
    const cvssStr = r.extra?.metadata?.owasp?.join(' ') ?? '';
    const owasp = mapToOwasp(title + ' ' + description + ' ' + cvssStr);

    return {
      id: `SAST-SG-${String(idx + 1).padStart(3, '0')}`,
      tool: 'semgrep',
      severity: classifySeverity(rawSev, title),
      title,
      description,
      file: r.path,
      line: r.start?.line,
      owasp,
    } satisfies Finding;
  });
}

function runBearer(srcDir: string, verbose: boolean): Finding[] {
  const reportPath = '/tmp/bearer-report.json';
  if (verbose) process.stderr.write('[bearer] Running scan...\n');

  runCommand(`bearer scan ${srcDir} --format json --output ${reportPath}`);

  const data = readJsonFile(reportPath) as {
    findings?: Array<{
      id?: string;
      title?: string;
      description?: string;
      severity?: string;
      filename?: string;
      line_number?: number;
    }>;
  } | null;

  if (!data || !Array.isArray(data.findings)) return [];

  return data.findings.map((f, idx) => {
    const title = f.title ?? 'bearer finding';
    const description = f.description ?? title;
    return {
      id: `SAST-BR-${String(idx + 1).padStart(3, '0')}`,
      tool: 'bearer',
      severity: classifySeverity(f.severity ?? 'low', title),
      title,
      description,
      file: f.filename,
      line: f.line_number,
      owasp: mapToOwasp(title + ' ' + description),
    } satisfies Finding;
  });
}

function runBandit(srcDir: string, verbose: boolean): Finding[] {
  const reportPath = '/tmp/bandit-report.json';
  if (verbose) process.stderr.write('[bandit] Running scan...\n');

  runCommand(`bandit -r ${srcDir} -f json -o ${reportPath}`);

  const data = readJsonFile(reportPath) as {
    results?: Array<{
      test_id?: string;
      test_name?: string;
      issue_text?: string;
      issue_severity?: string;
      issue_confidence?: string;
      filename?: string;
      line_number?: number;
    }>;
  } | null;

  if (!data || !Array.isArray(data.results)) return [];

  return data.results.map((r, idx) => {
    const title = r.test_name ?? r.test_id ?? 'bandit finding';
    const description = r.issue_text ?? title;
    return {
      id: `SAST-BD-${String(idx + 1).padStart(3, '0')}`,
      tool: 'bandit',
      severity: classifySeverity(r.issue_severity ?? 'low', title),
      title,
      description,
      file: r.filename,
      line: r.line_number,
      owasp: mapToOwasp(title + ' ' + description),
    } satisfies Finding;
  });
}

// ---------------------------------------------------------------------------
// SCA runners
// ---------------------------------------------------------------------------

function runNpmAudit(srcDir: string, verbose: boolean): Finding[] {
  if (verbose) process.stderr.write('[npm audit] Running scan...\n');

  const output = runCommand('npm audit --json', srcDir);
  if (!output) return [];

  let data: {
    vulnerabilities?: Record<string, {
      name?: string;
      severity?: string;
      via?: Array<string | {
        title?: string;
        url?: string;
        severity?: string;
        cvss?: { score?: number };
        cve?: string[];
        range?: string;
      }>;
      fixAvailable?: boolean | { name?: string; version?: string };
    }>;
  };

  try {
    data = JSON.parse(output);
  } catch {
    return [];
  }

  if (!data.vulnerabilities) return [];

  const findings: Finding[] = [];
  let idx = 0;

  for (const [pkgName, vuln] of Object.entries(data.vulnerabilities)) {
    const vias = Array.isArray(vuln.via) ? vuln.via : [];
    const detailVia = vias.find(v => typeof v === 'object') as {
      title?: string;
      url?: string;
      severity?: string;
      cvss?: { score?: number };
      cve?: string[];
      range?: string;
    } | undefined;

    const title = detailVia?.title ?? `Vulnerability in ${pkgName}`;
    const rawSev = detailVia?.severity ?? vuln.severity ?? 'low';
    const cvss = detailVia?.cvss?.score;
    const cve = detailVia?.cve?.[0];
    const fixedVersion =
      typeof vuln.fixAvailable === 'object'
        ? vuln.fixAvailable?.version
        : undefined;

    idx++;
    findings.push({
      id: `SCA-NM-${String(idx).padStart(3, '0')}`,
      tool: 'npm audit',
      severity: classifySeverity(rawSev, title, cvss),
      title,
      description: title + (cve ? ` (${cve})` : ''),
      owasp: mapToOwasp(title + ' vulnerable outdated component'),
      cvss,
      cve,
      package: pkgName,
      installedVersion: detailVia?.range,
      fixedVersion,
    });
  }

  return findings;
}

function runOsvScanner(srcDir: string, verbose: boolean, stack: Stack): Finding[] {
  if (verbose) process.stderr.write('[osv-scanner] Running scan...\n');

  // Determine lockfile
  const lockfiles: string[] = [];
  if (stack.nodejs) {
    const lockPath = path.join(srcDir, 'package-lock.json');
    if (fs.existsSync(lockPath)) lockfiles.push(`-L ${lockPath}`);
  }
  if (stack.python) {
    const reqPath = path.join(srcDir, 'requirements.txt');
    if (fs.existsSync(reqPath)) lockfiles.push(`-L ${reqPath}`);
  }

  if (lockfiles.length === 0) {
    if (verbose) process.stderr.write('[osv-scanner] No lockfiles found, skipping.\n');
    return [];
  }

  const output = runCommand(
    `osv-scanner scan --format json ${lockfiles.join(' ')}`
  );
  if (!output) return [];

  let data: {
    results?: Array<{
      packages?: Array<{
        package?: { name?: string; version?: string };
        vulnerabilities?: Array<{
          id?: string;
          summary?: string;
          severity?: Array<{ type?: string; score?: string }>;
          database_specific?: { severity?: string };
        }>;
      }>;
    }>;
  };

  try {
    data = JSON.parse(output);
  } catch {
    return [];
  }

  const findings: Finding[] = [];
  let idx = 0;

  for (const result of data.results ?? []) {
    for (const pkg of result.packages ?? []) {
      for (const vuln of pkg.vulnerabilities ?? []) {
        const cvssEntry = vuln.severity?.find(s => s.type === 'CVSS_V3');
        const cvss = cvssEntry?.score ? parseFloat(cvssEntry.score) : undefined;
        const rawSev = vuln.database_specific?.severity ?? 'low';
        const title = vuln.summary ?? `OSV: ${vuln.id}`;

        idx++;
        findings.push({
          id: `SCA-OSV-${String(idx).padStart(3, '0')}`,
          tool: 'osv-scanner',
          severity: classifySeverity(rawSev, title, cvss),
          title,
          description: title,
          owasp: mapToOwasp(title + ' vulnerable outdated component ' + (vuln.id ?? '')),
          cvss,
          cve: vuln.id?.startsWith('CVE-') ? vuln.id : undefined,
          package: pkg.package?.name,
          installedVersion: pkg.package?.version,
        });
      }
    }
  }

  return findings;
}

function runRetire(srcDir: string, verbose: boolean): Finding[] {
  const reportPath = '/tmp/retire-report.json';
  if (verbose) process.stderr.write('[retire.js] Running scan...\n');

  runCommand(
    `retire --outputformat json --outputpath ${reportPath}`,
    srcDir
  );

  const data = readJsonFile(reportPath) as Array<{
    file?: string;
    results?: Array<{
      component?: string;
      version?: string;
      vulnerabilities?: Array<{
        severity?: string;
        identifiers?: { CVE?: string[]; summary?: string };
        info?: string[];
      }>;
    }>;
  }> | null;

  if (!Array.isArray(data)) return [];

  const findings: Finding[] = [];
  let idx = 0;

  for (const entry of data) {
    for (const result of entry.results ?? []) {
      for (const vuln of result.vulnerabilities ?? []) {
        const cve = vuln.identifiers?.CVE?.[0];
        const title = vuln.identifiers?.summary ?? `retire: ${result.component}@${result.version}`;
        idx++;
        findings.push({
          id: `SCA-RT-${String(idx).padStart(3, '0')}`,
          tool: 'retire.js',
          severity: classifySeverity(vuln.severity ?? 'low', title),
          title,
          description: title,
          file: entry.file,
          owasp: mapToOwasp(title + ' vulnerable outdated component'),
          cve,
          package: result.component,
          installedVersion: result.version,
        });
      }
    }
  }

  return findings;
}

function runPipAudit(srcDir: string, verbose: boolean): Finding[] {
  const reportPath = '/tmp/pip-audit-report.json';
  if (verbose) process.stderr.write('[pip-audit] Running scan...\n');

  runCommand(`pip-audit -f json -o ${reportPath}`, srcDir);

  const data = readJsonFile(reportPath) as Array<{
    name?: string;
    version?: string;
    vulns?: Array<{
      id?: string;
      description?: string;
      fix_versions?: string[];
    }>;
  }> | null;

  if (!Array.isArray(data)) return [];

  const findings: Finding[] = [];
  let idx = 0;

  for (const pkg of data) {
    for (const vuln of pkg.vulns ?? []) {
      const title = `${pkg.name}@${pkg.version}: ${vuln.id ?? 'unknown'}`;
      const description = vuln.description ?? title;
      idx++;
      findings.push({
        id: `SCA-PA-${String(idx).padStart(3, '0')}`,
        tool: 'pip-audit',
        severity: classifySeverity('medium', title),
        title,
        description,
        owasp: mapToOwasp(title + ' vulnerable outdated component ' + (vuln.id ?? '')),
        cve: vuln.id?.startsWith('CVE-') ? vuln.id : undefined,
        package: pkg.name,
        installedVersion: pkg.version,
        fixedVersion: vuln.fix_versions?.[0],
      });
    }
  }

  return findings;
}

// ---------------------------------------------------------------------------
// Report generation
// ---------------------------------------------------------------------------

function severityBadge(s: Severity): string {
  switch (s) {
    case 'critical': return '**CRITICAL**';
    case 'high': return '**HIGH**';
    case 'medium': return 'MEDIUM';
    case 'low': return 'low';
  }
}

function scoreLabel(score: number): string {
  if (score >= 90) return 'A (Excellent)';
  if (score >= 75) return 'B (Good)';
  if (score >= 60) return 'C (Acceptable)';
  if (score >= 40) return 'D (Poor)';
  return 'F (Critical Risk)';
}

function buildMarkdownReport(report: SecurityReport): string {
  const { summary, findings, stack, toolsAvailable, owaspBreakdown } = report;

  const toolsList = Object.entries(toolsAvailable)
    .map(([tool, available]) => `| ${tool} | ${available ? 'Yes' : 'No'} |`)
    .join('\n');

  const owaspRows = Object.entries(owaspBreakdown)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .map(([cat, count]) => `| ${cat} | ${count} |`)
    .join('\n');

  const findingRows = findings
    .sort((a, b) => {
      const order: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      return order[a.severity] - order[b.severity];
    })
    .map(f => {
      const location = f.file ? `${f.file}${f.line ? `:${f.line}` : ''}` : '-';
      const pkg = f.package ? `${f.package}${f.installedVersion ? `@${f.installedVersion}` : ''}` : '-';
      const fix = f.fixedVersion ? `Fix: ${f.fixedVersion}` : '-';
      return `| ${f.id} | ${severityBadge(f.severity)} | ${f.tool} | ${f.title.substring(0, 60)} | ${location} | ${pkg} | ${fix} | ${f.owasp} |`;
    })
    .join('\n');

  const detailSections = findings
    .filter(f => f.severity === 'critical' || f.severity === 'high')
    .sort((a, b) => {
      const order: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      return order[a.severity] - order[b.severity];
    })
    .map(f => {
      return `### ${f.id} — ${f.title}

- **Severity**: ${severityBadge(f.severity)}
- **Tool**: ${f.tool}
- **OWASP**: ${f.owasp}
${f.cve ? `- **CVE**: ${f.cve}` : ''}
${f.cvss !== undefined ? `- **CVSS Score**: ${f.cvss}` : ''}
${f.file ? `- **File**: \`${f.file}${f.line ? `:${f.line}` : ''}\`` : ''}
${f.package ? `- **Package**: \`${f.package}${f.installedVersion ? `@${f.installedVersion}` : ''}\`` : ''}
${f.fixedVersion ? `- **Fixed in**: \`${f.fixedVersion}\`` : ''}

**Description**: ${f.description}
`;
    })
    .join('\n---\n\n');

  return `# Security Analysis Report

**Generated**: ${report.timestamp}
**Source Directory**: \`${report.srcDir}\`
**Stack**: ${[stack.nodejs && 'Node.js', stack.python && 'Python'].filter(Boolean).join(', ') || 'Unknown'}

---

## Security Score

| Metric | Value |
|--------|-------|
| **Score** | **${summary.securityScore} / 100** |
| **Grade** | **${scoreLabel(summary.securityScore)}** |
| Critical Findings | ${summary.critical} |
| High Findings | ${summary.high} |
| Medium Findings | ${summary.medium} |
| Low Findings | ${summary.low} |
| Total Findings | ${summary.total} |

> Score deduction: -25 per Critical, -15 per High, -5 per Medium, -1 per Low (max -5 for Low), floor 0.

---

## Tools Used

| Tool | Available |
|------|-----------|
${toolsList}

---

## OWASP Top 10 Breakdown

| Category | Findings |
|----------|---------|
${owaspRows || '| No findings | 0 |'}

---

## All Findings

| ID | Severity | Tool | Title | Location | Package | Fix | OWASP |
|----|----------|------|-------|----------|---------|-----|-------|
${findingRows || '| - | - | - | No findings detected | - | - | - | - |'}

---

## Critical & High Detail

${detailSections || '_No critical or high severity findings._'}

---

## Remediation Priorities

${summary.critical > 0 ? `1. **IMMEDIATE**: Address ${summary.critical} Critical finding(s) — these represent severe risk and must be fixed before any deployment.` : ''}
${summary.high > 0 ? `${summary.critical > 0 ? '2' : '1'}. **SHORT-TERM**: Resolve ${summary.high} High finding(s) within the current sprint.` : ''}
${summary.medium > 0 ? `- **MEDIUM-TERM**: Plan remediation of ${summary.medium} Medium finding(s) within the next 2 sprints.` : ''}
${summary.low > 0 ? `- **LONG-TERM**: Address ${summary.low} Low finding(s) as part of ongoing security hygiene.` : ''}
${summary.total === 0 ? '_No findings detected. Continue enforcing security best practices._' : ''}

---

_Report generated by \`analyze-security.ts\` — dev-methodology SDD plugin_
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const args = parseArgs();
  const { srcDir, specsDir, verbose, json, sastOnly, scaOnly } = args;

  // Resolve absolute paths
  const absSrcDir = path.resolve(srcDir);
  const absSpecsDir = path.resolve(specsDir);

  if (!fs.existsSync(absSrcDir)) {
    process.stderr.write(`[analyze-security] ERROR: --src-dir "${absSrcDir}" does not exist.\n`);
    process.exit(1);
  }

  process.stderr.write(`[analyze-security] Starting security analysis...\n`);
  process.stderr.write(`[analyze-security] Source: ${absSrcDir}\n`);
  process.stderr.write(`[analyze-security] Specs:  ${absSpecsDir}\n\n`);

  // Detect stack
  const stack = detectStack(absSrcDir);
  if (verbose) {
    process.stderr.write(`[stack] Node.js: ${stack.nodejs}, Python: ${stack.python}\n`);
  }

  // Check tools
  const tools = checkToolAvailability(stack);
  if (verbose) {
    for (const [tool, avail] of Object.entries(tools)) {
      process.stderr.write(`[tools] ${tool}: ${avail ? 'available' : 'not available'}\n`);
    }
    process.stderr.write('\n');
  }

  const findings: Finding[] = [];

  // ---- SAST ----
  if (!scaOnly) {
    if (tools.semgrep) {
      const r = runSemgrep(absSrcDir, verbose);
      process.stderr.write(`[semgrep] ${r.length} finding(s)\n`);
      findings.push(...r);
    } else {
      process.stderr.write(`[semgrep] Not installed, skipping.\n`);
    }

    if (tools.bearer) {
      const r = runBearer(absSrcDir, verbose);
      process.stderr.write(`[bearer] ${r.length} finding(s)\n`);
      findings.push(...r);
    } else {
      process.stderr.write(`[bearer] Not installed, skipping.\n`);
    }

    if (tools.bandit) {
      const r = runBandit(absSrcDir, verbose);
      process.stderr.write(`[bandit] ${r.length} finding(s)\n`);
      findings.push(...r);
    } else if (stack.python) {
      process.stderr.write(`[bandit] Not installed, skipping.\n`);
    }
  }

  // ---- SCA ----
  if (!sastOnly) {
    if (tools.npmAudit) {
      const r = runNpmAudit(absSrcDir, verbose);
      process.stderr.write(`[npm audit] ${r.length} finding(s)\n`);
      findings.push(...r);
    }

    if (tools.osvScanner) {
      const r = runOsvScanner(absSrcDir, verbose, stack);
      process.stderr.write(`[osv-scanner] ${r.length} finding(s)\n`);
      findings.push(...r);
    } else {
      process.stderr.write(`[osv-scanner] Not installed, skipping.\n`);
    }

    if (tools.retire) {
      const r = runRetire(absSrcDir, verbose);
      process.stderr.write(`[retire.js] ${r.length} finding(s)\n`);
      findings.push(...r);
    } else if (stack.nodejs) {
      process.stderr.write(`[retire.js] Not installed, skipping.\n`);
    }

    if (tools.pipAudit) {
      const r = runPipAudit(absSrcDir, verbose);
      process.stderr.write(`[pip-audit] ${r.length} finding(s)\n`);
      findings.push(...r);
    } else if (stack.python) {
      process.stderr.write(`[pip-audit] Not installed, skipping.\n`);
    }
  }

  // ---- Build summary ----
  const countBySeverity = (s: Severity) => findings.filter(f => f.severity === s).length;

  const owaspBreakdown: Partial<Record<OwaspCategory, number>> = {};
  for (const f of findings) {
    owaspBreakdown[f.owasp] = (owaspBreakdown[f.owasp] ?? 0) + 1;
  }

  const summary = {
    critical: countBySeverity('critical'),
    high: countBySeverity('high'),
    medium: countBySeverity('medium'),
    low: countBySeverity('low'),
    total: findings.length,
    securityScore: calculateSecurityScore(findings),
  };

  const report: SecurityReport = {
    timestamp: new Date().toISOString(),
    srcDir: absSrcDir,
    stack,
    toolsAvailable: tools,
    findings,
    summary,
    owaspBreakdown,
  };

  // ---- Write Markdown report ----
  const technicalDir = path.join(absSpecsDir, 'technical');
  if (!fs.existsSync(technicalDir)) {
    fs.mkdirSync(technicalDir, { recursive: true });
  }

  const reportPath = path.join(technicalDir, 'security-report.md');
  const markdownContent = buildMarkdownReport(report);
  fs.writeFileSync(reportPath, markdownContent, 'utf-8');

  // ---- JSON output ----
  if (json) {
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  }

  // ---- Summary to stderr ----
  process.stderr.write('\n');
  process.stderr.write('══════════════════════════════════════════\n');
  process.stderr.write(`  SECURITY ANALYSIS COMPLETE\n`);
  process.stderr.write('══════════════════════════════════════════\n');
  process.stderr.write(`  Security Score : ${summary.securityScore} / 100  (${scoreLabel(summary.securityScore)})\n`);
  process.stderr.write(`  Critical       : ${summary.critical}\n`);
  process.stderr.write(`  High           : ${summary.high}\n`);
  process.stderr.write(`  Medium         : ${summary.medium}\n`);
  process.stderr.write(`  Low            : ${summary.low}\n`);
  process.stderr.write(`  Total          : ${summary.total}\n`);
  process.stderr.write('──────────────────────────────────────────\n');
  process.stderr.write(`  Report written : ${reportPath}\n`);
  process.stderr.write('══════════════════════════════════════════\n\n');

  // Exit with non-zero if critical findings exist
  process.exit(summary.critical > 0 ? 2 : summary.high > 0 ? 1 : 0);
}

main();
