import { NextResponse } from 'next/server';
import { fail, identity, jsonBody, ApiError } from '@/lib/server/admin';
import { requestRefund, requireCommerce } from '@/lib/server/commerce';
import { idSchema } from '@/lib/commerce/model';
export async function POST(req:Request){try{requireCommerce();const user=await identity(req);const input=await jsonBody(req);const id=idSchema.safeParse(input.bookingId);if(!id.success||input.confirmFullRefund!==true)throw new ApiError(400,'Erstattung muss ausdrücklich bestätigt werden.');return NextResponse.json(await requestRefund(user,id.data));}catch(e){return fail(e);}}
