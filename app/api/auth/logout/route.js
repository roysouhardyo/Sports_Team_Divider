import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ 
    success: true, 
    message: 'Logout successful' 
  });
  
  // Clear the session cookie
  response.cookies.set('auth-session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0
  });
  
  return response;
}
