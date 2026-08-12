import { db } from "@/lib/db";
import { apiError, fail } from "@/lib/http";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ name: z.string().trim().min(2).max(100), phone: z.string().regex(/^(0|\+84)[0-9]{9,10}$/), email: z.string().email().transform(v => v.toLowerCase()), password: z.string().min(8).max(72), confirmPassword: z.string() }).refine(v => v.password === v.confirmPassword, { message: "Mật khẩu xác nhận không khớp", path: ["confirmPassword"] });
export async function POST(req: Request) { try {
  if (!rateLimit(`register:${clientIp(req)}`, 5, 900_000)) fail(429, "Vui lòng thử lại sau");
  const data = schema.parse(await req.json());
  if (await db.user.findFirst({ where: { OR: [{ email: data.email }, { phone: data.phone }] } })) fail(409, "Email hoặc số điện thoại đã tồn tại");
  const user = await db.user.create({ data: { name: data.name, phone: data.phone, email: data.email, passwordHash: await bcrypt.hash(data.password, 12) }, select: { id: true, email: true } });
  return NextResponse.json(user, { status: 201 });
} catch (e) { return apiError(e); } }
