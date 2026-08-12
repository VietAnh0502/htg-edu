import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const sections = [
  { title: "Cơ sở lý luận phương pháp Tài Trần", lessons: ["Tư duy sở hữu doanh nghiệp", "Biên độ an toàn", "Hào môn kinh tế"] },
  { title: "Công thức vận hành chiến lược", lessons: ["Vòng tròn năng lực", "Sự kiên nhẫn và đòn bẩy tiền mặt", "Nguyên lý tập trung"] },
  { title: "Những bài học đầu tư xương máu", lessons: ["Không có công thức nào vĩnh cửu", "Học từ những thương vụ sai", "Xây chiến lược phù hợp với chính mình"] },
  { title: "Nhận diện chân sóng siêu cổ", lessons: ["Chu kỳ kinh tế và thị trường", "Nền giá tích lũy", "Pha phát triển xu hướng", "Quy tắc nắm giữ 8 tuần"] },
  { title: "Đi vốn hiệu suất cao trong sóng tăng", lessons: ["Tầm quan trọng của quy mô vốn", "Giải ngân theo mô hình kim tự tháp", "Quản trị danh mục và đòn bẩy"] },
  { title: "Phương pháp tư duy đảo nghịch", lessons: ["Nhận diện lợi thế cạnh tranh", "Tìm biên độ an toàn", "Phân tích tình huống BSR, PC1 và MSR"] },
  { title: "Cổ phiếu tiêu điểm cùng HTG", lessons: ["Tiêu chí xây dựng danh mục", "Thực hành lập luận đầu tư", "Tổng kết hệ thống HTG"] },
];

const questions = [
  ["Khi mua một cổ phiếu theo tư duy sở hữu doanh nghiệp, nhà đầu tư đang mua gì?", "Một phần hoạt động kinh doanh của doanh nghiệp", "Một mã để lướt sóng trong ngày", "Một lời hứa lợi nhuận cố định", "Một công cụ không có rủi ro", "A"],
  ["Biên độ an toàn là khoảng cách giữa hai đại lượng nào?", "Giá trị nội tại và giá thị trường", "Giá mở cửa và giá đóng cửa", "Doanh thu và chi phí", "Tiền mặt và nợ vay", "A"],
  ["Hào môn kinh tế mô tả điều gì?", "Lợi thế cạnh tranh bền vững", "Khối lượng giao dịch cao", "Giá cổ phiếu thấp", "Doanh nghiệp có nhiều cổ đông", "A"],
  ["Vòng tròn năng lực khuyến khích nhà đầu tư làm gì?", "Chỉ đầu tư vào lĩnh vực mình thực sự hiểu", "Mua tất cả các ngành", "Luôn dùng đòn bẩy tối đa", "Giao dịch càng nhiều càng tốt", "A"],
  ["Theo tài liệu K1, nền giá tích lũy là giai đoạn nào?", "Cổ phiếu đi ngang trong vùng giá tương đối ổn định", "Cổ phiếu giảm sàn liên tục", "Cổ phiếu tăng trần mỗi ngày", "Doanh nghiệp ngừng hoạt động", "A"],
  ["Nền tích lũy càng dài thường gợi ý điều gì?", "Lực bật phía sau có thể càng mạnh", "Rủi ro luôn bằng không", "Giá chắc chắn giảm", "Không còn dòng tiền lớn", "A"],
  ["Giai đoạn được khóa học ưu tiên tham gia là giai đoạn nào?", "Giai đoạn 2 - tăng giá", "Giai đoạn phân phối", "Giai đoạn hoảng loạn", "Bất kỳ giai đoạn nào", "A"],
  ["Tín hiệu quan trọng tại điểm phá vỡ nền giá là gì?", "Khối lượng giao dịch mở rộng", "Thanh khoản biến mất hoàn toàn", "Giá đứng yên", "Doanh nghiệp đổi mã", "A"],
  ["Quy tắc 8 tuần được cân nhắc khi cổ phiếu đạt điều kiện nào?", "Tăng hơn 20% trong 3 tuần từ điểm mua hợp lý", "Giảm 20% trong một ngày", "Đi ngang 8 tháng", "Tăng 2% trong 8 tuần", "A"],
  ["Mục tiêu của quy tắc 8 tuần là gì?", "Tránh bán quá sớm một cổ phiếu có động lượng mạnh", "Buộc mua thêm mỗi tuần", "Xóa bỏ mọi rủi ro", "Dự đoán chính xác đỉnh", "A"],
  ["Mô hình giải ngân trong tài liệu K1 được gọi là gì?", "Mô hình kim tự tháp", "Mô hình ngẫu nhiên", "Mô hình bình quân vô hạn", "Mô hình không dùng tiền mặt", "A"],
  ["Nhà đầu tư cá nhân được khuyến nghị nắm tối đa khoảng bao nhiêu cổ phiếu?", "3-5 cổ phiếu", "20-30 cổ phiếu", "50-100 cổ phiếu", "Không giới hạn", "A"],
  ["Tư duy đảo nghịch giúp nhà đầu tư làm gì?", "Tìm cơ hội khi thị trường định giá sai hoặc quá bi quan", "Mua theo mọi tin đồn", "Bỏ qua giá trị doanh nghiệp", "Không cần quản trị vốn", "A"],
  ["Một doanh nghiệp có thương hiệu mạnh và rào cản gia nhập lớn đang thể hiện yếu tố nào?", "Hào môn kinh tế", "Giá trị sổ sách âm", "Thanh khoản thấp", "Rủi ro bằng không", "A"],
  ["Vì sao phương pháp Buffett cần được tinh chỉnh khi áp dụng tại Việt Nam?", "Thị trường khác về quy mô, cấu trúc và tâm lý đám đông", "Vì giá trị doanh nghiệp không tồn tại", "Vì Việt Nam không có chu kỳ", "Vì mọi cổ phiếu đều giống nhau", "A"],
  ["Nguyên lý tập trung không đồng nghĩa với điều gì?", "Bỏ qua quản trị rủi ro", "Ưu tiên cơ hội hiểu rõ", "Tập trung vào doanh nghiệp xuất sắc", "Giữ danh mục có chủ đích", "A"],
  ["Tiền mặt có vai trò gì trong chiến lược kiên nhẫn?", "Tạo khả năng hành động khi cơ hội định giá hấp dẫn xuất hiện", "Luôn làm giảm hiệu suất", "Thay thế hoàn toàn phân tích", "Bảo đảm lợi nhuận", "A"],
  ["Bài học từ sai lầm của các nhà đầu tư huyền thoại là gì?", "Không có phương pháp bất bại và cần liên tục thích ứng", "Luôn sao chép nguyên bản", "Không bao giờ cắt lỗ", "Chỉ mua cổ phiếu lớn", "A"],
  ["Góc tấn công cao sau phá vỡ nền giá thể hiện điều gì?", "Đà tăng và sự quyết tâm của dòng tiền", "Doanh nghiệp hết lợi thế", "Cổ phiếu chắc chắn không điều chỉnh", "Khối lượng không quan trọng", "A"],
  ["Trước khi giải ngân, nhà đầu tư nên ưu tiên việc nào?", "Xác định luận điểm và mức rủi ro chấp nhận được", "Mua ngay vì sợ bỏ lỡ", "Dùng tối đa đòn bẩy", "Bỏ qua kế hoạch thoát vị thế", "A"],
  ["Tại sao không nên mù quáng thần tượng một nhà đầu tư?", "Mỗi người có nguồn lực, giới hạn và bối cảnh khác nhau", "Vì mọi lý thuyết đều sai", "Vì dữ liệu không cần thiết", "Vì giá cổ phiếu không thay đổi", "A"],
  ["Một nền giá vững chắc cần được kết hợp với yếu tố nào khi phá vỡ?", "Khối lượng mở rộng", "Tin đồn không kiểm chứng", "Tỷ lệ vay tối đa", "Số lượng mã thật nhiều", "A"],
  ["Mục tiêu cốt lõi của quản trị vốn là gì?", "Tối ưu tỷ lệ lợi nhuận trên rủi ro và bảo vệ tài khoản", "Luôn đạt lợi nhuận cao nhất", "Không bao giờ giữ tiền mặt", "Mua đủ mọi cổ phiếu", "A"],
  ["Khi thị trường bán tháo ngắn hạn sau một nhịp tăng mạnh, quy tắc 8 tuần giúp gì?", "Giữ kỷ luật và tránh phản ứng cảm tính", "Bảo đảm giá tiếp tục tăng", "Xác định chính xác đáy", "Loại bỏ nhu cầu theo dõi", "A"],
  ["Một cổ phiếu đầu ngành nhưng đã tăng quá xa khỏi nền giá cần được nhìn nhận thế nào?", "Đánh giá lại biên độ an toàn và điểm vào", "Mua bằng mọi giá", "Bỏ qua rủi ro", "Luôn dùng đòn bẩy", "A"],
  ["Phân tích tình huống doanh nghiệp trong khóa học nhằm mục đích gì?", "Thực hành kết nối lý thuyết với quyết định thực tế", "Cung cấp cam kết lợi nhuận", "Thay thế hoàn toàn nghiên cứu cá nhân", "Phím hàng ngắn hạn", "A"],
  ["Điều gì giúp một hệ thống đầu tư có thể lặp lại?", "Quy trình rõ ràng và kỷ luật thực thi", "Cảm xúc tức thời", "Tin đồn trên mạng", "Giao dịch liên tục", "A"],
  ["Trong đầu tư giá trị, mức giá hấp dẫn có ý nghĩa gì?", "Tạo khoảng đệm trước sai số và biến cố", "Loại bỏ hoàn toàn biến động", "Bảo đảm doanh nghiệp tăng trưởng", "Thay thế chất lượng doanh nghiệp", "A"],
  ["Nhà đầu tư nên xử lý thông tin khóa học như thế nào?", "Kết hợp với nghiên cứu độc lập và mục tiêu cá nhân", "Xem là khuyến nghị mua bán bắt buộc", "Dùng thay mọi dữ liệu khác", "Áp dụng giống nhau cho mọi tài khoản", "A"],
  ["Thông điệp xuyên suốt của hệ thống HTG là gì?", "Tỉnh thức trước đám đông, sáng suốt cùng giá trị", "Luôn dự đoán thị trường", "Mua bán theo cảm xúc", "Theo đuổi lợi nhuận bằng mọi giá", "A"],
] as const;

async function main() {
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password || password.length < 12) throw new Error("Đặt SEED_ADMIN_PASSWORD (ít nhất 12 ký tự) để chạy seed");

  const admin = await db.user.upsert({
    where: { email: "admin@htgedu.local" },
    update: {},
    create: { name: "Quản trị HTG", phone: "0900000000", email: "admin@htgedu.local", passwordHash: await bcrypt.hash(password, 12), role: "ADMIN" },
  });
  const category = await db.category.upsert({
    where: { slug: "dau-tu-chung-khoan" },
    update: { name: "Đầu tư chứng khoán", description: "Tư duy, phương pháp và quản trị vốn cho nhà đầu tư Việt Nam" },
    create: { name: "Đầu tư chứng khoán", slug: "dau-tu-chung-khoan", description: "Tư duy, phương pháp và quản trị vốn cho nhà đầu tư Việt Nam" },
  });
  const existingInstructor = await db.instructor.findFirst({ where: { name: "Tài Trần" } });
  const instructorData = { name: "Tài Trần", title: "Founder HTG · Chuyên gia đầu tư", bio: "Nhà đầu tư với 8 năm kinh nghiệm thực chiến, Top Traders of the Year 2020 và Nhân viên xuất sắc VPS 2024. Người xây dựng hệ thống đầu tư tỉnh thức HTG dành cho thị trường Việt Nam.", avatarUrl: "/images/tai-tran-portrait.jpg" };
  const instructor = existingInstructor ? await db.instructor.update({ where: { id: existingInstructor.id }, data: instructorData }) : await db.instructor.create({ data: instructorData });

  const existingCourse = await db.course.findFirst({ where: { OR: [{ slug: "coaching-htg-danh-song-k1-2026" }, { slug: "quan-ly-hieu-suat" }] } });
  const courseData = {
    title: "Coaching hội viên HTG — Đánh Sóng K1 2026",
    slug: "coaching-htg-danh-song-k1-2026",
    courseCode: "K1-T5-2026",
    shortDescription: "Làm chủ phương pháp nhận diện chân sóng, đi vốn hiệu suất cao và xây danh mục có kỷ luật trong thị trường Việt Nam.",
    description: "Khóa học kết hợp 70-80% hồn cốt từ triết lý đầu tư giá trị của Warren Buffett với kinh nghiệm thực chiến và đặc thù chu kỳ, dòng tiền, tâm lý của thị trường Việt Nam. Bạn sẽ học cách đánh giá giá trị gốc của doanh nghiệp, nhận diện nền giá và pha phát triển xu hướng, đồng thời xây dựng nguyên tắc giải ngân và quản trị danh mục phù hợp với chính mình.\n\nĐây là chương trình giáo dục, không phải dịch vụ khuyến nghị mua bán chứng khoán hay cam kết lợi nhuận.",
    targetAudience: "Nhà đầu tư cá nhân muốn xây nền tảng tư duy bài bản; người đang giao dịch thiếu hệ thống; nhà đầu tư muốn hiểu cách nhận diện chân sóng, quản trị vốn và ra quyết định độc lập.",
    price: null,
    thumbnailUrl: "/images/k1-cover.jpg",
    status: "PUBLISHED" as const,
    featured: true,
    categoryId: category.id,
    instructorId: instructor.id,
    examDurationMinutes: 45,
    passingScore: 70,
    maxAttempts: 3,
  };

  const course = existingCourse
    ? await db.course.update({ where: { id: existingCourse.id }, data: courseData })
    : await db.course.create({ data: courseData });

  await db.courseSection.deleteMany({ where: { courseId: course.id } });
  for (const [sectionIndex, section] of sections.entries()) {
    await db.courseSection.create({
      data: {
        courseId: course.id,
        title: section.title,
        position: sectionIndex + 1,
        lessons: { create: section.lessons.map((title, lessonIndex) => ({ title, position: lessonIndex + 1, durationSeconds: 1200 + lessonIndex * 300, isPreview: sectionIndex === 0 && lessonIndex === 0 })) },
      },
    });
  }
  await db.question.deleteMany({ where: { courseId: course.id } });
  await db.question.createMany({ data: questions.map(([content, optionA, optionB, optionC, optionD, correctOption], i) => ({ courseId: course.id, content, optionA, optionB, optionC, optionD, correctOption, explanation: `Nội dung được trình bày trong chuyên đề ${Math.min(7, Math.floor(i / 4) + 1)} của khóa K1.`, difficulty: i < 10 ? "EASY" as const : i < 22 ? "MEDIUM" as const : "HARD" as const })) });
  console.log(`Seed hoàn tất. Admin: ${admin.email}. Khóa học: ${course.title}`);
}

main().finally(() => db.$disconnect());
