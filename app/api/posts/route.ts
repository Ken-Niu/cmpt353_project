import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const channelId = req.nextUrl.searchParams.get('channelId')
  
  const posts = await prisma.post.findMany({
    where: channelId ? { channelId } : {},
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { displayName: true } },
      _count: { select: { replies: true, votes: true } }
    }
  })
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, body, channelId } = await req.json()
  if (!title || !body || !channelId) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }

  const post = await prisma.post.create({
    data: { title, body, channelId, authorId: user.id }
  })
  return NextResponse.json(post, { status: 201 })
}
