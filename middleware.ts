import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Outbound providers accept caller-controlled URLs and have not passed security review.
// Keep them unavailable until host allowlists, redirect controls, and credential isolation are verified.
const unavailable = ['/api/ai-models', '/api/ai-image', '/api/image-to-image', '/api/unsplash', '/api/qiniu-upload', '/api/remove-bg', '/api/save-thumbnail', '/api/share/create', '/api/share/test', '/api/templates/public/create', '/api/materials/public/create'];
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (unavailable.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
    return NextResponse.json({ error: 'This integration is temporarily unavailable.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
  return NextResponse.next();
}
export const config = { matcher: '/api/:path*' };


