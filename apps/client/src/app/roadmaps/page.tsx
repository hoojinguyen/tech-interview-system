import { Metadata } from 'next'
import { RoleGrid } from '@/components/common/role-grid'

export const metadata: Metadata = {
  title: 'Tech Role Roadmaps | Tech Interview Platform',
  description: 'Explore comprehensive learning roadmaps for every major tech role. Get personalized preparation paths for frontend, backend, full-stack, DevOps, and more.',
}

export default function RoadmapsPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
          Tech Role Roadmaps
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Comprehensive learning paths designed by industry experts. Each roadmap includes 
          curated resources, practice questions, and estimated preparation time to help you 
          master the skills needed for your target role.
        </p>
      </div>

      <RoleGrid />
    </div>
  )
}