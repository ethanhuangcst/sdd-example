import type { Sentence } from '@/types'

export default function SentenceItem({ sentence }: { sentence: Sentence }) {
  const time = new Date(sentence.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      data-testid="sentence-item"
      style={{
        background: '#f3ede3',
        border: '1px solid #e0d5c5',
        borderRadius: '8px',
        padding: '16px',
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      <p style={{ color: '#2c2416', lineHeight: 1.7, margin: '0 0 12px' }}>{sentence.content}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'ui-rounded, Helvetica Neue, sans-serif', fontSize: '12px', color: '#8a7a65' }}>
        <span>{sentence.author}</span>
        <span data-testid="timestamp">{time}</span>
        <span
          data-testid="label"
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            background: sentence.isAI ? '#c17f3e' : '#5a7a5a',
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {sentence.isAI ? 'AI' : 'Human'}
        </span>
      </div>
    </div>
  )
}
