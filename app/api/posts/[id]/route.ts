import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { displayName: true } },
      attachments: true,
      votes: true,
      replies: {
        where: { parentReplyId: null },
        orderBy: { createdAt: 'asc' },
        include: {
          author: { select: { displayName: true } },
          attachments: true,
          votes: true,
          childReplies: {
            include: {
              author: { select: { displayName: true } },
              votes: true,
            }
          }
        }
      }
    }
  })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (user.role !== 'admin' && post.authorId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  await prisma.post.delete({ where: { id } })
  return NextResponse.json({ success: true })
}