import { ArrowRight, Award, BookOpenCheck, Eye, GraduationCap } from "lucide-react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getProtectedCourseContent } from "@/lib/course-content";
import { db } from "@/lib/db";

export const metadata = { title: "Khóa học của tôi" };

export default async function MyCourses() {
  const user = await requireUser();
  const enrollments = await db.enrollment.findMany({
    where: { userId: user.id, status: { in: ["ACTIVE", "COMPLETED"] } },
    select: {
      id: true,
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          _count: { select: { questions: { where: { status: "ACTIVE" } } } },
          sections: { orderBy: { position: "asc" }, select: { lessons: { orderBy: { position: "asc" }, take: 1, select: { id: true } } } },
          examAttempts: {
            where: { userId: user.id, status: { in: ["SUBMITTED", "EXPIRED"] } },
            select: { id: true, attemptNumber: true, status: true, correctCount: true, score: true, passed: true, submittedAt: true, _count: { select: { questions: true } } },
            orderBy: { attemptNumber: "desc" },
          },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  return <main className="app-shell">
    <section className="page-hero"><div className="container"><p className="eyebrow" style={{ color: "#6ee7b7" }}>Không gian học tập</p><h1>Chào {user.name.split(" ").slice(-1)},<br/>khóa học của bạn.</h1><p style={{ color: "#b8d2c8" }}>Xem video, giáo trình và tham gia bài thi cuối khóa bất cứ lúc nào.</p></div></section>
    <section className="section" style={{ paddingTop: 55 }}><div className="container">
      <div className="section-head"><div><p className="eyebrow">Nội dung đã được mở khóa</p><h2 className="section-title" style={{ fontSize: 38 }}>Khóa học của tôi</h2></div><Link href="/courses" className="btn btn-outline">Khám phá thêm <ArrowRight size={16}/></Link></div>
      <div className="student-course-list">{enrollments.length === 0
        ? <div className="card empty-course-card"><span className="icon-box"><GraduationCap/></span><h3>Bắt đầu khóa học đầu tiên</h3><p className="muted">Bạn chưa sở hữu khóa học nào.</p><Link href="/courses" className="btn btn-primary">Khám phá khóa học</Link></div>
        : enrollments.map(enrollment => {
          const firstLesson = enrollment.course.sections.flatMap(section => section.lessons)[0];
          const content = getProtectedCourseContent(enrollment.course.slug);
          const sessions = content?.sessions ?? [];
          return <article className="card student-course-card" key={enrollment.id}>
            <span className="icon-box"><BookOpenCheck/></span>
            <div><span className="badge">Đã mở khóa</span><h2>{enrollment.course.title}</h2><p className="muted">{sessions.length > 0 ? `${sessions.length} buổi học · Chọn buổi để vào học trực tiếp.` : "Toàn bộ video, giáo trình và lịch sử thi được lưu tại đây."}</p></div>
            <div className="student-course-actions">
              {firstLesson && sessions.length > 0
                ? <div className="student-session-picker"><span className="student-session-label">Chọn buổi học</span><div className="student-session-links">{sessions.map((session, index) => <Link className="session-chip" href={`/learn/${enrollment.course.slug}/${firstLesson.id}?session=${index + 1}`} key={session.title}><span>{String(index + 1).padStart(2, "0")}</span>{session.title}<ArrowRight size={14}/></Link>)}</div></div>
                : firstLesson && <Link className="btn btn-primary" href={`/learn/${enrollment.course.slug}/${firstLesson.id}`}>Vào khóa học <ArrowRight size={16}/></Link>}
              {enrollment.course._count.questions > 0 && <Link className="btn btn-outline" href={`/exam/${enrollment.course.id}`}><Award size={16}/> Làm bài thi</Link>}
            </div>
            {enrollment.course.examAttempts.length > 0 && <section className="course-attempt-history"><div className="course-attempt-heading"><h3>Lịch sử bài thi</h3><span>{enrollment.course.examAttempts.length} lần đã hoàn thành</span></div><div className="course-attempt-list">{enrollment.course.examAttempts.map(attempt => <article key={attempt.id}><div><b>Lần {attempt.attemptNumber}</b><small>{attempt.submittedAt?.toLocaleString("vi-VN")}</small></div><span>Đúng {attempt.correctCount ?? 0}/{attempt._count.questions} · {attempt.score ?? 0}/100</span><strong className={attempt.status === "EXPIRED" || !attempt.passed ? "is-failed" : "is-passed"}>{attempt.status === "EXPIRED" ? "Hết giờ" : attempt.passed ? "Đạt" : "Không đạt"}</strong><Link className="btn btn-outline btn-compact" href={`/exam-results/${attempt.id}`}><Eye size={14}/> Xem chi tiết</Link></article>)}</div></section>}
          </article>;
        })}
      </div>
    </div></section>
  </main>;
}
