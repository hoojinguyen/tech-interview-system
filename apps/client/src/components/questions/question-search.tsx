'use client'

import { useState } from 'react'
import { Search, SortAsc, SortDesc } from 'lucide-react'
import { 
  Input, 
  Button, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui'

interface QuestionSearchProps {
  onSearch: (search: string) => void
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  currentSort: {
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }
  placeholder?: string
}

const sortOptions = [
  { value: 'rating', label: 'Rating' },
  { value: 'createdAt', label: 'Date Added' },
  { value: 'difficulty', label: 'Difficulty' },
  { value: 'title', label: 'Title' },
]

export function QuestionSearch({ 
  onSearch, 
  onSortChange, 
  currentSort, 
  placeholder = "Search questions..." 
}: QuestionSearchProps) {
  const [searchValue, setSearchValue] = useState('')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchValue)
  }

  const handleSortByChange = (sortBy: string) => {
    onSortChange(sortBy, currentSort.sortOrder)
  }

  const handleSortOrderToggle = () => {
    const newOrder = currentSort.sortOrder === 'asc' ? 'desc' : 'asc'
    onSortChange(currentSort.sortBy, newOrder)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      {/* Sort Controls */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
        
        <Select value={currentSort.sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSortOrderToggle}
          className="px-2"
        >
          {currentSort.sortOrder === 'asc' ? (
            <SortAsc className="w-4 h-4" />
          ) : (
            <SortDesc className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  )
}