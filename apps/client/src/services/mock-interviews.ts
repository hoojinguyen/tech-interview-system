import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, handleApiResponse, handleApiError } from '@/lib/api'
import type { 
  MockInterview, 
  StartMockInterviewRequest, 
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  CompleteMockInterviewResponse
} from '@tech-interview-platform/shared-types'

// API functions
export const mockInterviewApi = {
  // Start a new mock interview session
  async startMockInterview(params: StartMockInterviewRequest): Promise<MockInterview> {
    try {
      const response = await api.post('/api/v1/mock-interviews/start', params)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  // Submit an answer for a question
  async submitAnswer(interviewId: string, answerData: SubmitAnswerRequest): Promise<void> {
    try {
      const response = await api.post(`/api/v1/mock-interviews/${interviewId}/submit`, answerData)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  // Get feedback for a mock interview
  async getFeedback(interviewId: string): Promise<CompleteMockInterviewResponse['data']> {
    try {
      const response = await api.get(`/api/v1/mock-interviews/${interviewId}/feedback`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  // Get mock interview session details
  async getMockInterview(interviewId: string): Promise<MockInterview> {
    try {
      const response = await api.get(`/api/v1/mock-interviews/${interviewId}`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },

  // End a mock interview session
  async endMockInterview(interviewId: string): Promise<void> {
    try {
      const response = await api.post(`/api/v1/mock-interviews/${interviewId}/end`)
      return handleApiResponse(response)
    } catch (error) {
      handleApiError(error)
    }
  },
}

// React Query hooks
export function useStartMockInterview() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: mockInterviewApi.startMockInterview,
    onSuccess: (data) => {
      // Cache the new interview session
      queryClient.setQueryData(['mock-interview', data.id], data)
    },
  })
}

export function useMockInterview(interviewId: string) {
  return useQuery({
    queryKey: ['mock-interview', interviewId],
    queryFn: () => mockInterviewApi.getMockInterview(interviewId),
    enabled: !!interviewId,
    staleTime: 30 * 1000, // 30 seconds (short stale time for active sessions)
  })
}

export function useSubmitAnswer() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ interviewId, answerData }: { interviewId: string; answerData: SubmitAnswerRequest }) =>
      mockInterviewApi.submitAnswer(interviewId, answerData),
    onSuccess: (_, variables) => {
      // Invalidate the interview data to refetch updated state
      queryClient.invalidateQueries({ queryKey: ['mock-interview', variables.interviewId] })
    },
  })
}

export function useMockInterviewFeedback(interviewId: string) {
  return useQuery({
    queryKey: ['mock-interview-feedback', interviewId],
    queryFn: () => mockInterviewApi.getFeedback(interviewId),
    enabled: !!interviewId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useEndMockInterview() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: mockInterviewApi.endMockInterview,
    onSuccess: (_, interviewId) => {
      // Invalidate the interview data
      queryClient.invalidateQueries({ queryKey: ['mock-interview', interviewId] })
    },
  })
}