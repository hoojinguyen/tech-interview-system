import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Target, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RoadmapTimeline } from '@/components/roadmap/roadmap-timeline'
import { RoadmapProvider } from '@/components/roadmap/roadmap-provider'
import { RoadmapProgressCard } from '@/components/roadmap/roadmap-progress-card'

interface RoadmapPageProps {
  params: {
    role: string
    level: string
  }
}

export async function generateMetadata({ params }: RoadmapPageProps): Promise<Metadata> {
  const { role, level } = params
  
  return {
    title: `${role} ${level} Roadmap | Tech Interview Platform`,
    description: `Comprehensive ${level} level roadmap for ${role} interviews. Learn essential skills, practice questions, and track your progress.`,
  }
}

export default function RoadmapPage({ params }: RoadmapPageProps) {
  const { role, level } = params

  return (
    <RoadmapProvider role={role} level={level}>
      <RoadmapContent role={role} level={level} />
    </RoadmapProvider>
  )
}

function RoadmapContent({ role, level }: { role: string; level: string }) {
  return (
    <div className="container py-12">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/roadmaps">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Roadmaps
          </Link>
        </Button>
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/roadmaps" className="hover:text-foreground">
            Roadmaps
          </Link>
          <span>/</span>
          <Link href={`/roadmaps/${role}`} className="hover:text-foreground capitalize">
            {role.replace('-', ' ')}
          </Link>
          <span>/</span>
          <span className="text-foreground capitalize">{level}</span>
        </nav>
      </div>

      {/* Roadmap Header */}
      <RoadmapHeader role={role} level={level} />

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Roadmap Timeline - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <RoadmapTimeline />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <RoadmapProgressCard />
          <RoadmapActions role={role} level={level} />
        </div>
      </div>
    </div>
  )
}

function RoadmapHeader({ role, level }: { role: string; level: string }) {
  return (
    <div className="mb-12">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 capitalize">
            {role.replace('-', ' ')} - {level} Level
          </h1>
          <p className="text-lg text-muted-foreground">
            Master the essential skills and concepts needed for {level} level {role.replace('-', ' ')} interviews
          </p>
        </div>
        <Badge variant="outline" className="capitalize">
          {level}
        </Badge>
      </div>
    </div>
  )
}



function RoadmapActions({ role, level }: { role: string; level: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Practice and test your knowledge
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full" asChild>
          <Link href={`/questions?role=${role}&level=${level}`}>
            <BookOpen className="mr-2 h-4 w-4" />
            Practice Questions
          </Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/mock-interviews?role=${role}&level=${level}`}>
            <Play className="mr-2 h-4 w-4" />
            Start Mock Interview
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}