import { requireApiUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiError, fail } from "@/lib/http";
import { NextResponse } from "next/server";
import { z } from "zod";
import { TOOLS_SLUG } from "@/lib/access";

export async function POST(req:Request){try{
  const user=await requireApiUser();
  const{courseId}=z.object({courseId:z.string().cuid()}).parse(await req.json());
  const course=await db.course.findFirst({where:{id:courseId,status:"PUBLISHED"},select:{id:true,slug:true,price:true,courseCode:true,enrollments:{where:{userId:user.id},select:{status:true},take:1},orders:{where:{userId:user.id,status:"PENDING",expiresAt:{gt:new Date()}},orderBy:{createdAt:"desc"},take:1}}});
  if(!course)fail(404,"Không tìm thấy khóa học");
  if(!course.courseCode)fail(409,"Khóa học chưa được thiết lập mã");
  const enrollment=course.enrollments[0];
  if(enrollment?.status==="ACTIVE"||enrollment?.status==="COMPLETED")fail(409,"Bạn đã sở hữu khóa học này");
  const transferContent=`${user.phone}_${course.courseCode}`;
  const pending=course.orders[0];
  if(pending)return NextResponse.json(pending);
  const amount=course.price??0;
  const expiry=Math.max(30,Number(process.env.ORDER_EXPIRY_MINUTES||43200));
  const orderCode=`HTG${Date.now().toString(36).toUpperCase()}${crypto.randomUUID().slice(0,6).toUpperCase()}`;
  if(course.slug!==TOOLS_SLUG&&course.price!==null&&Number(amount)===0){const order=await db.$transaction(async tx=>{const row=await tx.order.create({data:{orderCode,userId:user.id,courseId,amount,transferContent,status:"PAID",paidAt:new Date(),expiresAt:new Date(Date.now()+expiry*60_000)}});await tx.enrollment.upsert({where:{userId_courseId:{userId:user.id,courseId}},create:{userId:user.id,courseId},update:{status:"ACTIVE",completedAt:null}});return row});return NextResponse.json(order,{status:201})}
  const order=await db.order.create({data:{orderCode,userId:user.id,courseId,amount,transferContent,expiresAt:new Date(Date.now()+expiry*60_000)}});
  return NextResponse.json(order,{status:201});
}catch(e){return apiError(e)}}
