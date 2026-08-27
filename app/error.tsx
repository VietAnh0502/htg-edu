"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Route render failed", error);
  }, [error]);

  return <main className="app-shell">
    <section className="section">
      <div className="container">
        <div className="card empty-state">
          <h1>Trang chưa tải được</h1>
          <p>Kết nối dữ liệu vừa bị gián đoạn. Bạn có thể thử tải lại ngay.</p>
          <button className="btn btn-primary" onClick={reset}>Thử lại</button>
        </div>
      </div>
    </section>
  </main>;
}
