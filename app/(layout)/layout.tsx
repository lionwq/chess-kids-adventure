'use client'

import KidFriendlyUI from '@/components/KidFriendlyUI'
import GamificationPanel from '@/components/GamificationPanel'
import { useState } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [showGamification, setShowGamification] = useState(true)

  return (
    <KidFriendlyUI>
      {children}
      <GamificationPanel 
        show={showGamification} 
        onClose={() => setShowGamification(false)} 
      />
    </KidFriendlyUI>
  )
}
