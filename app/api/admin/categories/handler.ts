import { requireApiAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiError } from "@/lib/http";
import { revalidatePublicData } from "@/lib/public-data";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ name: z.string().trim().min(2).max(100), slug: z.string().trim().regex(/^[a-z0-9-]+$/), description: z.string().trim().max(500).optional() });

export async function POST(req: Request) {
  try {
    await requireApiAdmin();
    const category = await db.category.create({ data: schema.parse(await req.json()) });
    revalidatePublicData();
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
