import { Award } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ProtectedCourseContent } from "@/components/protected-course-content";
import { canAccessCourse } from "@/lib/access";
import { requireUser } from "@/lib/auth";
import { getProtectedCourseContent } from "@/lib/course-content";
import { db } from "@/lib/db";
import { createDocumentToken } from "@/lib/document-token";

export default async function Learn({ params, searchParams }: {
  params: Promise<{ courseSlug: string; lessonId: string }>;
  searchParams: Promise<{ session?: string }>;
}) {
  const user = await requireUser();
  const { courseSlug, lessonId } = await params;
  const query = await searchParams;
  const course = await db.course.findUnique({
    where: { slug: courseSlug },
    select: {
      id: true, title: true, slug: true,
      _count: { select: { questions: { where: { status: "ACTIVE" } } } },
      sections: { orderBy: { position: "asc" }, select: {
        id: true, title: true, position: true,
        lessons: { orderBy: { position: "asc" }, select: { id: true, title: true, position: true } },
      } },
    },
  });

  if (!course) notFound();
  if (!(await canAccessCourse(user.id, course.id, user.role === "ADMIN"))) redirect(`/courses/${course.slug}`);
  const lessons = course.sections.flatMap(section => section.lessons);
  if (!lessons.some(lesson => lesson.id === lessonId)) notFound();

  const content = getProtectedCourseContent(course.slug);
  const requestedSession = Number(query.session ?? "1");
  const sessionIndex = Number.isSafeInteger(requestedSession) && requestedSession >= 1 && requestedSession <= (content?.sessions.length ?? 1) ? requestedSession - 1 : 0;
  const selectedSession = content?.sessions[sessionIndex];
  const documentStartIndex = content?.sessions.slice(0, sessionIndex).reduce((total, session) => total + (session.pdfDocuments?.length ?? 0), 0) ?? 0;
  const [curriculumStart, curriculumEnd] = selectedSession?.curriculumRange ?? [0, content?.curriculum?.length ?? 0];
  const sessionCurriculum = content?.curriculum?.slice(curriculumStart, curriculumEnd);
  const documentToken = await createDocumentToken({ userId: user.id, courseId: course.id, slug: course.slug });
  const sessionHref = (index: number) => `/learn/${course.slug}/${lessonId}?session=${index + 1}`;

  return <main className="learning-page"><div className="learning-layout"><section className="lesson-content">
    <div className="learning-topbar"><Link href="/my-courses" className="lesson-back">← Khóa học của tôi</Link>{course._count.questions > 0 && <Link className="btn btn-primary" href={`/exam/${course.id}`}><Award size={16}/> Làm bài thi cuối khóa</Link>}</div>
    <h1>{course.title}</h1>
    {content && selectedSession ? <ProtectedCourseContent courseId={course.id} title={course.title} sessions={[{ ...selectedSession, pdfDocuments: selectedSession.pdfDocuments?.map(({ title }) => ({ title })) }]} documentToken={documentToken} documentStartIndex={documentStartIndex} fireantGuide={content.fireantGuide}/> : <p>Khóa học chưa có nội dung.</p>}
    {content && content.sessions.length > 1 && <nav className="session-navigation" aria-label="Điều hướng buổi học">
      {sessionIndex > 0 ? <Link className="btn btn-outline" href={sessionHref(sessionIndex - 1)}>← Buổi trước: {content.sessions[sessionIndex - 1].title}</Link> : <span/>}
      <b>{selectedSession?.title} / {content.sessions.length} buổi</b>
      {sessionIndex < content.sessions.length - 1 ? <Link className="btn btn-primary" href={sessionHref(sessionIndex + 1)}>Buổi tiếp theo: {content.sessions[sessionIndex + 1].title} →</Link> : <span/>}
    </nav>}
    <aside className="lesson-sidebar course-toc"><h2>Mục lục {selectedSession?.title ?? "khóa học"}</h2><p className="muted">Các mục được trích từ tài liệu PDF</p>
      {sessionCurriculum?.map((section, sectionIndex) => <section key={section.title}><h3>Tài liệu {curriculumStart + sectionIndex + 1}: {section.title}</h3>{section.items.map((title, index) => <div className="toc-item" key={title}>{index + 1}. {title}</div>)}</section>) ?? course.sections.map(section => <section key={section.id}><h3>Chương {section.position}: {section.title}</h3>{section.lessons.map(lesson => <div className="toc-item" key={lesson.id}>{lesson.position}. {lesson.title}</div>)}</section>)}
    </aside>
  </section></div></main>;
}
