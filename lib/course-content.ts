import path from "node:path";

type CourseContent = { videoEmbedUrl: string; youtubeUrl: string; pdfFileName?: string; fireantGuide?: boolean };
const contentBySlug: Record<string, CourseContent> = {
  "coaching-htg-danh-song-k1-2026": { videoEmbedUrl: "https://www.youtube-nocookie.com/embed/0-fbTLpcIgk?rel=0&fs=1&playsinline=0&vq=hd2160", youtubeUrl: "https://www.youtube.com/live/0-fbTLpcIgk", pdfFileName: "Tài Trần coaching K1 2026.pdf" },
  "k2-coaching-htg-2026": { videoEmbedUrl: "https://www.youtube-nocookie.com/embed/Yj8J-QZm2aY?rel=0&fs=1&playsinline=0&vq=hd2160", youtubeUrl: "https://www.youtube.com/live/Yj8J-QZm2aY", pdfFileName: "Tài Trần coaching K2 2026.pdf" },
  "huong-dan-su-dung-bo-cong-cu-htg": { videoEmbedUrl: "https://www.youtube-nocookie.com/embed/oaD9ZNT8BdA?rel=0&fs=1&playsinline=0&vq=hd2160", youtubeUrl: "https://www.youtube.com/live/oaD9ZNT8BdA", fireantGuide: true },
};
export const getProtectedCourseContent = (slug: string) => contentBySlug[slug] ?? null;
export function protectedPdfPath(slug: string) { const content=getProtectedCourseContent(slug); return content?.pdfFileName?path.join(process.cwd(),"khoahoc",content.pdfFileName):null; }
