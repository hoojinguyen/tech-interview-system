import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Users, BookOpen, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TECH_ROLES, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/lib/constants/roles'

interface RolePageProps {
  params: {
    roleId: string
  }
}

export async function generateMetadata({ params }: RolePageProps): Promise<Metadata> {
  const role = TECH_ROLES.find(r => r.id === params.roleId)
  
  if (!role) {
    return {
      title: 'Role Not Found | Tech Interview Platform'
    }
  }

  return {
    title: `${role.name} Roadmap | Tech Interview Platform`,
    description: `${role.description} Learn the essential skills and technologies needed for ${role.name} interviews.`,
  }
}

export async function generateStaticParams() {
  return TECH_ROLES.map((role) => ({
    roleId: role.id,
  }))
}

export default function RolePage({ params }: RolePageProps) {
  const role = TECH_ROLES.find(r => r.id === params.roleId)

  if (!role) {
    notFound()
  }

  return (
    <div className="container py-12">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/roadmaps">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Roadmaps
          </Link>
        </Button>
      </div>

      {/* Role Header */}
      <div className="mb-12">
        <div className="flex items-start space-x-4 mb-6">
          <div className={`flex h-16 w-16 items-center justify-center rounded-xl text-3xl ${role.color.replace('bg-', 'bg-').replace('-500', '-100')}`}>
            {role.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              {role.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {role.description}
            </p>
            <div className="flex items-center space-x-4">
              <Badge 
                variant="outline" 
                className={`border ${DIFFICULTY_COLORS[role.difficulty]}`}
              >
                {DIFFICULTY_LABELS[role.difficulty]}
              </Badge>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{role.estimatedHours} hours</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>#{role.popularityRank} most popular</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Key Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {role.technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button size="lg">
            <BookOpen className="mr-2 h-4 w-4" />
            Start Learning Path
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href={`/questions?role=${role.id}`}>
              <Target className="mr-2 h-4 w-4" />
              Practice Questions
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href={`/mock-interviews?role=${role.id}`}>
              Start Mock Interview
            </Link>
          </Button>
        </div>
      </div>

      {/* Roadmap Preview */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Learning Roadmap</CardTitle>
            <CardDescription>
              Structured learning path with estimated completion time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">0%</span>
              </div>
              <Progress value={0} className="h-2" />
              
              <div className="space-y-3 mt-6">
                <div className="flex items-center space-x-3 p-3 rounded-lg border">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">1</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Fundamentals</div>
                    <div className="text-sm text-muted-foreground">Core concepts and basics</div>
                  </div>
                  <Badge variant="outline">8h</Badge>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg border">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Advanced Topics</div>
                    <div className="text-sm text-muted-foreground">Deep dive into complex concepts</div>
                  </div>
                  <Badge variant="outline">16h</Badge>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg border">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">System Design</div>
                    <div className="text-sm text-muted-foreground">Architecture and scalability</div>
                  </div>
                  <Badge variant="outline">16h</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>
              Overview of available resources and preparation materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <span>Practice Questions</span>
                </div>
                <span className="font-medium">500+</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-muted-foreground" />
                  <span>Mock Interviews</span>
                </div>
                <span className="font-medium">Available</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>Estimated Prep Time</span>
                </div>
                <span className="font-medium">{role.estimatedHours} hours</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>Difficulty Level</span>
                </div>
                <Badge variant="outline" className={DIFFICULTY_COLORS[role.difficulty]}>
                  {DIFFICULTY_LABELS[role.difficulty]}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Notice */}
      <Card className="mt-8 border-dashed">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Detailed Roadmap Coming Soon</h3>
            <p className="text-muted-foreground mb-4">
              We&apos;re working on creating comprehensive, interactive roadmaps for each role. 
              In the meantime, you can explore our question bank and start practicing!
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/questions">Browse Questions</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/mock-interviews">Try Mock Interview</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}