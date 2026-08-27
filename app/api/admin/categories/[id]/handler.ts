import { requireApiAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiError } from "@/lib/http";
import { revalidatePublicData } from "@/lib/public-data";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ name: z.string().trim().min(2).max(100), slug: z.string().trim().regex(/^[a-z0-9-]+$/), description: z.string().trim().max(500).nullable().optional() }).partial();

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireApiAdmin();
    const category = await db.category.update({ where: { id: (await params).id }, data: schema.parse(await req.json()) });
    revalidatePublicData();
    return NextResponse.json(category);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireApiAdmin();
    const id = (await params).id;
    if (await db.course.count({ where: { categoryId: id } })) return NextResponse.json({ error: "Không thể xóa danh mục đang có khóa học" }, { status: 409 });
    await db.category.delete({ where: { id } });
    revalidatePublicData();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
