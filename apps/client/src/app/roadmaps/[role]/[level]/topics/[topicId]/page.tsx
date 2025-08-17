import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Circle, Clock, BookOpen, ExternalLink, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TopicDetailProvider } from '@/components/roadmap/topic-detail-provider'
import { TopicContent } from '@/components/roadmap/topic-content'

interface TopicDetailPageProps {
  params: {
    role: string
    level: string
    topicId: string
  }
}

export async function generateMetadata({ params }: TopicDetailPageProps): Promise<Metadata> {
  const { role, level, topicId } = params
  
  return {
    title: `Topic Details | ${role} ${level} Roadmap | Tech Interview Platform`,
    description: `Detailed learning resources and practice questions for ${role} ${level} roadmap topic.`,
  }
}

export default function TopicDetailPage({ params }: TopicDetailPageProps) {
  const { role, level, topicId } = params

  return (
    <TopicDetailProvider role={role} level={level} topicId={topicId}>
      <TopicDetailContent role={role} level={level} topicId={topicId} />
    </TopicDetailProvider>
  )
}

function TopicDetailContent({ role, level, topicId }: { role: string; level: string; topicId: string }) {
  return (
    <div className="container py-12">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/roadmaps/${role}/${level}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Roadmap
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
          <Link href={`/roadmaps/${role}/${level}`} className="hover:text-foreground capitalize">
            {level}
          </Link>
          <span>/</span>
          <span className="text-foreground">Topic Details</span>
        </nav>
      </div>

      {/* Main Content */}
      <TopicContent />
    </div>
  )
}