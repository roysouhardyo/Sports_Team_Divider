import { NextResponse } from 'next/server';
import { verifyCredentials, createSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (verifyCredentials(username, password)) {
      const session = createSession();
      
      const response = NextResponse.json({ 
        success: true, 
        message: 'Login successful' 
      });
      
      // Set session cookie
      response.cookies.set('auth-session', JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 // 24 hours
      });
      
      return response;
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
