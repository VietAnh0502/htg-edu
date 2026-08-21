import { jwtVerify, SignJWT } from "jose";

const AUDIENCE = "htg-course-document";

function tokenSecret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET phải có ít nhất 32 ký tự");
  return new TextEncoder().encode(value);
}

export async function createDocumentToken(input: { userId: string; courseId: string; slug: string }) {
  return new SignJWT({ courseId: input.courseId, slug: input.slug })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(input.userId)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(tokenSecret());
}

export async function verifyDocumentToken(token: string) {
  const { payload } = await jwtVerify(token, tokenSecret(), { audience: AUDIENCE });
  if (
    !payload.sub ||
    typeof payload.courseId !== "string" ||
    typeof payload.slug !== "string"
  ) throw new Error("HTTP:401:Phiên tải tài liệu không hợp lệ");
  return { userId: payload.sub, courseId: payload.courseId, slug: payload.slug };
}
