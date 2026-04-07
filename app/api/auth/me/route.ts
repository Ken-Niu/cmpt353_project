import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json(null)
  
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, displayName: true, role: true }
  })
  return NextResponse.json(dbUser)
}
