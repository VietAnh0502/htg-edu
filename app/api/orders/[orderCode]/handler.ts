import { requireApiUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiError,fail } from "@/lib/http";
import { NextResponse } from "next/server";

export async function GET(_:Request,{params}:{params:Promise<{orderCode:string}>}){try{const user=await requireApiUser();const{orderCode}=await params;const order=await db.order.findUnique({where:{orderCode},include:{course:{select:{title:true}}}});if(!order||(order.userId!==user.id&&user.role!=="ADMIN"))fail(404,"Không tìm thấy yêu cầu đăng ký");return NextResponse.json({...order,amount:Number(order.amount),contacts:[{name:"Hải Anh HTG",url:"https://zalo.me/0393835398"},{name:"Minh Hải HTG",url:"https://zalo.me/0971025264"}]})}catch(e){return apiError(e)}}
