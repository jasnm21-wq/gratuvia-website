import fs from 'node:fs';

const files = [
  'index.html',
  'privacy/index.html',
  'terms/index.html',
  'trust/index.html',
  'support/index.html',
];

const banned = [
  '—',
  'furthermore',
  'moreover',
  'notwithstanding',
  'that being said',
  'at its core',
  'in essence',
  'it is worth noting that',
  'in the landscape of',
  'to put it simply',
  "in today's world",
  "in today's digital age",
  'in an era of',
  "it's important to note",
  'when it comes to',
  'at the end of the day',
  'in the realm of',
  'it goes without saying',
  'this is where',
  'look no further',
  'our team of experts',
  "whether you're",
  'delve',
  'leverage',
  'utilize',
  'utilise',
  'facilitate',
  'foster',
  'bolster',
  'underscore',
  'unveil',
  'navigate',
  'streamline',
  'endeavour',
  'ascertain',
  'elucidate',
  'shed light on',
  'pave the way for',
  'a myriad of',
  'a plethora of',
  'paramount',
  'pertaining to',
  'prior to',
  'subsequent to',
  'in light of',
  'with respect to',
  'in terms of',
  'the fact that',
  'extremely',
  'dramatically',
  'exceptionally',
  'significantly',
  'incredibly',
  'remarkably',
  'truly',
  'absolutely',
  'literally',
  'robust',
  'comprehensive',
  'pivotal',
  'seamless',
  'transformative',
  'cutting-edge',
  'groundbreaking',
  'innovative',
  'intricate',
  'nuanced',
  'multifaceted',
  'holistic',
  'helps ensure',
  'may potentially',
  'can potentially',
  'oaicite',
  'contentreference',
  'grok_card',
  'attributableindex',
];

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

const failures = [];

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const text = visibleText(html);
  const lower = text.toLowerCase();

  for (const term of banned) {
    if (term === '—') {
      if (text.includes(term)) failures.push(`${file}: contains an em dash`);
      continue;
    }

    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wordLike = /^[a-z-]+$/i.test(term);
    const pattern = wordLike
      ? new RegExp(`\\b${escaped}\\b`, 'i')
      : new RegExp(escaped, 'i');

    if (pattern.test(lower)) failures.push(`${file}: contains banned copy pattern "${term}"`);
  }
}

if (failures.length) {
  console.error('Copy check failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Copy check passed for ${files.length} public pages.`);
