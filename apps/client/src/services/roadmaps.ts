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
    queryFn: () => roadmapApi.getRoadmap(role, level),
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