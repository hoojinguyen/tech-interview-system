'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, Clock, BookOpen, ExternalLink, Target, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTopicDetailContext } from './topic-detail-provider'
import { useTopicDetail } from '@/lib/hooks/use-topic-detail'
import { useRoadmapProgress } from '@/lib/hooks/use-roadmap-progress'
import { Resource } from '@/types'
import Link from 'next/link'

export function TopicContent() {
  const { topicId } = useTopicDetailContext()
  const { topic, isLoading, error } = useTopicDetail()
  const { isTopicCompleted, toggleTopicCompletion } = useRoadmapProgress()

  if (isLoading) {
    return <TopicContentSkeleton />
  }

  if (error || !topic) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p>Unable to load topic details. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isCompleted = isTopicCompleted(topicId)

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Topic Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleTopicCompletion(topicId)}
                  className="flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors hover:scale-110 mt-1"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                </button>
                <div>
                  <CardTitle className="text-2xl mb-2">{topic.title}</CardTitle>
                  <CardDescription className="text-base">
                    {topic.description}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={isCompleted ? "default" : "secondary"}>
                {isCompleted ? "Completed" : "In Progress"}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resources">Learning Resources</TabsTrigger>
            <TabsTrigger value="questions">Practice Questions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Learning Resources
                </CardTitle>
                <CardDescription>
                  Curated resources to help you master this topic
                </CardDescription>
              </CardHeader>
              <CardContent>
                {topic.resources && topic.resources.length > 0 ? (
                  <div className="space-y-4">
                    {topic.resources.map((resource, index) => (
                      <ResourceCard key={index} resource={resource} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No resources available for this topic yet.</p>
                    <p className="text-sm">Check back later for updates!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="questions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Practice Questions
                </CardTitle>
                <CardDescription>
                  Test your understanding with these practice questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {topic.questions && topic.questions.length > 0 ? (
                  <div className="space-y-4">
                    {topic.questions.map((question) => (
                      <QuestionCard key={question.id} question={question} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No practice questions available for this topic yet.</p>
                    <p className="text-sm">Check back later for updates!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <TopicProgress topic={topic} isCompleted={isCompleted} onToggleCompletion={() => toggleTopicCompletion(topicId)} />
        <TopicActions topic={topic} />
      </div>
    </div>
  )
}

function ResourceCard({ resource }: { resource: Resource }) {
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

  const getResourceColor = (type: Resource['type']) => {
    switch (type) {
      case 'video':
        return 'bg-red-50 border-red-200'
      case 'article':
        return 'bg-blue-50 border-blue-200'
      case 'tutorial':
        return 'bg-green-50 border-green-200'
      case 'documentation':
        return 'bg-purple-50 border-purple-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block p-4 rounded-lg border-2 transition-all hover:shadow-md group ${getResourceColor(resource.type)}`}
    >
      <div className="flex items-start gap-4">
        <span className="text-2xl">{getResourceIcon(resource.type)}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold group-hover:text-primary transition-colors mb-1">
            {resource.title}
          </h3>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="capitalize">
              {resource.type}
            </Badge>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>
    </a>
  )
}

function QuestionCard({ question }: { question: any }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'hard':
        return 'text-red-600 bg-red-100 border-red-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  return (
    <Link
      href={`/questions/${question.id}`}
      className="block p-4 rounded-lg border-2 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold group-hover:text-primary transition-colors">
          {question.title}
        </h3>
        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
      </div>
      <div className="flex items-center gap-2">
        <Badge className={getDifficultyColor(question.difficulty)}>
          {question.difficulty}
        </Badge>
        <Badge variant="outline">
          {question.type}
        </Badge>
      </div>
    </Link>
  )
}

function TopicProgress({ topic, isCompleted, onToggleCompletion }: { 
  topic: any
  isCompleted: boolean
  onToggleCompletion: () => void 
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status</span>
          <Badge variant={isCompleted ? "default" : "secondary"}>
            {isCompleted ? "Completed" : "In Progress"}
          </Badge>
        </div>
        
        <Button 
          onClick={onToggleCompletion}
          variant={isCompleted ? "secondary" : "default"}
          className="w-full"
        >
          {isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
        </Button>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Resources</span>
            <span>{topic.resources?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Questions</span>
            <span>{topic.questions?.length || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TopicActions({ topic }: { topic: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topic.questions && topic.questions.length > 0 && (
          <Button className="w-full" asChild>
            <Link href={`/questions?topic=${topic.id}`}>
              <Target className="mr-2 h-4 w-4" />
              Practice Questions
            </Link>
          </Button>
        )}
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/mock-interviews?topic=${topic.id}`}>
            <Play className="mr-2 h-4 w-4" />
            Mock Interview
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function TopicContentSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-muted rounded w-full animate-pulse" />
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="h-6 bg-muted rounded w-48 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="h-6 bg-muted rounded w-24 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}