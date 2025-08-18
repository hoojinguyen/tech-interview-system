'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Brain,
  Code2,
  Zap,
  Target,
  Lightbulb,
  Star
} from 'lucide-react';
import { InterviewFeedback } from '@tech-interview-platform/shared-types';

interface FeedbackDisplayProps {
  feedback: InterviewFeedback;
  compact?: boolean;
}

export function FeedbackDisplay({ feedback, compact = false }: FeedbackDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return '[&>div]:bg-green-500';
    if (score >= 60) return '[&>div]:bg-yellow-500';
    return '[&>div]:bg-red-500';
  };

  if (compact) {
    return (
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-500" />
              <span className="font-medium">AI Feedback</span>
            </div>
            <Badge variant={getScoreBadgeVariant(feedback.score)} className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {feedback.score}/100
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Code Quality</div>
              <div className={`font-semibold ${getScoreColor(feedback.codeQuality)}`}>
                {feedback.codeQuality}/10
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Problem Solving</div>
              <div className={`font-semibold ${getScoreColor(feedback.problemSolving * 10)}`}>
                {feedback.problemSolving}/10
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Efficiency</div>
              <div className={`font-semibold ${getScoreColor(feedback.efficiency * 10)}`}>
                {feedback.efficiency}/10
              </div>
            </div>
          </div>

          {feedback.strengths.length > 0 && (
            <div className="mb-2">
              <div className="text-sm font-medium text-green-700 mb-1">Strengths:</div>
              <div className="text-sm text-muted-foreground">
                {feedback.strengths.slice(0, 2).join(', ')}
                {feedback.strengths.length > 2 && '...'}
              </div>
            </div>
          )}

          {feedback.improvements.length > 0 && (
            <div>
              <div className="text-sm font-medium text-orange-700 mb-1">Improvements:</div>
              <div className="text-sm text-muted-foreground">
                {feedback.improvements.slice(0, 2).join(', ')}
                {feedback.improvements.length > 2 && '...'}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-80">
      <div className="p-4 space-y-4">
        {/* Overall Score */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" />
                AI Feedback Analysis
              </div>
              <Badge variant={getScoreBadgeVariant(feedback.score)} className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                {feedback.score}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <Progress 
                value={feedback.score} 
                className={`h-3 ${getProgressColor(feedback.score)}`}
              />
              <div className="text-sm text-muted-foreground">
                Overall performance score based on code quality, problem-solving approach, and efficiency.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Metrics */}
        <div className="grid gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Code Quality</span>
                </div>
                <Badge variant="outline">{feedback.codeQuality}/10</Badge>
              </div>
              <Progress 
                value={feedback.codeQuality * 10} 
                className={`h-2 ${getProgressColor(feedback.codeQuality * 10)}`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Problem Solving</span>
                </div>
                <Badge variant="outline">{feedback.problemSolving}/10</Badge>
              </div>
              <Progress 
                value={feedback.problemSolving * 10} 
                className={`h-2 ${getProgressColor(feedback.problemSolving * 10)}`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Efficiency</span>
                </div>
                <Badge variant="outline">{feedback.efficiency}/10</Badge>
              </div>
              <Progress 
                value={feedback.efficiency * 10} 
                className={`h-2 ${getProgressColor(feedback.efficiency * 10)}`}
              />
            </CardContent>
          </Card>
        </div>

        {/* Strengths */}
        {feedback.strengths.length > 0 && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium text-green-800 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Strengths
                </div>
                <ul className="space-y-1 text-sm text-green-700">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Areas for Improvement */}
        {feedback.improvements.length > 0 && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium text-orange-800 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Areas for Improvement
                </div>
                <ul className="space-y-1 text-sm text-orange-700">
                  {feedback.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Lightbulb className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* AI Analysis */}
        {feedback.aiAnalysis && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="h-4 w-4 text-purple-500" />
                Detailed Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="prose prose-sm max-w-none">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  {feedback.aiAnalysis}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Performance Summary */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Performance Summary</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Overall Rating</div>
                <div className={`font-semibold ${getScoreColor(feedback.score)}`}>
                  {feedback.score >= 80 ? 'Excellent' : 
                   feedback.score >= 60 ? 'Good' : 'Needs Improvement'}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Key Focus</div>
                <div className="font-semibold">
                  {feedback.codeQuality < 6 ? 'Code Quality' :
                   feedback.problemSolving < 6 ? 'Problem Solving' :
                   feedback.efficiency < 6 ? 'Efficiency' : 'Keep it up!'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}