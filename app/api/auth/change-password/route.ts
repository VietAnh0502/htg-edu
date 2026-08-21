import { requireApiUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiError, fail } from "@/lib/http";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema=z.object({currentPassword:z.string().min(1).max(72),newPassword:z.string().min(8).max(72)}).refine(v=>v.currentPassword!==v.newPassword,{message:"Mật khẩu mới phải khác mật khẩu hiện tại",path:["newPassword"]});
export async function POST(req:Request){try{const user=await requireApiUser();const data=schema.parse(await req.json());const row=await db.user.findUnique({where:{id:user.id},select:{passwordHash:true}});if(!row||!(await bcrypt.compare(data.currentPassword,row.passwordHash)))fail(400,"Mật khẩu hiện tại không đúng");await db.user.update({where:{id:user.id},data:{passwordHash:await bcrypt.hash(data.newPassword,12),resetTokenHash:null,resetTokenExpiresAt:null}});return NextResponse.json({ok:true});}catch(e){return apiError(e)}}
