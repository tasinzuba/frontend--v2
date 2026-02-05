import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || "https://backend-v2-tasinbis-projects.vercel.app";

async function handler(request: NextRequest, { params }: { params: Promise<{ all: string[] }> }) {
    const { all } = await params;
    const path = all.join('/');
    const url = `${BACKEND_URL}/api/auth/${path}`;
    
    let body: string | undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        body = await request.text();
    }

    const response = await fetch(url, {
        method: request.method,
        headers: {
            'Content-Type': 'application/json',
            'Cookie': request.headers.get('cookie') || '',
            'User-Agent': request.headers.get('user-agent') || '',
            'X-Forwarded-For': request.headers.get('x-forwarded-for') || '',
        },
        body: body || undefined,
        credentials: 'include',
    });

    const data = await response.text();
  
    const res = new NextResponse(data, {
        status: response.status,
        headers: {
            'Content-Type': response.headers.get('content-type') || 'application/json',
        },
    });

    
    const setCookieHeaders = response.headers.getSetCookie();
    if (setCookieHeaders && setCookieHeaders.length > 0) {
        setCookieHeaders.forEach((cookie) => {
            const modifiedCookie = cookie
                .replace(/Domain=[^;]+;?\s*/gi, '')
                .replace(/SameSite=None/gi, 'SameSite=Lax')
                .replace(/;\s*Secure/gi, process.env.NODE_ENV === 'production' ? '; Secure' : '');
            
            res.headers.append('Set-Cookie', modifiedCookie);
        });
    }

    return res;
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
