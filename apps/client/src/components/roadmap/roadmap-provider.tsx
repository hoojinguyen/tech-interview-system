'use client'

import { createContext, useContext, ReactNode } from 'react'

interface RoadmapContextType {
  role: string
  level: string
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined)

interface RoadmapProviderProps {
  role: string
  level: string
  children: ReactNode
}

export function RoadmapProvider({ role, level, children }: RoadmapProviderProps) {
  return (
    <RoadmapContext.Provider value={{ role, level }}>
      {children}
    </RoadmapContext.Provider>
  )
}

export function useRoadmapContext() {
  const context = useContext(RoadmapContext)
  if (context === undefined) {
    throw new Error('useRoadmapContext must be used within a RoadmapProvider')
  }
  return context
}