import { NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';

export function middleware(request) {
  // Only check authentication for player management routes
  if (request.nextUrl.pathname.startsWith('/api/players/') && 
      (request.method === 'PUT' || request.method === 'DELETE')) {
    
    const authSession = request.cookies.get('auth-session');
    
    if (!authSession) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    try {
      const session = JSON.parse(authSession.value);
      if (!validateSession(session)) {
        return NextResponse.json(
          { error: 'Session expired' },
          { status: 401 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/players/:path*',
};
