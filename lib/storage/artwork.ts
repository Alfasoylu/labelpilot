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
    throw new Error("Supabase Storage ist nicht verfuegbar.");
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
