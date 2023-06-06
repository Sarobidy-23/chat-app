import { NextResponse, NextRequest } from 'next/server';
 
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next();
  if((request.cookies.get("chat-token") == undefined || pathname == "/") && !['/login','/sign-up'].includes(pathname)) {
    response = NextResponse.redirect(new URL('/login', request.url));
  }
  if(request.cookies.get("chat-token") && (['/login','/sign-up'].includes(pathname))) {
    response = NextResponse.redirect(new URL('/profile', request.url));
  }
  return response
}
 
export const config = {
  matcher: ['/','/profile','/channel/(.*)','/message/(.*)','/sign-up','/login']
};