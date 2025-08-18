'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Play, 
  Square, 
  SkipForward, 
  CheckCircle, 
  AlertCircle,
  Code2,
  Brain
} from 'lucide-react';
import { useMockInterview, useSubmitAnswer, useEndMockInterview } from '@/services/mock-interviews';
import { MockInterviewTimer } from '@/components/mock-interview/mock-interview-timer';
import { QuestionPanel } from '@/components/mock-interview/question-panel';
import { CodeEditor } from '@/components/mock-interview/code-editor';
import { FeedbackDisplay } from '@/components/mock-interview/feedback-display';
import { InterviewFeedback } from '@tech-interview-platform/shared-types';

export default function MockInterviewSessionPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.id as string;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const { data: interview, isLoading, error } = useMockInterview(interviewId);
  const submitAnswer = useSubmitAnswer();
  const endInterview = useEndMockInterview();

  const currentQuestion = interview?.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (interview?.questions.length || 0) - 1;

  useEffect(() => {
    if (interview && !isRunning) {
      // Calculate time remaining based on interview duration
      const startTime = new Date(interview.startTime).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000 / 60); // minutes
      const remaining = Math.max(0, (interview.duration || 60) - elapsed);
      setTimeRemaining(remaining);
      setIsRunning(true);
    }
  }, [interview, isRunning]);

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !interview) return;

    try {
      const response = await submitAnswer.mutateAsync({
        interviewId: interview.id,
        answerData: {
          mockInterviewId: interview.id,
          questionId: currentQuestion.question.id,
          userCode,
        },
      });

      if (response?.feedback) {
        setFeedback(response.feedback);
        setShowFeedback(true);
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      handleEndInterview();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserCode('');
      setFeedback(null);
      setShowFeedback(false);
    }
  };

  const handleEndInterview = async () => {
    try {
      await endInterview.mutateAsync(interviewId);
      router.push(`/mock-interviews/${interviewId}/results`);
    } catch (error) {
      console.error('Failed to end interview:', error);
    }
  };

  const handleTimeUp = () => {
    handleEndInterview();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading interview session...</p>
        </div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load interview session. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold">Mock Interview</h1>
              <Badge variant="outline">
                {interview.role.name} - {interview.level}
              </Badge>
              <Badge variant="secondary">
                Question {currentQuestionIndex + 1} of {interview.questions.length}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <MockInterviewTimer
                timeRemaining={timeRemaining}
                onTimeUp={handleTimeUp}
                isRunning={isRunning}
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={handleEndInterview}
                disabled={endInterview.isPending}
              >
                <Square className="h-4 w-4 mr-2" />
                End Interview
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Question */}
        <div className="w-1/2 border-r flex flex-col">
          <div className="p-4 border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="font-medium">Problem Statement</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {currentQuestion && (
              <QuestionPanel question={currentQuestion.question} />
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          <div className="p-4 border-b bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                <span className="font-medium">Code Editor</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!userCode.trim() || submitAnswer.isPending}
                  size="sm"
                >
                  {submitAnswer.isPending ? 'Submitting...' : 'Submit Solution'}
                </Button>
                {!isLastQuestion && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextQuestion}
                    disabled={!showFeedback}
                  >
                    <SkipForward className="h-4 w-4 mr-2" />
                    Next Question
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <CodeEditor
                value={userCode}
                onChange={setUserCode}
                language="javascript"
              />
            </div>
            
            {/* Feedback Section */}
            {showFeedback && feedback && (
              <div className="border-t">
                <FeedbackDisplay feedback={feedback} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="border-t bg-muted/50 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Progress: {currentQuestionIndex + 1}/{interview.questions.length}</span>
            {currentQuestion && (
              <span>Time limit: {currentQuestion.timeLimit} minutes</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {showFeedback && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Answer submitted</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}