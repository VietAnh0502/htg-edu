import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, ExternalLink, Headphones, MessageCircle, ShieldCheck, UserRound } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { money } from "@/lib/format";
import { notFound } from "next/navigation";

const contacts=[
  {name:"Hải Anh HTG",phone:"0393 835 398",href:"https://zalo.me/0393835398"},
  {name:"Minh Hải HTG",phone:"0971 025 264",href:"https://zalo.me/0971025264"},
];

export default async function Checkout({params}:{params:Promise<{orderCode:string}>}){
  const user=await requireUser();
  const{orderCode}=await params;
  const order=await db.order.findUnique({where:{orderCode},include:{course:true}});
  if(!order||order.userId!==user.id)notFound();
  const activated=order.status==="PAID";
  return <main className="app-shell contact-checkout-page">
    <section className="contact-checkout-hero"><div className="container"><p className="eyebrow">Hoàn tất đăng ký khóa học</p><h1>{activated?"Khóa học đã được mở":"Liên hệ HTG EDU qua Zalo"}</h1><p>{activated?"Bạn có thể bắt đầu học ngay trong khu vực khóa học của tôi.":"Chọn một trong hai tư vấn viên bên dưới để trao đổi thanh toán và kích hoạt khóa học."}</p></div></section>
    <div className="container contact-checkout-layout">
      <section className="registration-summary">
        <div className="summary-heading"><span className="icon-box"><ShieldCheck/></span><div><p className="eyebrow">Thông tin yêu cầu</p><h2>Đăng ký khóa học</h2></div></div>
        <dl><dt>Học viên</dt><dd>{user.name}</dd><dt>Số điện thoại</dt><dd>{user.phone}</dd><dt>Khóa học</dt><dd>{order.course.title}</dd><dt>Mã khóa học</dt><dd><code>{order.course.courseCode}</code></dd><dt>Học phí</dt><dd className="summary-price">{money(String(order.amount))}</dd><dt>Nội dung chuyển khoản</dt><dd><code>{order.transferContent}</code></dd><dt>Trạng thái</dt><dd><span className={`request-status ${activated?"is-active":"is-pending"}`}>{activated?"Đã mở khóa":"Chờ Admin xác nhận"}</span></dd></dl>
        {!activated&&<div className="contact-instruction"><MessageCircle/><div><b>Nội dung chuyển khoản cần ghi chính xác:</b><p><strong>{order.transferContent}</strong>. Hãy liên hệ 1 trong 2 bạn trợ lí bên dưới để được hỗ trợ cụ thể nhé!</p></div></div>}
        {activated&&<div className="activated-box"><CheckCircle2/><div><b>Kích hoạt thành công</b><p>Khóa học đã được thêm vào tài khoản của bạn.</p><Link href="/my-courses" className="btn btn-primary">Vào khóa học của tôi <ArrowRight size={17}/></Link></div></div>}
      </section>

      <aside className="zalo-contact-card">
        <div className="zalo-card-heading"><span><Headphones/></span><div><p className="eyebrow">Hỗ trợ đăng ký</p><h2>Chọn người liên hệ</h2></div></div>
        {activated?<p className="contact-complete-note">Bạn không cần liên hệ lại. Nếu cần hỗ trợ, bạn vẫn có thể nhắn cho đội ngũ HTG EDU.</p>:<p className="zalo-intro">Bạn có thể chọn bất kỳ một trong hai liên hệ. Sau khi trao đổi và thanh toán, Admin sẽ xác nhận để mở khóa học.</p>}
        <div className="zalo-options">{contacts.map(c=><a href={c.href} target="_blank" rel="noopener noreferrer" className="zalo-button" key={c.href}><span className="zalo-avatar"><UserRound/></span><span><b>Zalo {c.name}</b><small>{c.phone}</small></span><ExternalLink size={18}/></a>)}</div>
        {!activated&&<div className="waiting-note"><Clock3/><span><b>Sau khi thanh toán</b>Admin sẽ kiểm tra tin nhắn và mở khóa học tương ứng cho tài khoản của bạn.</span></div>}
      </aside>
    </div>
  </main>;
}
