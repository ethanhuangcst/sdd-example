import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'AI 故事接龙' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body style={{ background: '#faf7f2', margin: 0 }}>{children}</body>
    </html>
  )
}
