'use client'

import { useState } from 'react'
import { useSearchQuestions } from '@/services/questions'
import { QuestionList } from '@/components/questions/question-list'
import { QuestionFilters } from '@/components/questions/question-filters'
import { QuestionSearch } from '@/components/questions/question-search'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Skeleton } from '@/components/ui'
import type { SearchQuestionsRequest, Difficulty, QuestionType } from '@/types'

export default function QuestionsPage() {
  const [searchParams, setSearchParams] = useState<SearchQuestionsRequest>({
    page: 1,
    limit: 20,
    sortBy: 'rating',
    sortOrder: 'desc',
  })

  const { data, isLoading, error } = useSearchQuestions(searchParams)

  const handleSearch = (search: string) => {
    setSearchParams(prev => ({
      ...prev,
      search: search || undefined,
      page: 1, // Reset to first page on new search
    }))
  }

  const handleFilterChange = (filters: {
    technologies?: string[]
    difficulty?: Difficulty[]
    type?: QuestionType[]
    roles?: string[]
    companies?: string[]
  }) => {
    setSearchParams(prev => ({
      ...prev,
      ...filters,
      page: 1, // Reset to first page on filter change
    }))
  }

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setSearchParams(prev => ({
      ...prev,
      sortBy: sortBy as any,
      sortOrder,
      page: 1, // Reset to first page on sort change
    }))
  }

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({
      ...prev,
      page,
    }))
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <h2 className="text-lg font-semibold mb-2">Error Loading Questions</h2>
              <p>There was an error loading the questions. Please try again later.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Question Bank</h1>
        <p className="text-muted-foreground">
          Explore our comprehensive collection of technical interview questions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionFilters
                onFilterChange={handleFilterChange}
                currentFilters={{
                  technologies: searchParams.technologies,
                  difficulty: searchParams.difficulty,
                  type: searchParams.type,
                  roles: searchParams.roles,
                  companies: searchParams.companies,
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search Bar */}
          <div className="mb-6">
            <QuestionSearch
              onSearch={handleSearch}
              onSortChange={handleSortChange}
              currentSort={{
                sortBy: searchParams.sortBy || 'rating',
                sortOrder: searchParams.sortOrder || 'desc',
              }}
              placeholder="Search questions by title, content, or technology..."
            />
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <QuestionList
              questions={data?.questions || []}
              pagination={data?.pagination}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  )
}