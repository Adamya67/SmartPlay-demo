import { Readable } from "node:stream";

import { NextResponse } from "next/server";

import { getS3Object } from "@/lib/storage";

export const runtime = "nodejs";

function toWebStream(body: unknown) {
  if (
    body &&
    typeof body === "object" &&
    "transformToWebStream" in body &&
    typeof body.transformToWebStream === "function"
  ) {
    return body.transformToWebStream() as ReadableStream<Uint8Array>;
  }

  return Readable.toWeb(body as unknown as Readable) as ReadableStream<Uint8Array>;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ key: string[] }> },
) {
  const { key } = await context.params;

  if (!key.length) {
    return NextResponse.json({ error: "Missing storage object key." }, { status: 400 });
  }

  try {
    const objectKey = key.join("/");
    const range = request.headers.get("range") ?? undefined;
    const response = await getS3Object({ objectKey, range });

    if (!response.Body) {
      return NextResponse.json({ error: "Stored object was empty." }, { status: 404 });
    }

    const headers = new Headers();

    if (response.ContentType) {
      headers.set("Content-Type", response.ContentType);
    }
    if (response.ContentLength !== undefined) {
      headers.set("Content-Length", String(response.ContentLength));
    }
    if (response.ContentRange) {
      headers.set("Content-Range", response.ContentRange);
    }
    if (response.ETag) {
      headers.set("ETag", response.ETag);
    }
    if (response.LastModified) {
      headers.set("Last-Modified", response.LastModified.toUTCString());
    }

    headers.set("Accept-Ranges", response.AcceptRanges ?? "bytes");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new Response(toWebStream(response.Body), {
      status: response.ContentRange ? 206 : 200,
      headers,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to serve stored media.",
      },
      { status: 500 },
    );
  }
}
