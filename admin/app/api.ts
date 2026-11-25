import type { FileName, JsonObject } from "./schema";

export type Content = Record<FileName, JsonObject>;
export type ImageFile = { path: string; size: number };
export type Status = { changes: string[]; branch: string; unpushed: number };

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(body.error ?? `שגיאה ${res.status}`) as Error & { status?: number; body?: unknown };
    error.status = res.status;
    error.body = body;
    throw error;
  }
  return body as T;
}

export const api = {
  content: () => call<Content>("/__admin/content"),
  save: (file: FileName, data: JsonObject) =>
    call<{ ok: true }>(`/__admin/content/${file}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  images: () => call<ImageFile[]>("/__admin/images"),
  upload: (blob: Blob, dir: string, name: string, overwrite = false) =>
    call<{ path: string }>(
      `/__admin/upload?dir=${encodeURIComponent(dir)}&name=${encodeURIComponent(name)}${overwrite ? "&overwrite=1" : ""}`,
      { method: "POST", body: blob },
    ),
  status: () => call<Status>("/__admin/status"),
  publish: (message: string) =>
    call<{ ok: true; log: string[] }>("/__admin/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    }),
};
