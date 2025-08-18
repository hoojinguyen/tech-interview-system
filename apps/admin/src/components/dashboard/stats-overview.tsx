'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Map, 
  Activity, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Users
} from 'lucide-react'
import { adminService } from '@/services/admin'

export function StatsOverview() {
  const { data: contentOverview, isLoading } = useQuery({
    queryKey: ['admin', 'content-overview'],
    queryFn: () => adminService.getContentOverview(),
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
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
        ))}
      </div>
    )
  }

  if (!contentOverview) {
    return null
  }

  const stats = [
    {
      title: 'Total Questions',
      value: contentOverview.questions.total.toLocaleString(),
      change: `${contentOverview.questions.pending} pending`,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: contentOverview.questions.approved > contentOverview.questions.pending ? 'up' : 'down',
    },
    {
      title: 'Active Roadmaps',
      value: contentOverview.roadmaps.total.toString(),
      change: `${contentOverview.roles.total} roles`,
      icon: Map,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: 'up',
    },
    {
      title: 'Mock Interviews',
      value: contentOverview.mockInterviews.total.toLocaleString(),
      change: `${contentOverview.mockInterviews.completed} completed`,
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: contentOverview.mockInterviews.completed > contentOverview.mockInterviews.abandoned ? 'up' : 'down',
    },
    {
      title: 'Approval Rate',
      value: contentOverview.questions.total > 0 
        ? `${Math.round((contentOverview.questions.approved / contentOverview.questions.total) * 100)}%`
        : '0%',
      change: `${contentOverview.questions.approved} approved`,
      icon: CheckCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: 'up',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
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
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function ContentHealthIndicators() {
  const { data: contentOverview } = useQuery({
    queryKey: ['admin', 'content-overview'],
    queryFn: () => adminService.getContentOverview(),
    refetchInterval: 30000,
  })

  if (!contentOverview) {
    return null
  }

  const pendingCount = contentOverview.questions.pending
  const approvalRate = contentOverview.questions.total > 0 
    ? (contentOverview.questions.approved / contentOverview.questions.total) * 100 
    : 0
  const completionRate = contentOverview.mockInterviews.total > 0
    ? (contentOverview.mockInterviews.completed / contentOverview.mockInterviews.total) * 100
    : 0

  const indicators = [
    {
      label: 'Pending Reviews',
      value: pendingCount,
      status: pendingCount > 50 ? 'critical' : pendingCount > 20 ? 'warning' : 'good',
      icon: Clock,
    },
    {
      label: 'Content Quality',
      value: `${approvalRate.toFixed(0)}%`,
      status: approvalRate >= 80 ? 'good' : approvalRate >= 60 ? 'warning' : 'critical',
      icon: CheckCircle,
    },
    {
      label: 'Interview Success',
      value: `${completionRate.toFixed(0)}%`,
      status: completionRate >= 70 ? 'good' : completionRate >= 50 ? 'warning' : 'critical',
      icon: Activity,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <span>Platform Health</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {indicators.map((indicator) => (
            <div key={indicator.label} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <indicator.icon className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{indicator.label}</span>
              </div>
              <Badge
                variant={
                  indicator.status === 'good' 
                    ? 'default' 
                    : indicator.status === 'warning' 
                    ? 'secondary' 
                    : 'destructive'
                }
              >
                {indicator.value}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}