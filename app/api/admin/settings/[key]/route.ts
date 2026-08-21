import{requireApiAdmin}from"@/lib/auth";import{db}from"@/lib/db";import{apiError}from"@/lib/http";import{NextResponse}from"next/server";
import{z}from"zod";
export async function PATCH(req:Request,{params}:{params:Promise<{key:string}>}){try{await requireApiAdmin();const data=z.object({value:z.string().max(5000),isSecret:z.boolean()}).parse(await req.json());return NextResponse.json(await db.systemSetting.update({where:{key:decodeURIComponent((await params).key)},data}))}catch(e){return apiError(e)}}
export async function DELETE(_:Request,{params}:{params:Promise<{key:string}>}){try{await requireApiAdmin();await db.systemSetting.delete({where:{key:decodeURIComponent((await params).key)}});return NextResponse.json({ok:true})}catch(e){return apiError(e)}}
