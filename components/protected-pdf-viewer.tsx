"use client";

import { AlertCircle, FileText, LoaderCircle, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

const CHUNK_SIZE = 3 * 1024 * 1024;
const CONCURRENT_REQUESTS = 2;

type ByteRange = { start: number; end: number; index: number };

async function apiMessage(response: Response) {
  try {
    const body = await response.json() as { error?: string };
    return body.error || "Không thể tải tài liệu.";
  } catch {
    return "Không thể tải tài liệu.";
  }
}

function parseContentRange(value: string | null) {
  const match = value?.match(/^bytes (\d+)-(\d+)\/(\d+)$/);
  if (!match) return null;
  return { start: Number(match[1]), end: Number(match[2]), total: Number(match[3]) };
}

export function ProtectedPdfViewer({ courseId, title, documentToken, documentIndex = 0 }: { courseId: string; title: string; documentToken: string; documentIndex?: number }) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let generatedUrl: string | null = null;

    async function loadPdf() {
      setObjectUrl(null);
      setError(null);
      setProgress(0);

      try {
        const endpoint = `/api/courses/${courseId}/document?document=${documentIndex}`;
        const firstResponse = await fetch(endpoint, {
          headers: { Range: `bytes=0-${CHUNK_SIZE - 1}`, Authorization: `Bearer ${documentToken}` },
          cache: "no-store",
          signal: controller.signal,
        });
        if (!firstResponse.ok) throw new Error(await apiMessage(firstResponse));

        const firstRange = parseContentRange(firstResponse.headers.get("content-range"));
        const firstPart = await firstResponse.arrayBuffer();

        if (firstResponse.status === 200) {
          generatedUrl = URL.createObjectURL(new Blob([firstPart], { type: "application/pdf" }));
          setProgress(100);
          setObjectUrl(generatedUrl);
          return;
        }

        if (!firstRange || firstRange.start !== 0 || firstPart.byteLength !== firstRange.end + 1) {
          throw new Error("Máy chủ trả về dữ liệu PDF không đầy đủ.");
        }

        const ranges: ByteRange[] = [];
        for (let start = firstRange.end + 1, index = 1; start < firstRange.total; start += CHUNK_SIZE, index++) {
          ranges.push({ start, end: Math.min(start + CHUNK_SIZE - 1, firstRange.total - 1), index });
        }

        const parts: BlobPart[] = new Array(ranges.length + 1);
        parts[0] = firstPart;
        let loadedBytes = firstPart.byteLength;
        setProgress(Math.max(1, Math.round((loadedBytes / firstRange.total) * 100)));

        for (let offset = 0; offset < ranges.length; offset += CONCURRENT_REQUESTS) {
          const batch = ranges.slice(offset, offset + CONCURRENT_REQUESTS);
          await Promise.all(batch.map(async ({ start, end, index }) => {
            const response = await fetch(endpoint, {
              headers: { Range: `bytes=${start}-${end}`, Authorization: `Bearer ${documentToken}` },
              cache: "no-store",
              signal: controller.signal,
            });
            if (response.status !== 206) throw new Error(await apiMessage(response));

            const contentRange = parseContentRange(response.headers.get("content-range"));
            const part = await response.arrayBuffer();
            if (
              !contentRange ||
              contentRange.start !== start ||
              contentRange.end !== end ||
              contentRange.total !== firstRange.total ||
              part.byteLength !== end - start + 1
            ) throw new Error("Một phần dữ liệu PDF bị thiếu. Vui lòng tải lại.");

            parts[index] = part;
            loadedBytes += part.byteLength;
            setProgress(Math.min(99, Math.round((loadedBytes / firstRange.total) * 100)));
          }));
        }

        generatedUrl = URL.createObjectURL(new Blob(parts, { type: "application/pdf" }));
        setProgress(100);
        setObjectUrl(generatedUrl);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(loadError instanceof Error ? loadError.message : "Không thể tải tài liệu.");
      }
    }

    void loadPdf();
    return () => {
      controller.abort();
      if (generatedUrl) URL.revokeObjectURL(generatedUrl);
    };
  }, [attempt, courseId, documentIndex, documentToken]);

  if (error) return <div className="pdf-viewer-status pdf-viewer-error"><AlertCircle/><b>Không tải được giáo trình</b><p>{error}</p><button type="button" onClick={() => setAttempt(value => value + 1)}><RotateCcw size={16}/> Thử lại</button></div>;
  if (!objectUrl) return <div className="pdf-viewer-status"><LoaderCircle className="pdf-loading-icon"/><b>Đang chuẩn bị giáo trình</b><p>Đã tải {progress}% · Vui lòng giữ trang này mở</p><div className="pdf-loading-track"><span style={{ width: `${progress}%` }}/></div></div>;

  return <iframe src={`${objectUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`} title={`Tài liệu ${title}`} />;
}
