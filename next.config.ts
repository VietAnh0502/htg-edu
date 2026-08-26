import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  devIndicators: false,
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/api/[[...path]]": ["./khoahoc/*.pdf"],
  },
  async rewrites() {
    return [
      { source: "/account", destination: "/student/account" },
      { source: "/my-courses", destination: "/student/my-courses" },
      { source: "/checkout/:orderCode", destination: "/student/checkout/:orderCode" },
      { source: "/exam-results/:attemptId", destination: "/student/exam-results/:attemptId" },
      { source: "/exam/:courseId", destination: "/student/exam/:courseId" },
      { source: "/learn/:courseSlug/:lessonId", destination: "/student/learn/:courseSlug/:lessonId" },
    ];
  },
  async headers() {
    return [{ source: "/(.*)", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
    ] }];
  }
};
export default nextConfig;
