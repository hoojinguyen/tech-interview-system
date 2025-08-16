import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Database connection configuration
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/tech_interview_platform';

// Create postgres client
const client = postgres(connectionString, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
  prepare: false, // Disable prepared statements for better compatibility
});

// Create Drizzle database instance
export const db = drizzle(client, { 
  schema,
  logger: process.env.NODE_ENV === 'development' // Enable query logging in development
});

// Export the client for manual queries if needed
export { client };

// Database health check function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await client`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Graceful shutdown function
export async function closeDatabaseConnection(): Promise<void> {
  try {
    await client.end();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}