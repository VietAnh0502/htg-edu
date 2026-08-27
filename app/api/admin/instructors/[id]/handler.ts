import { requireApiAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiError } from "@/lib/http";
import { revalidatePublicData } from "@/lib/public-data";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ name: z.string().trim().min(2).max(100), title: z.string().trim().max(150).nullable().optional(), bio: z.string().trim().min(10), avatarUrl: z.union([z.string().url(), z.string().startsWith("/"), z.literal("")]).nullable().optional() }).partial();

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireApiAdmin();
    const data = schema.parse(await req.json());
    if (data.avatarUrl === "") data.avatarUrl = null;
    const instructor = await db.instructor.update({ where: { id: (await params).id }, data });
    revalidatePublicData();
    return NextResponse.json(instructor);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireApiAdmin();
    const id = (await params).id;
    if (await db.course.count({ where: { instructorId: id } })) return NextResponse.json({ error: "Không thể xóa giảng viên đang phụ trách khóa học" }, { status: 409 });
    await db.instructor.delete({ where: { id } });
    revalidatePublicData();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
