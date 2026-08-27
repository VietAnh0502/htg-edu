import { NextResponse } from "next/server";
import * as adminCategories from "@/app/api/admin/categories/handler";
import * as adminCategory from "@/app/api/admin/categories/[id]/handler";
import * as adminCourses from "@/app/api/admin/courses/handler";
import * as adminCourse from "@/app/api/admin/courses/[id]/handler";
import * as adminEnrollments from "@/app/api/admin/enrollments/handler";
import * as adminInstructors from "@/app/api/admin/instructors/handler";
import * as adminInstructor from "@/app/api/admin/instructors/[id]/handler";
import * as adminOrderCancel from "@/app/api/admin/orders/[id]/cancel/handler";
import * as adminOrderConfirm from "@/app/api/admin/orders/[id]/confirm/handler";
import * as adminQuestions from "@/app/api/admin/questions/handler";
import * as adminQuestion from "@/app/api/admin/questions/[id]/handler";
import * as adminSettings from "@/app/api/admin/settings/handler";
import * as adminSetting from "@/app/api/admin/settings/[key]/handler";
import * as authChangePassword from "@/app/api/auth/change-password/handler";
import * as authForgotPassword from "@/app/api/auth/forgot-password/handler";
import * as authLogin from "@/app/api/auth/login/handler";
import * as authLogout from "@/app/api/auth/logout/handler";
import * as authMe from "@/app/api/auth/me/handler";
import * as authRegister from "@/app/api/auth/register/handler";
import * as authResetPassword from "@/app/api/auth/reset-password/handler";
import * as courseAccess from "@/app/api/courses/[id]/access/handler";
import * as courseDocument from "@/app/api/courses/[id]/document/handler";
import * as courses from "@/app/api/courses/handler";
import * as examSubmit from "@/app/api/exams/[attemptId]/submit/handler";
import * as examStart from "@/app/api/exams/start/handler";
import * as order from "@/app/api/orders/[orderCode]/handler";
import * as orders from "@/app/api/orders/handler";
import * as progress from "@/app/api/progress/handler";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

type HandlerModule = Record<string, unknown>;
type RouteContext = { params: Promise<Record<string, string>> };

async function invoke(module: HandlerModule, request: Request, params: Record<string, string> = {}) {
  const handler = module[request.method];
  if (typeof handler !== "function") return NextResponse.json({ error: "Phương thức không được hỗ trợ" }, { status: 405, headers: { Allow: Object.keys(module).filter(key => /^[A-Z]+$/.test(key)).join(", ") } });
  return handler(request, { params: Promise.resolve(params) } satisfies RouteContext);
}

async function route(request: Request, path: string[]) {
  const pathname = path.join("/");
  let match: RegExpMatchArray | null;

  if (pathname === "admin/categories") return invoke(adminCategories, request);
  if ((match = pathname.match(/^admin\/categories\/([^/]+)$/))) return invoke(adminCategory, request, { id: match[1] });
  if (pathname === "admin/courses") return invoke(adminCourses, request);
  if ((match = pathname.match(/^admin\/courses\/([^/]+)$/))) return invoke(adminCourse, request, { id: match[1] });
  if (pathname === "admin/enrollments") return invoke(adminEnrollments, request);
  if (pathname === "admin/instructors") return invoke(adminInstructors, request);
  if ((match = pathname.match(/^admin\/instructors\/([^/]+)$/))) return invoke(adminInstructor, request, { id: match[1] });
  if ((match = pathname.match(/^admin\/orders\/([^/]+)\/cancel$/))) return invoke(adminOrderCancel, request, { id: match[1] });
  if ((match = pathname.match(/^admin\/orders\/([^/]+)\/confirm$/))) return invoke(adminOrderConfirm, request, { id: match[1] });
  if (pathname === "admin/questions") return invoke(adminQuestions, request);
  if ((match = pathname.match(/^admin\/questions\/([^/]+)$/))) return invoke(adminQuestion, request, { id: match[1] });
  if (pathname === "admin/settings") return invoke(adminSettings, request);
  if ((match = pathname.match(/^admin\/settings\/([^/]+)$/))) return invoke(adminSetting, request, { key: match[1] });
  if (pathname === "auth/change-password") return invoke(authChangePassword, request);
  if (pathname === "auth/forgot-password") return invoke(authForgotPassword, request);
  if (pathname === "auth/login") return invoke(authLogin, request);
  if (pathname === "auth/logout") return invoke(authLogout, request);
  if (pathname === "auth/me") return invoke(authMe, request);
  if (pathname === "auth/register") return invoke(authRegister, request);
  if (pathname === "auth/reset-password") return invoke(authResetPassword, request);
  if (pathname === "courses") return invoke(courses, request);
  if ((match = pathname.match(/^courses\/([^/]+)\/access$/))) return invoke(courseAccess, request, { id: match[1] });
  if ((match = pathname.match(/^courses\/([^/]+)\/document$/))) return invoke(courseDocument, request, { id: match[1] });
  if (pathname === "exams/start") return invoke(examStart, request);
  if ((match = pathname.match(/^exams\/([^/]+)\/submit$/))) return invoke(examSubmit, request, { attemptId: match[1] });
  if (pathname === "orders") return invoke(orders, request);
  if ((match = pathname.match(/^orders\/([^/]+)$/))) return invoke(order, request, { orderCode: match[1] });
  if (pathname === "progress") return invoke(progress, request);
  return NextResponse.json({ error: "Không tìm thấy API" }, { status: 404 });
}

type Context = { params: Promise<{ path?: string[] }> };
export async function GET(request: Request, context: Context) { return route(request, (await context.params).path ?? []); }
export async function POST(request: Request, context: Context) { return route(request, (await context.params).path ?? []); }
export async function PUT(request: Request, context: Context) { return route(request, (await context.params).path ?? []); }
export async function PATCH(request: Request, context: Context) { return route(request, (await context.params).path ?? []); }
export async function DELETE(request: Request, context: Context) { return route(request, (await context.params).path ?? []); }
