import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// User preferences and progress tracking
interface UserProgress {
  roadmapId: string
  completedTopics: string[]
  currentTopic: string
  lastAccessed: Date
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  preferredLanguage: string
  difficulty: 'easy' | 'medium' | 'hard' | 'all'
  notifications: boolean
}

interface UserStore {
  // User preferences
  preferences: UserPreferences
  setPreferences: (preferences: Partial<UserPreferences>) => void
  
  // Progress tracking
  progress: Record<string, UserProgress>
  updateProgress: (roadmapId: string, progress: Partial<UserProgress>) => void
  getProgress: (roadmapId: string) => UserProgress | undefined
  
  // Search and filter state
  searchQuery: string
  setSearchQuery: (query: string) => void
  
  // UI state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Default preferences
      preferences: {
        theme: 'system',
        preferredLanguage: 'javascript',
        difficulty: 'all',
        notifications: true,
      },
      setPreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),
      
      // Progress tracking
      progress: {},
      updateProgress: (roadmapId, newProgress) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [roadmapId]: {
              ...state.progress[roadmapId],
              ...newProgress,
              lastAccessed: new Date(),
            },
          },
        })),
      getProgress: (roadmapId) => get().progress[roadmapId],
      
      // Search state
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      // UI state
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'tech-interview-platform-storage',
      partialize: (state) => ({
        preferences: state.preferences,
        progress: state.progress,
      }),
    }
  )
)

// Mock interview session store
interface MockInterviewStore {
  currentSession: {
    id: string
    roleId: string
    level: string
    questions: any[]
    currentQuestionIndex: number
    startTime: Date
    answers: Record<string, string>
  } | null
  
  startSession: (session: any) => void
  updateAnswer: (questionId: string, answer: string) => void
  nextQuestion: () => void
  endSession: () => void
}

export const useMockInterviewStore = create<MockInterviewStore>((set, get) => ({
  currentSession: null,
  
  startSession: (session) => set({ currentSession: session }),
  
  updateAnswer: (questionId, answer) =>
    set((state) => ({
      currentSession: state.currentSession
        ? {
            ...state.currentSession,
            answers: {
              ...state.currentSession.answers,
              [questionId]: answer,
            },
          }
        : null,
    })),
  
  nextQuestion: () =>
    set((state) => ({
      currentSession: state.currentSession
        ? {
            ...state.currentSession,
            currentQuestionIndex: state.currentSession.currentQuestionIndex + 1,
          }
        : null,
    })),
  
  endSession: () => set({ currentSession: null }),
}))