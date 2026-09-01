/* 티스토리 백업(HTML) → 마크다운 이관. 일회용 스크립트.
 *
 *   node scripts/import-tistory.mjs --list            카테고리별 남은 글 수
 *   node scripts/import-tistory.mjs "Unity"           Unity 와 그 하위 전부
 *   node scripts/import-tistory.mjs "Unity/오류"       소분류 하나만
 *   node scripts/import-tistory.mjs "Unity" --dry     쓰지 않고 결과만 출력
 *
 * 이미 있는 파일은 건너뛴다. 중간에 끊고 다시 돌려도 안전하다.
 * 이미지는 원본 그대로 옮긴다 — Astro 가 빌드 때 최적화한다.
 */
import fs from 'node:fs';
import path from 'node:path';
import TurndownService from 'turndown';

const BACKUP = '/Users/hanju/Downloads/aiwcpd-1-1';
const OUT = 'src/content/posts';

/* 백업의 카테고리 문자열이 categories.ts 의 표시명과 다른 경우.
   →Diary 계열은 티스토리가 2단까지만 지원해서 납작해진 것이라 한 단 내려보낸다. */
const SPECIAL = {
  '': 'etc/uncategorized',
  '애기 때 일기장/→Diary': 'etc/diary-baby/childhood/diary',
  '애기 때 일기장/→Thinking': 'etc/diary-baby/childhood/thinking',
  '애기 때 일기장/→Wondering': 'etc/diary-baby/childhood/wondering',
};

/* categories.ts 는 순수 데이터라 타입 선언만 걷어내면 그대로 평가할 수 있다 */
function loadTree() {
  const src = fs.readFileSync('src/data/categories.ts', 'utf8');
  const key = 'export const GROUPS: Group[] =';
  const body = src.slice(src.indexOf(key) + key.length).trim().replace(/;\s*$/, '');
  const groups = eval('(' + body + ')');
  const map = new Map(); // 표시명 경로 -> 폴더 경로
  const walk = (c, dirs, names) => {
    const d = [...dirs, c.dir], n = [...names, c.name];
    map.set(n.join('/'), d.join('/'));
    (c.children ?? []).forEach((ch) => walk(ch, d, n));
  };
  for (const g of groups) for (const it of g.items) walk(it, [g.dir], []);
  return map;
}

const pick = (html, re) => (html.match(re)?.[1] ?? '').trim();
const decode = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
   .replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');

function readPosts() {
  const out = [];
  for (const dir of fs.readdirSync(BACKUP).filter((d) => /^\d+$/.test(d))) {
    const files = fs.readdirSync(path.join(BACKUP, dir)).filter((f) => f.endsWith('.html'));
    if (!files.length) continue;
    const file = path.join(BACKUP, dir, files[0]);
    const html = fs.readFileSync(file, 'utf8');
    out.push({
      id: dir,
      dir: path.join(BACKUP, dir),
      category: pick(html, /<p class="category">([\s\S]*?)<\/p>/),
      title: decode(pick(html, /<h2 class="title-article">([\s\S]*?)<\/h2>/)),
      date: pick(html, /<p class="date">([\s\S]*?)<\/p>/),
      body: html.match(/<div class="contents_style">([\s\S]*?)<\/div>\s*<br\/?>\s*<div class="tags">/)?.[1] ?? '',
    });
  }
  return out.sort((a, b) => +a.id - +b.id);
}

function makeTurndown() {
  const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' });
  /* 티스토리 코드블록: <pre data-ke-language="bash"><code>…</code></pre> */
  td.addRule('tistoryCode', {
    filter: (n) => n.nodeName === 'PRE' && n.getAttribute('data-ke-type') === 'codeblock',
    replacement: (_c, node) => {
      const lang = node.getAttribute('data-ke-language') || '';
      const code = node.textContent.replace(/\n+$/, '');
      return '\n\n```' + (lang === 'bash' ? '' : lang) + '\n' + code + '\n```\n\n';
    },
  });
  /* 링크 카드(오픈그래프)는 제목 링크 한 줄로 */
  td.addRule('opengraph', {
    filter: (n) => n.nodeName === 'FIGURE' && n.getAttribute('data-ke-type') === 'opengraph',
    replacement: (_c, node) => {
      const url = node.getAttribute('data-og-url') || '';
      const t = node.getAttribute('data-og-title') || url;
      return url ? `\n\n[${t}](${url})\n\n` : '';
    },
  });
  /* 유튜브 등 iframe 은 그대로 둔다 */
  td.addRule('iframe', {
    filter: 'iframe',
    replacement: (_c, node) => '\n\n' + node.outerHTML + '\n\n',
  });
  td.addRule('figcaption', {
    filter: 'figcaption',
    replacement: (c) => (c.trim() ? `\n*${c.trim()}*\n` : ''),
  });
  return td;
}

const yaml = (s) => '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';

function toIso(d) {
  // "2022-04-03 22:57:06" (KST)
  const m = d.match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}+09:00` : d;
}

function summarize(md) {
  const text = md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_>`|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.slice(0, 150);
}

/* ---------- 실행 ---------- */
const args = process.argv.slice(2);
const dry = args.includes('--dry');
const target = args.find((a) => !a.startsWith('--'));
const map = loadTree();
const posts = readPosts();
const resolve = (cat) => SPECIAL[cat] ?? map.get(cat) ?? null;

if (args.includes('--list') || !target) {
  const rows = new Map();
  for (const p of posts) {
    const dest = resolve(p.category);
    const k = p.category || '(미분류)';
    const r = rows.get(k) ?? { n: 0, dest, done: 0 };
    r.n++;
    if (dest && fs.existsSync(path.join(OUT, dest, p.id + '.md'))) r.done++;
    rows.set(k, r);
  }
  const w = Math.max(...[...rows.keys()].map((k) => k.length));
  for (const [k, r] of [...rows].sort((a, b) => b[1].n - a[1].n)) {
    console.log(`${k.padEnd(w)}  ${String(r.n).padStart(4)}개  ${r.done ? `(${r.done} 완료) ` : ''}→ ${r.dest ?? '### 매핑 없음'}`);
  }
  console.log(`\n합계 ${posts.length}개`);
  process.exit(0);
}

const hit = posts.filter((p) => p.category === target || p.category.startsWith(target + '/'));
if (!hit.length) {
  console.error(`"${target}" 에 해당하는 글이 없습니다. --list 로 이름을 확인하세요.`);
  process.exit(1);
}

const td = makeTurndown();
let wrote = 0, skipped = 0, images = 0;

for (const p of hit) {
  const dest = resolve(p.category);
  if (!dest) { console.error(`  ! 매핑 없음: ${p.category} (${p.id})`); continue; }
  const dir = path.join(OUT, dest);
  const file = path.join(dir, p.id + '.md');
  if (fs.existsSync(file)) { skipped++; continue; }

  let body = td.turndown(p.body).replace(/\n{3,}/g, '\n\n').trim();

  /* 이미지: 백업의 ./img/x.png → 글 폴더 아래 img/<id>/x.png (원본 그대로) */
  const srcImg = path.join(p.dir, 'img');
  if (fs.existsSync(srcImg)) {
    const dstImg = path.join(dir, 'img', p.id);
    if (!dry) fs.mkdirSync(dstImg, { recursive: true });
    for (const f of fs.readdirSync(srcImg)) {
      if (!dry) fs.copyFileSync(path.join(srcImg, f), path.join(dstImg, f));
      images++;
    }
    body = body.replace(/\.\/img\//g, `./img/${p.id}/`);
  }

  const fm = [
    '---',
    `title: ${yaml(p.title)}`,
    `date: ${toIso(p.date)}`,
    ...(summarize(body) ? [`description: ${yaml(summarize(body))}`] : []),
    'tags: []',
    '---',
    '',
  ].join('\n');

  if (!dry) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, fm + body + '\n');
  }
  wrote++;
  console.log(`  ${p.id}  ${dest}/${p.id}.md  ${p.title.slice(0, 40)}`);
}

console.log(`\n${dry ? '[dry] ' : ''}${wrote}개 작성, ${skipped}개 건너뜀, 이미지 ${images}개`);
