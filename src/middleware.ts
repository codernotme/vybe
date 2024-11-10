import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from 'next/server';

export default clerkMiddleware();

export function middleware(req: NextRequest) {
  const userRole = req.cookies.get('role')?.value; // Assuming role is stored in cookies

  // Define role-based access for each route
  if (req.nextUrl.pathname.startsWith('/tech') && userRole !== 'tech') {
    return NextResponse.redirect(new URL('/not-authorized', req.url));
  }

  if (req.nextUrl.pathname.startsWith('/nontech') && userRole !== 'member') {
    return NextResponse.redirect(new URL('/not-authorized', req.url));
  }

  if (req.nextUrl.pathname.startsWith('/mentor') && userRole !== 'mentor') {
    return NextResponse.redirect(new URL('/not-authorized', req.url));
  }

  if (req.nextUrl.pathname.startsWith('/admin') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/not-authorized', req.url));
  }

  if (req.nextUrl.pathname.startsWith('/community') && userRole !== 'community') {
    return NextResponse.redirect(new URL('/not-authorized', req.url));
  }

  // If all checks pass, proceed to the requested route
  return NextResponse.next();
}

// Export combined config to run middleware on specific routes
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/',
    '/(api|trpc)(.*)',
    '/tech/:path*',
    '/nontech/:path*',
    '/mentor/:path*',
    '/admin/:path*',
    '/community/:path*'
  ],
};