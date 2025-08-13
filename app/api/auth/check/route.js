import { NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';

export async function GET(request) {
  const authSession = request.cookies.get('auth-session');
  
  if (!authSession) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
  
  try {
    const session = JSON.parse(authSession.value);
    if (validateSession(session)) {
      return NextResponse.json({ authenticated: true });
    } else {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}
