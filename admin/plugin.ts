// ממשק הניהול: API קטן שרץ רק בתוך שרת הפיתוח (npm run dev), ולא נכנס ל-build של האתר.
// הוא קורא וכותב את קובצי ה-JSON ב-src/content/data, שומר תמונות ב-public/images
// ומפרסם (git commit + push) כדי ש-Vercel יבנה את האתר מחדש.
import { execFile } from "node:child_process";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";

const CONTENT_FILES = ["site", "articles", "automations", "quiz"] as const;
const IMAGE_EXT = /\.(webp|jpe?g|png|gif|svg|avif)$/i;
const MAX_UPLOAD = 25 * 1024 * 1024;

// אזהרות ההמרה של סופי שורות (LF/CRLF) ב-Windows הן רעש ולא שגיאה, אז הן לא מוצגות.
const noise = /^warning: (in the working copy of|LF will be replaced|CRLF will be replaced).*$/gm;

function git(cwd: string, args: string[]) {
  return new Promise<{ ok: boolean; out: string }>((done) => {
    execFile("git", args, { cwd, windowsHide: true }, (error, stdout, stderr) => {
      done({ ok: !error, out: `${stdout}${stderr}`.replace(noise, "").replace(/\n{2,}/g, "\n").trim() });
    });
  });
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

async function readBody(req: IncomingMessage) {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_UPLOAD) throw new Error("הקובץ גדול מדי (עד 25MB)");
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks);
}

// שרת הפיתוח פתוח גם לרשת המקומית (host: true), אז ה-API עונה רק לבקשות מהמחשב הזה.
function isLocal(req: IncomingMessage) {
  const ip = req.socket.remoteAddress ?? "";
  return ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1";
}

// שם קובץ בטוח: אותיות לטיניות, ספרות, מקף ונקודה. תיקייה בתוך public/images בלבד.
function safeName(name: string) {
  const clean = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "");
  if (!clean || !IMAGE_EXT.test(clean)) throw new Error("שם קובץ לא תקין");
  return clean;
}

function safeDir(dir: string) {
  return dir
    .split("/")
    .map((part) => part.toLowerCase().replace(/[^a-z0-9_-]+/g, ""))
    .filter(Boolean)
    .join("/");
}

async function listImages(base: string, dir = base): Promise<{ path: string; size: number }[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const out: { path: string; size: number }[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listImages(base, full)));
    else if (IMAGE_EXT.test(entry.name)) {
      const info = await stat(full);
      out.push({ path: `/images/${relative(base, full).split(sep).join("/")}`, size: info.size });
    }
  }
  return out;
}

export function adminPlugin(): Plugin {
  let root = process.cwd();

  return {
    name: "lirrey-admin",
    apply: "serve",
    configResolved(config) {
      root = config.root;
    },
    configureServer(server) {
      const dataDir = resolve(root, "src/content/data");
      const imagesDir = resolve(root, "public/images");
      const publishPaths = ["src/content/data", "public/images"];

      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? "/", "http://localhost");

        // /admin בלי לוכסן בסוף מפנה ל-/admin/ כדי שהקבצים היחסיים ייטענו.
        if (url.pathname === "/admin") {
          res.statusCode = 302;
          res.setHeader("Location", "/admin/");
          return res.end();
        }
        if (!url.pathname.startsWith("/__admin/")) return next();
        if (!isLocal(req)) return send(res, 403, { error: "ממשק הניהול זמין רק מהמחשב שמריץ את השרת" });

        const route = url.pathname.slice("/__admin/".length);
        try {
          if (route === "content" && req.method === "GET") {
            const entries = await Promise.all(
              CONTENT_FILES.map(async (name) => [name, JSON.parse(await readFile(join(dataDir, `${name}.json`), "utf8"))]),
            );
            return send(res, 200, Object.fromEntries(entries));
          }

          const contentMatch = route.match(/^content\/(\w+)$/);
          if (contentMatch && req.method === "PUT") {
            const name = contentMatch[1] as (typeof CONTENT_FILES)[number];
            if (!CONTENT_FILES.includes(name)) return send(res, 404, { error: "קובץ לא מוכר" });
            const data = JSON.parse((await readBody(req)).toString("utf8"));
            if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("מבנה לא תקין");
            await writeFile(join(dataDir, `${name}.json`), `${JSON.stringify(data, null, 2)}\n`, "utf8");
            return send(res, 200, { ok: true });
          }

          if (route === "images" && req.method === "GET") {
            return send(res, 200, await listImages(imagesDir));
          }

          if (route === "upload" && req.method === "POST") {
            const dir = safeDir(url.searchParams.get("dir") ?? "uploads");
            const name = safeName(url.searchParams.get("name") ?? "");
            const target = resolve(imagesDir, dir, name);
            if (!target.startsWith(imagesDir + sep)) throw new Error("נתיב לא תקין");
            const exists = await stat(target).then(() => true, () => false);
            if (exists && url.searchParams.get("overwrite") !== "1") {
              return send(res, 409, { error: "כבר קיימת תמונה בשם הזה", path: `/images/${dir ? `${dir}/` : ""}${name}` });
            }
            const body = await readBody(req);
            if (!body.length) throw new Error("הקובץ ריק");
            await mkdir(dirname(target), { recursive: true });
            await writeFile(target, body);
            return send(res, 200, { path: `/images/${dir ? `${dir}/` : ""}${name}` });
          }

          if (route === "status" && req.method === "GET") {
            const status = await git(root, ["status", "--porcelain", "--", ...publishPaths]);
            const branch = await git(root, ["rev-parse", "--abbrev-ref", "HEAD"]);
            const ahead = await git(root, ["rev-list", "--count", "@{u}..HEAD"]);
            return send(res, 200, {
              changes: status.out ? status.out.split("\n").map((line) => line.slice(3)) : [],
              branch: branch.out,
              unpushed: ahead.ok ? Number(ahead.out) || 0 : 0,
            });
          }

          if (route === "publish" && req.method === "POST") {
            const { message } = JSON.parse((await readBody(req)).toString("utf8") || "{}");
            const log: string[] = [];
            const add = await git(root, ["add", "--", ...publishPaths]);
            log.push(add.out);
            if (!add.ok) return send(res, 500, { error: "git add נכשל", log });
            const staged = await git(root, ["diff", "--cached", "--quiet", "--", ...publishPaths]);
            if (!staged.ok) {
              const commit = await git(root, [
                "commit",
                "-m",
                String(message || "עדכון תוכן מממשק הניהול"),
                "--",
                ...publishPaths,
              ]);
              log.push(commit.out);
              if (!commit.ok) return send(res, 500, { error: "git commit נכשל", log });
            }
            const push = await git(root, ["push"]);
            log.push(push.out);
            if (!push.ok) return send(res, 500, { error: "git push נכשל", log });
            return send(res, 200, { ok: true, log });
          }

          return send(res, 404, { error: "לא נמצא" });
        } catch (error) {
          return send(res, 400, { error: error instanceof Error ? error.message : String(error) });
        }
      });
    },
  };
}
