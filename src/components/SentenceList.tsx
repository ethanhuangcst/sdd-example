import type { Sentence } from '@/types'
import SentenceItem from './SentenceItem'

export default function SentenceList({ sentences }: { sentences: Sentence[] }) {
  if (sentences.length === 0) {
    return (
      <p
        data-testid="empty-state"
        style={{
          textAlign: 'center',
          fontStyle: 'italic',
          color: '#8a7a65',
          fontFamily: "Georgia, 'Times New Roman', serif",
          marginTop: '48px',
        }}
      >
        还没有故事，成为第一个添加句子的人吧。
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {sentences.map((s) => (
        <SentenceItem key={s.id} sentence={s} />
      ))}
    </div>
  )
}
