// Re-export shared types for client use
export * from '@tech-interview-platform/shared-types';

// Client-specific types
export interface ClientConfig {
  apiUrl: string;
  environment: 'development' | 'production' | 'staging';
  features: {
    mockInterviews: boolean;
    analytics: boolean;
    darkMode: boolean;
  };
}

export interface AppState {
  user: {
    preferences: {
      theme: 'light' | 'dark' | 'system';
      language: string;
    };
    progress: {
      currentRoadmap?: string;
      completedTopics: string[];
    };
  };
  ui: {
    sidebarOpen: boolean;
    loading: boolean;
    error: string | null;
  };
}

// React component props types
export interface PageProps {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface LayoutProps {
  children: React.ReactNode;
}