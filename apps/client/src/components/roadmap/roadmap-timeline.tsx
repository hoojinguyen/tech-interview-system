'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, Clock, BookOpen, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useRoadmapData } from '@/lib/hooks/use-roadmap-data'
import { useRoadmapProgress } from '@/lib/hooks/use-roadmap-progress'
import { Resource } from '@/types'
import Link from 'next/link'

// Simplified types for the component
interface SimplifiedQuestion {
  id: string
  title: string
  difficulty: string
  type: string
}

interface SimplifiedTopic {
  id: string
  roadmapId: string
  title: string
  description: string | null
  order: number
  resources: Resource[]
  questions: SimplifiedQuestion[]
  createdAt: Date
  updatedAt: Date
}

export function RoadmapTimeline() {
  const { roadmap, topics, isLoading, error } = useRoadmapData()
  const { isTopicCompleted, toggleTopicCompletion } = useRoadmapProgress()

  if (isLoading) {
    return <RoadmapTimelineSkeleton />
  }

  if (error || !roadmap || !topics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p>Unable to load roadmap. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Learning Timeline
          </CardTitle>
          <CardDescription>
            Follow this structured path to master {roadmap.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>~{roadmap.estimatedHours} hours</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{topics.length} topics</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {topics.map((topic, index) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            index={index}
            isCompleted={isTopicCompleted(topic.id)}
            onToggleCompletion={() => toggleTopicCompletion(topic.id)}
          />
        ))}
      </div>
    </div>
  )
}

interface TopicCardProps {
  topic: SimplifiedTopic
  index: number
  isCompleted: boolean
  onToggleCompletion: () => void
}

function TopicCard({ topic, index, isCompleted, onToggleCompletion }: TopicCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className={`transition-all duration-200 ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-start gap-4">
              {/* Timeline indicator */}
              <div className="flex flex-col items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleCompletion()
                  }}
                  className="flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors hover:scale-110"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <div className={`w-0.5 h-8 mt-2 ${isCompleted ? 'bg-green-300' : 'bg-border'}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {index + 1}. {topic.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {topic.questions.length > 0 && (
                      <Badge variant="secondary">
                        {topic.questions.length} questions
                      </Badge>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </div>
                {topic.description && (
                  <CardDescription className="mt-2">
                    {topic.description}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="ml-12 space-y-6">
              {/* Resources */}
              {topic.resources && topic.resources.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Learning Resources</h4>
                  <div className="grid gap-2">
                    {topic.resources.map((resource, idx) => (
                      <ResourceItem key={idx} resource={resource} />
                    ))}
                  </div>
                </div>
              )}

              {/* Practice Questions */}
              {topic.questions && topic.questions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Practice Questions</h4>
                  <div className="grid gap-2">
                    {topic.questions.slice(0, 3).map((question) => (
                      <QuestionItem key={question.id} question={question} />
                    ))}
                    {topic.questions.length > 3 && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/questions?topic=${topic.id}`}>
                          View all {topic.questions.length} questions
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant={isCompleted ? "secondary" : "default"}
                  size="sm"
                  onClick={onToggleCompletion}
                >
                  {isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
                </Button>
                {topic.questions.length > 0 && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/questions?topic=${topic.id}`}>
                      Practice Questions
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

function ResourceItem({ resource }: { resource: Resource }) {
  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'video':
        return '🎥'
      case 'article':
        return '📄'
      case 'tutorial':
        return '📚'
      case 'documentation':
        return '📖'
      default:
        return '🔗'
    }
  }

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
    >
      <span className="text-lg">{getResourceIcon(resource.type)}</span>
      <div className="flex-1 min-w-0">
        <div className="font-medium group-hover:text-primary transition-colors">
          {resource.title}
        </div>
        <div className="text-sm text-muted-foreground capitalize">
          {resource.type}
        </div>
      </div>
      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </a>
  )
}

function QuestionItem({ question }: { question: SimplifiedQuestion }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-600 bg-green-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'hard':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <Link
      href={`/questions/${question.id}`}
      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium group-hover:text-primary transition-colors">
          {question.title}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
            {question.difficulty}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {question.type}
          </span>
        </div>
      </div>
      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </Link>
  )
}

function RoadmapTimelineSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="h-6 bg-muted rounded w-48 animate-pulse" />
          <div className="h-4 bg-muted rounded w-64 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="h-4 bg-muted rounded w-20 animate-pulse" />
            <div className="h-4 bg-muted rounded w-24 animate-pulse" />
          </div>
        </CardContent>
      </Card>

      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-muted rounded w-full animate-pulse" />
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}