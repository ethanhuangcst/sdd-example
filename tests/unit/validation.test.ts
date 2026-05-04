import { describe, it, expect } from 'vitest'
import { validateSentenceInput } from '@/lib/validation'

describe('validateSentenceInput', () => {
  it('UT-F2-01: returns error when author is empty', () => {
    const errors = validateSentenceInput({ author: '', content: 'Hello' })
    expect(errors.author).toBeDefined()
  })

  it('UT-F2-02: returns error when content is empty', () => {
    const errors = validateSentenceInput({ author: 'Alice', content: '' })
    expect(errors.content).toBeDefined()
  })

  it('returns no errors for valid input', () => {
    const errors = validateSentenceInput({ author: 'Alice', content: 'Hello world' })
    expect(errors).toEqual({})
  })

  it('trims whitespace-only values', () => {
    const errors = validateSentenceInput({ author: '   ', content: '   ' })
    expect(errors.author).toBeDefined()
    expect(errors.content).toBeDefined()
  })
})