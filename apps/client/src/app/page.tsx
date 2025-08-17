import Link from 'next/link'
import { ArrowRight, BookOpen, MessageSquare, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Master Your Next{' '}
            <span className="text-primary">Tech Interview</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Comprehensive interview preparation with curated questions, role-specific roadmaps, 
            and AI-powered mock interviews. Everything you need to land your dream tech job.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/roadmaps">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/questions">Browse Questions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to Succeed
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comprehensive tools and resources designed for modern tech interviews
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Learning Roadmaps</CardTitle>
              </div>
              <CardDescription>
                Role-specific learning paths tailored to your experience level and target position.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Frontend</Badge>
                <Badge variant="secondary">Backend</Badge>
                <Badge variant="secondary">Full-Stack</Badge>
                <Badge variant="secondary">DevOps</Badge>
              </div>
              <Button className="mt-4 w-full" variant="outline" asChild>
                <Link href="/roadmaps">Explore Roadmaps</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Question Bank</CardTitle>
              </div>
              <CardDescription>
                Thousands of curated interview questions with detailed solutions and explanations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Coding</Badge>
                <Badge variant="secondary">System Design</Badge>
                <Badge variant="secondary">Behavioral</Badge>
              </div>
              <Button className="mt-4 w-full" variant="outline" asChild>
                <Link href="/questions">Browse Questions</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Mock Interviews</CardTitle>
              </div>
              <CardDescription>
                AI-powered mock interviews with real-time feedback and performance analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Live Coding</Badge>
                <Badge variant="secondary">AI Feedback</Badge>
                <Badge variant="secondary">Timed Sessions</Badge>
              </div>
              <Button className="mt-4 w-full" variant="outline" asChild>
                <Link href="/mock-interviews">Start Interview</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Popular Roles Section */}
      <section className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Popular Tech Roles
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose your target role and get personalized preparation materials
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          {[
            'Frontend Developer',
            'Backend Engineer',
            'Full-Stack Developer',
            'DevOps Engineer',
            'Mobile Developer',
            'Data Engineer',
            'ML Engineer',
            'Product Manager',
          ].map((role) => (
            <Button
              key={role}
              variant="outline"
              className="h-auto p-4 text-left"
              asChild
            >
              <Link href={`/roadmaps/${role.toLowerCase().replace(/\s+/g, '-')}`}>
                <div>
                  <div className="font-semibold">{role}</div>
                  <div className="text-sm text-muted-foreground">View roadmap</div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </section>
    </div>
  )
}