'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  BarChart3,
  FileText,
  Users,
  TrendingUp,
  Plus,
  Eye,
  CheckCircle,
  Clock,
} from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Total Questions',
      value: '12,456',
      change: '+234 this week',
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Active Users',
      value: '8,923',
      change: '+12% from last month',
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Mock Interviews',
      value: '1,234',
      change: '+89 today',
      icon: BarChart3,
      color: 'text-purple-600',
    },
    {
      title: 'Avg Rating',
      value: '4.7',
      change: '+0.2 from last week',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ]

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Tech Interview Platform admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-600 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

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
                  className="justify-start h-auto p-4"
                  asChild
                >
                  <a href={action.href}>
                    <action.icon className="mr-3 h-4 w-4" />
                    {action.label}
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}