import path from "node:path";

type PdfDocument = { fileName: string; title: string };
type CourseSession = { title: string; videoEmbedUrl: string; youtubeUrl: string; pdfDocuments?: PdfDocument[]; curriculumRange?: [number, number] };
type CurriculumSection = { title: string; items: string[] };
type CourseContent = { sessions: CourseSession[]; majorSectionCount?: number; fireantGuide?: boolean; curriculum?: CurriculumSection[] };
const contentBySlug: Record<string, CourseContent> = {
  "coaching-htg-danh-song-k1-2026": { sessions: [{ title: "Bài giảng", videoEmbedUrl: "https://www.youtube-nocookie.com/embed/0-fbTLpcIgk?rel=0&fs=1&playsinline=0&vq=hd2160", youtubeUrl: "https://www.youtube.com/live/0-fbTLpcIgk", pdfDocuments: [{ fileName: "k1-course-material.pdf", title: "Giáo trình PDF" }] }], majorSectionCount: 7 },
  "k2-coaching-htg-2026": { sessions: [{ title: "Bài giảng", videoEmbedUrl: "https://www.youtube-nocookie.com/embed/Yj8J-QZm2aY?rel=0&fs=1&playsinline=0&vq=hd2160", youtubeUrl: "https://www.youtube.com/live/Yj8J-QZm2aY", pdfDocuments: [{ fileName: "k2-course-material.pdf", title: "Giáo trình PDF" }] }], majorSectionCount: 7 },
  "huong-dan-su-dung-bo-cong-cu-htg": {
    sessions: [
      {
        title: "Buổi 1",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/oaD9ZNT8BdA?rel=0&fs=1&playsinline=0&vq=hd2160",
        youtubeUrl: "https://www.youtube.com/live/oaD9ZNT8BdA",
        pdfDocuments: [{ fileName: "tangThucTinh1.pdf", title: "Tăng Thức Tỉnh 1" }, { fileName: "tangThucTinh2.pdf", title: "Tăng Thức Tỉnh 2" }],
        curriculumRange: [0, 2],
      },
      {
        title: "Buổi 2",
        videoEmbedUrl: "https://www.youtube-nocookie.com/embed/KDKdL5vGFoQ?rel=0&fs=1&playsinline=0&vq=hd2160",
        youtubeUrl: "https://www.youtube.com/live/KDKdL5vGFoQ",
        pdfDocuments: [{ fileName: "coachingCongCu-buoi2.pdf", title: "Hướng dẫn sử dụng Bộ công cụ AI" }],
        curriculumRange: [2, 3],
      },
    ],
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
      {
        title: "Buổi 2: Hướng dẫn sử dụng Bộ công cụ AI",
        items: [
          "I. AI Answer & Copilot",
          "Hướng dẫn sử dụng trợ lý FireAnt AI Answer",
          "Hướng dẫn sử dụng trợ lý FireAnt AI Copilot",
          "Liên kết tới Tầng 2 Tỉnh thức HTG",
          "II. Bộ lọc cổ phiếu xuất sắc",
          "Z-Score - Chấm điểm nguy cơ phá sản",
          "F-Score - Chấm điểm sức khỏe và chất lượng tài chính",
          "Mô hình DuPont - Bóc tách hiệu quả sử dụng vốn (ROE)",
          "Bộ lọc cổ phiếu cơ bản và cảnh báo tín hiệu",
          "III. Công cụ HTG Trading",
          "Cơ sở xây dựng và các thông số cấu hình",
          "Thực tế tính chính xác của dự báo",
          "Tóm lại và lời khuyên áp dụng",
          "IV. AI Report",
          "V. HTG RiskProfile",
          "HTG hỗ trợ hội viên trọn đời",
        ],
      },
    ],
  },
};
export const getProtectedCourseContent = (slug: string) => contentBySlug[slug] ?? null;
export function getCourseMajorSectionCount(slug: string, databaseSectionCount: number) { const content=getProtectedCourseContent(slug); return content?.majorSectionCount??content?.curriculum?.length??databaseSectionCount; }
export function protectedPdfPath(slug: string, documentIndex: number) { const document=getProtectedCourseContent(slug)?.sessions.flatMap(session=>session.pdfDocuments??[])[documentIndex]; return document?path.join(process.cwd(),"khoahoc",document.fileName):null; }
