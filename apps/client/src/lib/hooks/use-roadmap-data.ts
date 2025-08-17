'use client'

import { useRoadmap } from '@/services/roadmaps'
import { useRoadmapContext } from '@/components/roadmap/roadmap-provider'

export function useRoadmapData() {
  const { role, level } = useRoadmapContext()
  
  const {
    data: roadmap,
    isLoading,
    error,
  } = useRoadmap(role, level)

  // Mock topics data for now - this will be replaced with real API data
  const mockTopics = roadmap ? [
    {
      id: '1',
      roadmapId: roadmap.id,
      title: 'JavaScript Fundamentals',
      description: 'Master the core concepts of JavaScript including variables, functions, closures, and async programming.',
      order: 1,
      roadmap: roadmap,
      resources: [
        {
          title: 'MDN JavaScript Guide',
          url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
          type: 'documentation' as const,
        },
        {
          title: 'JavaScript.info Tutorial',
          url: 'https://javascript.info/',
          type: 'tutorial' as const,
        },
        {
          title: 'You Don\'t Know JS Book Series',
          url: 'https://github.com/getify/You-Dont-Know-JS',
          type: 'article' as const,
        },
      ],
      questions: [
        {
          id: 'q1',
          title: 'Explain JavaScript Closures',
          difficulty: 'medium',
          type: 'conceptual',
        },
        {
          id: 'q2',
          title: 'Implement a Debounce Function',
          difficulty: 'medium',
          type: 'coding',
        },
        {
          id: 'q3',
          title: 'Promise vs Async/Await',
          difficulty: 'easy',
          type: 'conceptual',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      roadmapId: roadmap.id,
      title: 'React Ecosystem',
      description: 'Deep dive into React, including hooks, state management, performance optimization, and testing.',
      order: 2,
      roadmap: roadmap,
      resources: [
        {
          title: 'React Official Documentation',
          url: 'https://react.dev/',
          type: 'documentation' as const,
        },
        {
          title: 'React Hooks in Action',
          url: 'https://www.youtube.com/watch?v=dpw9EHDh2bM',
          type: 'video' as const,
        },
        {
          title: 'Testing React Components',
          url: 'https://testing-library.com/docs/react-testing-library/intro/',
          type: 'tutorial' as const,
        },
      ],
      questions: [
        {
          id: 'q4',
          title: 'React Component Lifecycle',
          difficulty: 'easy',
          type: 'conceptual',
        },
        {
          id: 'q5',
          title: 'Custom Hook Implementation',
          difficulty: 'medium',
          type: 'coding',
        },
        {
          id: 'q6',
          title: 'State Management Patterns',
          difficulty: 'hard',
          type: 'conceptual',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      roadmapId: roadmap.id,
      title: 'Performance Optimization',
      description: 'Learn advanced techniques for optimizing React applications, including code splitting, memoization, and bundle optimization.',
      order: 3,
      roadmap: roadmap,
      resources: [
        {
          title: 'React Performance Optimization',
          url: 'https://react.dev/learn/render-and-commit',
          type: 'documentation' as const,
        },
        {
          title: 'Web Performance Fundamentals',
          url: 'https://web.dev/performance/',
          type: 'article' as const,
        },
      ],
      questions: [
        {
          id: 'q7',
          title: 'React.memo vs useMemo',
          difficulty: 'medium',
          type: 'conceptual',
        },
        {
          id: 'q8',
          title: 'Implement Virtual Scrolling',
          difficulty: 'hard',
          type: 'coding',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      roadmapId: roadmap.id,
      title: 'System Design Fundamentals',
      description: 'Understand how to design scalable frontend architectures and discuss system design in interviews.',
      order: 4,
      roadmap: roadmap,
      resources: [
        {
          title: 'Frontend System Design',
          url: 'https://www.greatfrontend.com/system-design',
          type: 'tutorial' as const,
        },
        {
          title: 'Scalable Frontend Architecture',
          url: 'https://blog.logrocket.com/scalable-frontend-architecture/',
          type: 'article' as const,
        },
      ],
      questions: [
        {
          id: 'q9',
          title: 'Design a Chat Application Frontend',
          difficulty: 'hard',
          type: 'system-design',
        },
        {
          id: 'q10',
          title: 'Micro-frontend Architecture',
          difficulty: 'hard',
          type: 'conceptual',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ] : []

  return {
    roadmap,
    topics: mockTopics,
    isLoading,
    error,
  }
}