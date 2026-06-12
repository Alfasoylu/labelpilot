import { randomUUID } from "node:crypto";

import { getPublicEnv, getServerEnv, hasSupabaseServerEnv } from "@/lib/env";
import { getSupabaseServerClient } from "@/lib/auth/supabase-server";

const DEFAULT_ARTWORK_BUCKET = "artwork";

function getArtworkBucketName() {
  return getServerEnv().SUPABASE_ARTWORK_BUCKET || DEFAULT_ARTWORK_BUCKET;
}

function getStorageClient() {
  if (!hasSupabaseServerEnv()) {
    throw new Error("Supabase Storage ist nicht konfiguriert.");
  }

  const publicEnv = getPublicEnv();
  const serverEnv = getServerEnv();

  if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL || !serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase Storage ist nicht konfiguriert.");
  }

  const client = getSupabaseServerClient();

  if (!client) {
    throw new Error("Supabase Storage ist nicht verfügbar.");
  }

  return client;
}

export async function uploadArtwork(orderId: string, file: File, sanitizedFileName: string) {
  const client = getStorageClient();
  const bucket = getArtworkBucketName();
  const storagePath = `orders/${orderId}/artwork/${randomUUID()}-${sanitizedFileName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await client.storage.from(bucket).upload(storagePath, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    throw new Error("Upload fehlgeschlagen.");
  }

  return storagePath;
}

export async function uploadProofFile(orderId: string, file: File, sanitizedFileName: string) {
  const client = getStorageClient();
  const bucket = getArtworkBucketName();
  const storagePath = `orders/${orderId}/proofs/${randomUUID()}-${sanitizedFileName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await client.storage.from(bucket).upload(storagePath, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    throw new Error("Proof-Upload fehlgeschlagen.");
  }

  return storagePath;
}

export async function uploadSupportAttachment(
  supportRequestId: string,
  file: File,
  sanitizedFileName: string,
) {
  const client = getStorageClient();
  const bucket = getArtworkBucketName();
  const storagePath = `support/${supportRequestId}/${randomUUID()}-${sanitizedFileName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await client.storage.from(bucket).upload(storagePath, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    throw new Error("Anhang-Upload fehlgeschlagen.");
  }

  return storagePath;
}

export function buildArtworkStoragePath(orderId: string, sanitizedFileName: string) {
  return `orders/${orderId}/artwork/${randomUUID()}-${sanitizedFileName}`;
}

/**
 * Issues a short-lived signed upload URL so the browser can PUT the file
 * directly to Supabase Storage. This bypasses the ~4.5 MB request-body limit
 * of Vercel serverless functions, which print-ready PDFs routinely exceed.
 */
export async function createSignedArtworkUploadUrl(storagePath: string) {
  const client = getStorageClient();
  const bucket = getArtworkBucketName();
  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUploadUrl(storagePath);

  if (error || !data?.signedUrl) {
    throw new Error("Upload-URL konnte nicht erstellt werden.");
  }

  return data.signedUrl;
}

/** Returns the real stored object size in bytes, or null if the object does not exist. */
export async function getStoredObjectSize(storagePath: string): Promise<number | null> {
  const client = getStorageClient();
  const bucket = getArtworkBucketName();
  const lastSlash = storagePath.lastIndexOf("/");
  const prefix = storagePath.slice(0, lastSlash);
  const fileName = storagePath.slice(lastSlash + 1);

  const { data, error } = await client.storage.from(bucket).list(prefix, {
    limit: 100,
    search: fileName,
  });

  if (error || !data) {
    return null;
  }

  const entry = data.find((item) => item.name === fileName);
  if (!entry) {
    return null;
  }

  const size = (entry.metadata as { size?: number } | null)?.size;
  return typeof size === "number" ? size : null;
}

export async function removeStoredObject(storagePath: string) {
  const client = getStorageClient();
  const bucket = getArtworkBucketName();
  await client.storage.from(bucket).remove([storagePath]);
}

export async function getSignedUrl(storagePath: string, expiresInSeconds = 60) {
  const client = getStorageClient();
  const bucket = getArtworkBucketName();
  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUrl(storagePath, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error("Datei konnte nicht bereitgestellt werden.");
  }

  return data.signedUrl;
}
