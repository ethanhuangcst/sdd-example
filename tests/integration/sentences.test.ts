import { PrismaClient } from '@prisma/client'
import { describe, it, expect, beforeEach } from 'vitest'

const prisma = new PrismaClient()

beforeEach(async () => {
  await prisma.sentence.deleteMany()
})

describe('GET /api/sentences', () => {
  it('IT-F1-01: returns sentences in ascending order', async () => {
    await prisma.sentence.createMany({
      data: [
        { content: 'First', author: 'Alice', isAI: false },
        { content: 'Second', author: 'AI', isAI: true },
        { content: 'Third', author: 'Bob', isAI: false },
      ],
    })

    const res = await fetch('http://localhost:3000/api/sentences')
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toHaveLength(3)
    expect(data[0].content).toBe('First')
    expect(data[1].content).toBe('Second')
    expect(data[2].content).toBe('Third')
    expect(data[0]).toMatchObject({ id: expect.any(Number), content: expect.any(String), author: expect.any(String), isAI: expect.any(Boolean), createdAt: expect.any(String) })
  })

  it('IT-F1-02: returns empty array when no sentences exist', async () => {
    const res = await fetch('http://localhost:3000/api/sentences')
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual([])
  })
})

describe('POST /api/sentences', () => {
  it('IT-F2-01: saves sentence and returns 201', async () => {
    const res = await fetch('http://localhost:3000/api/sentences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: 'Alice', content: 'The dragon awoke.' }),
    })
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data).toMatchObject({ author: 'Alice', content: 'The dragon awoke.', isAI: false })

    const saved = await prisma.sentence.findFirst({ where: { content: 'The dragon awoke.' } })
    expect(saved).not.toBeNull()
  })

  it('IT-F2-02: returns 400 when author is empty', async () => {
    const res = await fetch('http://localhost:3000/api/sentences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: '', content: 'Hello' }),
    })
    expect(res.status).toBe(400)
  })

  it('IT-F2-03: returns 400 when content is empty', async () => {
    const res = await fetch('http://localhost:3000/api/sentences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: 'Alice', content: '' }),
    })
    expect(res.status).toBe(400)
  })
})

describe('F3 — AI auto-continuation', () => {
  it('IT-F3-01: POST saves human sentence and AI continuation', async () => {
    await prisma.sentence.create({ data: { content: 'Once upon a time', author: 'AI', isAI: true } })

    const res = await fetch('http://localhost:3000/api/sentences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: 'Alice', content: 'The dragon awoke.' }),
    })

    expect(res.status).toBe(201)

    const all = await prisma.sentence.findMany({ orderBy: { createdAt: 'asc' } })
    expect(all).toHaveLength(3)
    expect(all[1].isAI).toBe(false)
    expect(all[1].content).toBe('The dragon awoke.')
    expect(all[2].isAI).toBe(true)
    expect(all[2].content.length).toBeGreaterThan(0)
  })
})

describe('US2 — AI auto-opener', () => {
  it('IT-F1-03: page visit when empty saves exactly one AI sentence to DB', async () => {
    // Trigger SSR by fetching the page
    await fetch('http://localhost:3000/')

    const sentences = await prisma.sentence.findMany()
    expect(sentences).toHaveLength(1)
    expect(sentences[0].isAI).toBe(true)
    expect(sentences[0].author).toBe('AI')
    expect(sentences[0].content.length).toBeGreaterThan(0)
  })

  it('IT-F1-04: second page visit does not add another sentence', async () => {
    await fetch('http://localhost:3000/')
    await fetch('http://localhost:3000/')

    const sentences = await prisma.sentence.findMany()
    expect(sentences).toHaveLength(1)
  })
})

describe('F4 — Reset story', () => {
  it('IT-F4-01: POST /api/reset deletes all sentences', async () => {
    await prisma.sentence.createMany({
      data: [
        { content: 'A', author: 'Alice', isAI: false },
        { content: 'B', author: 'AI', isAI: true },
      ],
    })
    const res = await fetch('http://localhost:3000/api/reset', { method: 'POST' })
    expect(res.status).toBe(200)
    const remaining = await prisma.sentence.findMany()
    expect(remaining).toHaveLength(0)
  })
})

