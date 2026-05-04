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
            content: '用中文开始一个简短的创意故事，恰好一句话。只输出那句话，不要其他内容。',
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
            content: `用中文续写这个故事，恰好一句话。只输出那句话，不要其他内容。\n\n目前的故事：\n${story}`,
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

