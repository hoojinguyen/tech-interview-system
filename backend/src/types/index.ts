// Re-export shared types for backend use
export * from '@tech-interview-platform/shared-types';

// Backend-specific types can be added here
export interface DatabaseConnection {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export interface ServerConfig {
  port: number;
  cors: {
    origin: string[];
    credentials: boolean;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  database: DatabaseConnection;
  redis: {
    url: string;
  };
  openai: {
    apiKey: string;
  };
}

// Example of using shared types in backend context
export interface ApiContext {
  // This would be used in Hono context
  user?: {
    id: string;
    role: 'admin' | 'user';
  };
}