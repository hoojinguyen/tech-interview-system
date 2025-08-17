'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRoadmapContext } from '@/components/roadmap/roadmap-provider'
import { useRoadmapData } from './use-roadmap-data'

interface RoadmapProgress {
  [roadmapKey: string]: {
    completedTopics: string[]
    lastAccessed: string
    progress: number
  }
}

const STORAGE_KEY = 'roadmap-progress'

export function useRoadmapProgress() {
  const { role, level } = useRoadmapContext()
  const { topics } = useRoadmapData()
  const roadmapKey = `${role}-${level}`
  
  const [progress, setProgress] = useState<RoadmapProgress>({})

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setProgress(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load roadmap progress:', error)
    }
  }, [])

  // Save progress to localStorage whenever it changes
  const saveProgress = useCallback((newProgress: RoadmapProgress) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress))
      setProgress(newProgress)
    } catch (error) {
      console.error('Failed to save roadmap progress:', error)
    }
  }, [])

  // Get current roadmap progress
  const currentProgress = progress[roadmapKey] || {
    completedTopics: [],
    lastAccessed: new Date().toISOString(),
    progress: 0,
  }

  // Calculate progress percentage - handle case where topics might be undefined
  const totalTopics = topics?.length || 0
  const completedTopics = currentProgress.completedTopics.length
  const progressPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0

  // Check if a topic is completed
  const isTopicCompleted = useCallback((topicId: string) => {
    return currentProgress.completedTopics.includes(topicId)
  }, [currentProgress.completedTopics])

  // Toggle topic completion
  const toggleTopicCompletion = useCallback((topicId: string) => {
    const isCompleted = currentProgress.completedTopics.includes(topicId)
    const newCompletedTopics = isCompleted
      ? currentProgress.completedTopics.filter(id => id !== topicId)
      : [...currentProgress.completedTopics, topicId]

    const newProgress = {
      ...progress,
      [roadmapKey]: {
        completedTopics: newCompletedTopics,
        lastAccessed: new Date().toISOString(),
        progress: totalTopics > 0 ? (newCompletedTopics.length / totalTopics) * 100 : 0,
      },
    }

    saveProgress(newProgress)
  }, [progress, roadmapKey, totalTopics, currentProgress.completedTopics, saveProgress])

  // Mark topic as completed
  const markTopicCompleted = useCallback((topicId: string) => {
    if (!currentProgress.completedTopics.includes(topicId)) {
      toggleTopicCompletion(topicId)
    }
  }, [currentProgress.completedTopics, toggleTopicCompletion])

  // Mark topic as incomplete
  const markTopicIncomplete = useCallback((topicId: string) => {
    if (currentProgress.completedTopics.includes(topicId)) {
      toggleTopicCompletion(topicId)
    }
  }, [currentProgress.completedTopics, toggleTopicCompletion])

  // Reset progress for current roadmap
  const resetProgress = useCallback(() => {
    const newProgress = {
      ...progress,
      [roadmapKey]: {
        completedTopics: [],
        lastAccessed: new Date().toISOString(),
        progress: 0,
      },
    }
    saveProgress(newProgress)
  }, [progress, roadmapKey, saveProgress])

  // Get all roadmap progress (for dashboard/overview)
  const getAllProgress = useCallback(() => {
    return progress
  }, [progress])

  return {
    progress: progressPercentage,
    totalTopics,
    completedTopics,
    isTopicCompleted,
    toggleTopicCompletion,
    markTopicCompleted,
    markTopicIncomplete,
    resetProgress,
    getAllProgress,
    lastAccessed: currentProgress.lastAccessed,
  }
}