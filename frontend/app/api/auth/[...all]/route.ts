import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || "https://backend-v2-tasinbis-projects.vercel.app";

async function handler(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const apiPath = path.join('/');

    const searchParams = request.nextUrl.searchParams.toString();
    const url = searchParams 
        ? `${BACKEND_URL}/${apiPath}?${searchParams}` 
        : `${BACKEND_URL}/${apiPath}`;

    let body: string | undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        body = await request.text();
    }

    const response = await fetch(url, {
        method: request.method,
        headers: {
            'Content-Type': request.headers.get('content-type') || 'application/json',
            'Cookie': request.headers.get('cookie') || '',
        },
        body: body || undefined,
    });

    const data = await response.text();
    
    const res = new NextResponse(data, {
        status: response.status,
        headers: {
            'Content-Type': response.headers.get('content-type') || 'application/json',
        },
    });

    const setCookieHeaders = response.headers.getSetCookie();
    setCookieHeaders?.forEach((cookie) => {
        const modifiedCookie = cookie
            .replace(/Domain=[^;]+;?\s*/gi, '')
            .replace(/SameSite=None/gi, 'SameSite=Lax');
        res.headers.append('Set-Cookie', modifiedCookie);
    });

    return res;
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
