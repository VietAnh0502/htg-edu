import { revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";
import { db } from "@/lib/db";

export const PUBLIC_DATA_TAG = "public-course-data";
const PUBLIC_DATA_TTL_SECONDS = 300;

export function revalidatePublicData() {
  revalidateTag(PUBLIC_DATA_TAG, "max");
}

export const getPublishedCourses = unstable_cache(
  async () => {
    const courses = await db.course.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 100,
      select: {
        id: true,
        title: true,
        slug: true,
        courseCode: true,
        shortDescription: true,
        thumbnailUrl: true,
        price: true,
        featured: true,
        category: { select: { name: true, slug: true } },
        instructor: { select: { name: true } },
        sections: {
          select: {
            _count: { select: { lessons: true } },
            lessons: { select: { durationSeconds: true } },
          },
        },
      },
    });

    // Prisma Decimal is converted before entering Next's persistent Data Cache.
    return courses.map(course => ({
      ...course,
      price: course.price?.toString() ?? null,
    }));
  },
  ["published-courses-v1"],
  { revalidate: PUBLIC_DATA_TTL_SECONDS, tags: [PUBLIC_DATA_TAG] },
);

export const getPublicCategories = unstable_cache(
  () => db.category.findMany({
    orderBy: { createdAt: "asc" },
    take: 100,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      _count: { select: { courses: { where: { status: "PUBLISHED" } } } },
    },
  }),
  ["public-categories-v1"],
  { revalidate: PUBLIC_DATA_TTL_SECONDS, tags: [PUBLIC_DATA_TAG] },
);

export const getPublicHomeStats = unstable_cache(
  async () => {
    const instructor = await db.instructor.findFirst({
      where: { name: { contains: "Tài" } },
      orderBy: { createdAt: "asc" },
      select: { name: true, bio: true, avatarUrl: true },
    });
    const studentCount = await db.user.count({ where: { role: "STUDENT" } });
    return { instructor, studentCount };
  },
  ["public-home-stats-v1"],
  { revalidate: PUBLIC_DATA_TTL_SECONDS, tags: [PUBLIC_DATA_TAG] },
);

const getPersistedPublishedCourse = unstable_cache(
  (slug: string) => db.course.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
      courseCode: true,
      shortDescription: true,
      description: true,
      targetAudience: true,
      thumbnailUrl: true,
      category: { select: { name: true } },
      instructor: {
        select: { name: true, title: true, bio: true, avatarUrl: true },
      },
      sections: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            orderBy: { position: "asc" },
            select: { id: true, title: true, isPreview: true },
          },
        },
      },
    },
  }),
  ["published-course-v1"],
  { revalidate: PUBLIC_DATA_TTL_SECONDS, tags: [PUBLIC_DATA_TAG] },
);

// generateMetadata and the page render request the same course. React cache
// makes those two reads share one promise, including on a cold cache miss.
export const getPublishedCourse = cache(getPersistedPublishedCourse);
