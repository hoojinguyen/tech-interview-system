'use client'

import { createContext, useContext, ReactNode } from 'react'

interface TopicDetailContextType {
  role: string
  level: string
  topicId: string
}

const TopicDetailContext = createContext<TopicDetailContextType | undefined>(undefined)

interface TopicDetailProviderProps {
  role: string
  level: string
  topicId: string
  children: ReactNode
}

export function TopicDetailProvider({ role, level, topicId, children }: TopicDetailProviderProps) {
  return (
    <TopicDetailContext.Provider value={{ role, level, topicId }}>
      {children}
    </TopicDetailContext.Provider>
  )
}

export function useTopicDetailContext() {
  const context = useContext(TopicDetailContext)
  if (context === undefined) {
    throw new Error('useTopicDetailContext must be used within a TopicDetailProvider')
  }
  return context
}