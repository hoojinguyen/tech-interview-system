import axios, { AxiosError, AxiosResponse } from 'axios'

// Create axios instance with default config
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed in the future
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.warn('Unauthorized access')
    } else if (error.response?.status === 500) {
      // Handle server errors
      console.error('Server error:', error.response.data)
    }
    
    return Promise.reject(error)
  }
)

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
}

// Generic API error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Helper function to handle API responses
export function handleApiResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
  if (!response.data.success || !response.data.data) {
    throw new ApiError(
      response.data.error?.message || 'API request failed',
      response.status,
      response.data.error?.code
    )
  }
  return response.data.data
}

// Helper function to handle API errors
export function handleApiError(error: any): never {
  if (error.response?.data?.error) {
    throw new ApiError(
      error.response.data.error.message,
      error.response.status,
      error.response.data.error.code
    )
  } else if (error.message) {
    throw new ApiError(error.message)
  } else {
    throw new ApiError('An unexpected error occurred')
  }
}