import { requireApiUser } from "@/lib/auth";
import { canAccessCourse } from "@/lib/access";
import { db } from "@/lib/db";
import { apiError, fail } from "@/lib/http";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req:Request){try{
  const user=await requireApiUser();
  const data=z.object({lessonId:z.string().cuid(),completed:z.boolean().optional(),lastPosition:z.number().int().min(0).max(86400).optional()}).parse(await req.json());
  const lesson=await db.lesson.findUnique({where:{id:data.lessonId},select:{section:{select:{courseId:true}}}});
  if(!lesson)fail(404,"Không tìm thấy bài học");const courseId=lesson.section.courseId;
  if(!(await canAccessCourse(user.id,courseId,user.role==="ADMIN")))fail(403,"Bạn chưa được cấp quyền học khóa này");
  const progress=await db.lessonProgress.upsert({where:{userId_lessonId:{userId:user.id,lessonId:data.lessonId}},create:{userId:user.id,lessonId:data.lessonId,completed:data.completed??false,completedAt:data.completed?new Date():null,lastPosition:data.lastPosition??0},update:{...(data.completed!==undefined?{completed:data.completed,completedAt:data.completed?new Date():null}:{}),...(data.lastPosition!==undefined?{lastPosition:data.lastPosition}:{})}});
  const[total,done]=await Promise.all([db.lesson.count({where:{section:{courseId}}}),db.lessonProgress.count({where:{userId:user.id,completed:true,lesson:{section:{courseId}}}})]);
  if(user.role!=="ADMIN")await db.enrollment.updateMany({where:{userId:user.id,courseId,status:{not:"REVOKED"}},data:done===total&&total>0?{status:"COMPLETED",completedAt:new Date()}:{status:"ACTIVE",completedAt:null}});
  return NextResponse.json({progress,courseProgress:{completed:done,total,percent:total?Math.round(done*100/total):0}});
}catch(e){return apiError(e)}}
