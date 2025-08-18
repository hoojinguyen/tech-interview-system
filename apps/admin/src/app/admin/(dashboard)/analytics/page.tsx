'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, TrendingUp, Users, FileText, BarChart3, Star } from 'lucide-react'
import { adminService } from '@/services/admin'
import {
  QuestionsByDifficultyChart,
  QuestionsByTypeChart,
  MockInterviewsByLevelChart,
  ContentApprovalStatusChart,
  UsageTrendsChart,
} from '@/components/charts/analytics-charts'

export default function AnalyticsPage() {
  // Fetch analytics data
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: () => adminService.getPlatformAnalytics(),
    refetchInterval: 60000, // Refetch every minute
  })

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Platform usage statistics and insights</p>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>Failed to load analytics data. Please try refreshing the page.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Platform usage statistics and insights</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))
        ) : analytics ? (
          [
            {
              title: 'Total Questions',
              value: analytics.overview.totalQuestions.toLocaleString(),
              subtitle: `${analytics.questions.approvedQuestions} approved`,
              icon: FileText,
              color: 'text-blue-600',
              bgColor: 'bg-blue-50',
            },
            {
              title: 'Mock Interviews',
              value: analytics.overview.totalMockInterviews.toLocaleString(),
              subtitle: `${analytics.mockInterviews.completionRate}% completion rate`,
              icon: BarChart3,
              color: 'text-purple-600',
              bgColor: 'bg-purple-50',
            },
            {
              title: 'Average Rating',
              value: analytics.questions.averageRating.toFixed(1),
              subtitle: 'Question quality score',
              icon: Star,
              color: 'text-yellow-600',
              bgColor: 'bg-yellow-50',
            },
            {
              title: 'Average Score',
              value: analytics.mockInterviews.averageScore.toFixed(1),
              subtitle: 'Mock interview performance',
              icon: TrendingUp,
              color: 'text-green-600',
              bgColor: 'bg-green-50',
            },
          ].map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">{stat.subtitle}</p>
              </CardContent>
            </Card>
          ))
        ) : null}
      </div>

      {/* Detailed Analytics */}
      {analytics && (
        <>
          {/* Usage Trends */}
          <div className="grid grid-cols-1 gap-6">
            <UsageTrendsChart />
          </div>

          {/* Question Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QuestionsByDifficultyChart data={analytics.questions.questionsByDifficulty} />
            <QuestionsByTypeChart data={analytics.questions.questionsByType} />
          </div>

          {/* Content and Interview Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContentApprovalStatusChart 
              data={{
                approved: analytics.questions.approvedQuestions,
                pending: analytics.questions.pendingQuestions,
              }} 
            />
            <MockInterviewsByLevelChart data={analytics.mockInterviews.interviewsByLevel} />
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Question Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Question Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Questions</span>
                  <Badge variant="outline">{analytics.questions.totalQuestions}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Approved</span>
                  <Badge variant="default">{analytics.questions.approvedQuestions}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending Review</span>
                  <Badge variant="secondary">{analytics.questions.pendingQuestions}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <Badge variant="outline">{analytics.questions.averageRating.toFixed(1)} ⭐</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Interview Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <span>Interview Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Interviews</span>
                  <Badge variant="outline">{analytics.mockInterviews.totalInterviews}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <Badge variant="default">{analytics.mockInterviews.completedInterviews}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <Badge variant="outline">{analytics.mockInterviews.completionRate}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Score</span>
                  <Badge variant="outline">{analytics.mockInterviews.averageScore.toFixed(1)}/100</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Usage Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Today's Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Questions Viewed</span>
                  <Badge variant="outline">{analytics.usage.questionsViewedToday}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Interviews Started</span>
                  <Badge variant="default">{analytics.usage.mockInterviewsStartedToday}</Badge>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-xs text-gray-500 mb-2">Platform Health:</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Content Quality</span>
                      <span className="text-green-600">
                        {analytics.questions.averageRating >= 4 ? 'Excellent' : 
                         analytics.questions.averageRating >= 3 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Interview Success</span>
                      <span className="text-green-600">
                        {analytics.mockInterviews.completionRate >= 70 ? 'High' : 
                         analytics.mockInterviews.completionRate >= 50 ? 'Medium' : 'Low'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}