import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '象棋冒险乐园 - 小朋友的国际象棋学习之旅',
  description: '专为7岁小朋友设计的互动式国际象棋学习平台',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '象棋冒险乐园',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-gray-100">
        {children}
      </body>
    </html>
  )
}
