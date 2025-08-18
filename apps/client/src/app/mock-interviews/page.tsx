'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Code, Brain, Target } from 'lucide-react';
import { useStartMockInterview } from '@/services/mock-interviews';
import { Level } from '@tech-interview-platform/shared-types';
import { ROLES } from '@/lib/constants/roles';

export default function MockInterviewsPage() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<Level | ''>('');
  const [questionCount, setQuestionCount] = useState<string>('5');
  const [timeLimit, setTimeLimit] = useState<string>('60');
  
  const router = useRouter();
  const startMockInterview = useStartMockInterview();

  const handleStartInterview = async () => {
    if (!selectedRole || !selectedLevel) return;

    try {
      const interview = await startMockInterview.mutateAsync({
        roleId: selectedRole,
        level: selectedLevel as Level,
        questionCount: parseInt(questionCount),
        timeLimit: parseInt(timeLimit),
      });

      router.push(`/mock-interviews/${interview.id}`);
    } catch (error) {
      console.error('Failed to start mock interview:', error);
    }
  };

  const selectedRoleData = ROLES.find(role => role.id === selectedRole);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Mock Interview</h1>
        <p className="text-lg text-muted-foreground">
          Practice with realistic coding interviews and get AI-powered feedback
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Setup Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Interview Setup
            </CardTitle>
            <CardDescription>
              Configure your mock interview session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Role</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Level Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Experience Level</label>
              <Select value={selectedLevel} onValueChange={(value) => setSelectedLevel(value as Level)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid-level (2-5 years)</SelectItem>
                  <SelectItem value="senior">Senior (5+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Question Count */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Questions</label>
              <Select value={questionCount} onValueChange={setQuestionCount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Questions (30 min)</SelectItem>
                  <SelectItem value="5">5 Questions (45 min)</SelectItem>
                  <SelectItem value="7">7 Questions (60 min)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Limit */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Limit (minutes)</label>
              <Select value={timeLimit} onValueChange={setTimeLimit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleStartInterview}
              disabled={!selectedRole || !selectedLevel || startMockInterview.isPending}
              className="w-full"
              size="lg"
            >
              {startMockInterview.isPending ? 'Starting...' : 'Start Mock Interview'}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <div className="space-y-6">
          {/* Role Preview */}
          {selectedRoleData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{selectedRoleData.name}</CardTitle>
                <CardDescription>{selectedRoleData.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">Key Technologies:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedRoleData.technologies.slice(0, 6).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {selectedRoleData.technologies.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{selectedRoleData.technologies.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What to Expect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Code className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">Live Coding Environment</p>
                  <p className="text-sm text-muted-foreground">
                    Full-featured code editor with syntax highlighting
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Brain className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">AI-Powered Feedback</p>
                  <p className="text-sm text-muted-foreground">
                    Get detailed analysis of your code and approach
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium">Timed Challenges</p>
                  <p className="text-sm text-muted-foreground">
                    Practice under realistic interview conditions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}