'use client'

import { useTopicDetailContext } from '@/components/roadmap/topic-detail-provider'
import { useRoadmapData } from './use-roadmap-data'

export function useTopicDetail() {
  const { topicId } = useTopicDetailContext()
  const { topics, isLoading, error } = useRoadmapData()

  // Find the specific topic
  const topic = topics.find(t => t.id === topicId)

  return {
    topic,
    isLoading,
    error: error || (!isLoading && !topic ? new Error('Topic not found') : null),
  }
}