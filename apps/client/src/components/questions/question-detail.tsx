'use client'

import { useState } from 'react'
import { Star, Clock, Building2, Users, Code, Brain, Settings, MessageSquare, Copy, Check } from 'lucide-react'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Badge, 
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Separator
} from '@/components/ui'
import type { QuestionWithDetails } from '@/types'

interface QuestionDetailProps {
  question: QuestionWithDetails
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

export function QuestionDetail({ question }: QuestionDetailProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  
  const TypeIcon = typeIcons[question.type]
  const rating = parseFloat(question.rating)
  const hasRating = !isNaN(rating) && question.ratingCount > 0

  const copyToClipboard = async (code: string, language: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(language)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-4">{question.title}</CardTitle>
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
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

                {hasRating && (
                  <Badge variant="outline" className="gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {rating.toFixed(1)} ({question.ratingCount} reviews)
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            {/* Technologies */}
            {question.technologies.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-1">
                  {question.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Companies */}
            {question.companies.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  Companies
                </h4>
                <div className="flex flex-wrap gap-1">
                  {question.companies.map((company) => (
                    <Badge key={company} variant="outline" className="text-xs">
                      {company}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Roles */}
            {question.roles.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Roles
                </h4>
                <div className="flex flex-wrap gap-1">
                  {question.roles.map((role) => (
                    <Badge key={role} variant="outline" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Created Date */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground pt-2">
            <Clock className="w-4 h-4" />
            <span>Added on {new Date(question.createdAt).toLocaleDateString()}</span>
          </div>
        </CardHeader>
      </Card>

      {/* Question Content and Solution */}
      <Tabs defaultValue="question" className="space-y-4">
        <TabsList>
          <TabsTrigger value="question">Question</TabsTrigger>
          {question.solution && (
            <TabsTrigger value="solution">Solution</TabsTrigger>
          )}
          {question.tags.length > 0 && (
            <TabsTrigger value="tags">Tags</TabsTrigger>
          )}
        </TabsList>

        {/* Question Tab */}
        <TabsContent value="question">
          <Card>
            <CardHeader>
              <CardTitle>Problem Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap">{question.content}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Solution Tab */}
        {question.solution && (
          <TabsContent value="solution" className="space-y-4">
            {/* Explanation */}
            <Card>
              <CardHeader>
                <CardTitle>Explanation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap">{question.solution.explanation}</div>
                </div>
              </CardContent>
            </Card>

            {/* Code Examples */}
            {question.solution.codeExamples && question.solution.codeExamples.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Code Solutions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {question.solution.codeExamples.map((example, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{example.language}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(example.code, example.language)}
                        >
                          {copiedCode === example.language ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{example.code}</code>
                      </pre>
                      
                      {example.explanation && (
                        <p className="text-sm text-muted-foreground">
                          {example.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Complexity Analysis */}
            {(question.solution.timeComplexity || question.solution.spaceComplexity) && (
              <Card>
                <CardHeader>
                  <CardTitle>Complexity Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {question.solution.timeComplexity && (
                    <div>
                      <span className="font-medium">Time Complexity: </span>
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {question.solution.timeComplexity}
                      </code>
                    </div>
                  )}
                  {question.solution.spaceComplexity && (
                    <div>
                      <span className="font-medium">Space Complexity: </span>
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {question.solution.spaceComplexity}
                      </code>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Alternative Approaches */}
            {question.solution.alternativeApproaches && question.solution.alternativeApproaches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Alternative Approaches</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {question.solution.alternativeApproaches.map((approach, index) => (
                      <li key={index} className="text-sm">
                        • {approach}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}

        {/* Tags Tab */}
        {question.tags.length > 0 && (
          <TabsContent value="tags">
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Related Topics */}
      {question.relatedTopics && question.relatedTopics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Related Learning Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.relatedTopics.map((topic) => (
                <div key={topic.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-1">{topic.title}</h4>
                  {topic.description && (
                    <p className="text-sm text-muted-foreground">{topic.description}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}