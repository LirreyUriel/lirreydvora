// מכניס את ה-HTML המרונדר של האפליקציה לתוך dist/index.html אחרי ה-build,
// ויוצר קובץ HTML נפרד לכל דף נוסף (מאמרים) עם title ו-meta משלו.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const SITE = "https://lirreydvora.com";
const root = resolve(import.meta.dirname, "..");
const distDir = resolve(root, "dist");
const indexPath = resolve(distDir, "index.html");
const serverDir = resolve(root, "dist-ssr");

const { render, prerenderPaths, resolveRoute, routeMeta } = await import(
  pathToFileURL(resolve(serverDir, "entry-server.js")).href
);
const template = await readFile(indexPath, "utf8");
const marker = '<div id="root"></div>';

if (!template.includes(marker)) throw new Error("prerender: root marker not found in dist/index.html");

const escapeAttr = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// מחליף את content של תגית meta לפי name או property.
function setMeta(html, key, value) {
  const pattern = new RegExp(`(<meta\\s+(?:name|property)="${key}"\\s+content=")[^"]*(")`);
  if (!pattern.test(html)) throw new Error(`prerender: meta ${key} not found`);
  return html.replace(pattern, `$1${escapeAttr(value)}$2`);
}

function withMeta(html, meta) {
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
    out = setMeta(out, "og:image:type", "image/jpeg");
    out = setMeta(out, "og:image:height", "675");
  }

  if (meta.jsonLd) {
    const script = `    <script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, "\\u003c")}</script>\n  </head>`;
    out = out.replace("  </head>", script);
  }
  return out;
}

await writeFile(indexPath, template.replace(marker, `<div id="root">${render("/")}</div>`));

for (const path of prerenderPaths()) {
  const meta = routeMeta(resolveRoute(path));
  const html = withMeta(template, meta).replace(marker, `<div id="root">${render(path)}</div>`);
  const outDir = resolve(distDir, `.${path}`);
  await mkdir(outDir, { recursive: true });
  await writeFile(resolve(outDir, "index.html"), html);
}

await rm(serverDir, { recursive: true, force: true });
console.log(`prerender: rendered / and ${prerenderPaths().join(", ")}`);
