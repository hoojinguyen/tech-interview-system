'use client'

import Link from 'next/link'
import { Star, Eye, Clock, Building2, Users, Code, Brain, Settings, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui'
import type { Question } from '@/types'

interface QuestionCardProps {
  question: Question
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  hard: 'bg-red-100 text-red-800 border-red-200',
}

const typeIcons = {
  coding: Code,
  conceptual: Brain,
  'system-design': Settings,
  behavioral: MessageSquare,
}

const typeColors = {
  coding: 'bg-blue-100 text-blue-800 border-blue-200',
  conceptual: 'bg-purple-100 text-purple-800 border-purple-200',
  'system-design': 'bg-orange-100 text-orange-800 border-orange-200',
  behavioral: 'bg-pink-100 text-pink-800 border-pink-200',
}

export function QuestionCard({ question }: QuestionCardProps) {
  const TypeIcon = typeIcons[question.type]
  const rating = parseFloat(question.rating)
  const hasRating = !isNaN(rating) && question.ratingCount > 0

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight mb-2">
              <Link 
                href={`/questions/${question.id}`}
                className="hover:text-primary transition-colors"
              >
                {question.title}
              </Link>
            </CardTitle>
            
            {/* Question Type and Difficulty */}
            <div className="flex items-center gap-2 mb-3">
              <Badge 
                variant="outline" 
                className={typeColors[question.type]}
              >
                <TypeIcon className="w-3 h-3 mr-1" />
                {question.type.charAt(0).toUpperCase() + question.type.slice(1).replace('-', ' ')}
              </Badge>
              
              <Badge 
                variant="outline"
                className={difficultyColors[question.difficulty]}
              >
                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Rating */}
          {hasRating && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{rating.toFixed(1)}</span>
              <span>({question.ratingCount})</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Content Preview */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {question.content?.length > 150 
            ? `${question.content.substring(0, 150)}...`
            : question.content
          }
        </p>

        {/* Technologies */}
        {question.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {question.technologies.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {question.technologies.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{question.technologies.length - 4} more
              </Badge>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {/* Companies */}
            {question.companies.length > 0 && (
              <div className="flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                <span>{question.companies.slice(0, 2).join(', ')}</span>
                {question.companies.length > 2 && (
                  <span>+{question.companies.length - 2}</span>
                )}
              </div>
            )}

            {/* Roles */}
            {question.roles.length > 0 && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{question.roles.slice(0, 2).join(', ')}</span>
                {question.roles.length > 2 && (
                  <span>+{question.roles.length - 2}</span>
                )}
              </div>
            )}
          </div>

          {/* Created Date */}
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <Link href={`/questions/${question.id}`}>
            <Button variant="outline" size="sm">
              View Solution
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            {question.solution && (
              <Badge variant="outline" className="text-xs">
                <Eye className="w-3 h-3 mr-1" />
                Solution Available
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}