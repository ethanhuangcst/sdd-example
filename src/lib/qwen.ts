export async function generateOpener(): Promise<string | null> {
  try {
    const res = await fetch(`${process.env.QWEN_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.QWEN_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.QWEN_MODEL ?? 'qwen-plus',
        messages: [
          {
            role: 'user',
            content: 'Start a short creative story with exactly one sentence. Output only that sentence, nothing else.',
          },
        ],
        max_tokens: 80,
      }),
    })
    const data = await res.json()
    return data.choices?.[0]?.message?.content?.trim() ?? null
  } catch {
    return null
  }
}

export async function generateContinuation(context: string[]): Promise<string | null> {
  try {
    const story = context.map(s => `- ${s}`).join('\n')
    const res = await fetch(`${process.env.QWEN_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.QWEN_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.QWEN_MODEL ?? 'qwen-plus',
        messages: [
          {
            role: 'user',
            content: `Continue this story with exactly one sentence. Output only that sentence, nothing else.\n\nStory so far:\n${story}`,
          },
        ],
        max_tokens: 80,
      }),
    })
    const data = await res.json()
    return data.choices?.[0]?.message?.content?.trim() ?? null
  } catch {
    return null
  }
}

