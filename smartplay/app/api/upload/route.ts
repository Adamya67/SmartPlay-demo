import { NextResponse } from "next/server";

import { getMaxUploadBytes, saveUploadedFile } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const bucket = String(formData.get("bucket") ?? "misc");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file upload." }, { status: 400 });
    }

    if (!file.type.startsWith("video/") && !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only video and image uploads are supported." },
        { status: 400 },
      );
    }

    if (file.size > getMaxUploadBytes()) {
      return NextResponse.json(
        { error: "Upload exceeds the configured size limit for this deployment." },
        { status: 400 },
      );
    }

    const result = await saveUploadedFile(file, bucket);
    return NextResponse.json({ fileUrl: result.fileUrl });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Upload failed for this deployment.",
      },
      { status: 500 },
    );
  }
}
