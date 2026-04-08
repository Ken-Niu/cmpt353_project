import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const reply = await prisma.reply.findUnique({ where: { id } })
  if (!reply) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (user.role !== 'admin' && reply.authorId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.vote.deleteMany({ where: { replyId: id } })
  await prisma.attachment.deleteMany({ where: { replyId: id } })
  await prisma.reply.deleteMany({ where: { parentReplyId: id } })
  await prisma.reply.delete({ where: { id } })

  return NextResponse.json({ success: true })
}