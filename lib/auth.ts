import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import { fail } from "./http";

const COOKIE = "htg_session";
const secret = () => {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET phải có ít nhất 32 ký tự");
  return new TextEncoder().encode(value);
};

export async function createSession(user: { id: string; role: string; name?: string }) {
  const token = await new SignJWT({ role: user.role, name: user.name }).setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id).setIssuedAt().setExpirationTime("7d").sign(secret());
  (await cookies()).set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 604800 });
}

export async function destroySession() { (await cookies()).delete(COOKIE); }

export async function getSession() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    if(payload.role!=="ADMIN"&&payload.role!=="STUDENT")return null;
    return { userId: payload.sub, role: payload.role, name: typeof payload.name==="string"?payload.name:"" };
  } catch { return null; }
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return db.user.findUnique({ where: { id: session.userId }, select: { id: true, name: true, email: true, phone: true, role: true, avatarUrl: true } });
}

export async function requireUser() { const user = await getCurrentUser(); if (!user) redirect("/login"); return user; }
export async function requireAdmin() { const user = await requireUser(); if (user.role !== "ADMIN") redirect("/"); return user; }
export async function requireApiUser() { const user = await getCurrentUser(); if (!user) fail(401, "Bạn cần đăng nhập"); return user; }
export async function requireApiAdmin() { const user = await requireApiUser(); if (user.role !== "ADMIN") fail(403, "Bạn không có quyền quản trị"); return user; }
