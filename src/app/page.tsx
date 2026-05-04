import { prisma } from '@/lib/prisma'
import { generateOpener } from '@/lib/qwen'
import SentenceList from '@/components/SentenceList'
import AddSentenceForm from '@/components/AddSentenceForm'
import ResetButton from '@/components/ResetButton'

export default async function Page() {
  let sentences = await prisma.sentence.findMany({ orderBy: { createdAt: 'asc' } })

  if (sentences.length === 0) {
    // Re-check inside to prevent race condition with concurrent requests
    const count = await prisma.sentence.count()
    if (count === 0) {
      const opener = await generateOpener()
      if (opener) {
        await prisma.sentence.create({ data: { content: opener, author: 'AI', isAI: true } })
        sentences = await prisma.sentence.findMany({ orderBy: { createdAt: 'asc' } })
      }
    } else {
      sentences = await prisma.sentence.findMany({ orderBy: { createdAt: 'asc' } })
    }
  }

  return (
    <main style={{ maxWidth: '672px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '28px', fontWeight: 'normal', color: '#2c2416', margin: 0 }}>
          AI 故事接龙
        </h1>
        <ResetButton />
      </div>
      <SentenceList sentences={sentences} />
      <AddSentenceForm />
    </main>
  )
}
