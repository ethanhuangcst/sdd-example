import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'AI Story Chain' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#faf7f2', margin: 0 }}>{children}</body>
    </html>
  )
}
