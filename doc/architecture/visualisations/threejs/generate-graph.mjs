import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workspacePath = path.resolve(__dirname, '../../workspace.json');
const decisionsDir = path.resolve(__dirname, '../../decisions');
const outputPath = path.resolve(__dirname, 'data/architecture-graph.json');

function normalizeText(value = '') {
  return value
    .replace(/\r/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTitle(markdown = '') {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? normalizeText(match[1]) : 'Architecture Decision';
}

function extractSummary(markdown = '') {
  const lines = markdown.split(/\r?\n/);
  const paragraphs = [];
  let capture = false;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (capture) break;
      if (line.toLowerCase().includes('context')) capture = true;
      continue;
    }

    if (capture && line.trim()) {
      if (!line.startsWith('#') && !line.startsWith('---') && !line.startsWith('Date:')) {
        paragraphs.push(line.trim());
      }
    }
  }

  const text = paragraphs.join(' ');
  if (text) return normalizeText(text);

  const firstParagraph = markdown
    .replace(/^---[\s\S]*?---\n?/m, '')
    .replace(/^#.*?\n+/m, '')
    .split(/\n\n+/)
    .map((part) => normalizeText(part))
    .find(Boolean);

  return firstParagraph || 'Architecture decision';
}

const workspace = JSON.parse(await fs.readFile(workspacePath, 'utf8'));
const people = workspace.model?.people ?? [];
const softwareSystems = workspace.model?.softwareSystems ?? [];

const files = (await fs.readdir(decisionsDir)).filter((name) => name.endsWith('.md')).sort();
const adrEntries = await Promise.all(
  files.map(async (file) => {
    const markdown = await fs.readFile(path.join(decisionsDir, file), 'utf8');
    const match = file.match(/^(\d+)/);
    const id = match ? match[1] : file.replace(/\.md$/, '');
    const frontMatter = markdown.match(/^---\n([\s\S]*?)\n---/);
    const status = frontMatter ? frontMatter[1].match(/status:\s*["']?([^"'\n]+)["']?/)?.[1] ?? 'Accepted' : 'Accepted';
    const title = extractTitle(markdown);
    const summary = extractSummary(markdown);
    const dateMatch = markdown.match(/Date:\s*(.+)/);

    return {
      id: `ADR-${id}`,
      title,
      status,
      date: dateMatch ? dateMatch[1].trim() : 'Unknown date',
      summary,
      file,
      affects: [],
    };
  })
);

const nodes = [];
const links = [];

people.forEach((person) => {
  nodes.push({
    id: `person-${person.id}`,
    label: person.name,
    kind: 'person',
    x: -6,
    y: 0,
    z: 0,
  });

  const systemNode = softwareSystems[0];
  if (systemNode) {
    links.push({ from: `person-${person.id}`, to: `system-${systemNode.id}` });
  }
});

softwareSystems.forEach((system) => {
  nodes.push({
    id: `system-${system.id}`,
    label: system.name,
    kind: 'system',
    x: 0,
    y: 0,
    z: 0,
  });
});

adrEntries.forEach((adr, index) => {
  nodes.push({
    id: adr.id.toLowerCase(),
    label: adr.id,
    kind: 'decision',
    x: 0 + (index - 1) * 2.4,
    y: 4.5,
    z: -0.6 + (index % 2 === 0 ? 0 : 0.5),
  });

  const systemNodeId = softwareSystems[0] ? `system-${softwareSystems[0].id}` : null;
  if (systemNodeId) {
    links.push({ from: adr.id.toLowerCase(), to: systemNodeId });
  }
});

const graph = {
  nodes,
  links,
  adrs: adrEntries,
};

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, JSON.stringify(graph, null, 2));

console.log(`Generated ${outputPath}`);
console.log(`Nodes: ${graph.nodes.length}`);
console.log(`ADRs: ${graph.adrs.length}`);
