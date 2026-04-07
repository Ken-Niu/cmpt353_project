import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || ''
  const type = req.nextUrl.searchParams.get('type') || 'content'
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
  const limit = 10
  const skip = (page - 1) * limit

  if (type === 'content') {
    const [posts, replies] = await Promise.all([
      prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { body: { contains: q, mode: 'insensitive' } }
          ]
        },
        include: { author: { select: { displayName: true } }, channel: { select: { name: true } } },
        skip,
        take: limit,
      }),
      prisma.reply.findMany({
        where: { body: { contains: q, mode: 'insensitive' } },
        include: { author: { select: { displayName: true } }, post: { select: { title: true, channelId: true } } },
        skip,
        take: limit,
      })
    ])
    return NextResponse.json({ posts, replies })
  }

  if (type === 'author') {
    const posts = await prisma.post.findMany({
      where: { author: { displayName: { contains: q, mode: 'insensitive' } } },
      include: { author: { select: { displayName: true } }, channel: { select: { name: true } } },
      skip,
      take: limit,
    })
    return NextResponse.json({ posts })
  }

  if (type === 'top_posters') {
    const users = await prisma.user.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { posts: { _count: 'desc' } },
      take: 10,
    })
    return NextResponse.json({ users })
  }

  if (type === 'least_posters') {
    const users = await prisma.user.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { posts: { _count: 'asc' } },
      take: 10,
    })
    return NextResponse.json({ users })
  }

  if (type === 'top_voted') {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { displayName: true } },
        channel: { select: { name: true } },
        votes: true,
      },
      skip,
      take: limit,
    })
    const sorted = posts.sort((a: any, b: any) => {
      const aScore = a.votes.reduce((s: number, v: any) => s + v.value, 0)
      const bScore = b.votes.reduce((s: number, v: any) => s + v.value, 0)
      return bScore - aScore
    })
    return NextResponse.json({ posts: sorted })
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}
