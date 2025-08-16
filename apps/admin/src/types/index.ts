// Re-export shared types for admin use
export * from '@tech-interview-platform/shared-types';

// Admin-specific types
export interface AdminConfig {
  apiUrl: string;
  environment: 'development' | 'production' | 'staging';
  features: {
    analytics: boolean;
    bulkOperations: boolean;
    contentModeration: boolean;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  lastLogin: Date;
}

export interface AdminState {
  user: AdminUser | null;
  ui: {
    sidebarOpen: boolean;
    loading: boolean;
    error: string | null;
    notifications: Array<{
      id: string;
      type: 'success' | 'error' | 'warning' | 'info';
      message: string;
      timestamp: Date;
    }>;
  };
  content: {
    pendingQuestions: number;
    totalQuestions: number;
    totalUsers: number;
  };
}

// Admin component props types
export interface AdminPageProps {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface AdminLayoutProps {
  children: React.ReactNode;
}