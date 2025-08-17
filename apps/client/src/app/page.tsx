import Link from 'next/link'
import { ArrowRight, BookOpen, MessageSquare, Target, TrendingUp, Users, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RoleGrid } from '@/components/common/role-grid'
import { TECH_ROLES } from '@/lib/constants/roles'

export default function Home() {
  // Get top 4 most popular roles for quick access
  const popularRoles = TECH_ROLES
    .sort((a, b) => a.popularityRank - b.popularityRank)
    .slice(0, 4)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center">
            <Badge variant="secondary" className="px-3 py-1">
              <TrendingUp className="mr-2 h-4 w-4" />
              Join 50,000+ developers preparing for interviews
            </Badge>
          </div>
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
          
          {/* Quick stats */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10,000+</div>
              <div className="text-sm text-muted-foreground">Curated Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Learning Roadmaps</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">AI Mock Interviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24 bg-muted/30">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to Succeed
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comprehensive tools and resources designed for modern tech interviews
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="rounded-lg bg-blue-100 p-2">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Learning Roadmaps</CardTitle>
              </div>
              <CardDescription>
                Role-specific learning paths tailored to your experience level and target position.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">Frontend</Badge>
                <Badge variant="secondary">Backend</Badge>
                <Badge variant="secondary">Full-Stack</Badge>
                <Badge variant="secondary">DevOps</Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>40-70h prep time</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>8 roles available</span>
                </div>
              </div>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/roadmaps">Explore Roadmaps</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-green-500" />
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="rounded-lg bg-green-100 p-2">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Question Bank</CardTitle>
              </div>
              <CardDescription>
                Thousands of curated interview questions with detailed solutions and explanations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">Coding</Badge>
                <Badge variant="secondary">System Design</Badge>
                <Badge variant="secondary">Behavioral</Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>10,000+ questions</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="h-4 w-4" />
                  <span>All difficulty levels</span>
                </div>
              </div>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/questions">Browse Questions</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="rounded-lg bg-purple-100 p-2">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Mock Interviews</CardTitle>
              </div>
              <CardDescription>
                AI-powered mock interviews with real-time feedback and performance analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">Live Coding</Badge>
                <Badge variant="secondary">AI Feedback</Badge>
                <Badge variant="secondary">Timed Sessions</Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>30-60 min sessions</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Real-time analysis</span>
                </div>
              </div>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/mock-interviews">Start Interview</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Popular Roles Quick Access */}
      <section className="container py-16">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Most Popular Roles
          </h2>
          <p className="mt-4 text-muted-foreground">
            Quick access to the most in-demand tech positions
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
          {popularRoles.map((role) => (
            <Button
              key={role.id}
              variant="outline"
              className="h-auto p-4 text-left group hover:border-primary/50 transition-colors"
              asChild
            >
              <Link href={`/roadmaps/${role.id}`}>
                <div className="w-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{role.icon}</span>
                    <Badge variant="secondary" className="text-xs">
                      #{role.popularityRank}
                    </Badge>
                  </div>
                  <div className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {role.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {role.estimatedHours}h • {role.technologies.slice(0, 2).join(', ')}
                  </div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="outline" asChild>
            <Link href="/roadmaps">
              View All Roles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="container py-24 bg-muted/30">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Choose Your Path
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore detailed roadmaps for every major tech role with personalized learning paths
          </p>
        </div>
        
        <RoleGrid variant="compact" showFilters={false} maxRoles={6} />
        
        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/roadmaps">
              Explore All Roles & Roadmaps
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}