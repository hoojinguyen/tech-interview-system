'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BarChart3,
  FileText,
  Users,
  TrendingUp,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Activity,
  Map,
  Star,
} from 'lucide-react'
import { adminService, ContentOverview } from '@/services/admin'
import Link from 'next/link'

export default function AdminDashboard() {
  // Fetch content overview data
  const { data: contentOverview, isLoading, error } = useQuery({
    queryKey: ['admin', 'content-overview'],
    queryFn: () => adminService.getContentOverview(),
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  // Mock recent activity data (in a real app, this would come from an API)
  const recentActivity = [
    {
      type: 'question',
      title: 'New question submitted: "React Hooks Best Practices"',
      time: '2 minutes ago',
      status: 'pending',
    },
    {
      type: 'approval',
      title: 'Question approved: "JavaScript Closures"',
      time: '15 minutes ago',
      status: 'approved',
    },
    {
      type: 'user',
      title: 'New user registered: john.doe@email.com',
      time: '1 hour ago',
      status: 'active',
    },
    {
      type: 'interview',
      title: 'Mock interview completed: Senior Backend role',
      time: '2 hours ago',
      status: 'completed',
    },
  ]

  const quickActions = [
    { label: 'Add Question', icon: Plus, href: '/admin/content/questions/new' },
    { label: 'Create Roadmap', icon: Plus, href: '/admin/roadmaps/new' },
    { label: 'Manage Users', icon: Users, href: '/admin/users' },
    { label: 'View Analytics', icon: BarChart3, href: '/admin/analytics' },
    { label: 'Pending Reviews', icon: Eye, href: '/admin/content?status=pending' },
  ]

  // Generate stats from content overview data
  const getStats = (data: ContentOverview | undefined) => {
    if (!data) return []

    return [
      {
        title: 'Total Questions',
        value: data.questions.total.toLocaleString(),
        change: `${data.questions.pending} pending approval`,
        icon: FileText,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      },
      {
        title: 'Active Roadmaps',
        value: data.roadmaps.total.toString(),
        change: `${data.roles.total} roles available`,
        icon: Map,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      },
      {
        title: 'Mock Interviews',
        value: data.mockInterviews.total.toLocaleString(),
        change: `${data.mockInterviews.completed} completed`,
        icon: BarChart3,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
      },
      {
        title: 'Approval Rate',
        value: data.questions.total > 0 
          ? `${Math.round((data.questions.approved / data.questions.total) * 100)}%`
          : '0%',
        change: `${data.questions.approved} approved`,
        icon: CheckCircle,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
      },
    ]
  }

  const stats = getStats(contentOverview)

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to the Tech Interview Platform admin panel</p>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>Failed to load dashboard data. Please try refreshing the page.</span>
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Tech Interview Platform admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          // Loading skeletons
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
        ) : (
          stats.map((stat) => (
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
                <p className="text-xs text-gray-600 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Content Overview Cards */}
      {contentOverview && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Questions Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Questions Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Approved</span>
                <Badge variant="default">{contentOverview.questions.approved}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <Badge variant="secondary">{contentOverview.questions.pending}</Badge>
              </div>
              <div className="pt-2 border-t">
                <div className="text-xs text-gray-500 mb-2">By Difficulty:</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Easy</span>
                    <span className="text-green-600">{contentOverview.questions.byDifficulty.easy}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Medium</span>
                    <span className="text-yellow-600">{contentOverview.questions.byDifficulty.medium}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Hard</span>
                    <span className="text-red-600">{contentOverview.questions.byDifficulty.hard}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Roadmaps Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Map className="h-5 w-5 text-green-600" />
                <span>Roadmaps Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Roadmaps</span>
                <Badge variant="outline">{contentOverview.roadmaps.total}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Available Roles</span>
                <Badge variant="outline">{contentOverview.roles.total}</Badge>
              </div>
              <div className="pt-2 border-t">
                <div className="text-xs text-gray-500 mb-2">By Level:</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Junior</span>
                    <span className="text-blue-600">{contentOverview.roadmaps.byLevel.junior}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Mid-level</span>
                    <span className="text-purple-600">{contentOverview.roadmaps.byLevel.mid}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Senior</span>
                    <span className="text-red-600">{contentOverview.roadmaps.byLevel.senior}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mock Interviews Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-purple-600" />
                <span>Mock Interviews</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total</span>
                <Badge variant="outline">{contentOverview.mockInterviews.total}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <Badge variant="default">{contentOverview.mockInterviews.completed}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active</span>
                <Badge variant="secondary">{contentOverview.mockInterviews.active}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Abandoned</span>
                <Badge variant="destructive">{contentOverview.mockInterviews.abandoned}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {activity.status === 'pending' && (
                      <Clock className="h-4 w-4 text-yellow-500 mt-1" />
                    )}
                    {activity.status === 'approved' && (
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    )}
                    {activity.status === 'active' && (
                      <Users className="h-4 w-4 text-blue-500 mt-1" />
                    )}
                    {activity.status === 'completed' && (
                      <BarChart3 className="h-4 w-4 text-purple-500 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Badge
                    variant={
                      activity.status === 'pending'
                        ? 'secondary'
                        : activity.status === 'approved'
                        ? 'default'
                        : 'outline'
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="justify-start h-auto p-4 hover:bg-gray-50"
                  asChild
                >
                  <Link href={action.href}>
                    <action.icon className="mr-3 h-4 w-4" />
                    {action.label}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}