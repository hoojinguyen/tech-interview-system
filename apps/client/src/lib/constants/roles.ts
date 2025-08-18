export interface TechRole {
  id: string
  name: string
  description: string
  technologies: string[]
  difficulty: 'junior' | 'mid' | 'senior'
  estimatedHours: number
  icon: string
  color: string
  popularityRank: number
}

export const TECH_ROLES: TechRole[] = [
  {
    id: 'frontend-developer',
    name: 'Frontend Developer',
    description: 'Build user interfaces and experiences with modern web technologies',
    technologies: ['React', 'TypeScript', 'CSS', 'HTML', 'JavaScript'],
    difficulty: 'junior',
    estimatedHours: 40,
    icon: '🎨',
    color: 'bg-blue-500',
    popularityRank: 1,
  },
  {
    id: 'backend-engineer',
    name: 'Backend Engineer',
    description: 'Design and build server-side applications and APIs',
    technologies: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'Docker'],
    difficulty: 'mid',
    estimatedHours: 50,
    icon: '⚙️',
    color: 'bg-green-500',
    popularityRank: 2,
  },
  {
    id: 'full-stack-developer',
    name: 'Full-Stack Developer',
    description: 'Work across the entire technology stack from frontend to backend',
    technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    difficulty: 'mid',
    estimatedHours: 60,
    icon: '🚀',
    color: 'bg-purple-500',
    popularityRank: 3,
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    description: 'Automate deployment, scaling, and management of applications',
    technologies: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD'],
    difficulty: 'senior',
    estimatedHours: 55,
    icon: '🔧',
    color: 'bg-orange-500',
    popularityRank: 4,
  },
  {
    id: 'mobile-developer',
    name: 'Mobile Developer',
    description: 'Create native and cross-platform mobile applications',
    technologies: ['React Native', 'Swift', 'Kotlin', 'Flutter', 'Firebase'],
    difficulty: 'mid',
    estimatedHours: 45,
    icon: '📱',
    color: 'bg-pink-500',
    popularityRank: 5,
  },
  {
    id: 'data-engineer',
    name: 'Data Engineer',
    description: 'Build and maintain data pipelines and infrastructure',
    technologies: ['Python', 'SQL', 'Apache Spark', 'Kafka', 'Airflow'],
    difficulty: 'senior',
    estimatedHours: 65,
    icon: '📊',
    color: 'bg-indigo-500',
    popularityRank: 6,
  },
  {
    id: 'ml-engineer',
    name: 'ML Engineer',
    description: 'Develop and deploy machine learning models and systems',
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Kubernetes'],
    difficulty: 'senior',
    estimatedHours: 70,
    icon: '🤖',
    color: 'bg-cyan-500',
    popularityRank: 7,
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    description: 'Drive product strategy and coordinate cross-functional teams',
    technologies: ['Analytics', 'A/B Testing', 'SQL', 'Figma', 'Jira'],
    difficulty: 'mid',
    estimatedHours: 35,
    icon: '📋',
    color: 'bg-yellow-500',
    popularityRank: 8,
  },
]

export const DIFFICULTY_LABELS = {
  junior: 'Junior Level',
  mid: 'Mid Level',
  senior: 'Senior Level',
} as const

export const DIFFICULTY_COLORS = {
  junior: 'bg-green-100 text-green-800 border-green-200',
  mid: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  senior: 'bg-red-100 text-red-800 border-red-200',
} as const

// Alias for backward compatibility
export const ROLES = TECH_ROLES