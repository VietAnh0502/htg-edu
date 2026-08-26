import { requireApiUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiError,fail } from "@/lib/http";
import { NextResponse } from "next/server";
import { z } from "zod";
import { displayedOption,originalOption } from "@/lib/exam-options";

const schema=z.object({answers:z.array(z.object({questionId:z.string().cuid(),selectedOption:z.enum(["A","B","C","D"])})).max(30)});
export async function POST(req:Request,{params}:{params:Promise<{attemptId:string}>}){try{
  const user=await requireApiUser();const{attemptId}=await params;const{answers}=schema.parse(await req.json());
  const attempt=await db.examAttempt.findUnique({where:{id:attemptId},include:{course:{select:{passingScore:true}},questions:{include:{question:{select:{id:true,correctOption:true}}}}}});
  if(!attempt||attempt.userId!==user.id)fail(404,"Không tìm thấy lần thi");if(attempt.status!=="IN_PROGRESS")fail(409,"Bài thi đã được nộp");
  const allowed=new Map(attempt.questions.map(q=>[q.questionId,q.question.correctOption]));const unique=new Map(answers.map(a=>[a.questionId,originalOption(attemptId,a.questionId,a.selectedOption)]));if([...unique.keys()].some(id=>!allowed.has(id)))fail(400,"Câu trả lời không thuộc đề thi");
  const correct=[...unique].filter(([id,option])=>allowed.get(id)===option).length;const score=Math.round(correct*100/attempt.questions.length);const expired=new Date()>attempt.expiresAt;const passed=!expired&&score>=attempt.course.passingScore;
  const result=await db.$transaction(async tx=>{if(unique.size)await tx.examAnswer.createMany({data:[...unique].map(([questionId,selectedOption])=>({attemptId,questionId,selectedOption,isCorrect:allowed.get(questionId)===selectedOption}))});return tx.examAttempt.update({where:{id:attemptId},data:{status:expired?"EXPIRED":"SUBMITTED",submittedAt:new Date(),correctCount:correct,score,passed},select:{id:true,correctCount:true,score:true,passed:true,status:true,submittedAt:true}})});
  const review=attempt.questions.map(({questionId,question})=>({questionId,correctOption:displayedOption(attemptId,questionId,question.correctOption as "A"|"B"|"C"|"D")}));
  return NextResponse.json({...result,review});
}catch(e){return apiError(e)}}
