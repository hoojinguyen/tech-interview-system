import Link from 'next/link'
import { Clock, Users, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TechRole, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/lib/constants/roles'
import { cn } from '@/lib/utils'

interface RoleCardProps {
  role: TechRole
  variant?: 'default' | 'compact'
}

export function RoleCard({ role, variant = 'default' }: RoleCardProps) {
  const isCompact = variant === 'compact'

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      {/* Gradient background accent */}
      <div className={cn('absolute top-0 left-0 right-0 h-1', role.color)} />
      
      <CardHeader className={cn('pb-3', isCompact && 'pb-2')}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg text-2xl',
              role.color.replace('bg-', 'bg-').replace('-500', '-100')
            )}>
              {role.icon}
            </div>
            <div>
              <CardTitle className={cn('text-lg', isCompact && 'text-base')}>
                {role.name}
              </CardTitle>
              <Badge 
                variant="outline" 
                className={cn(
                  'mt-1 text-xs border',
                  DIFFICULTY_COLORS[role.difficulty]
                )}
              >
                {DIFFICULTY_LABELS[role.difficulty]}
              </Badge>
            </div>
          </div>
          {role.popularityRank <= 3 && (
            <Badge variant="secondary" className="text-xs">
              Popular
            </Badge>
          )}
        </div>
        
        {!isCompact && (
          <CardDescription className="mt-2 text-sm leading-relaxed">
            {role.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className={cn('pt-0', isCompact && 'pb-4')}>
        {/* Technologies */}
        <div className="mb-4">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            Key Technologies
          </div>
          <div className="flex flex-wrap gap-1">
            {role.technologies.slice(0, isCompact ? 3 : 5).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {role.technologies.length > (isCompact ? 3 : 5) && (
              <Badge variant="outline" className="text-xs">
                +{role.technologies.length - (isCompact ? 3 : 5)} more
              </Badge>
            )}
          </div>
        </div>

        {/* Stats */}
        {!isCompact && (
          <div className="mb-4 flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{role.estimatedHours}h prep time</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>#{role.popularityRank} most popular</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={cn(
          'flex gap-2',
          isCompact ? 'flex-col' : 'flex-row'
        )}>
          <Button asChild className="flex-1" size={isCompact ? 'sm' : 'default'}>
            <Link href={`/roadmaps/${role.id}`}>
              View Roadmap
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          {!isCompact && (
            <Button variant="outline" asChild size="default">
              <Link href={`/questions?role=${role.id}`}>
                Practice Questions
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}