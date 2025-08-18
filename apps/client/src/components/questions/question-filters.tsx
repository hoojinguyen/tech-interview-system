'use client'

import { useState } from 'react'
import { X, Filter } from 'lucide-react'
import { 
  Button, 
  Badge, 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger,
  Separator
} from '@/components/ui'
import { MultiSelect } from './multi-select'
import type { Difficulty, QuestionType } from '@/types'

interface QuestionFiltersProps {
  onFilterChange: (filters: {
    technologies?: string[]
    difficulty?: Difficulty[]
    type?: QuestionType[]
    roles?: string[]
    companies?: string[]
  }) => void
  currentFilters: {
    technologies?: string[]
    difficulty?: Difficulty[]
    type?: QuestionType[]
    roles?: string[]
    companies?: string[]
  }
}

// Predefined options for filters
const difficultyOptions: Difficulty[] = ['easy', 'medium', 'hard']
const typeOptions: QuestionType[] = ['coding', 'conceptual', 'system-design', 'behavioral']

const technologyOptions = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'Go',
  'Rust', 'Swift', 'Kotlin', 'PHP', 'Ruby', 'C#', 'SQL', 'MongoDB', 'PostgreSQL',
  'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'Linux'
]

const roleOptions = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer',
  'Mobile Developer', 'Data Engineer', 'Machine Learning Engineer', 'Software Architect',
  'Technical Lead', 'Engineering Manager', 'Site Reliability Engineer', 'Security Engineer'
]

const companyOptions = [
  'Google', 'Meta', 'Amazon', 'Apple', 'Microsoft', 'Netflix', 'Uber', 'Airbnb',
  'Spotify', 'Twitter', 'LinkedIn', 'Salesforce', 'Adobe', 'Nvidia', 'Tesla',
  'Stripe', 'Shopify', 'Atlassian', 'Dropbox', 'Slack'
]

export function QuestionFilters({ onFilterChange, currentFilters }: QuestionFiltersProps) {
  const [isOpen, setIsOpen] = useState(true)

  const handleFilterUpdate = (key: string, values: string[]) => {
    onFilterChange({
      ...currentFilters,
      [key]: values.length > 0 ? values : undefined,
    })
  }

  const clearAllFilters = () => {
    onFilterChange({})
  }

  const getActiveFilterCount = () => {
    return Object.values(currentFilters).filter(filter => filter && filter.length > 0).length
  }

  const activeFilterCount = getActiveFilterCount()

  return (
    <div className="space-y-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </div>
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-4 mt-4">
          {/* Clear All Filters */}
          {activeFilterCount > 0 && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear All
              </Button>
            </div>
          )}

          {/* Difficulty Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <MultiSelect
              options={difficultyOptions.map(d => ({ value: d, label: d.charAt(0).toUpperCase() + d.slice(1) }))}
              selected={currentFilters.difficulty || []}
              onChange={(values) => handleFilterUpdate('difficulty', values)}
              placeholder="Select difficulty levels"
            />
          </div>

          <Separator />

          {/* Question Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Question Type</label>
            <MultiSelect
              options={typeOptions.map(t => ({ 
                value: t, 
                label: t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ') 
              }))}
              selected={currentFilters.type || []}
              onChange={(values) => handleFilterUpdate('type', values)}
              placeholder="Select question types"
            />
          </div>

          <Separator />

          {/* Technologies Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Technologies</label>
            <MultiSelect
              options={technologyOptions.map(t => ({ value: t, label: t }))}
              selected={currentFilters.technologies || []}
              onChange={(values) => handleFilterUpdate('technologies', values)}
              placeholder="Select technologies"
              searchable
            />
          </div>

          <Separator />

          {/* Roles Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Roles</label>
            <MultiSelect
              options={roleOptions.map(r => ({ value: r, label: r }))}
              selected={currentFilters.roles || []}
              onChange={(values) => handleFilterUpdate('roles', values)}
              placeholder="Select roles"
              searchable
            />
          </div>

          <Separator />

          {/* Companies Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Companies</label>
            <MultiSelect
              options={companyOptions.map(c => ({ value: c, label: c }))}
              selected={currentFilters.companies || []}
              onChange={(values) => handleFilterUpdate('companies', values)}
              placeholder="Select companies"
              searchable
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}