import { requireApiAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiError } from "@/lib/http";
import { revalidatePublicData } from "@/lib/public-data";
import { courseSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireApiAdmin();
    const course = await db.course.update({
      where: { id: (await params).id },
      data: courseSchema.partial().parse(await req.json()),
    });
    revalidatePublicData();
    return NextResponse.json(course);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireApiAdmin();
    const id = (await params).id;
    const linked = await db.course.findUnique({
      where: { id },
      select: { _count: { select: { orders: true, enrollments: true } } },
    });
    if (!linked) return NextResponse.json({ error: "Không tìm thấy khóa học" }, { status: 404 });
    if (linked._count.orders || linked._count.enrollments) {
      return NextResponse.json({ error: "Khóa học đã có học viên hoặc đơn đăng ký. Hãy chuyển sang trạng thái lưu trữ thay vì xóa." }, { status: 409 });
    }
    await db.course.delete({ where: { id } });
    revalidatePublicData();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
