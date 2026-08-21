import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { db } from "@/lib/db";
import { CourseCard } from "@/components/course-card";

export const metadata={title:"Thư viện khóa học"};
export const revalidate=300;
export default async function Courses({searchParams}:{searchParams:Promise<{q?:string;category?:string;sort?:string}>}) {
  const p=await searchParams;
  const [courses,categories]=await Promise.all([
    db.course.findMany({where:{status:"PUBLISHED",...(p.q?{OR:[{title:{contains:p.q,mode:"insensitive"}},{shortDescription:{contains:p.q,mode:"insensitive"}}]}:{}),...(p.category?{category:{slug:p.category}}:{})},orderBy:[{featured:"desc"},{createdAt:"desc"}],take:100,select:{id:true,title:true,slug:true,courseCode:true,shortDescription:true,thumbnailUrl:true,price:true,featured:true,category:{select:{name:true}},instructor:{select:{name:true}},sections:{select:{lessons:{select:{durationSeconds:true}}}}}}),
    db.category.findMany({orderBy:{name:"asc"}})
  ]);
  const activeCategory=categories.find(c=>c.slug===p.category);
  return <main className="app-shell courses-page">
    <section className="courses-hero"><div className="container"><p className="eyebrow">Thư viện HTG EDU</p><h1>Chọn khóa học phù hợp<br/>với mục tiêu của bạn.</h1><p>Khám phá các chương trình học dành cho nhà đầu tư, từ kiến thức nền tảng đến phương pháp và kỹ năng thực hành.</p></div></section>
    <div className="container"><form className="course-filter-card"><label className="search-field"><Search size={18}/><input className="input" name="q" defaultValue={p.q} placeholder="Tìm tên khóa học..."/></label><select className="select" name="category" defaultValue={p.category||""}><option value="">Tất cả danh mục</option>{categories.map(c=><option key={c.id} value={c.slug}>{c.name}</option>)}</select><button className="btn btn-primary"><SlidersHorizontal size={16}/> Tìm khóa học</button></form></div>
    <section className="section courses-results"><div className="container">
      <div className="results-heading"><div><span>{courses.length} khóa học</span><h2>{activeCategory?.name||(p.q?`Kết quả cho “${p.q}”`:"Tất cả khóa học")}</h2></div>{(p.q||p.category||p.sort)&&<Link href="/courses" className="clear-filter"><X size={15}/> Xóa bộ lọc</Link>}</div>
      {courses.length?<div className="grid-courses">{courses.map(c=><CourseCard key={c.slug} course={c}/>)}</div>:<div className="empty-state"><Search/><h3>Chưa tìm thấy khóa học phù hợp</h3><p>Hãy thử một từ khóa hoặc danh mục khác.</p><Link href="/courses" className="btn btn-outline">Xem tất cả khóa học</Link></div>}
    </div></section>
  </main>;
}
