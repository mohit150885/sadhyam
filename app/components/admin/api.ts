"use client";

/** fetch wrapper for /api/admin/* — throws readable errors, sends you to login on 401. */
export async function adminApi<T = unknown>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
    const { json, ...rest } = init ?? {};
    const res = await fetch(path, {
        ...rest,
        cache: "no-store",
        headers: json !== undefined ? { "Content-Type": "application/json", ...(rest.headers ?? {}) } : rest.headers,
        body: json !== undefined ? JSON.stringify(json) : rest.body,
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 && typeof window !== "undefined" && !path.includes("/login")) {
        // Full reload on purpose: drops any stale admin state before signing in again.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign(`${window.location.origin}/admin/login?next=${encodeURIComponent(window.location.pathname)}`);
    }
    if (!res.ok) throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
    return data as T;
}

export function saveContent(key: string, data: unknown) {
    return adminApi<{ ok: boolean; savedAt: number }>(`/api/admin/content/${key}`, { method: "PUT", json: { data } });
}

/* ------------------------------------------------------------------ */
/* Image upload with in-browser compression                            */
/* ------------------------------------------------------------------ */

const TARGET_BYTES = 650 * 1024;

function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("This image could not be read."));
        };
        img.src = url;
    });
}

/**
 * Resizes to at most `maxWidth` and re-encodes as WebP until the file is
 * under ~650 KB, so it fits both Firebase Storage and the Firestore fallback.
 */
export async function compressImage(file: File, maxWidth = 1920): Promise<File> {
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") return file;
    const img = await loadImage(file);
    if (file.size <= TARGET_BYTES && img.naturalWidth <= maxWidth) return file;

    let width = Math.min(img.naturalWidth, maxWidth);
    for (let attempt = 0; attempt < 6; attempt++) {
        const height = Math.round((img.naturalHeight / img.naturalWidth) * width);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return file;
        ctx.drawImage(img, 0, 0, width, height);
        for (const quality of [0.85, 0.75, 0.65]) {
            const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", quality));
            if (blob && blob.size <= TARGET_BYTES) {
                return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
            }
        }
        width = Math.round(width * 0.8);
    }
    throw new Error("Could not compress this image enough. Try a smaller image.");
}

export async function uploadFile(file: File, folder = "general"): Promise<{ url: string; backend: string }> {
    const prepared = file.type.startsWith("image/") ? await compressImage(file) : file;
    const form = new FormData();
    form.append("file", prepared);
    form.append("folder", folder);
    return adminApi("/api/admin/upload", { method: "POST", body: form });
}
