import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ContentOverview {
  questions: {
    total: number;
    approved: number;
    pending: number;
    byDifficulty: {
      easy: number;
      medium: number;
      hard: number;
    };
    byType: {
      coding: number;
      conceptual: number;
      'system-design': number;
      behavioral: number;
    };
  };
  roadmaps: {
    total: number;
    byLevel: {
      junior: number;
      mid: number;
      senior: number;
    };
  };
  roles: {
    total: number;
  };
  mockInterviews: {
    total: number;
    completed: number;
    active: number;
    abandoned: number;
  };
}

export interface PlatformAnalytics {
  overview: {
    totalQuestions: number;
    totalRoadmaps: number;
    totalRoles: number;
    totalMockInterviews: number;
  };
  questions: {
    totalQuestions: number;
    approvedQuestions: number;
    pendingQuestions: number;
    averageRating: number;
    topTechnologies: Array<{ technology: string; count: number }>;
    questionsByDifficulty: {
      easy: number;
      medium: number;
      hard: number;
    };
    questionsByType: {
      coding: number;
      conceptual: number;
      'system-design': number;
      behavioral: number;
    };
  };
  mockInterviews: {
    totalInterviews: number;
    completedInterviews: number;
    averageScore: number;
    completionRate: number;
    interviewsByLevel: {
      junior: number;
      mid: number;
      senior: number;
    };
  };
  usage: {
    questionsViewedToday: number;
    mockInterviewsStartedToday: number;
    topRoles: Array<{ role: string; count: number }>;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const adminService = {
  /**
   * Get content overview for admin dashboard
   */
  async getContentOverview(): Promise<ContentOverview> {
    const response = await api.get<ApiResponse<ContentOverview>>('/admin/content');
    return response.data.data;
  },

  /**
   * Get platform analytics
   */
  async getPlatformAnalytics(): Promise<PlatformAnalytics> {
    const response = await api.get<ApiResponse<PlatformAnalytics>>('/admin/analytics');
    return response.data.data;
  },

  /**
   * Approve content
   */
  async approveContent(type: 'question', id: string): Promise<void> {
    await api.post('/admin/approve', { type, id });
  },

  /**
   * Delete content
   */
  async deleteContent(type: 'question' | 'roadmap' | 'role', id: string): Promise<void> {
    await api.delete(`/admin/${type}/${id}`);
  },
};