import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, handleApiResponse, handleApiError } from '@/lib/api';
import type {
  Question,
  SearchQuestionsRequest,
  SearchQuestionsResponse,
  CreateQuestionRequest,
} from '@tech-interview-platform/shared-types';

// API functions
export const questionApi = {
  // Search questions with filters
  async searchQuestions(params: SearchQuestionsRequest): Promise<{
    questions: Question[];
    pagination: any;
    filters?: any;
  }> {
    try {
      const searchParams = new URLSearchParams();

      if (params.search) searchParams.append('search', params.search);
      if (params.technologies?.length)
        searchParams.append('technologies', params.technologies.join(','));
      if (params.difficulty?.length)
        searchParams.append('difficulty', params.difficulty.join(','));
      if (params.type?.length)
        searchParams.append('type', params.type.join(','));
      if (params.roles?.length)
        searchParams.append('roles', params.roles.join(','));
      if (params.companies?.length)
        searchParams.append('companies', params.companies.join(','));
      if (params.tags?.length)
        searchParams.append('tags', params.tags.join(','));
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

      const response = await api.get(
        `/api/v1/questions?${searchParams.toString()}`
      );
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get question by ID
  async getQuestion(id: string): Promise<Question> {
    try {
      const response = await api.get(`/api/v1/questions/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  // Create new question (for future use)
  async createQuestion(questionData: CreateQuestionRequest): Promise<Question> {
    try {
      const response = await api.post('/api/v1/questions', questionData);
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get popular questions
  async getPopularQuestions(limit: number = 10): Promise<Question[]> {
    try {
      const response = await api.get(
        `/api/v1/questions/popular?limit=${limit}`
      );
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get questions by technology
  async getQuestionsByTechnology(
    technology: string,
    limit: number = 20
  ): Promise<Question[]> {
    try {
      const response = await api.get(
        `/api/v1/questions/technology/${technology}?limit=${limit}`
      );
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
    }
  },
};

// React Query hooks
export function useSearchQuestions(params: SearchQuestionsRequest) {
  return useQuery({
    queryKey: ['questions', 'search', params],
    queryFn: () => questionApi.searchQuestions(params),
    enabled: !!params && Object.keys(params).length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useQuestion(id: string) {
  return useQuery({
    queryKey: ['question', id],
    queryFn: () => questionApi.getQuestion(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePopularQuestions(limit: number = 10) {
  return useQuery({
    queryKey: ['questions', 'popular', limit],
    queryFn: () => questionApi.getPopularQuestions(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useQuestionsByTechnology(
  technology: string,
  limit: number = 20
) {
  return useQuery({
    queryKey: ['questions', 'technology', technology, limit],
    queryFn: () => questionApi.getQuestionsByTechnology(technology, limit),
    enabled: !!technology,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: questionApi.createQuestion,
    onSuccess: () => {
      // Invalidate and refetch questions
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}
