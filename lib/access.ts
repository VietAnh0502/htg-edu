import { db } from "./db";
export const K2_SLUG="k2-coaching-htg-2026",TOOLS_SLUG="huong-dan-su-dung-bo-cong-cu-htg";

export async function syncDependentCourseAccess(userId:string){const courses=await db.course.findMany({where:{slug:{in:[K2_SLUG,TOOLS_SLUG]}},select:{id:true,slug:true}});const k2=courses.find(c=>c.slug===K2_SLUG),tools=courses.find(c=>c.slug===TOOLS_SLUG);if(!k2||!tools)return false;const source=await db.enrollment.findUnique({where:{userId_courseId:{userId,courseId:k2.id}},select:{status:true}});const eligible=source?.status==="ACTIVE"||source?.status==="COMPLETED";if(eligible)await db.enrollment.upsert({where:{userId_courseId:{userId,courseId:tools.id}},create:{userId,courseId:tools.id},update:{status:"ACTIVE",completedAt:null}});else await db.enrollment.updateMany({where:{userId,courseId:tools.id,status:{in:["ACTIVE","COMPLETED"]}},data:{status:"REVOKED",completedAt:null}});return eligible}

export async function canAccessCourse(userId: string, courseId: string, isAdmin = false) {
  if (isAdmin) return true;
  const course = await db.course.findUnique({ where: { id: courseId }, select: { price: true,slug:true } });
  if (!course) return false;
  if(course.slug===TOOLS_SLUG)return syncDependentCourseAccess(userId);
  if (course.price !== null && Number(course.price) === 0) return true;
  return !!(await db.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } }, select: { status: true } }))?.status.match(/ACTIVE|COMPLETED/);
}

export async function courseProgress(userId: string, courseId: string) {
  const lessons = await db.lesson.findMany({ where: { section: { courseId } }, select: { id: true } });
  const completed = lessons.length ? await db.lessonProgress.count({ where: { userId, lessonId: { in: lessons.map(l => l.id) }, completed: true } }) : 0;
  return { completed, total: lessons.length, percent: lessons.length ? Math.round(completed * 100 / lessons.length) : 0 };
}
