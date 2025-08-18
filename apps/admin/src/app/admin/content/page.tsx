'use client'

import { useState } from 'react'
import { DataTable, Column, DataTableAction } from '@/components/shared/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Trash2, Eye, Plus } from 'lucide-react'

interface Question {
  id: string
  title: string
  type: string
  difficulty: string
  technology: string
  status: 'approved' | 'pending' | 'rejected'
  views: number
  rating: number
  createdAt: string
}

export default function ContentManagementPage() {
  const [questions] = useState<Question[]>([
    {
      id: '1',
      title: 'Implement Binary Search',
      type: 'Coding',
      difficulty: 'Medium',
      technology: 'JavaScript',
      status: 'approved',
      views: 1234,
      rating: 4.8,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'React Performance Optimization',
      type: 'Conceptual',
      difficulty: 'Hard',
      technology: 'React',
      status: 'pending',
      views: 892,
      rating: 4.6,
      createdAt: '2024-01-14',
    },
    {
      id: '3',
      title: 'Design a URL Shortener',
      type: 'System Design',
      difficulty: 'Hard',
      technology: 'Architecture',
      status: 'approved',
      views: 2156,
      rating: 4.9,
      createdAt: '2024-01-13',
    },
  ])

  const columns: Column<Question>[] = [
    {
      key: 'title',
      title: 'Title',
      sortable: true,
      filterable: true,
    },
    {
      key: 'type',
      title: 'Type',
      sortable: true,
      filterable: true,
      render: (value) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: 'difficulty',
      title: 'Difficulty',
      sortable: true,
      filterable: true,
      render: (value) => (
        <Badge
          variant={
            value === 'Easy'
              ? 'default'
              : value === 'Medium'
              ? 'secondary'
              : 'destructive'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'technology',
      title: 'Technology',
      sortable: true,
      filterable: true,
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      filterable: true,
      render: (value) => (
        <Badge
          variant={
            value === 'approved'
              ? 'default'
              : value === 'pending'
              ? 'secondary'
              : 'destructive'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'views',
      title: 'Views',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    {
      key: 'rating',
      title: 'Rating',
      sortable: true,
      render: (value) => `⭐ ${value}`,
    },
  ]

  const actions: DataTableAction<Question>[] = [
    {
      label: 'View',
      onClick: (question) => console.log('View question:', question.id),
      icon: <Eye className="h-4 w-4" />,
    },
    {
      label: 'Edit',
      onClick: (question) => console.log('Edit question:', question.id),
      icon: <Edit className="h-4 w-4" />,
    },
    {
      label: 'Delete',
      onClick: (question) => console.log('Delete question:', question.id),
      variant: 'destructive',
      icon: <Trash2 className="h-4 w-4" />,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600">Manage questions, roadmaps, and learning materials</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,456</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Approved Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">15</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
          </CardContent>
        </Card>
      </div>

      {/* Questions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={questions}
            columns={columns}
            actions={actions}
            searchable
            filterable
            pagination
          />
        </CardContent>
      </Card>
    </div>
  )
}