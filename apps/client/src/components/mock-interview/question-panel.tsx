'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, 
  Target, 
  Lightbulb, 
  Code, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Question } from '@tech-interview-platform/shared-types';

interface QuestionPanelProps {
  question: Question;
}

export function QuestionPanel({ question }: QuestionPanelProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'coding':
        return <Code className="h-4 w-4" />;
      case 'system-design':
        return <Target className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  // Parse question content to extract examples and constraints
  const parseQuestionContent = (content: string) => {
    const sections = content.split('\n\n');
    const description = sections[0] || content;
    
    // Look for example sections
    const exampleSections = sections.filter(section => 
      section.toLowerCase().includes('example') || 
      section.toLowerCase().includes('input:') ||
      section.toLowerCase().includes('output:')
    );
    
    // Look for constraints
    const constraintSections = sections.filter(section =>
      section.toLowerCase().includes('constraint') ||
      section.toLowerCase().includes('note:') ||
      section.toLowerCase().includes('follow up')
    );

    return {
      description,
      examples: exampleSections,
      constraints: constraintSections
    };
  };

  const { description, examples, constraints } = parseQuestionContent(question.content);

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Question Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-semibold leading-tight pr-4">
              {question.title}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge 
              variant="outline" 
              className={getDifficultyColor(question.difficulty)}
            >
              {question.difficulty}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              {getTypeIcon(question.type)}
              {question.type}
            </Badge>
            {question.technologies.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
            {question.technologies.length > 3 && (
              <Badge variant="outline">
                +{question.technologies.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* Problem Description */}
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Problem Description
          </h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
          </div>
        </div>

        {/* Examples */}
        {examples.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Examples
              </h3>
              <div className="space-y-4">
                {examples.map((example, index) => (
                  <Card key={index} className="bg-muted/50">
                    <CardContent className="p-4">
                      <pre className="text-sm whitespace-pre-wrap font-mono">
                        {example}
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Constraints */}
        {constraints.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Constraints & Notes
              </h3>
              <div className="space-y-2">
                {constraints.map((constraint, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    <p className="whitespace-pre-wrap">{constraint}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Solution Hints (if available) */}
        {question.solution && (
          <>
            <Separator />
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  Approach Hints
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  <p><strong>Time Complexity:</strong> {question.solution.timeComplexity}</p>
                  <p><strong>Space Complexity:</strong> {question.solution.spaceComplexity}</p>
                  {question.solution.alternativeApproaches.length > 0 && (
                    <div>
                      <p className="font-medium mb-1">Alternative Approaches:</p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {question.solution.alternativeApproaches.map((approach, index) => (
                          <li key={index}>{approach}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Tags */}
        {question.tags.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Related Topics</h3>
              <div className="flex flex-wrap gap-1">
                {question.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}