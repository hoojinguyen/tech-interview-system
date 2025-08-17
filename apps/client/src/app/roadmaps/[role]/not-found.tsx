import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Search } from 'lucide-react'

export default function RoleNotFound() {
  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto text-center">
        <Card>
          <CardHeader>
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">Role Not Found</CardTitle>
            <CardDescription>
              The role you&apos;re looking for doesn&apos;t exist or may have been moved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Don&apos;t worry! You can browse all available tech roles and find the perfect roadmap for your career goals.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/roadmaps">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Browse All Roles
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  Go Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}