import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, BookOpen, BookOpenCheck, CheckCircle2, Clock3, GraduationCap, Layers3, LineChart, Play, Sparkles, Target, TrendingUp, UserRound, Users } from "lucide-react";
import { CourseCard } from "@/components/course-card";
import { getCourseMajorSectionCount } from "@/lib/course-content";
import { getPublicCategories, getPublicHomeStats, getPublishedCourses } from "@/lib/public-data";

const categoryIcons = [TrendingUp, LineChart, BarChart3, Target, BookOpen, Layers3];
export const dynamic="force-dynamic";

export default async function Home() {
  // Resolve cache entries sequentially because the Supabase pool intentionally
  // exposes one connection per Prisma client.
  const courses=(await getPublishedCourses()).slice(0,6);
  const categories=(await getPublicCategories()).slice(0,6);
  const {instructor,studentCount}=await getPublicHomeStats();
  const featured=courses[0];
  const featuredChapterCount=featured?getCourseMajorSectionCount(featured.slug,featured.sections.length):0;

  return <main>
    <section className="edu-hero">
      <div className="container edu-hero-grid">
        <div className="edu-hero-copy reveal">
          <span className="hero-label"><Sparkles size={14}/> Nền tảng học tập dành cho nhà đầu tư</span>
          <h1>Học đầu tư <em>bài bản.</em><br/>Ra quyết định tự tin.</h1>
          <p>Khóa học được xây dựng theo lộ trình rõ ràng, kết hợp kiến thức nền tảng, bài học thực tế và phương pháp ứng dụng dành cho nhà đầu tư.</p>
          <div className="hero-actions"><Link href="/courses" className="btn btn-primary btn-lg">Khám phá khóa học <ArrowRight size={18}/></Link></div>
          <div className="hero-checks"><span><CheckCircle2/> Học trên mọi thiết bị</span><span><CheckCircle2/> Theo dõi tiến độ</span><span><CheckCircle2/> Kiểm tra cuối khóa</span></div>
        </div>
        {featured?<Link href={`/courses/${featured.slug}`} className="hero-course-card reveal delay-1">
          <div className="hero-course-image"><Image src={featured.thumbnailUrl||"/images/k1-cover.jpg"} alt={featured.title} fill priority sizes="(max-width: 900px) 92vw, 44vw" className="cover-image"/><span className="hero-course-play"><Play size={20} fill="currentColor"/></span></div>
          <div className="hero-course-content">
            <div className="hero-course-top"><span>{featured.category.name}</span><small>Khóa học nổi bật</small></div>
            <h2>{featured.title}</h2>
            <div className="hero-course-meta"><span><BookOpen size={14}/>{featuredChapterCount} chương</span><span><UserRound size={14}/>{featured.instructor.name}</span></div>
            <div className="hero-course-bottom"><strong>{featured.slug==="huong-dan-su-dung-bo-cong-cu-htg"?"Admin cấp quyền":featured.price!==null&&Number(featured.price)===0?"Miễn phí":"Liên hệ"}</strong><span>Xem khóa học <ArrowRight size={16}/></span></div>
          </div>
        </Link>:<div className="hero-empty-card"><GraduationCap size={52}/><b>Khóa học mới sắp ra mắt</b></div>}
      </div>
      <div className="container platform-stats">
        <div><b>{courses.length}</b><span>Khóa học đang mở</span></div><div><b>{categories.length}</b><span>Danh mục đào tạo</span></div><div><b>{studentCount}</b><span>Học viên đăng ký</span></div><div><b>24/7</b><span>Học mọi lúc, mọi nơi</span></div>
      </div>
    </section>

    <section id="featured" className="section featured-courses-section"><div className="container">
      <div className="section-head"><div><p className="eyebrow">Chương trình đào tạo</p><h2 className="section-title">Khóa học nổi bật</h2><p className="section-subtitle">Nội dung cô đọng, thực tế và được sắp xếp theo một lộ trình dễ theo dõi.</p></div><Link href="/courses" className="text-link">Xem tất cả khóa học <ArrowRight size={17}/></Link></div>
      {courses.length?<div className="grid-courses">{courses.map(c=><CourseCard key={c.id} course={c}/>)}</div>:<div className="empty-state"><BookOpenCheck/><h3>Khóa học đang được cập nhật</h3></div>}
    </div></section>

    <section className="section learning-benefits"><div className="container">
      <div className="benefit-intro"><p className="eyebrow">Một trải nghiệm học tập hoàn chỉnh</p><h2 className="section-title">Không chỉ xem video.<br/>Bạn học theo một hệ thống.</h2><p>Mỗi khóa học trên HTG EDU được tổ chức để bạn biết mình đang ở đâu, cần học gì tiếp theo và đã tiến bộ như thế nào.</p></div>
      <div className="benefit-grid">
        <article><span><BookOpenCheck/></span><b>Lộ trình rõ ràng</b><p>Chương, bài học và tài liệu được sắp xếp theo đúng trình tự cần thiết.</p></article>
        <article><span><Clock3/></span><b>Học linh hoạt</b><p>Tiếp tục bài học đang dở trên máy tính hoặc điện thoại bất cứ lúc nào.</p></article>
        <article><span><TrendingUp/></span><b>Theo dõi tiến độ</b><p>Tự động ghi nhận bài đã học và phần trăm hoàn thành của từng khóa.</p></article>
        <article><span><Target/></span><b>Tập trung ứng dụng</b><p>Kết nối tư duy, phương pháp và tình huống thực tế của thị trường Việt Nam.</p></article>
      </div>
    </div></section>

    <section id="categories" className="section categories-section"><div className="container">
      <div className="section-head"><div><p className="eyebrow">Học theo chủ đề</p><h2 className="section-title">Danh mục khóa học</h2><p className="section-subtitle">Tìm đúng nhóm kiến thức phù hợp với mục tiêu và giai đoạn đầu tư của bạn.</p></div></div>
      <div className="category-grid">{categories.map((c,i)=>{const Icon=categoryIcons[i%categoryIcons.length];return <Link href={`/courses?category=${c.slug}`} className="category-card" key={c.id}><span className="category-icon"><Icon/></span><div><h3>{c.name}</h3><p>{c.description||"Khóa học được thiết kế theo lộ trình thực tế."}</p></div><span className="category-count">{c._count.courses} khóa học <ArrowRight size={15}/></span></Link>})}</div>
    </div></section>

    <section className="section learning-flow"><div className="container">
      <div className="flow-heading"><p className="eyebrow">Bắt đầu rất đơn giản</p><h2 className="section-title">Từ chọn khóa học<br/>đến hoàn thành lộ trình.</h2></div>
      <div className="flow-steps">{[["01","Chọn khóa học","Xem mô tả, nội dung, giảng viên và chọn chương trình phù hợp."],["02","Liên hệ qua Zalo","Chọn Hải Anh HTG hoặc Minh Hải HTG để được hướng dẫn đăng ký."],["03","Nhận tư vấn","Đội ngũ HTG hỗ trợ thông tin chương trình và lịch khai giảng."],["04","Học và ứng dụng","Học theo lộ trình và từng bước ứng dụng phương pháp vào thực tế."]].map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
    </div></section>

    <section id="instructors" className="section instructor-section"><div className="container instructor-grid-home">
      <div className="instructor-photo"><Image src={instructor?.avatarUrl||"/images/tai-tran-portrait.jpg"} alt={instructor?.name||"Tài Trần"} fill sizes="(max-width: 800px) 92vw, 42vw" className="cover-image"/></div>
      <div className="instructor-content"><p className="eyebrow">Chuyên gia đồng hành</p><h2 className="section-title">Học cùng<br/>Tài Trần.</h2><p>{instructor?.bio||"Tài Trần là chuyên gia đầu tư và người xây dựng nội dung đào tạo tại HTG EDU. Các bài học tập trung vào tư duy, phương pháp và khả năng ứng dụng thực tế."}</p><div className="instructor-points"><span><CheckCircle2/> Nội dung trực tiếp xây dựng bởi chuyên gia</span><span><CheckCircle2/> Ví dụ gắn với thị trường Việt Nam</span><span><CheckCircle2/> Tập trung vào năng lực tự ra quyết định</span></div><Link href="/courses" className="btn btn-primary">Xem khóa học của Tài Trần <ArrowRight size={17}/></Link></div>
    </div></section>

    <section className="section home-cta"><div className="container"><div className="cta-card"><div><p className="eyebrow">Tìm chương trình phù hợp</p><h2>Khám phá lộ trình học<br/>dành cho nhà đầu tư.</h2></div><div><p>Xem nội dung từng khóa học và liên hệ HTG EDU để được tư vấn chi tiết.</p><Link href="/courses" className="btn btn-primary btn-lg">Xem khóa học <ArrowRight size={18}/></Link></div></div></div></section>
  </main>;
}
