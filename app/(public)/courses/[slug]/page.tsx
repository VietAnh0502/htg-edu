import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Award, BookOpen, CalendarDays, Check, CheckCircle2, ChevronDown, FileText, Gift, Hash, Headphones, ImageIcon, Layers3, LockKeyhole, Play, UserRound, Users, Video } from "lucide-react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

const K2_SLUG = "k2-coaching-htg-2026";
const K2_PREVIEW_IMAGE = "/images/tai-tran-coaching-k2-2026.jpg";

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata> {
  const {slug}=await params;
  const course=await db.course.findFirst({where:{slug,status:"PUBLISHED"},select:{title:true,shortDescription:true,thumbnailUrl:true}});
  if(!course)return {};
  const image=slug===K2_SLUG?K2_PREVIEW_IMAGE:course.thumbnailUrl;
  const url=`/courses/${slug}`;
  return {
    title:course.title,
    description:course.shortDescription,
    alternates:{canonical:url},
    openGraph:{
      type:"website",
      locale:"vi_VN",
      url,
      siteName:"HTG EDU",
      title:course.title,
      description:course.shortDescription,
      images:image?[{url:image,width:2400,height:1350,alt:course.title}]:undefined,
    },
    twitter:{
      card:"summary_large_image",
      title:course.title,
      description:course.shortDescription,
      images:image?[image]:undefined,
    },
  };
}

export default async function CourseDetail({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const course=await db.course.findFirst({where:{slug,status:"PUBLISHED"},include:{category:true,instructor:true,sections:{orderBy:{position:"asc"},include:{lessons:{orderBy:{position:"asc"},include:{resources:true}}}}}});
  if(!course)notFound();
  const lessons=course.sections.flatMap(s=>s.lessons);

  return <main className="app-shell course-detail-page">
    <section className="detail-hero"><div className="container">
      <Link href="/courses" className="back-link"><ArrowLeft size={16}/> Quay lại thư viện</Link>
      <div className="detail-hero-grid">
        <div className="detail-hero-content"><span className="detail-category">{course.category.name}</span><h1>{course.title}</h1><p>{course.shortDescription}</p><div className="detail-meta">{course.courseCode&&<span><Hash/>{course.courseCode}</span>}<span><UserRound/>{course.instructor.name}</span><span><Layers3/>{course.sections.length} chương</span><span><BookOpen/>{lessons.length} bài học</span></div></div>
        <div className="detail-thumbnail">{course.thumbnailUrl?<Image src={course.thumbnailUrl} alt={course.title} fill priority sizes="(max-width: 900px) 92vw, 44vw" className="cover-image"/>:<span><ImageIcon size={48}/>Ảnh khóa học đang cập nhật</span>}</div>
      </div>
    </div></section>

    <div className="container detail-layout">
      <article className="detail-main">
        <nav className="detail-tabs"><a href="#overview">Tổng quan</a><a href="#curriculum">Nội dung học</a><a href="#instructor">Giảng viên</a></nav>
        <section id="overview" className="detail-block"><p className="eyebrow">Giới thiệu khóa học</p><h2>Bạn sẽ học được gì?</h2><div className="rich-copy">{course.description}</div>
          <div className="learn-outcomes"><div><CheckCircle2/><span><b>Kiến thức có hệ thống</b>Nội dung được sắp xếp theo trình tự dễ tiếp thu.</span></div><div><CheckCircle2/><span><b>Ứng dụng thực tế</b>Kết nối kiến thức với tình huống của nhà đầu tư.</span></div><div><CheckCircle2/><span><b>Xây dựng nguyên tắc</b>Từng bước hoàn thiện phương pháp và khả năng ra quyết định độc lập.</span></div></div>
        </section>
        {slug===K2_SLUG&&<section className="detail-block k2-info-block"><div className="k2-info-heading"><div><p className="eyebrow">K2 Coaching cao cấp</p><h2>Sẵn sàng cho chu kỳ tài chính 2026–2030</h2></div><span className="k2-capacity"><Users/> Giới hạn 30 học viên</span></div><div className="k2-facts"><article><CalendarDays/><span><small>Thời gian dự kiến</small><b>19:00 · Thứ Bảy, 15/08/2026</b></span></article><article><Video/><span><small>Hình thức</small><b>Online qua YouTube riêng tư · Chuẩn 4K</b></span></article><article><UserRound/><span><small>Trực tiếp dẫn dắt</small><b>Tài Trần &amp; đội ngũ cố vấn HTG</b></span></article></div><div className="k2-benefits"><p className="eyebrow">Đặc quyền dành cho học viên K2</p><div><article><Video/><span><b>Video 4K trọn đời</b><small>Xem lại toàn bộ nội dung bài giảng bất cứ lúc nào.</small></span></article><article><Headphones/><span><b>Hỗ trợ chuyên môn 24/7</b><small>Đồng hành thực hành và hoàn thiện phương pháp giao dịch.</small></span></article><article><Gift/><span><b>Giáo trình bản cứng độc quyền</b><small>Kèm chữ ký Tài Trần, gửi tận nhà cùng quà lưu niệm.</small></span></article><article><Award/><span><b>Quyền lợi dành cho học viên sớm</b><small>10 học viên đầu tiên nhận một buổi coaching 1:1 thiết kế và cơ cấu danh mục cá nhân hóa.</small></span></article></div></div><p className="k2-note">Cổng đăng ký sẽ đóng khi đủ 30 học viên. Vui lòng liên hệ đội ngũ HTG để được xác nhận suất tham gia.</p></section>}
        <section className="detail-block audience-block"><p className="eyebrow">Đối tượng phù hợp</p><h2>Khóa học dành cho ai?</h2><div className="audience-box"><Check/><p>{course.targetAudience}</p></div></section>
        <section id="curriculum" className="detail-block curriculum-block"><div className="curriculum-title"><div><p className="eyebrow">Chương trình học</p><h2>Nội dung khóa học</h2></div><span>{course.sections.length} chương · {lessons.length} bài</span></div>
          <div className="curriculum-list">{course.sections.map(s=><details className="curriculum-item" key={s.id} open={s.position===1}><summary><span className="section-number">{String(s.position).padStart(2,"0")}</span><div><small>Chương {s.position}</small><b>{s.title}</b></div><span className="section-lessons">{s.lessons.length} bài <ChevronDown size={16}/></span></summary><div className="lesson-list">{s.lessons.map(l=><div key={l.id}><span className="lesson-icon"><Play size={13}/></span><span className="lesson-title">{l.title}{l.isPreview&&<em>Học thử</em>}</span></div>)}</div></details>)}</div>
        </section>
        <section id="instructor" className="instructor-detail-card"><div className="instructor-detail-photo"><Image src={course.instructor.avatarUrl||"/images/tai-tran-portrait.jpg"} alt={course.instructor.name} fill sizes="200px" className="cover-image"/></div><div><p className="eyebrow">Giảng viên khóa học</p><h2>{course.instructor.name}</h2><b>{course.instructor.title}</b><p>{course.instructor.bio}</p></div></section>
      </article>

      <aside className="purchase-card"><p className="purchase-label">Thông tin khóa học</p><div className="purchase-price"><strong>Liên hệ</strong></div><div className="purchase-action course-zalo-actions"><a className="btn btn-primary course-zalo-button" href="https://zalo.me/0393835398" target="_blank" rel="noopener noreferrer">Zalo Hải Anh HTG</a><a className="btn btn-primary course-zalo-button" href="https://zalo.me/0971025264" target="_blank" rel="noopener noreferrer">Zalo Minh Hải HTG</a></div><p className="purchase-note">Chọn một trong hai tư vấn viên để được hỗ trợ về chương trình và lịch khai giảng.</p><div className="purchase-includes"><b>Khóa học bao gồm</b><span><LockKeyhole/>Truy cập nội dung trọn đời</span><span><BookOpen/>{lessons.length} bài học trực tuyến</span><span><FileText/>Tài liệu học tập đi kèm</span></div></aside>
    </div>
  </main>;
}
