import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { targetType, targetId, value } = await req.json()
  if (!targetType || !targetId || value === undefined) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }

  if (value === 0) {
    await prisma.vote.deleteMany({
      where: { userId: user.id, targetType, targetId }
    })
    return NextResponse.json({ success: true })
  }

  const vote = await prisma.vote.upsert({
    where: { userId_targetType_targetId: { userId: user.id, targetType, targetId } },
    update: { value },
    create: {
      userId: user.id,
      targetType,
      targetId,
      value,
      postId: targetType === 'post' ? targetId : null,
      replyId: targetType === 'reply' ? targetId : null,
    }
  })
  return NextResponse.json(vote)
}
