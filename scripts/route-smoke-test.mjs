const baseUrl = (process.env.SMOKE_BASE_URL || "http://127.0.0.1:3001").replace(/\/$/, "");
const concurrency = Number(process.env.SMOKE_CONCURRENCY || 6);
const repeats = Number(process.env.SMOKE_REPEATS || 2);

async function fetchWithTimeout(path, init = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 35_000);
  const startedAt = performance.now();
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      redirect: "manual",
      ...init,
      signal: controller.signal,
    });
    const body = await response.text();
    return {
      path,
      status: response.status,
      durationMs: Math.round(performance.now() - startedAt),
      digest: body.match(/digest[\\\"]*:[\\\"]*(\d+)/)?.[1],
    };
  } finally {
    clearTimeout(timeout);
  }
}

const courseResponse = await fetchWithTimeout("/api/courses");
if (courseResponse.status !== 200) {
  throw new Error(`Không thể đọc danh sách khóa học: HTTP ${courseResponse.status}`);
}
const courses = await fetch(`${baseUrl}/api/courses`).then(response => response.json());

const routes = [
  "/",
  "/courses",
  "/courses?q=HTG",
  ...courses.map(course => `/courses/${course.slug}`),
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/account",
  "/my-courses",
  "/checkout/smoke-order",
  "/exam/smoke-course",
  "/exam-results/smoke-attempt",
  "/learn/smoke-course/smoke-lesson",
  "/admin",
  "/admin/students",
  "/admin/courses",
  "/admin/categories",
  "/admin/instructors",
  "/admin/payments",
  "/admin/questions",
  "/admin/results",
  "/admin/settings",
  "/api/courses",
  "/api/auth/me",
];

const jobs = Array.from({ length: repeats }, () => routes).flat();
const results = [];
let cursor = 0;

async function worker() {
  while (cursor < jobs.length) {
    const path = jobs[cursor++];
    try {
      results.push(await fetchWithTimeout(path));
    } catch (error) {
      results.push({ path, status: 0, durationMs: 35_000, error: String(error) });
    }
  }
}

await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length) }, worker));
results.sort((a, b) => a.path.localeCompare(b.path) || a.status - b.status);
console.table(results);

const failures = results.filter(result => ![200, 307, 308].includes(result.status));
if (failures.length) {
  throw new Error(`${failures.length}/${results.length} request route bị lỗi`);
}

console.log(`Đã kiểm tra ${results.length} request trên ${routes.length} route, không có lỗi HTTP.`);
