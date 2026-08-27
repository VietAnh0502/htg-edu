import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const course = await db.course.update({
    where: { slug: "huong-dan-su-dung-bo-cong-cu-htg" },
    data: {
      description: "Khóa học độc lập hướng dẫn sử dụng hiệu quả hệ sinh thái công cụ đầu tư HTG trên nền tảng FireAnt. Nội dung tập trung vào cách tiếp cận các tính năng, đọc dữ liệu, sử dụng bộ lọc và các công cụ hỗ trợ để nâng cao chất lượng phân tích và quản trị danh mục.\n\nQuyền truy cập khóa học được Admin cấp riêng cho từng tài khoản.",
      targetAudience: "Dành cho nhà đầu tư muốn sử dụng bộ công cụ HTG x FireAnt trong quá trình phân tích, theo dõi và quản trị danh mục.",
    },
    select: { title: true },
  });
  console.log(`Đã tách ${course.title} thành khóa học độc lập.`);
}

main().finally(() => db.$disconnect());
