import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const channels = await prisma.channel.findMany({
    orderBy: { createdAt: 'desc' },
    include: { creator: { select: { displayName: true } }, _count: { select: { posts: true } } }
  })
  return NextResponse.json(channels)
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, description } = await req.json()
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })

  const channel = await prisma.channel.create({
    data: { name, description, createdBy: user.id }
  })
  return NextResponse.json(channel, { status: 201 })
}
