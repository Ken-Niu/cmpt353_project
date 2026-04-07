import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role })
  const res = NextResponse.json({ user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role } })
  res.cookies.set('token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 })
  return res
}
