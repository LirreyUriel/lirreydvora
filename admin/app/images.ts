// עיבוד תמונות בדפדפן לפני ההעלאה, באותן מידות שבהן האתר כבר משתמש.
import { api } from "./api";

function loadImage(file: Blob) {
  return new Promise<HTMLImageElement>((done, fail) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => done(img);
    img.onerror = () => fail(new Error("לא הצלחתי לקרוא את התמונה"));
    img.src = url;
  });
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((done, fail) =>
    canvas.toBlob((blob) => (blob ? done(blob) : fail(new Error("המרת התמונה נכשלה"))), type, quality),
  );
}

// מצייר את התמונה בגודל נתון. עם crop, חותך מהמרכז ליחס של המידות המבוקשות.
function draw(img: HTMLImageElement, width: number, height: number, crop: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  let sx = 0;
  let sy = 0;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;
  if (crop) {
    const target = width / height;
    if (sw / sh > target) {
      sw = sh * target;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      sh = sw / target;
      sy = (img.naturalHeight - sh) / 2;
    }
  }
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
  return canvas;
}

export function slugify(name: string) {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `image-${Date.now().toString(36)}`
  );
}

async function upload(blob: Blob, dir: string, name: string) {
  try {
    return await api.upload(blob, dir, name);
  } catch (error) {
    const err = error as Error & { status?: number };
    if (err.status === 409 && confirm(`כבר יש תמונה בשם ${name}. להחליף אותה?`)) {
      return api.upload(blob, dir, name, true);
    }
    throw error;
  }
}

// תמונת כריכה של פרויקט: שלושה קבצים מתמונה אחת, חתוכים ליחס 1200×630.
export async function uploadCover(file: File, slug: string) {
  const img = await loadImage(file);
  const ratio = 1200 / 630;
  const bigWidth = Math.min(2000, img.naturalWidth);
  const big = await toBlob(draw(img, bigWidth, Math.round(bigWidth / ratio), true), "image/webp", 0.86);
  const small = await toBlob(draw(img, 800, 420, true), "image/webp", 0.82);
  const og = await toBlob(draw(img, 1200, 630, true), "image/jpeg", 0.86);
  const base = slugify(slug);
  const [a, b, c] = [
    await upload(big, "articles", `${base}.webp`),
    await upload(small, "articles", `${base}-800.webp`),
    await upload(og, "articles", `${base}.jpg`),
  ];
  return { src: a.path, small: b.path, og: c.path };
}

// תמונה רגילה: עד 1600px רוחב, ב-WebP. GIF ו-SVG עולים כמו שהם, כדי לא לאבד אנימציה.
export async function uploadImage(file: File, dir: string, maxWidth = 1600) {
  const img = await loadImage(file);
  const keep = /\.(gif|svg)$/i.test(file.name) || file.type === "image/gif" || file.type === "image/svg+xml";
  if (keep) {
    const ext = file.name.match(/\.(gif|svg)$/i)?.[0].toLowerCase() ?? ".gif";
    const res = await upload(file, dir, `${slugify(file.name)}${ext}`);
    return { path: res.path, width: img.naturalWidth, height: img.naturalHeight };
  }
  const width = Math.min(maxWidth, img.naturalWidth);
  const height = Math.round((img.naturalHeight / img.naturalWidth) * width);
  const blob = await toBlob(draw(img, width, height, false), "image/webp", 0.86);
  const res = await upload(blob, dir, `${slugify(file.name)}.webp`);
  return { path: res.path, width, height };
}

export function pickFile(accept = "image/*") {
  return new Promise<File | null>((done) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = () => done(input.files?.[0] ?? null);
    input.click();
  });
}
