import { redirect } from "next/navigation";

export const metadata = { title: "Đăng nhập" };

export default function Login() {
  redirect("/");
}
