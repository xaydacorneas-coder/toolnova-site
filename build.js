#!/usr/bin/env node
/* ToolNova v1.0 - tạo lại toàn bộ trang HTML, sitemap.xml, robots.txt và ads.txt.
   Dùng trên máy tính (cần Node.js):
     node build.js                                 -> dùng tên miền mẫu trong sitemap
     SITE_URL=https://tenmiencuaban.com node build.js  -> ghi tên miền thật vào canonical, sitemap, robots
   Không cần chạy file này nếu bạn chỉ muốn đưa website lên mạng ngay. */
'use strict';
const fs = require('fs');
const path = require('path');
const D = require('./js/data.js');

const SITE_URL = (process.env.SITE_URL || '').replace(/\/+$/, '');
const PLACEHOLDER = 'https://toolnova.example';
const ORIGIN = SITE_URL || PLACEHOLDER;
const vi = D.i18n.vi;
const THEME = '#4f46e5';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function write(rel, content) {
  const p = path.join(__dirname, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}
const i18nAttr = (key) => `data-i18n="${key}"`;
const tx = (key, tag = 'span', extra = '') => `<${tag}${extra ? ' ' + extra : ''} ${i18nAttr(key)}>${esc(vi[key])}</${tag}>`;

const LOGO = `<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="${THEME}"/><path d="M16 5l2.6 7.4L26 15l-7.4 2.6L16 25l-2.6-7.4L6 15l7.4-2.6z" fill="#fff"/></svg>`;

/* ---------- Khung trang chung ---------- */
function layout(o) {
  const base = o.base;                        // '' | '../../' | '/'
  const home = base || './';
  const canonical = SITE_URL && o.url ? `\n<link rel="canonical" href="${SITE_URL}${o.url}">\n<meta property="og:url" content="${SITE_URL}${o.url}">` : '';
  const robots = o.noindex ? '\n<meta name="robots" content="noindex">' : '';
  const ld = o.jsonld ? `\n<script type="application/ld+json">${JSON.stringify(o.jsonld)}</script>` : '';
  const scripts = ['js/data.js', 'js/app.js'].concat(o.tools ? ['js/tools.js'] : [])
    .map((s) => `<script src="${base}${s}" defer></script>`).join('\n');
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(vi[o.titleKey])}</title>
<meta name="description" content="${esc(vi[o.metaKey])}">
<meta name="theme-color" content="${THEME}">${robots}${canonical}
<meta property="og:type" content="website">
<meta property="og:site_name" content="ToolNova">
<meta property="og:title" content="${esc(vi[o.titleKey])}">
<meta property="og:description" content="${esc(vi[o.metaKey])}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="${base}favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${base}css/style.css">${ld}
<!-- GOOGLE ADSENSE: sau khi được duyệt, dán đoạn mã <script async src="https://pagead2.googlesyndication.com/..."> vào đây (xem README-VI.txt). -->
<!-- GOOGLE ANALYTICS: dán thẻ gtag.js vào đây khi có mã đo lường (xem README-VI.txt). -->
</head>
<body data-title-key="${o.titleKey}" data-meta-key="${o.metaKey}">
<a class="skip" href="#main" ${i18nAttr('skip')}>${esc(vi.skip)}</a>
<header class="site-header"><div class="wrap bar">
<a class="brand" href="${home}">${LOGO}<span>ToolNova</span></a>
<nav id="nav" class="nav">
<a href="${home}#tools" ${i18nAttr('nav.tools')}>${esc(vi['nav.tools'])}</a>
<a href="${base}about/" ${i18nAttr('nav.about')}>${esc(vi['nav.about'])}</a>
<a href="${base}contact/" ${i18nAttr('nav.contact')}>${esc(vi['nav.contact'])}</a>
</nav>
<button type="button" class="lang-btn" id="lang-btn" ${i18nAttr('lang.btn')} data-i18n-aria="lang.label" aria-label="${esc(vi['lang.label'])}">${esc(vi['lang.btn'])}</button>
<button type="button" class="menu-btn" id="menu-btn" aria-expanded="false" aria-controls="nav" data-i18n-aria="nav.menu" aria-label="${esc(vi['nav.menu'])}">☰</button>
</div></header>
<main id="main">
${o.body}
</main>
<footer class="site-footer"><div class="wrap">
<strong>ToolNova</strong>
<p ${i18nAttr('foot.tag')}>${esc(vi['foot.tag'])}</p>
<div class="links">
<a href="${base}about/" ${i18nAttr('nav.about')}>${esc(vi['nav.about'])}</a>
<a href="${base}contact/" ${i18nAttr('nav.contact')}>${esc(vi['nav.contact'])}</a>
<a href="${base}privacy/" ${i18nAttr('nav.privacy')}>${esc(vi['nav.privacy'])}</a>
<a href="${base}terms/" ${i18nAttr('nav.terms')}>${esc(vi['nav.terms'])}</a>
</div>
<p>© <span id="year">2026</span> ToolNova. <span ${i18nAttr('foot.rights')}>${esc(vi['foot.rights'])}</span></p>
</div></footer>
${scripts}
</body>
</html>
`;
}

const adSlot = (name) => `<div class="ad-slot" data-ad-slot="${name}"><!-- Vị trí quảng cáo "${name}": dán mã khối quảng cáo AdSense vào giữa thẻ div này --></div>`;
const toolUrl = (t) => `tools/${t.slug}/`;

function card(t, base) {
  const k = `t.${t.id}.`;
  return `<a class="card" href="${base}${toolUrl(t)}" data-id="${t.id}" data-cat="${t.cat}">` +
    `<span class="ico" style="--c:${t.color}" aria-hidden="true">${esc(t.icon)}</span>` +
    `<span class="txt"><strong ${i18nAttr(k + 'name')}>${esc(vi[k + 'name'])}</strong>` +
    `<small ${i18nAttr(k + 'desc')}>${esc(vi[k + 'desc'])}</small></span></a>`;
}

/* ---------- Trang chủ ---------- */
function homePage() {
  const base = '';
  const chips = ['all'].concat(D.cats).map((c, i) =>
    `<button type="button" class="chip" data-cat="${c}" aria-pressed="${i === 0}" ${i18nAttr('cat.' + c)}>${esc(vi['cat.' + c])}</button>`).join('\n');
  const body = `<section class="hero"><div class="wrap">
<h1 ${i18nAttr('home.h1')}>${esc(vi['home.h1'])}</h1>
<p ${i18nAttr('home.sub')}>${esc(vi['home.sub'])}</p>
<div class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
<input id="search" type="search" autocomplete="off" aria-label="${esc(vi['search.label'])}" data-i18n-aria="search.label" placeholder="${esc(vi['search.ph'])}" data-i18n-ph="search.ph"></div>
</div></section>
<div class="wrap">
<section class="section" id="tools" aria-labelledby="tools-h">
<h2 id="tools-h" ${i18nAttr('home.tools')}>${esc(vi['home.tools'])}</h2>
<div class="chips" role="group" aria-label="${esc(vi['cat.label'])}" data-i18n-aria="cat.label">
${chips}
</div>
<div class="grid" id="tool-grid">
${D.tools.map((t) => card(t, base)).join('\n')}
</div>
<p class="empty" id="empty" hidden ${i18nAttr('home.none')}>${esc(vi['home.none'])}</p>
</section>
${adSlot('home')}
<section class="features">
${[1, 2, 3].map((n) => `<div class="feature"><h3 ${i18nAttr(`home.f${n}.h`)}>${esc(vi[`home.f${n}.h`])}</h3><p ${i18nAttr(`home.f${n}.p`)}>${esc(vi[`home.f${n}.p`])}</p></div>`).join('\n')}
</section>
</div>`;
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'WebSite', name: 'ToolNova',
    description: vi['home.meta'], inLanguage: ['vi', 'en']
  };
  if (SITE_URL) { jsonld.url = SITE_URL + '/'; }
  return layout({ base, titleKey: 'home.title', metaKey: 'home.meta', body, url: '/', jsonld });
}

/* ---------- Trang công cụ ---------- */
function toolPage(t) {
  const base = '../../';
  const k = `t.${t.id}.`;
  const related = D.tools.filter((x) => x.id !== t.id)
    .sort((a, b) => (b.cat === t.cat) - (a.cat === t.cat)).slice(0, 4);
  const body = `<div class="wrap">
<nav class="crumbs" aria-label="${esc(vi['crumb.label'])}" data-i18n-aria="crumb.label"><a href="${base}" ${i18nAttr('crumb.home')}>${esc(vi['crumb.home'])}</a> › <span ${i18nAttr(k + 'name')}>${esc(vi[k + 'name'])}</span></nav>
<h1 ${i18nAttr(k + 'name')}>${esc(vi[k + 'name'])}</h1>
<p class="lead" ${i18nAttr(k + 'desc')}>${esc(vi[k + 'desc'])}</p>
${adSlot('top')}
<section class="tool-box" id="tool-root" data-tool="${t.id}" aria-label="${esc(vi[k + 'name'])}"><noscript><p ${i18nAttr('tool.nojs')}>${esc(vi['tool.nojs'])}</p></noscript></section>
<p class="privacy-note" ${i18nAttr('tool.local')}>${esc(vi['tool.local'])}</p>
${adSlot('middle')}
<section class="prose">
<h2 ${i18nAttr('tool.how')}>${esc(vi['tool.how'])}</h2>
<ol>
${[1, 2, 3].map((n) => `<li ${i18nAttr(k + 's' + n)}>${esc(vi[k + 's' + n])}</li>`).join('\n')}
</ol>
<h2 ${i18nAttr('tool.faq')}>${esc(vi['tool.faq'])}</h2>
${[1, 2].map((n) => `<details><summary ${i18nAttr(k + 'q' + n)}>${esc(vi[k + 'q' + n])}</summary><p ${i18nAttr(k + 'a' + n)}>${esc(vi[k + 'a' + n])}</p></details>`).join('\n')}
</section>
<section class="section">
<h2 ${i18nAttr('tool.related')}>${esc(vi['tool.related'])}</h2>
<div class="grid">
${related.map((x) => card(x, base)).join('\n')}
</div>
</section>
${adSlot('bottom')}
</div>`;
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'WebApplication', name: vi[k + 'name'], description: vi[k + 'meta'],
    applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript',
    inLanguage: ['vi', 'en'], isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' }
  };
  if (SITE_URL) { jsonld.url = SITE_URL + '/' + toolUrl(t); }
  return layout({ base, titleKey: k + 'title', metaKey: k + 'meta', body, tools: true, url: '/' + toolUrl(t), jsonld });
}

/* ---------- Trang tĩnh (about, contact, privacy, terms) ---------- */
function staticPage(name) {
  const base = '../';
  const blocks = D.pages[name].vi.blocks;
  const html = blocks.map((b, i) => {
    const key = `pg.${name}.${i}`;
    if (b[0] === 'h1' || b[0] === 'h2') { return `<${b[0]} ${i18nAttr(key)}>${esc(vi[key])}</${b[0]}>`; }
    if (b[0] === 'p') { return `<p data-i18n-html="${key}">${vi[key]}</p>`; }
    return `<ul>\n${b[1].map((li, j) => `<li data-i18n-html="${key}.${j}">${vi[key + '.' + j]}</li>`).join('\n')}\n</ul>`;
  }).join('\n');
  let extra = '';
  if (name === 'contact') {
    extra = `
<p><strong ${i18nAttr('contact.email')}>${esc(vi['contact.email'])}</strong> <a id="contact-email" href="mailto:${D.site.email}">${D.site.email}</a></p>
<h2 ${i18nAttr('contact.form.h')}>${esc(vi['contact.form.h'])}</h2>
<form id="contact-form" class="tool-box">
<div class="field"><label for="cf-topic" ${i18nAttr('contact.topic')}>${esc(vi['contact.topic'])}</label>
<select id="cf-topic">
${[1, 2, 3, 4].map((n) => `<option value="t${n}" ${i18nAttr('contact.t' + n)}>${esc(vi['contact.t' + n])}</option>`).join('\n')}
</select></div>
<div class="field" style="margin-top:12px"><label for="cf-msg" ${i18nAttr('contact.msg')}>${esc(vi['contact.msg'])}</label>
<textarea id="cf-msg" rows="6" required></textarea></div>
<div class="actions"><button type="submit" class="btn" ${i18nAttr('contact.send')}>${esc(vi['contact.send'])}</button></div>
<p class="hint" ${i18nAttr('contact.hint')}>${esc(vi['contact.hint'])}</p>
</form>`;
  }
  const body = `<div class="wrap page prose">
${html}${extra}
</div>`;
  return layout({ base, titleKey: `pg.${name}.title`, metaKey: `pg.${name}.meta`, body, url: `/${name}/` });
}

/* ---------- Trang 404 (đường dẫn tuyệt đối vì có thể hiện ở mọi độ sâu) ---------- */
function notFoundPage() {
  const body = `<div class="wrap page" style="text-align:center;padding:60px 16px">
<h1 ${i18nAttr('p404.h')}>${esc(vi['p404.h'])}</h1>
<p ${i18nAttr('p404.p')}>${esc(vi['p404.p'])}</p>
<p><a class="btn" href="/" ${i18nAttr('p404.btn')}>${esc(vi['p404.btn'])}</a></p>
</div>`;
  return layout({ base: '/', titleKey: 'p404.title', metaKey: 'p404.meta', body, noindex: true });
}

/* ---------- Ghi file ---------- */
const urls = ['/'].concat(D.tools.map((t) => '/' + toolUrl(t)), ['/about/', '/contact/', '/privacy/', '/terms/']);

write('index.html', homePage());
D.tools.forEach((t) => write(`${toolUrl(t)}index.html`, toolPage(t)));
['about', 'contact', 'privacy', 'terms'].forEach((n) => write(`${n}/index.html`, staticPage(n)));
write('404.html', notFoundPage());

write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${ORIGIN}${u}</loc><lastmod>${D.site.updated}</lastmod></url>`).join('\n')}
</urlset>
`);
write('robots.txt', `User-agent: *
Allow: /

Sitemap: ${ORIGIN}/sitemap.xml
`);
write('ads.txt', `# ads.txt - chỉ cần khi bạn dùng Google AdSense.
# Sau khi tài khoản AdSense được duyệt, xóa dấu # ở dòng dưới và thay pub-XXXXXXXXXXXXXXXX bằng mã nhà xuất bản của bạn.
# google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
`);
write('favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${THEME}"/><path d="M16 5l2.6 7.4L26 15l-7.4 2.6L16 25l-2.6-7.4L6 15l7.4-2.6z" fill="#fff"/></svg>
`);

console.log(`Đã tạo ${urls.length} trang + 404.html, sitemap.xml, robots.txt, ads.txt (tên miền: ${ORIGIN}${SITE_URL ? '' : ' - MẪU'}).`);
