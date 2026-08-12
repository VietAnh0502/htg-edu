import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, ShieldCheck } from "lucide-react";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://taitranhtg.vercel.app"),
  title: { default: "HTG EDU — Học đầu tư bài bản", template: "%s | HTG EDU" },
  description: "Nền tảng học tập trực tuyến dành cho nhà đầu tư với các khóa học có hệ thống và lộ trình ứng dụng thực tế.",
  openGraph: { title: "HTG EDU — Học đầu tư bài bản", description: "Nền tảng học tập trực tuyến dành cho nhà đầu tư.", type: "website", locale: "vi_VN" },
  twitter: { card: "summary", title: "HTG EDU — Học đầu tư bài bản", description: "Nền tảng học tập trực tuyến dành cho nhà đầu tư." },
};
export const dynamic = "force-dynamic";

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="vi"><body>
    <Header/>{children}
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand footer-brand-link"><Image src="/images/htgedu-logo.png" alt="HTG EDU" width={68} height={68}/><span><b>HTG</b> EDU<small>Kiến thức tỉnh thức</small></span></Link>
            <p>Nền tảng đào tạo trực tuyến giúp nhà đầu tư học đúng kiến thức, theo đúng lộ trình và xây dựng năng lực ra quyết định độc lập.</p>
          </div>
          <div><b>Khám phá</b><p><Link href="/courses">Tất cả khóa học</Link></p><p><Link href="/#categories">Danh mục đào tạo</Link></p><p><Link href="/#instructors">Chuyên gia</Link></p></div>
          <div><b>HTG EDU</b><p><Link href="/courses">Chương trình đào tạo</Link></p><p><Link href="/#instructors">Giảng viên</Link></p><p><Link href="/#categories">Danh mục</Link></p></div>
          <div><b>Liên hệ</b><p><Mail size={15}/> support@htgedu.vn</p><p><MapPin size={15}/> Việt Nam</p><p><ShieldCheck size={15}/> Thanh toán an toàn</p></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} HTG EDU.</span><span>Nội dung phục vụ mục đích giáo dục, không phải khuyến nghị đầu tư.</span></div>
      </div>
    </footer>
  </body></html>;
}
