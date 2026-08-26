import { notFound } from "next/navigation";
import Account from "@/app/(student)/_screens/account";
import Checkout from "@/app/(student)/_screens/checkout";
import ExamResult from "@/app/(student)/_screens/exam-result";
import Exam from "@/app/(student)/_screens/exam";
import Learn from "@/app/(student)/_screens/learn";
import MyCourses from "@/app/(student)/_screens/my-courses";

export const dynamic = "force-dynamic";

export default async function StudentPage({ params, searchParams }: {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<{ session?: string }>;
}) {
  const path = (await params).path ?? [];
  if (path.length === 1 && path[0] === "account") return Account();
  if (path.length === 1 && path[0] === "my-courses") return MyCourses();
  if (path.length === 2 && path[0] === "checkout") return Checkout({ params: Promise.resolve({ orderCode: path[1] }) });
  if (path.length === 2 && path[0] === "exam-results") return ExamResult({ params: Promise.resolve({ attemptId: path[1] }) });
  if (path.length === 2 && path[0] === "exam") return Exam({ params: Promise.resolve({ courseId: path[1] }) });
  if (path.length === 3 && path[0] === "learn") return Learn({ params: Promise.resolve({ courseSlug: path[1], lessonId: path[2] }), searchParams });
  notFound();
}
