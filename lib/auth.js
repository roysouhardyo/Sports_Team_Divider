// Simple authentication utility
// In a production app, you'd want to use proper authentication like NextAuth.js

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password123';

export function verifyCredentials(username, password) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function createSession() {
  // In a real app, you'd create a proper session token
  return {
    id: Date.now().toString(),
    username: ADMIN_USERNAME,
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
}

export function validateSession(session) {
  if (!session) return false;
  return Date.now() < session.expiresAt;
}
