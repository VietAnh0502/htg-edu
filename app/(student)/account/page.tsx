import { CreditCard, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { money } from "@/lib/format";

export default async function Account() {
  const user = await requireUser();
  const [orders, enrollments] = await Promise.all([
    db.order.findMany({ where: { userId: user.id }, include: { course: { select: { title: true } } }, orderBy: { createdAt: "desc" } }),
    db.enrollment.count({ where: { userId: user.id } }),
  ]);
  return <main className="app-shell"><section className="page-hero"><div className="container"><p className="eyebrow" style={{color:"#6ee7b7"}}>Hồ sơ cá nhân</p><h1>Tài khoản của bạn</h1><p style={{color:"#b8d2c8"}}>Quản lý thông tin và các khóa học của bạn tại một nơi.</p></div></section><section className="section" style={{paddingTop:55}}><div className="container account-layout" style={{display:"grid",gridTemplateColumns:"320px minmax(0,1fr)",gap:24,alignItems:"start"}}><aside className="card" style={{padding:28}}><div className="icon-box" style={{width:68,height:68,borderRadius:22}}><UserRound size={30}/></div><h2 style={{marginBottom:5}}>{user.name}</h2><span className="badge"><ShieldCheck size={13}/>{user.role}</span><div style={{display:"grid",gap:13,marginTop:26,paddingTop:22,borderTop:"1px solid var(--line)",fontSize:14}}><span><Mail size={15} color="var(--green)" style={{display:"inline",marginRight:8}}/>{user.email}</span><span><Phone size={15} color="var(--green)" style={{display:"inline",marginRight:8}}/>{user.phone}</span><span>{enrollments} khóa học</span></div></aside><section className="card" style={{padding:26}}><div style={{display:"flex",alignItems:"center",gap:12}}><span className="icon-box"><CreditCard/></span><div><p className="eyebrow" style={{margin:0}}>Đăng ký</p><h2 style={{margin:0}}>Yêu cầu mở khóa học</h2></div></div><div className="table-wrap" style={{marginTop:20}}><table className="table"><thead><tr><th>Nội dung đối chiếu</th><th>Khóa học</th><th>Học phí</th><th>Trạng thái</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td><b>{o.transferContent}</b></td><td>{o.course.title}</td><td>{money(String(o.amount))}</td><td><span className="badge">{o.status==="PENDING"?"Chờ xác nhận":o.status==="PAID"?"Đã mở khóa":o.status==="CANCELLED"?"Đã hủy":o.status}</span></td></tr>)}</tbody></table></div></section></div></section></main>;
}
