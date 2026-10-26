// מכניס את ה-HTML המרונדר של האפליקציה לתוך dist/index.html אחרי ה-build,
// ויוצר קובץ HTML נפרד לכל דף נוסף (מאמרים) עם title ו-meta משלו.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const SITE = "https://lirrey.com";
const root = resolve(import.meta.dirname, "..");
const distDir = resolve(root, "dist");
const indexPath = resolve(distDir, "index.html");
const serverDir = resolve(root, "dist-ssr");

const { render, prerenderPaths, resolveRoute, routeMeta, llmsFull } = await import(
  pathToFileURL(resolve(serverDir, "entry-server.js")).href
);
const template = await readFile(indexPath, "utf8");
const marker = '<div id="root"></div>';

if (!template.includes(marker)) throw new Error("prerender: root marker not found in dist/index.html");

const escapeAttr = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// גובה ורוחב של JPEG מתוך ה-SOF, כדי שתגיות og:image יתאימו לתמונה האמיתית.
async function jpegSize(publicPath) {
  const data = await readFile(resolve(distDir, `.${publicPath}`));
  for (let i = 2; i < data.length; ) {
    const marker = data[i + 1];
    const length = data.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc3) return { height: data.readUInt16BE(i + 5), width: data.readUInt16BE(i + 7) };
    i += 2 + length;
  }
  throw new Error(`prerender: no JPEG size in ${publicPath}`);
}

// מחליף את content של תגית meta לפי name או property.
function setMeta(html, key, value) {
  const pattern = new RegExp(`(<meta\\s+(?:name|property)="${key}"\\s+content=")[^"]*(")`);
  if (!pattern.test(html)) throw new Error(`prerender: meta ${key} not found`);
  return html.replace(pattern, `$1${escapeAttr(value)}$2`);
}

async function withMeta(html, meta) {
  const url = `${SITE}${meta.path}`;
  const image = `${SITE}${meta.image}`;
  const isJpeg = meta.image.endsWith(".jpg");

  let out = html
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(meta.title)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeAttr(meta.description)}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeAttr(meta.description)}" />`)
    .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<link rel="alternate" hreflang="[^"]+" href=")[^"]*(")/g, `$1${url}$2`)
    // תמונת ה-hero שייכת רק לעמוד הראשי.
    .replace(/\s*<link rel="preload" as="image" href="\/images\/hero\.webp"[^>]*>/, "");

  out = setMeta(out, "og:type", meta.type);
  out = setMeta(out, "og:title", meta.title);
  out = setMeta(out, "og:url", url);
  out = setMeta(out, "og:image", image);
  out = setMeta(out, "og:image:secure_url", image);
  out = setMeta(out, "og:image:alt", meta.title);
  out = setMeta(out, "twitter:title", meta.title);
  out = setMeta(out, "twitter:image", image);
  out = setMeta(out, "twitter:image:alt", meta.title);
  if (isJpeg) {
    const { width, height } = await jpegSize(meta.image);
    out = setMeta(out, "og:image:type", "image/jpeg");
    out = setMeta(out, "og:image:width", String(width));
    out = setMeta(out, "og:image:height", String(height));
  }
  if (meta.keywords) out = setMeta(out, "keywords", meta.keywords.join(", "));

  const extra = [];
  if (meta.article) {
    extra.push(`<meta property="article:published_time" content="${meta.article.published}" />`);
    extra.push(`<meta property="article:modified_time" content="${meta.article.modified}" />`);
    extra.push(`<meta property="article:author" content="${SITE}/#about" />`);
    extra.push(`<meta property="article:section" content="${escapeAttr(meta.article.section)}" />`);
    for (const tag of meta.article.tags) extra.push(`<meta property="article:tag" content="${escapeAttr(tag)}" />`);
  }
  if (meta.jsonLd) {
    extra.push(`<script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, "\\u003c")}</script>`);
  }
  if (extra.length) out = out.replace("  </head>", `${extra.map((line) => `    ${line}\n`).join("")}  </head>`);
  return out;
}

await writeFile(indexPath, template.replace(marker, `<div id="root">${render("/")}</div>`));

for (const path of prerenderPaths()) {
  const meta = routeMeta(resolveRoute(path));
  const html = (await withMeta(template, meta)).replace(marker, `<div id="root">${render(path)}</div>`);
  const outDir = resolve(distDir, `.${path}`);
  await mkdir(outDir, { recursive: true });
  await writeFile(resolve(outDir, "index.html"), html);
}

// הטקסט המלא של כל הפרויקטים בקובץ אחד, למנועי AI שקוראים את llms.txt.
await writeFile(resolve(distDir, "llms-full.txt"), llmsFull());

await rm(serverDir, { recursive: true, force: true });
console.log(`prerender: rendered / and ${prerenderPaths().join(", ")}`);
