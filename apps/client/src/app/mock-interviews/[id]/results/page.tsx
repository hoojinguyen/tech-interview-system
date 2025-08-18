'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  RotateCcw,
  Home,
  Share2,
  Download,
  Star
} from 'lucide-react';
import { useMockInterviewFeedback } from '@/services/mock-interviews';
import { FeedbackDisplay } from '@/components/mock-interview/feedback-display';

export default function MockInterviewResultsPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.id as string;

  const { data: results, isLoading, error } = useMockInterviewFeedback(interviewId);

  const handleRetakeInterview = () => {
    router.push('/mock-interviews');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleShareResults = async () => {
    if (navigator.share && results) {
      try {
        await navigator.share({
          title: 'Mock Interview Results',
          text: `I scored ${results.summary.averageScore}/100 on my mock interview!`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Generating your results...</p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">Failed to load interview results.</p>
            <Button onClick={handleGoHome}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return 'Outstanding';
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold">Interview Complete!</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Here&apos;s how you performed in your mock interview
        </p>
      </div>

      {/* Overall Score Card */}
      <Card className="mb-8 border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-500" />
              Overall Performance
            </div>
            <Badge 
              variant={getScoreBadgeVariant(results.summary.averageScore)} 
              className="text-lg px-3 py-1"
            >
              {results.summary.averageScore}/100
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Performance Level</span>
                <span className={`font-semibold ${getScoreColor(results.summary.averageScore)}`}>
                  {getPerformanceLevel(results.summary.averageScore)}
                </span>
              </div>
              <Progress 
                value={results.summary.averageScore} 
                className="h-3"
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {results.summary.totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground">Total Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {results.summary.completedQuestions}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((results.summary.completedQuestions / results.summary.totalQuestions) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(results.summary.averageScore)}`}>
                  {results.summary.averageScore}
                </div>
                <div className="text-sm text-muted-foreground">Avg Score</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Strengths */}
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <TrendingUp className="h-5 w-5" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.summary.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-green-800">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Target className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.summary.areasForImprovement.map((area, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Target className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-orange-800">{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {results.summary.recommendations.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-blue-500" />
              Recommendations for Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {results.summary.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="bg-blue-100 text-blue-600 rounded-full p-1 mt-0.5">
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className="text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <Button onClick={handleRetakeInterview} size="lg" className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Take Another Interview
        </Button>
        <Button variant="outline" onClick={handleGoHome} size="lg" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
        <Button variant="outline" onClick={handleShareResults} size="lg" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Share Results
        </Button>
      </div>

      {/* Performance Tip */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-800">Pro Tip</span>
          </div>
          <p className="text-sm text-blue-700">
            {results.summary.averageScore >= 80 
              ? "Excellent work! Consider practicing system design questions to round out your skills."
              : results.summary.averageScore >= 60
                ? "Good progress! Focus on the improvement areas and practice similar questions."
                : "Keep practicing! Review the fundamentals and try easier questions first."
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
}