# HTG EDU LMS

LMS production-ready xây bằng Next.js App Router, TypeScript, PostgreSQL và Prisma. Hệ thống có xác thực cookie JWT HttpOnly, phân quyền Student/Admin phía server, đăng ký khóa học qua Zalo và Admin mở khóa thủ công, lưu tiến độ từng bài và thi cuối khóa chấm điểm phía server.

## Chạy local

1. Sao chép `.env.example` thành `.env` và cấu hình PostgreSQL, `AUTH_SECRET` (tạo bằng `openssl rand -base64 32`) cùng thông tin ngân hàng.
2. `npm install`
3. `npx prisma migrate dev --name init`
4. Chỉ khi cần dữ liệu khởi đầu: `SEED_ADMIN_PASSWORD='mật-khẩu-an-toàn' npm run db:seed`. Hãy đổi email/số điện thoại quản trị sau lần đăng nhập đầu tiên.
5. `npm run dev`

Không chạy seed trên dữ liệu thật nếu không muốn tạo khóa học mẫu. File/video được lưu tại object storage hoặc nền tảng video, database chỉ giữ URL.

## Deploy Vercel

- Tạo PostgreSQL managed database (Neon, Supabase, Vercel Postgres hoặc dịch vụ tương đương).
- Import repository vào Vercel và thêm toàn bộ biến trong `.env.example` ở Project Settings.
- Chạy migration production bằng `npm run db:deploy` trong CI hoặc máy quản trị trước khi phát hành.
- Build command: `npm run build`; output mặc định Next.js.
- Cấu hình domain, cập nhật `NEXT_PUBLIC_APP_URL`, bật HTTPS và kết nối SMTP/object storage thực tế.

## Vận hành

Rate limit trong bộ nhớ phù hợp local/single instance. Production serverless nên thay `lib/rate-limit.ts` bằng Redis/KV (Upstash/Vercel KV). Tích hợp SMTP tại API quên mật khẩu trước khi mở cho người dùng thật. Thông tin bí mật chỉ đặt trong Environment Variables hoặc secret manager, không commit vào Git.
