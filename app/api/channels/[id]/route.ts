import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const channel = await prisma.channel.findUnique({ where: { id } })
  if (!channel) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (user.role !== 'admin' && channel.createdBy !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.channel.delete({ where: { id } })
  return NextResponse.json({ success: true })
}