import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Seed endpoint for E2E test setup only
export async function POST(request: NextRequest) {
  const body = await request.json()
  const sentence = await prisma.sentence.create({ data: body })
  return NextResponse.json(sentence, { status: 201 })
}
