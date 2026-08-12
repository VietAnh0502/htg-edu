import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

export async function Header() {
  return <header className="site-header">
    <div className="container header-inner">
      <Link href="/" className="brand" aria-label="HTG EDU - Trang chủ">
        <Image src="/images/htgedu-logo.png" alt="HTG EDU" width={66} height={66} priority className="brand-logo"/>
        <span><b>HTG</b> EDU<small>Kiến thức tỉnh thức</small></span>
      </Link>
      <nav className="nav desktop-nav" aria-label="Điều hướng chính">
        <Link href="/">Trang chủ</Link>
        <Link href="/courses">Khóa học</Link>
        <Link href="/#categories">Danh mục</Link>
        <Link href="/#instructors">Chuyên gia</Link>
      </nav>
      <details className="mobile-menu">
        <summary aria-label="Mở menu"><Menu size={22}/></summary>
        <div className="mobile-menu-panel">
          <Link href="/">Trang chủ</Link><Link href="/courses">Khóa học</Link><Link href="/#categories">Danh mục</Link><Link href="/#instructors">Chuyên gia</Link>
        </div>
      </details>
    </div>
  </header>;
}
