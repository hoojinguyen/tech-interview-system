'use client'

import { Target } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useRoadmapProgress } from '@/lib/hooks/use-roadmap-progress'

export function RoadmapProgressCard() {
  const { progress, totalTopics, completedTopics } = useRoadmapProgress()
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Your Progress
        </CardTitle>
        <CardDescription>
          Track your learning journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress || 0)}%</span>
          </div>
          <Progress value={progress || 0} className="h-2" />
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedTopics || 0}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalTopics || 0}</div>
              <div className="text-sm text-muted-foreground">Total Topics</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}