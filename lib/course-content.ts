import path from "node:path";

type PdfDocument = { fileName: string; title: string };
type CurriculumSection = { title: string; items: string[] };
type CourseContent = { videoEmbedUrl: string; youtubeUrl: string; pdfDocuments?: PdfDocument[]; fireantGuide?: boolean; curriculum?: CurriculumSection[] };
const contentBySlug: Record<string, CourseContent> = {
  "coaching-htg-danh-song-k1-2026": { videoEmbedUrl: "https://www.youtube-nocookie.com/embed/0-fbTLpcIgk?rel=0&fs=1&playsinline=0&vq=hd2160", youtubeUrl: "https://www.youtube.com/live/0-fbTLpcIgk", pdfDocuments: [{ fileName: "k1-course-material.pdf", title: "Giáo trình PDF" }] },
  "k2-coaching-htg-2026": { videoEmbedUrl: "https://www.youtube-nocookie.com/embed/Yj8J-QZm2aY?rel=0&fs=1&playsinline=0&vq=hd2160", youtubeUrl: "https://www.youtube.com/live/Yj8J-QZm2aY", pdfDocuments: [{ fileName: "k2-course-material.pdf", title: "Giáo trình PDF" }] },
  "huong-dan-su-dung-bo-cong-cu-htg": {
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/oaD9ZNT8BdA?rel=0&fs=1&playsinline=0&vq=hd2160",
    youtubeUrl: "https://www.youtube.com/live/oaD9ZNT8BdA",
    pdfDocuments: [{ fileName: "tangThucTinh1.pdf", title: "Tăng Thức Tỉnh 1" }, { fileName: "tangThucTinh2.pdf", title: "Tăng Thức Tỉnh 2" }],
    fireantGuide: true,
    curriculum: [
      {
        title: "Tầng Thức Tỉnh 1: Tâm - Định hình bản lĩnh",
        items: [
          "Fear & Greed Index",
          "Tỷ lệ % số mã nằm trên MA20",
          "RSI - Relative Strength Index (VN-Index / VN30)",
          "Khối lượng & Động lượng Giá (Volume Momentum)",
          "Độ lệch Phái sinh (Basis = VN30F1M - VN30)",
          "Kinh nghiệm đầu tư thực chiến: dư nợ Margin và khả năng đáp ứng của công ty chứng khoán",
        ],
      },
      {
        title: "Tầng 2: Tầm - Xác định giá trị",
        items: [
          "I. Bộ lọc 4 bước cốt lõi (4-Filter Framework)",
          "Bộ lọc 1: Vòng tròn năng lực (Circle of Competence)",
          "Bộ lọc 2: Lợi thế cạnh tranh bền vững - Hào kinh tế (Economic Moat)",
          "Bộ lọc 3: Ban lãnh đạo tài năng & Trung thực (Management Quality)",
          "Bộ lọc 4: Mức giá hợp lý & Biên an toàn (Margin of Safety)",
          "II. Bộ tiêu chí định lượng (Sức khỏe tài chính)",
          "Kiến thức mở rộng từ Charlie Munger: Tư duy nghịch đảo (Inversion Thinking)",
          "Bẫy định giá (Value Trap)",
          "Sự phụ thuộc vào thiên tài",
          "Ngành nghề đòi hỏi đầu tư vốn quá lớn để tái cấu trúc",
          "Ban lãnh đạo thiếu liêm chính",
        ],
      },
    ],
  },
};
export const getProtectedCourseContent = (slug: string) => contentBySlug[slug] ?? null;
export function protectedPdfPath(slug: string, documentIndex: number) { const document=getProtectedCourseContent(slug)?.pdfDocuments?.[documentIndex]; return document?path.join(process.cwd(),"khoahoc",document.fileName):null; }
