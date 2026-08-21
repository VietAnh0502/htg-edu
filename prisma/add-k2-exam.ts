import{PrismaClient}from"@prisma/client";
import{questions}from"./k2-questions";

const db=new PrismaClient();
async function main(){const course=await db.course.findUnique({where:{slug:"k2-coaching-htg-2026"},select:{id:true,title:true}});if(!course)throw new Error("Không tìm thấy khóa K2");const count=await db.question.count({where:{courseId:course.id}});if(count>0){console.log(`Giữ nguyên ${count} câu hỏi hiện có của ${course.title}.`);return}await db.$transaction([db.course.update({where:{id:course.id},data:{examDurationMinutes:45,passingScore:70,maxAttempts:3}}),db.question.createMany({data:questions.map(([content,optionA,optionB,optionC,optionD,correctOption],index)=>({courseId:course.id,content,optionA,optionB,optionC,optionD,correctOption,explanation:`Câu hỏi từ giáo trình K2, nhóm nội dung ${Math.min(8,Math.floor(index/4)+1)}.`,difficulty:index<10?"EASY" as const:index<23?"MEDIUM" as const:"HARD" as const}))})]);console.log(`Đã thêm ${questions.length} câu hỏi cho ${course.title}.`)}
main().finally(()=>db.$disconnect());
