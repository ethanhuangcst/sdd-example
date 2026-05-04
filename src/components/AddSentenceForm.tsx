'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { validateSentenceInput, type FormErrors } from '@/lib/validation'

export default function AddSentenceForm() {
  const router = useRouter()
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateSentenceInput({ author, content })
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    try {
      await fetch('/api/sentences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content }),
      })
      setAuthor('')
      setContent('')
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '8px 12px', boxSizing: 'border-box' as const,
    background: '#faf7f2', border: '1px solid #e0d5c5', borderRadius: '6px',
    fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '15px', color: '#2c2416',
  }
  const labelStyle = {
    display: 'block', marginBottom: '4px',
    fontFamily: 'ui-rounded, Helvetica Neue, sans-serif', fontSize: '12px',
    color: '#8a7a65', textTransform: 'uppercase' as const, letterSpacing: '0.05em',
  }
  const errorStyle = { color: '#b94040', fontSize: '12px', marginTop: '4px' }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={labelStyle}>您的姓名</label>
        <input
          data-testid="input-author"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          style={inputStyle}
        />
        {errors.author && <p data-testid="error-author" style={errorStyle}>{errors.author}</p>}
      </div>
      <div>
        <label style={labelStyle}>您的句子</label>
        <input
          data-testid="input-content"
          value={content}
          onChange={e => setContent(e.target.value)}
          style={inputStyle}
        />
        {errors.content && <p data-testid="error-content" style={errorStyle}>{errors.content}</p>}
      </div>
      <button
        data-testid="btn-submit"
        type="submit"
        disabled={submitting}
        style={{
          alignSelf: 'flex-start', padding: '8px 20px',
          background: '#c17f3e', color: '#2c2416', border: 'none', borderRadius: '6px',
          fontFamily: 'ui-rounded, Helvetica Neue, sans-serif', fontSize: '14px',
          cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.5 : 1,
        }}
      >
        添加到故事
      </button>
    </form>
  )
}
