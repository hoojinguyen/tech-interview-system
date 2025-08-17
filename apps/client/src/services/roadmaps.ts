import { useQuery } from '@tanstack/react-query'
import { api, handleApiResponse, handleApiError } from '@/lib/api'
import type { Role, Roadmap } from '@tech-interview-platform/shared-types'

// API functions
export const roadmapApi = {
  // Get all available roles
  async getRoles(): Promise<Role[]> {
    try {
      const response = await api.get('/api/v1/roadmaps/roles')
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  // Get roadmap for specific role and level
  async getRoadmap(role: string, level: string): Promise<Roadmap> {
    try {
      const response = await api.get(`/api/v1/roadmaps/${role}/${level}`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  // Get roadmaps for a specific role (all levels)
  async getRoadmapsByRole(role: string): Promise<Roadmap[]> {
    try {
      const response = await api.get(`/api/v1/roadmaps/role/${role}`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },
}

// React Query hooks
export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: roadmapApi.getRoles,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useRoadmap(role: string, level: string) {
  return useQuery({
    queryKey: ['roadmap', role, level],
    queryFn: () => {
      // Mock roadmap data for now - replace with real API call later
      return Promise.resolve({
        id: `${role}-${level}`,
        roleId: role,
        level: level as any,
        title: `${role.replace('-', ' ')} - ${level} Level`,
        description: `Comprehensive roadmap for ${level} level ${role.replace('-', ' ')} interviews`,
        estimatedHours: level === 'junior' ? 20 : level === 'mid' ? 35 : 50,
        prerequisites: level === 'junior' ? [] : level === 'mid' ? ['Basic programming knowledge'] : ['2+ years experience', 'Advanced programming concepts'],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    },
    enabled: !!role && !!level,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useRoadmapsByRole(role: string) {
  return useQuery({
    queryKey: ['roadmaps', role],
    queryFn: () => roadmapApi.getRoadmapsByRole(role),
    enabled: !!role,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}