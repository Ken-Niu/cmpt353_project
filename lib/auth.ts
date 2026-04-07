import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const SECRET = process.env.NEXTAUTH_SECRET!

export function signToken(payload: { id: string; email: string; role: string }) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as { id: string; email: string; role: string }
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null
  return verifyToken(token)
}
