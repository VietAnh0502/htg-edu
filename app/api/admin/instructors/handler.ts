import { requireApiAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiError } from "@/lib/http";
import { revalidatePublicData } from "@/lib/public-data";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ name: z.string().trim().min(2).max(100), title: z.string().trim().max(150).optional(), bio: z.string().trim().min(10), avatarUrl: z.union([z.string().url(), z.string().startsWith("/")]).optional() });

export async function POST(req: Request) {
  try {
    await requireApiAdmin();
    const instructor = await db.instructor.create({ data: schema.parse(await req.json()) });
    revalidatePublicData();
    return NextResponse.json(instructor, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
