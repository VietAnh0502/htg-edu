import Link from "next/link";
import { LogIn } from "lucide-react";
import { AuthForm, RegisteredNotice } from "@/components/interactive";

export const metadata = { title: "Đăng nhập" };

export default function Login() {
  return <main className="auth-page">
    <section className="auth-brand"><p className="eyebrow" style={{color:"#6ee7b7"}}>HTG EDU</p><h2>Tiếp tục lộ trình học tập của bạn.</h2><p style={{color:"#b8d2c8",maxWidth:520}}>Đăng nhập để truy cập khóa học, theo dõi tiến độ và quản lý tài khoản.</p></section>
    <section className="auth-wrap"><div className="card auth-card"><span className="icon-box"><LogIn/></span><h1 style={{marginTop:18}}>Đăng nhập</h1><p className="muted">Chào mừng bạn quay lại HTG EDU.</p><RegisteredNotice/><AuthForm mode="login"/><p style={{textAlign:"center",marginTop:20}}><Link href="/forgot-password" className="muted">Quên mật khẩu?</Link></p><p style={{textAlign:"center"}}>Chưa có tài khoản? <Link href="/register" className="text-link">Đăng ký</Link></p></div></section>
  </main>;
}
