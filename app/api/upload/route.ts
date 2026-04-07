import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  const targetType = formData.get('targetType') as string
  const targetId = formData.get('targetId') as string

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Only PNG, JPEG, WebP allowed' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Max 5MB' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
  const filepath = path.join(process.cwd(), 'public/uploads', filename)

  await writeFile(filepath, buffer)

  const attachment = await prisma.attachment.create({
    data: {
      targetType,
      targetId,
      mimeType: file.type,
      sizeBytes: file.size,
      path: `/uploads/${filename}`,
      postId: targetType === 'post' ? targetId : null,
      replyId: targetType === 'reply' ? targetId : null,
    }
  })

  return NextResponse.json(attachment, { status: 201 })
}
