import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const curriculum = [
  { title: "Thực trạng báo động của 95% nhà đầu tư chứng khoán Việt Nam", lessons: ["Bức tranh thực trạng nhà đầu tư Việt Nam"] },
  { title: "Giải mã di sản Warren Buffett", lessons: ["Cuộc đời Warren Buffett", "Sự nghiệp đầu tư", "Triết lý đầu tư"] },
  { title: "Công thức vận hành chiến lược Warren Buffett", lessons: ["Vòng tròn năng lực", "Sự kiên nhẫn và đòn bẩy tiền mặt", "Nguyên lý tập trung"] },
  { title: "Hệ thống đầu tư tỉnh thức HTG", lessons: ["Bản địa hóa phương pháp Đầu tư Giá trị Tăng trưởng", "Tầng 1 — TÂM: Định hình bản lĩnh", "Tầng 2 — TẦM: Xác định giá trị", "Tầng 3 — THẾ: Lựa chọn thời điểm"] },
  { title: "Chiến lược đầu tư bất bại 2026–2030", lessons: ["Top-down: Từ vĩ mô đến ngành và cổ phiếu", "Chiến lược thời tiền đắt", "Chiến lược thời tiền rẻ", "Quy mô vốn và thời điểm mua bán", "Kỹ thuật cao trào mua và cao trào bán"] },
  { title: "Các sai lầm chết người của nhà đầu tư Việt Nam", lessons: ["Mua quá nhiều mã", "Tập trung sai cách trong cùng một nhóm ngành", "Hoảng loạn trước tin xấu và hưng phấn trước tin tốt", "Tham lam khi đám đông tham lam", "Sử dụng vốn và đòn bẩy sai thời điểm"] },
  { title: "Danh mục chủ lực HTG 2026–2030", lessons: ["Nguyên tắc xây dựng danh mục chủ lực HTG"] },
];

async function main() {
  const [category, instructor] = await Promise.all([
    db.category.findUnique({ where: { slug: "dau-tu-chung-khoan" } }),
    db.instructor.findFirst({ where: { name: "Tài Trần" } }),
  ]);
  if (!category || !instructor) throw new Error("Thiếu danh mục hoặc giảng viên Tài Trần");

  await db.course.updateMany({ data: { featured: false } });
  const course = await db.course.upsert({
    where: { slug: "k2-coaching-htg-2026" },
    update: {
      title: "K2 Coaching HTG 2026 — Hệ thống Đầu tư Tỉnh thức",
      courseCode: "K2-2026",
      shortDescription: "Bản địa hóa và hoàn thiện phương pháp Đầu tư Giá trị Tăng trưởng Warren Buffett cho nhà đầu tư Việt Nam giai đoạn 2026–2030.",
      description: "K2 Coaching HTG là chương trình coaching cao cấp, hoàn thiện và bản địa hóa phương pháp Đầu tư Giá trị Tăng trưởng Warren Buffett sát với thực chiến thị trường Việt Nam. Khóa học đi từ thực trạng của nhà đầu tư, giải mã di sản và công thức vận hành chiến lược Buffett, đến Hệ thống Đầu tư Tỉnh thức HTG với ba tầng TÂM — TẦM — THẾ. Học viên từng bước xây dựng chiến lược phù hợp cho từng giai đoạn tiền đắt, tiền rẻ; nhận diện sai lầm trong quản trị danh mục, cảm xúc và đòn bẩy; đồng thời hiểu nguyên tắc xây dựng danh mục chủ lực giai đoạn 2026–2030.\n\nTỉnh thức trước đám đông — Sáng suốt cùng giá trị. Nội dung phục vụ mục đích giáo dục, không phải khuyến nghị mua bán hay cam kết lợi nhuận.",
      targetAudience: "Nhà đầu tư có 1–3 năm kinh nghiệm nhưng còn thua lỗ, mắc bẫy tâm lý hoặc chưa xác định được điểm mua bán phù hợp; nhà đầu tư bận rộn muốn xây dựng danh mục có nguyên tắc mà không phải liên tục theo dõi bảng điện; học viên K1 và nhà đầu tư muốn nâng cấp phương pháp Warren Buffett theo bối cảnh Việt Nam để chuẩn bị cho chu kỳ 2026–2030.",
      thumbnailUrl: "/images/tai-tran-coaching-k2-2026.jpg",
      price: null,
      status: "PUBLISHED",
      featured: true,
      categoryId: category.id,
      instructorId: instructor.id,
    },
    create: {
      title: "K2 Coaching HTG 2026 — Hệ thống Đầu tư Tỉnh thức",
      slug: "k2-coaching-htg-2026",
      courseCode: "K2-2026",
      shortDescription: "Bản địa hóa và hoàn thiện phương pháp Đầu tư Giá trị Tăng trưởng Warren Buffett cho nhà đầu tư Việt Nam giai đoạn 2026–2030.",
      description: "K2 Coaching HTG là chương trình coaching cao cấp, hoàn thiện và bản địa hóa phương pháp Đầu tư Giá trị Tăng trưởng Warren Buffett sát với thực chiến thị trường Việt Nam. Khóa học đi từ thực trạng của nhà đầu tư, giải mã di sản và công thức vận hành chiến lược Buffett, đến Hệ thống Đầu tư Tỉnh thức HTG với ba tầng TÂM — TẦM — THẾ. Học viên từng bước xây dựng chiến lược phù hợp cho từng giai đoạn tiền đắt, tiền rẻ; nhận diện sai lầm trong quản trị danh mục, cảm xúc và đòn bẩy; đồng thời hiểu nguyên tắc xây dựng danh mục chủ lực giai đoạn 2026–2030.\n\nTỉnh thức trước đám đông — Sáng suốt cùng giá trị. Nội dung phục vụ mục đích giáo dục, không phải khuyến nghị mua bán hay cam kết lợi nhuận.",
      targetAudience: "Nhà đầu tư có 1–3 năm kinh nghiệm nhưng còn thua lỗ, mắc bẫy tâm lý hoặc chưa xác định được điểm mua bán phù hợp; nhà đầu tư bận rộn muốn xây dựng danh mục có nguyên tắc mà không phải liên tục theo dõi bảng điện; học viên K1 và nhà đầu tư muốn nâng cấp phương pháp Warren Buffett theo bối cảnh Việt Nam để chuẩn bị cho chu kỳ 2026–2030.",
      thumbnailUrl: "/images/tai-tran-coaching-k2-2026.jpg",
      price: null,
      status: "PUBLISHED",
      featured: true,
      categoryId: category.id,
      instructorId: instructor.id,
    },
  });

  await db.courseSection.deleteMany({ where: { courseId: course.id } });
  for (const [sectionIndex, section] of curriculum.entries()) {
    await db.courseSection.create({
      data: {
        courseId: course.id,
        title: section.title,
        position: sectionIndex + 1,
        lessons: {
          create: section.lessons.map((title, lessonIndex) => ({
            title,
            position: lessonIndex + 1,
            durationSeconds: 0,
            isPreview: false,
          })),
        },
      },
    });
  }
  console.log(`Đã cập nhật ${course.title} với ${curriculum.length} chương.`);
}

main().finally(() => db.$disconnect());
