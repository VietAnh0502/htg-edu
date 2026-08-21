import Link from "next/link";
import { UserPlus } from "lucide-react";
import { AuthForm } from "@/components/interactive";

export const metadata = { title: "Đăng ký" };

export default function Register() {
  return <main className="auth-page">
    <section className="auth-brand"><p className="eyebrow" style={{color:"#6ee7b7"}}>Bắt đầu cùng HTG EDU</p><h2>Xây nền tảng đầu tư theo một lộ trình rõ ràng.</h2><p style={{color:"#b8d2c8",maxWidth:520}}>Tạo tài khoản để đăng ký khóa học và lưu tiến độ học tập.</p></section>
    <section className="auth-wrap"><div className="card auth-card"><span className="icon-box"><UserPlus/></span><h1 style={{marginTop:18}}>Tạo tài khoản</h1><p className="muted">Điền thông tin chính xác để nhận hỗ trợ khi cần.</p><AuthForm mode="register"/><p style={{textAlign:"center",marginTop:20}}>Đã có tài khoản? <Link href="/login" className="text-link">Đăng nhập</Link></p></div></section>
  </main>;
}
