import { describe, it, expect } from 'vitest'
import { generateContinuation } from '@/lib/qwen'

describe('generateContinuation', () => {
  it('UT-F3-01: returns a non-empty string given context', async () => {
    const context = ['Once upon a time', 'there was a dragon']
    const result = await generateContinuation(context)
    expect(result).not.toBeNull()
    expect(result!.length).toBeGreaterThan(0)
    expect(result).not.toBe(context[context.length - 1])
  })
})