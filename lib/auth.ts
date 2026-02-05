import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-change-in-production'
);

export interface SessionPayload {
  nickname: string;
  exp: number;
}

export async function createToken(nickname: string): Promise<string> {
  const token = await new SignJWT({ nickname })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
  
  return token;
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    if (typeof payload.nickname !== 'string' || typeof payload.exp !== 'number') {
      return null;
    }
    
    return {
      nickname: payload.nickname,
      exp: payload.exp
    };
  } catch (error) {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
}

export function verifyPassword(password: string): boolean {
  const sitePassword = process.env.SITE_PASSWORD || 'test123';
  return password === sitePassword;
}
