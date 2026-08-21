import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  const user=session?{id:session.userId,name:session.name,role:session.role}:null;
  return NextResponse.json({ user }, { headers: { "Cache-Control": "private, no-store" } });
}
