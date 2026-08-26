import{requireApiAdmin}from"@/lib/auth";import{db}from"@/lib/db";import{apiError}from"@/lib/http";import{courseSchema}from"@/lib/validation";import{NextResponse}from"next/server";
export async function POST(req:Request){try{await requireApiAdmin();return NextResponse.json(await db.course.create({data:courseSchema.parse(await req.json())}),{status:201})}catch(e){return apiError(e)}}
