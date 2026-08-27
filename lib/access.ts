import { db } from "./db";
export const TOOLS_SLUG="huong-dan-su-dung-bo-cong-cu-htg";

export async function canAccessCourse(userId: string, courseId: string, isAdmin = false) {
  if (isAdmin) return true;
  const course = await db.course.findUnique({ where: { id: courseId }, select: { price: true,slug:true } });
  if (!course) return false;
  // The tools course is independent: access must be granted explicitly by an
  // admin, regardless of its displayed price or the user's K2 enrollment.
  if (course.slug === TOOLS_SLUG) {
    return !!(await db.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } }, select: { status: true } }))?.status.match(/ACTIVE|COMPLETED/);
  }
  if (course.price !== null && Number(course.price) === 0) return true;
  return !!(await db.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } }, select: { status: true } }))?.status.match(/ACTIVE|COMPLETED/);
}

export async function courseProgress(userId: string, courseId: string) {
  const lessons = await db.lesson.findMany({ where: { section: { courseId } }, select: { id: true } });
  const completed = lessons.length ? await db.lessonProgress.count({ where: { userId, lessonId: { in: lessons.map(l => l.id) }, completed: true } }) : 0;
  return { completed, total: lessons.length, percent: lessons.length ? Math.round(completed * 100 / lessons.length) : 0 };
}
