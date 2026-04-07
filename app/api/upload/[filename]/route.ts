import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params
  const filepath = path.join(process.cwd(), 'public/uploads', filename)
  
  try {
    const file = await readFile(filepath)
    const ext = filename.split('.').pop()?.toLowerCase()
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
    }
    const mimeType = mimeTypes[ext || ''] || 'image/jpeg'
    return new NextResponse(file, {
      headers: { 'Content-Type': mimeType }
    })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}