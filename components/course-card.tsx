import Link from "next/link";
import { ArrowRight, BookOpen, Hash, ImageIcon, UserRound } from "lucide-react";

type C={slug:string;courseCode:string|null;title:string;shortDescription:string;thumbnailUrl:string|null;price:unknown;instructor:{name:string};category:{name:string};sections:{lessons:unknown[]}[]};

export function CourseCard({course}:{course:C}) {
  const lessons=course.sections.flatMap(s=>s.lessons);
  const isFree=course.price!==null&&Number(course.price)===0;
  return <article className="course-card">
    <Link href={`/courses/${course.slug}`} className="course-cover" style={course.thumbnailUrl?{backgroundImage:`url(${course.thumbnailUrl})`}:undefined}>
      {!course.thumbnailUrl&&<span className="course-placeholder"><ImageIcon size={32}/></span>}
      <span className="course-category">{course.category.name}</span>
    </Link>
    <div className="course-body">
      <span className="course-instructor"><UserRound size={14}/>{course.instructor.name}{course.courseCode&&<><Hash size={13}/>{course.courseCode}</>}</span>
      <h3><Link href={`/courses/${course.slug}`}>{course.title}</Link></h3>
      <p>{course.shortDescription}</p>
      <div className="course-meta"><span><BookOpen size={14}/>{lessons.length} bài học</span></div>
      <div className="course-footer">
        <div><strong>{isFree?"Miễn phí · Cần học K2":"Liên hệ"}</strong></div>
        <Link href={`/courses/${course.slug}`} aria-label={`Xem khóa học ${course.title}`}>Xem chi tiết <ArrowRight size={16}/></Link>
      </div>
    </div>
  </article>;
}
