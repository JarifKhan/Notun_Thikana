import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Convert JWT_SECRET to Uint8Array for jose
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);

    // Verify the token
    await jose.jwtVerify(token, secretKey);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'], // whatever routes you want to protect
};
