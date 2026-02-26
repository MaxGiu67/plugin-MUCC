#!/usr/bin/env npx tsx

import * as fs from 'fs';
import * as path from 'path';

interface ExportConfig {
  specsDir: string;
  output: string;
  format: 'markdown' | 'html';
}

function parseArgs(): ExportConfig {
  const args = process.argv.slice(2);
  let specsDir = './specs';
  let output = 'project-overview.md';
  let format: 'markdown' | 'html' = 'markdown';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--specs-dir' && i + 1 < args.length) {
      specsDir = args[i + 1];
      i++;
    } else if (args[i] === '--output' && i + 1 < args.length) {
      output = args[i + 1];
      i++;
    } else if (args[i] === '--format' && i + 1 < args.length) {
      format = args[i + 1] as 'markdown' | 'html';
      i++;
    }
  }

  return { specsDir, output, format };
}

function readFile(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    return '';
  }
  return fs.readFileSync(filePath, 'utf-8');
}

function buildMarkdownDocument(specsDir: string): string {
  const files = [
    '01-vision.md',
    '02-prd.md',
    '03-user-stories.md',
    '04-tech-spec.md',
    '05-implementation.md',
    '06-testing.md',
    '07-deployment.md',
    '08-validation.md',
  ];

  let doc = `# Panoramica Progetto

**Data generazione**: ${new Date().toISOString()}
**Formato**: Combined Markdown Export

## Indice

`;

  files.forEach((file, idx) => {
    const title = file.replace(/^\d+-/, '').replace(/\.md$/, '').replace(/-/g, ' ');
    doc += `${idx + 1}. [${title}](#${title.toLowerCase().replace(/\s+/g, '-')})\n`;
  });

  doc += `\n---\n\n`;

  files.forEach(file => {
    const filePath = path.join(specsDir, file);
    const content = readFile(filePath);

    if (content) {
      const title = file.replace(/^\d+-/, '').replace(/\.md$/, '').replace(/-/g, ' ');
      doc += `## ${title}\n\n`;
      doc += content;
      doc += `\n\n---\n\n`;
    }
  });

  doc += `## Metadata\n\n`;
  doc += `- **Data export**: ${new Date().toISOString()}\n`;
  doc += `- **Numero file**: ${files.length}\n`;
  doc += `- **Lunghezza totale**: ${doc.length} caratteri\n`;

  return doc;
}

function markdownToHtml(markdown: string): string {
  const htmlContent = markdown
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*?)$/gm, '<li>$1</li>')
    .replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>')
    .replace(/^---$/gm, '<hr />')
    .replace(/\n/g, '<br />\n');

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Panoramica Progetto</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
      background-color: #f5f5f5;
    }
    h1 {
      color: #F5921B;
      border-bottom: 3px solid #F5921B;
      padding-bottom: 10px;
    }
    h2 {
      color: #2FA7E6;
      margin-top: 30px;
    }
    h3 {
      color: #2FA7E6;
    }
    code {
      background-color: #1E1E2E;
      color: #00D084;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', Courier, monospace;
    }
    pre {
      background-color: #1E1E2E;
      color: #fff;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    table th, table td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    table th {
      background-color: #F5921B;
      color: white;
    }
    ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    li {
      margin: 5px 0;
    }
    a {
      color: #2FA7E6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .metadata {
      background-color: #e8f4f8;
      padding: 15px;
      border-left: 4px solid #2FA7E6;
      border-radius: 3px;
      margin-top: 30px;
    }
    hr {
      border: none;
      height: 2px;
      background-color: #ddd;
      margin: 40px 0;
    }
  </style>
</head>
<body>
  ${htmlContent}
  <div class="metadata">
    <strong>Generato:</strong> ${new Date().toLocaleString('it-IT')}
  </div>
</body>
</html>`;

  return html;
}

async function main() {
  const cfg = parseArgs();

  if (!fs.existsSync(cfg.specsDir)) {
    console.error(`❌ Directory ${cfg.specsDir} non trovata!`);
    process.exit(1);
  }

  console.log(`\n📄 Export progetto: ${cfg.format}\n`);

  // Build document
  let content: string;

  if (cfg.format === 'markdown') {
    content = buildMarkdownDocument(cfg.specsDir);
  } else {
    const markdown = buildMarkdownDocument(cfg.specsDir);
    content = markdownToHtml(markdown);
  }

  // Write output
  fs.writeFileSync(cfg.output, content, 'utf-8');

  const stats = fs.statSync(cfg.output);
  const sizeKB = (stats.size / 1024).toFixed(2);

  console.log(`✅ Export completato!\n`);
  console.log(`📝 Formato: ${cfg.format.toUpperCase()}`);
  console.log(`📁 File: ${cfg.output}`);
  console.log(`📊 Dimensione: ${sizeKB} KB`);
  console.log(`📈 Lunghezza: ${content.length} caratteri\n`);
}

main();
