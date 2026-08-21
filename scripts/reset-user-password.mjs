import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const email=process.env.RESET_USER_EMAIL?.trim().toLowerCase();
const password=process.env.RESET_USER_PASSWORD;
if(!email||!password||password.length<12)throw new Error("Đặt RESET_USER_EMAIL và RESET_USER_PASSWORD (ít nhất 12 ký tự)");
const db=new PrismaClient();
try{const user=await db.user.update({where:{email},data:{passwordHash:await bcrypt.hash(password,12),resetTokenHash:null,resetTokenExpiresAt:null},select:{email:true,role:true}});console.log(`Đã đặt lại mật khẩu cho ${user.email} (${user.role})`)}finally{await db.$disconnect()}
