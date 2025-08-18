'use client'

import { useQuestion } from '@/services/questions'
import { QuestionDetail } from '@/components/questions/question-detail'
import { Card, CardContent } from '@/components/ui'
import { Skeleton } from '@/components/ui'
import { Button } from '@/components/ui'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { PageProps } from '@/types'

export default function QuestionDetailPage({ params }: PageProps) {
  const { data: question, isLoading, error } = useQuestion(params.id)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !question) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/questions">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Questions
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <h2 className="text-lg font-semibold mb-2">Question Not Found</h2>
              <p>The question you&apos;re looking for doesn&apos;t exist or has been removed.</p>
              <Link href="/questions" className="mt-4 inline-block">
                <Button>Browse All Questions</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/questions">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Questions
          </Button>
        </Link>
      </div>
      
      <QuestionDetail question={question} />
    </div>
  )
}