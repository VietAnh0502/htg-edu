import { createSession } from "@/lib/auth";
import { db, isTransientDatabaseError } from "@/lib/db";
import { apiError, fail } from "@/lib/http";
import { clientIp, rateLimit, refundRateLimit } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  const rateLimitKey = `login:${clientIp(req)}`;
  try {
    if (!rateLimit(rateLimitKey, 8, 900_000)) fail(429, "Quá nhiều lần đăng nhập. Vui lòng thử lại sau.");
    const data = z.object({ email: z.string().trim().email().transform(v => v.toLowerCase()), password: z.string().min(1).max(72) }).parse(await req.json());
    const user = await db.user.findUnique({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) fail(401, "Email hoặc mật khẩu không đúng");
    await createSession(user);
    return NextResponse.json({ user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    // Infrastructure failures are not failed password attempts. Refunding the
    // counter lets the browser's single safe retry avoid locking the user out.
    if (isTransientDatabaseError(error)) refundRateLimit(rateLimitKey);
    return apiError(error);
  }
}
