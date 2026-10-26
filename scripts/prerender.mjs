// מכניס את ה-HTML המרונדר של האפליקציה לתוך dist/index.html אחרי ה-build.
import { readFile, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const indexPath = resolve(root, "dist/index.html");
const serverDir = resolve(root, "dist-ssr");

const { render } = await import(pathToFileURL(resolve(serverDir, "entry-server.js")).href);
const html = await readFile(indexPath, "utf8");
const marker = '<div id="root"></div>';

if (!html.includes(marker)) throw new Error("prerender: root marker not found in dist/index.html");

await writeFile(indexPath, html.replace(marker, `<div id="root">${render()}</div>`));
await rm(serverDir, { recursive: true, force: true });
console.log("prerender: dist/index.html now contains the rendered page");
