import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateSentenceInput } from '@/lib/validation'
import { generateContinuation } from '@/lib/qwen'

export async function GET() {
  const sentences = await prisma.sentence.findMany({
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(sentences)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const errors = validateSentenceInput(body)
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 })
  }

  const sentence = await prisma.sentence.create({
    data: { content: body.content.trim(), author: body.author.trim(), isAI: false },
  })

  const recent = await prisma.sentence.findMany({
    orderBy: { createdAt: 'asc' },
    take: 10,
  })
  const context = recent.map(s => s.content)
  const continuation = await generateContinuation(context)
  if (continuation) {
    await prisma.sentence.create({
      data: { content: continuation, author: 'AI', isAI: true },
    })
  }

  return NextResponse.json(sentence, { status: 201 })
}
