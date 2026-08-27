import { requireApiAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiError } from "@/lib/http";
import { revalidatePublicData } from "@/lib/public-data";
import { courseSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await requireApiAdmin();
    const course = await db.course.create({ data: courseSchema.parse(await req.json()) });
    revalidatePublicData();
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
