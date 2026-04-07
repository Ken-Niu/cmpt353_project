import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { body, postId, parentReplyId } = await req.json()
  if (!body || !postId) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }

  const reply = await prisma.reply.create({
    data: { body, postId, authorId: user.id, parentReplyId: parentReplyId || null },
    include: { author: { select: { displayName: true } } }
  })
  return NextResponse.json(reply, { status: 201 })
}
