import{requireApiAdmin}from"@/lib/auth";import{db}from"@/lib/db";import{apiError}from"@/lib/http";import{questionSchema}from"@/lib/validation";import{NextResponse}from"next/server";
export async function POST(req:Request){try{await requireApiAdmin();return NextResponse.json(await db.question.create({data:questionSchema.parse(await req.json())}),{status:201})}catch(e){return apiError(e)}}
