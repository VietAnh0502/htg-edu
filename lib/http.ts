import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export function apiError(error: unknown) {
  if (error instanceof ZodError) return NextResponse.json({ error: "Dữ liệu không hợp lệ", details: error.flatten() }, { status: 400 });
  if (error instanceof Error && error.message.startsWith("HTTP:")) {
    const [, status, ...parts] = error.message.split(":"); const message=parts.join(":");
    return NextResponse.json({ error: message }, { status: Number(status) });
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") return NextResponse.json({ error: "Dữ liệu này đã tồn tại" }, { status: 409 });
    if (error.code === "P2025") return NextResponse.json({ error: "Không tìm thấy dữ liệu" }, { status: 404 });
    if (error.code === "P2003") return NextResponse.json({ error: "Dữ liệu đang được sử dụng và không thể thay đổi" }, { status: 409 });
  }
  console.error(error);
  return NextResponse.json({ error: "Có lỗi xảy ra. Vui lòng thử lại." }, { status: 500 });
}
export function fail(status: number, message: string): never {
  throw new Error(`HTTP:${status}:${message}`);
}
