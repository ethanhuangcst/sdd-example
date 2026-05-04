'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ResetButton() {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleConfirm() {
    setSubmitting(true)
    setConfirming(false)
    try {
      await fetch('/api/reset', { method: 'POST' })
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

  const muted = '#8a7a65'
  const btnBase = {
    padding: '6px 14px',
    borderRadius: '6px',
    fontFamily: 'ui-rounded, Helvetica Neue, sans-serif',
    fontSize: '13px',
    cursor: 'pointer' as const,
    border: '1px solid #e0d5c5',
  }

  if (confirming) {
    return (
      <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: muted, fontFamily: 'ui-rounded, Helvetica Neue, sans-serif' }}>Sure?</span>
        <button
          data-testid="btn-reset-confirm"
          onClick={handleConfirm}
          style={{ ...btnBase, background: '#b94040', color: '#fff', border: '1px solid #b94040' }}
        >
          Yes, reset
        </button>
        <button
          data-testid="btn-reset-cancel"
          onClick={() => setConfirming(false)}
          style={{ ...btnBase, background: 'transparent', color: muted }}
        >
          Cancel
        </button>
      </span>
    )
  }

  return (
    <button
      data-testid="btn-reset"
      type="button"
      onClick={() => setConfirming(true)}
      disabled={submitting}
      style={{ ...btnBase, background: 'transparent', color: muted, opacity: submitting ? 0.5 : 1 }}
    >
      Start Over
    </button>
  )
}
