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

export const questions = [
  ["Theo giáo trình K2, cạm bẫy phổ biến của nhà đầu tư Việt Nam là gì?","Lướt sóng T+ và phản ứng theo bảng điện","Chỉ nắm giữ tiền mặt","Luôn phân tích doanh nghiệp","Không theo dõi thị trường","A"],
  ["Khoảng trống lớn của thị trường được K2 chỉ ra là gì?","Thiếu cổ phiếu niêm yết","Thiếu hệ tư duy điềm tĩnh để bảo vệ và phát triển tài sản","Thiếu công ty chứng khoán","Thiếu dữ liệu giá","B"],
  ["Buffett tiếp thu nền tảng đầu tư giá trị từ ai?","Benjamin Graham","Peter Lynch","Philip Fisher","John Bogle","A"],
  ["Buffett đã biến doanh nghiệp nào từ công ty dệt may sa sút thành tập đoàn đa ngành?","GEICO","Coca-Cola","Berkshire Hathaway","American Express","C"],
  ["Trụ cột 'cổ phiếu là quyền sở hữu' yêu cầu nhìn cổ phiếu như thế nào?","Một vé số","Một phần doanh nghiệp thực sự","Một khoản lãi cố định","Một công cụ không biến động","B"],
  ["Lợi thế cạnh tranh bền vững được ví như yếu tố nào?","Lớp hào bảo vệ doanh nghiệp","Đòn bẩy tài chính","Khối lượng giao dịch","Giá trị sổ sách","A"],
  ["Biên an toàn có vai trò chính nào?","Tăng số lần giao dịch","Bảo vệ vốn trước biến động khó lường","Loại bỏ phân tích doanh nghiệp","Bảo đảm lợi nhuận","B"],
  ["HTG bổ sung trụ cột nào khi bản địa hóa phương pháp Buffett tại Việt Nam?","Cổ tức","Dòng tiền theo Wyckoff/VSA","Tin đồn thị trường","Giao dịch T+","B"],
  ["Vòng tròn năng lực khuyến nghị điều gì?","Chỉ đầu tư vào doanh nghiệp và ngành mình hiểu rõ","Mua mọi ngành để phân tán","Theo mọi xu hướng mới","Luôn giải ngân hết vốn","A"],
  ["Trong chiến lược Buffett, tiền mặt dồi dào giúp làm gì?","Mua tài sản chất lượng khi thị trường hoảng loạn","Tránh mọi cơ hội đầu tư","Tăng phí giao dịch","Bảo đảm không thua lỗ","A"],
  ["Nguyên lý tập trung trong K2 có nghĩa là gì?","Dàn trải vào thật nhiều mã","Dồn tỷ trọng có chọn lọc vào một số doanh nghiệp xuất sắc","All-in một mã bất kỳ","Chỉ mua cổ phiếu giá thấp","B"],
  ["Tầng TÂM của hệ thống HTG tập trung vào điều gì?","Định hình bản lĩnh và làm chủ cảm xúc","Định giá FCFF","Xác định điểm mua kỹ thuật","Dự báo lãi suất","A"],
  ["Ưu tiên số một tại tầng TÂM là gì?","Tối đa hóa margin","Bảo toàn vốn","Giao dịch liên tục","Đánh bại chỉ số mỗi ngày","B"],
  ["Tầng TẦM sử dụng nội dung nào để xác định giá trị?","Tin đồn và bảng điện","Ban lãnh đạo, giá trị tài sản và dòng tiền FCFF/FCFE","Chỉ khối lượng giao dịch","Chỉ giá cổ phiếu","B"],
  ["Tầng THẾ nhằm giải quyết vấn đề nào?","Chọn thời điểm qua dòng tiền lớn","Chọn mật khẩu tài khoản","Tính thuế doanh nghiệp","Tuyển ban lãnh đạo","A"],
  ["Chuỗi giai đoạn cổ phiếu trong tài liệu là gì?","Tích lũy - Đẩy giá - Phân phối - Tái tích lũy","Đẩy giá - Tích lũy - Phá sản - Chia cổ tức","Phân phối - Tích lũy - Ngừng giao dịch - Tăng giá","Tăng giá - Giảm giá - Đứng yên - Hủy niêm yết","A"],
  ["Phân bổ vốn đa tầng cho NAV lớn được tài liệu gợi ý theo tỷ lệ nào?","50% cốt lõi - 50% tăng tốc","70% cốt lõi - 30% tăng tốc","30% cốt lõi - 70% tiền mặt","90% tăng tốc - 10% cốt lõi","B"],
  ["Phương pháp Top-down bắt đầu từ đâu?","Một mã cổ phiếu ngẫu nhiên","Vĩ mô rồi đến thị trường, chiến lược, ngành và cổ phiếu","Tin đồn doanh nghiệp","Điểm mua trong ngày","B"],
  ["Trong bối cảnh tiền đắt, chiến lược phù hợp theo K2 là gì?","Tấn công tổng lực","Phòng ngự chặt, phản công nhanh và quản trị kỳ vọng","Dùng margin tối đa","Mua mọi điểm nổ","B"],
  ["Trong bối cảnh tiền rẻ và uptrend, tài liệu ưu tiên cách tiếp cận nào?","Tấn công với nhóm thanh khoản lớn và kỳ vọng theo xu hướng","Chỉ giữ tiền mặt","Chỉ mua cạnh dưới sideway","Không tham gia thị trường","A"],
  ["Theo lưu ý trong K2, đỉnh lãi suất thường tương ứng với điều gì?","Đỉnh thị trường tài chính","Đáy thị trường tài chính","Thanh khoản bằng không","Không có quan hệ nào","B"],
  ["Nhóm nào được xem là chỉ báo sớm của thị trường chứng khoán?","Tài chính như chứng khoán, ngân hàng và bất động sản","Chỉ hàng tiêu dùng thiết yếu","Chỉ ngành y tế","Chỉ ngành nông nghiệp","A"],
  ["Nền giá tích lũy được hiểu là gì?","Giai đoạn đi ngang trong vùng giá tương đối ổn định","Giai đoạn giảm sàn liên tục","Một phiên tăng trần","Giai đoạn doanh nghiệp ngừng hoạt động","A"],
  ["Nền tích lũy dài thường gợi ý điều gì theo tài liệu?","Sóng sau có thể lớn và bền vững hơn","Giá chắc chắn giảm","Không còn dòng tiền tổ chức","Rủi ro bằng không","A"],
  ["Điều kiện đủ bên cạnh nền tích lũy là gì?","Pha phát triển xu hướng","Tin đồn tích cực","Cổ tức tiền mặt","Giá thấp hơn mệnh giá","A"],
  ["Cú chuyển sang pha tăng giá mạnh được mô tả với dấu hiệu nào?","Giá thoát nền và tăng trên 20% trong 3 tuần","Giá giảm 20% trong 3 tuần","Đi ngang nhiều năm không đổi","Thanh khoản biến mất","A"],
  ["Tài khoản cá nhân dưới 10 tỷ được HTG khuyến nghị nắm bao nhiêu mã?","3-4 mã, nhiều nhất 5","10-15 mã","20-30 mã","Chỉ một mã duy nhất","A"],
  ["Giải ngân theo mô hình kim tự tháp nghĩa là gì?","Mua nhiều hơn ở chân sóng và thu hẹp vốn khi giá đi xa nền","Mua ít ở chân sóng và càng cao càng mua lớn","Dùng hết margin tại đỉnh sóng","Chia đều vốn ở mọi mức giá","A"],
  ["Cách ứng xử với cao trào mua theo K2 là gì?","Không dám bán vì sợ tăng tiếp","Cân nhắc bán khi thị trường hưng phấn","Mua thêm bằng mọi giá","Bỏ qua quản trị rủi ro","B"],
  ["Hai nhóm trọng điểm cuối 2026 trong giáo trình là gì?","Phòng thủ và định giá hấp dẫn/sự cố thiên nga đen","Chỉ công nghệ và bán lẻ","Chỉ ngân hàng và chứng khoán","Đầu cơ và cổ phiếu penny","A"],
] as const;

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
      examDurationMinutes: 45,
      passingScore: 70,
      maxAttempts: 3,
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
      examDurationMinutes: 45,
      passingScore: 70,
      maxAttempts: 3,
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
  const existingQuestions=await db.question.count({where:{courseId:course.id}});
  if(existingQuestions===0)await db.question.createMany({data:questions.map(([content,optionA,optionB,optionC,optionD,correctOption],index)=>({courseId:course.id,content,optionA,optionB,optionC,optionD,correctOption,explanation:`Câu hỏi được xây dựng từ giáo trình K2, nhóm nội dung ${Math.min(8,Math.floor(index/4)+1)}.`,difficulty:index<10?"EASY" as const:index<23?"MEDIUM" as const:"HARD" as const}))});
  console.log(`Đã cập nhật ${course.title}: ${curriculum.length} chương; ${existingQuestions===0?`đã thêm ${questions.length} câu hỏi`:`giữ nguyên ${existingQuestions} câu hỏi hiện có`}.`);
}

if(process.argv[1]?.endsWith("add-k2.ts"))main().finally(() => db.$disconnect());
