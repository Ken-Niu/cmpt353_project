import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, displayName, password } = await req.json()

  if (!email || !displayName || !password) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, displayName, passwordHash }
  })

  const token = signToken({ id: user.id, email: user.email, role: user.role })
  const res = NextResponse.json({ user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role } })
  res.cookies.set('token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 })
  return res
}
