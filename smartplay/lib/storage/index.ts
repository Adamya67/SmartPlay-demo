import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

type StorageProvider = "local" | "s3";
type StorageDeliveryMode = "proxy" | "public";

type SaveStorageObjectInput = {
  bucket: string;
  fileName: string;
  body: Buffer;
  contentType?: string;
};

function sanitizeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9.-]/g, "-");
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function getStorageProvider(): StorageProvider {
  return process.env.STORAGE_PROVIDER === "s3" ? "s3" : "local";
}

function getStorageDeliveryMode(): StorageDeliveryMode {
  return process.env.STORAGE_DELIVERY_MODE === "public" ? "public" : "proxy";
}

function getUploadRoot() {
  return (process.env.UPLOAD_DIR ?? "public/uploads").replace(/^public\//, "");
}

function getStorageObjectKey(bucket: string, fileName: string) {
  const prefix = process.env.STORAGE_PREFIX?.trim().replace(/^\/+|\/+$/g, "") ?? "";
  return [prefix, bucket, sanitizeFileName(fileName)].filter(Boolean).join("/");
}

function getS3Client() {
  const region = process.env.STORAGE_REGION;
  const accessKeyId = process.env.STORAGE_ACCESS_KEY_ID;
  const secretAccessKey = process.env.STORAGE_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "S3 storage is missing STORAGE_REGION, STORAGE_ACCESS_KEY_ID, or STORAGE_SECRET_ACCESS_KEY.",
    );
  }

  return new S3Client({
    region,
    endpoint: process.env.STORAGE_ENDPOINT || undefined,
    forcePathStyle: process.env.STORAGE_FORCE_PATH_STYLE === "true",
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

function getProxyStorageUrl(objectKey: string) {
  return `/api/storage/${objectKey}`;
}

function getPublicStorageUrl(objectKey: string) {
  if (getStorageProvider() === "local") {
    return `/${getUploadRoot()}/${objectKey}`;
  }

  if (getStorageDeliveryMode() === "proxy") {
    return getProxyStorageUrl(objectKey);
  }

  const publicBase = process.env.STORAGE_PUBLIC_BASE_URL?.trim();

  if (publicBase) {
    return `${trimTrailingSlash(publicBase)}/${objectKey}`;
  }

  const bucket = process.env.STORAGE_BUCKET;
  const endpoint = process.env.STORAGE_ENDPOINT?.trim();
  const region = process.env.STORAGE_REGION;

  if (!bucket) {
    throw new Error("S3 storage is missing STORAGE_BUCKET.");
  }

  if (endpoint) {
    if (process.env.STORAGE_FORCE_PATH_STYLE === "true") {
      return `${trimTrailingSlash(endpoint)}/${bucket}/${objectKey}`;
    }

    const url = new URL(endpoint);
    return `${url.protocol}//${bucket}.${url.host}/${objectKey}`;
  }

  if (!region) {
    throw new Error("S3 storage is missing STORAGE_REGION.");
  }

  return `https://${bucket}.s3.${region}.amazonaws.com/${objectKey}`;
}

async function saveStorageObjectLocally({
  bucket,
  fileName,
  body,
}: SaveStorageObjectInput) {
  const objectKey = getStorageObjectKey(bucket, fileName);
  const outputPath = path.join(process.cwd(), "public", getUploadRoot(), objectKey);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, body);

  return {
    fileUrl: getPublicStorageUrl(objectKey),
    objectKey,
  };
}

async function saveStorageObjectToS3({
  bucket,
  fileName,
  body,
  contentType,
}: SaveStorageObjectInput) {
  const storageBucket = process.env.STORAGE_BUCKET;

  if (!storageBucket) {
    throw new Error("S3 storage is missing STORAGE_BUCKET.");
  }

  const objectKey = getStorageObjectKey(bucket, fileName);
  const client = getS3Client();

  await client.send(
    new PutObjectCommand({
      Bucket: storageBucket,
      Key: objectKey,
      Body: body,
      ContentType: contentType,
    }),
  );

  return {
    fileUrl: getPublicStorageUrl(objectKey),
    objectKey,
  };
}

export function getMaxUploadBytes() {
  const parsed = Number(process.env.MAX_UPLOAD_BYTES ?? 250 * 1024 * 1024);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 250 * 1024 * 1024;
}

export function getMaxVideoAnalysisDurationSeconds() {
  const parsed = Number(process.env.MAX_VIDEO_ANALYSIS_DURATION_SECONDS ?? 180);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 180;
}

export function isCloudStorageEnabled() {
  return getStorageProvider() === "s3";
}

export function getS3StorageConfig() {
  return {
    bucket: process.env.STORAGE_BUCKET ?? "",
    region: process.env.STORAGE_REGION ?? "",
  };
}

export function parseStorageObjectKeyFromUrl(fileUrl: string) {
  if (fileUrl.startsWith("/api/storage/")) {
    return decodeURIComponent(fileUrl.replace(/^\/api\/storage\//, ""));
  }

  const publicBase = process.env.STORAGE_PUBLIC_BASE_URL?.trim();

  if (publicBase && fileUrl.startsWith(trimTrailingSlash(publicBase))) {
    return fileUrl.replace(`${trimTrailingSlash(publicBase)}/`, "");
  }

  try {
    const url = new URL(fileUrl);
    const bucket = process.env.STORAGE_BUCKET;

    if (
      bucket &&
      url.hostname === `${bucket}.s3.${process.env.STORAGE_REGION}.amazonaws.com`
    ) {
      return url.pathname.replace(/^\//, "");
    }
  } catch {}

  return null;
}

export async function getS3Object({
  objectKey,
  range,
}: {
  objectKey: string;
  range?: string;
}) {
  const bucket = process.env.STORAGE_BUCKET;

  if (!bucket) {
    throw new Error("S3 storage is missing STORAGE_BUCKET.");
  }

  const client = getS3Client();
  return client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Range: range,
    }),
  );
}

export async function saveStorageObject(input: SaveStorageObjectInput) {
  if (getStorageProvider() === "s3") {
    return saveStorageObjectToS3(input);
  }

  return saveStorageObjectLocally(input);
}

export async function saveStorageObjectFromPath({
  filePath,
  bucket,
  fileName,
  contentType,
}: {
  filePath: string;
  bucket: string;
  fileName: string;
  contentType?: string;
}) {
  const body = await readFile(filePath);
  return saveStorageObject({
    bucket,
    fileName,
    body,
    contentType,
  });
}

export async function saveUploadedFile(file: File, bucket = "misc") {
  const body = Buffer.from(await file.arrayBuffer());
  const safeName = `${Date.now()}-${sanitizeFileName(file.name)}`;

  return saveStorageObject({
    bucket,
    fileName: safeName,
    body,
    contentType: file.type || undefined,
  });
}
