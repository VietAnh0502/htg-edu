"use client";

import { AlertCircle, FileText, LoaderCircle, RotateCcw } from "lucide-react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { useEffect, useRef, useState } from "react";

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

function PdfPage({ document, pageNumber }: { document: PDFDocumentProxy; pageNumber: number }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const [ratio, setRatio] = useState(1.414);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new IntersectionObserver(entries => {
      setVisible(entries.some(entry => entry.isIntersecting));
    }, { root: wrapper.closest(".pdf-pages-scroll"), rootMargin: "900px 0px" });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
      return;
    }
    let cancelled = false;
    let renderTask: RenderTask | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let lastWidth = 0;

    void document.getPage(pageNumber).then(page => {
      if (cancelled) return;
      const original = page.getViewport({ scale: 1 });
      const pageRatio = original.height / original.width;
      setRatio(pageRatio);

      const render = () => {
        const wrapper = wrapperRef.current;
        const canvas = canvasRef.current;
        if (!wrapper || !canvas || cancelled) return;
        const cssWidth = Math.max(1, wrapper.clientWidth);
        if (cssWidth === lastWidth) return;
        lastWidth = cssWidth;
        renderTask?.cancel();
        const outputScale = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: (cssWidth / original.width) * outputScale });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${Math.round(cssWidth * pageRatio)}px`;
        const context = canvas.getContext("2d", { alpha: false });
        if (context) {
          renderTask = page.render({ canvasContext: context, viewport });
          void renderTask.promise.catch(renderError => {
            if (renderError instanceof Error && renderError.name !== "RenderingCancelledException") console.error("Không thể render trang PDF", renderError);
          });
        }
      };

      render();
      resizeObserver = new ResizeObserver(render);
      if (wrapperRef.current) resizeObserver.observe(wrapperRef.current);
    });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      renderTask?.cancel();
    };
  }, [document, pageNumber, visible]);

  return <div ref={wrapperRef} className="pdf-page" style={{ aspectRatio: `1 / ${ratio}` }}><canvas ref={canvasRef} aria-label={`Trang ${pageNumber}`}/><span>{pageNumber}</span></div>;
}

function PdfPages({ data, title }: { data: ArrayBuffer; title: string }) {
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let loadedDocument: PDFDocumentProxy | undefined;
    let loadingTask: ReturnType<typeof import("pdfjs-dist")["getDocument"]> | undefined;

    void import("pdfjs-dist").then(pdfjs => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
      loadingTask = pdfjs.getDocument({ data: new Uint8Array(data.slice(0)) });
      return loadingTask.promise;
    }).then(pdf => {
      loadedDocument = pdf;
      if (active) setDocument(pdf);
    }).catch(loadError => {
      if (active) setError(loadError instanceof Error ? loadError.message : "Không thể đọc tài liệu PDF.");
    });

    return () => {
      active = false;
      void loadingTask?.destroy();
      void loadedDocument?.destroy();
    };
  }, [data]);

  if (error) return <div className="pdf-viewer-status pdf-viewer-error"><AlertCircle/><b>Không thể hiển thị giáo trình</b><p>{error}</p></div>;
  if (!document) return <div className="pdf-viewer-status"><LoaderCircle className="pdf-loading-icon"/><b>Đang dựng các trang PDF</b><p>Vui lòng đợi trong giây lát</p></div>;

  return <div className="pdf-pages-scroll" role="document" aria-label={`Tài liệu ${title}`}><div className="pdf-pages">{Array.from({ length: document.numPages }, (_, index) => <PdfPage key={index + 1} document={document} pageNumber={index + 1}/>)}</div></div>;
}

export function ProtectedPdfViewer({ courseId, title, documentToken, documentIndex = 0 }: { courseId: string; title: string; documentToken: string; documentIndex?: number }) {
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPdf() {
      setPdfData(null);
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
          setProgress(100);
          setPdfData(firstPart);
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

        const completePdf = await new Blob(parts, { type: "application/pdf" }).arrayBuffer();
        setProgress(100);
        setPdfData(completePdf);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(loadError instanceof Error ? loadError.message : "Không thể tải tài liệu.");
      }
    }

    void loadPdf();
    return () => {
      controller.abort();
    };
  }, [attempt, courseId, documentIndex, documentToken]);

  if (error) return <div className="pdf-viewer-status pdf-viewer-error"><AlertCircle/><b>Không tải được giáo trình</b><p>{error}</p><button type="button" onClick={() => setAttempt(value => value + 1)}><RotateCcw size={16}/> Thử lại</button></div>;
  if (!pdfData) return <div className="pdf-viewer-status"><LoaderCircle className="pdf-loading-icon"/><b>Đang chuẩn bị giáo trình</b><p>Đã tải {progress}% · Vui lòng giữ trang này mở</p><div className="pdf-loading-track"><span style={{ width: `${progress}%` }}/></div></div>;

  return <PdfPages data={pdfData} title={title}/>;
}
