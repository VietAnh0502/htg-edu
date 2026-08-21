import { requireApiUser } from "@/lib/auth";
import { canAccessCourse } from "@/lib/access";
import { db } from "@/lib/db";
import { apiError,fail } from "@/lib/http";
import { NextResponse } from "next/server";
import { z } from "zod";
import { shuffleQuestionOptions } from "@/lib/exam-options";

const questionInclude={questions:{orderBy:{position:"asc" as const},include:{question:{select:{id:true,content:true,optionA:true,optionB:true,optionC:true,optionD:true}}}}};
const shuffled=<T extends{ id:string;questions:Array<{question:{id:string;content:string;optionA:string;optionB:string;optionC:string;optionD:string}}> }>(attempt:T)=>({...attempt,questions:attempt.questions.map(row=>({...row,question:shuffleQuestionOptions(row.question,attempt.id)}))});
export async function POST(req:Request){try{
  const user=await requireApiUser();const{courseId}=z.object({courseId:z.string().cuid()}).parse(await req.json());
  if(!(await canAccessCourse(user.id,courseId,user.role==="ADMIN")))fail(403,"Bạn chưa được cấp quyền");
  const course=await db.course.findUnique({where:{id:courseId},select:{examDurationMinutes:true,maxAttempts:true}});if(!course)fail(404,"Không tìm thấy khóa học");
  await db.examAttempt.updateMany({where:{userId:user.id,courseId,status:"IN_PROGRESS",expiresAt:{lte:new Date()}},data:{status:"EXPIRED",submittedAt:new Date(),correctCount:0,score:0,passed:false}});
  const existing=await db.examAttempt.findFirst({where:{userId:user.id,courseId,status:"IN_PROGRESS"},include:questionInclude});if(existing)return NextResponse.json(shuffled(existing));
  const attempts=await db.examAttempt.count({where:{userId:user.id,courseId}});if(attempts>=course.maxAttempts)fail(403,"Bạn đã sử dụng hết số lần thi");
  const pool=await db.question.findMany({where:{courseId,status:"ACTIVE"},select:{id:true}});if(pool.length===0)fail(400,"Khóa học chưa có câu hỏi trắc nghiệm");
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
  const attempt=await db.examAttempt.create({data:{userId:user.id,courseId,attemptNumber:attempts+1,expiresAt:new Date(Date.now()+course.examDurationMinutes*60_000),questions:{create:pool.slice(0,30).map((q,i)=>({questionId:q.id,position:i+1}))}},include:questionInclude});
  return NextResponse.json(shuffled(attempt),{status:201});
}catch(e){return apiError(e)}}
