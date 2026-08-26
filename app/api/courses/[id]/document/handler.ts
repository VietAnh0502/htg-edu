import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { protectedPdfPath } from "@/lib/course-content";
import { verifyDocumentToken } from "@/lib/document-token";
import { apiError, fail } from "@/lib/http";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_CHUNK = 4 * 1024 * 1024;
const baseHeaders = {
  "Content-Type": "application/pdf",
  "Content-Disposition": "inline; filename=course-material.pdf",
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Accept-Ranges": "bytes",
};

function invalidRange(size: number) {
  return new NextResponse(null, {
    status: 416,
    headers: { ...baseHeaders, "Content-Range": `bytes */${size}` },
  });
}

function parseRange(value: string, size: number) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(value);
  if (!match || (!match[1] && !match[2])) return null;

  if (!match[1]) {
    const suffixLength = Number(match[2]);
    if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) return null;
    return { start: Math.max(size - suffixLength, 0), end: size - 1 };
  }

  const start = Number(match[1]);
  const requestedEnd = match[2] ? Number(match[2]) : size - 1;
  if (
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(requestedEnd) ||
    start < 0 ||
    start >= size ||
    requestedEnd < start
  ) return null;

  return { start, end: Math.min(requestedEnd, size - 1) };
}

function pdfChunk(filePath: string, size: number, start: number, requestedEnd: number, partial: boolean) {
  const end = Math.min(requestedEnd, start + MAX_CHUNK - 1, size - 1);
  const stream = Readable.toWeb(createReadStream(filePath, { start, end })) as ReadableStream;
  return new NextResponse(stream, {
    status: partial ? 206 : 200,
    headers: {
      ...baseHeaders,
      "Content-Length": String(end - start + 1),
      ...(partial ? { "Content-Range": `bytes ${start}-${end}/${size}` } : {}),
    },
  });
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) fail(401, "Thiếu phiên tải tài liệu");
    const documentAccess = await verifyDocumentToken(authorization.slice(7));
    if (documentAccess.courseId !== id) fail(403, "Phiên tải tài liệu không đúng khóa học");

    const rawDocumentIndex = new URL(request.url).searchParams.get("document") ?? "0";
    const documentIndex = Number(rawDocumentIndex);
    if (!/^\d+$/.test(rawDocumentIndex) || !Number.isSafeInteger(documentIndex)) fail(400, "Tài liệu không hợp lệ");
    const filePath = protectedPdfPath(documentAccess.slug, documentIndex);
    if (!filePath) fail(404, "Khóa học chưa có tài liệu PDF");
    const { size } = await stat(filePath);
    const rangeHeader = request.headers.get("range");

    if (!rangeHeader) {
      const partial = size > MAX_CHUNK;
      return pdfChunk(filePath, size, 0, size - 1, partial);
    }

    const range = parseRange(rangeHeader, size);
    if (!range) return invalidRange(size);
    return pdfChunk(filePath, size, range.start, range.end, true);
  } catch (error) {
    return apiError(error);
  }
}
