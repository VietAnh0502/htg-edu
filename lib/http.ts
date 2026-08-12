import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiError(error: unknown) {
  if (error instanceof ZodError) return NextResponse.json({ error: "Dữ liệu không hợp lệ", details: error.flatten() }, { status: 400 });
  if (error instanceof Error && error.message.startsWith("HTTP:")) {
    const [, status, message] = error.message.split(":");
    return NextResponse.json({ error: message }, { status: Number(status) });
  }
  console.error(error);
  return NextResponse.json({ error: "Có lỗi xảy ra. Vui lòng thử lại." }, { status: 500 });
}
export function fail(status: number, message: string): never {
  throw new Error(`HTTP:${status}:${message}`);
}
