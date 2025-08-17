#!/usr/bin/env bun

/**
 * Utility script to generate admin JWT tokens for testing
 * Usage: bun run src/utils/generateAdminToken.ts
 */

import { generateJWT } from '../middleware/auth';

// Set JWT_SECRET if not already set
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your-super-secret-jwt-key-for-development-only';
  console.log('⚠️ Using default JWT_SECRET for development');
}

const adminPayload = {
  userId: 'admin-user-id',
  role: 'admin' as const,
  email: 'admin@techinterview.platform'
};

try {
  const token = generateJWT(adminPayload);
  
  console.log('🔑 Admin JWT Token Generated:');
  console.log('');
  console.log(token);
  console.log('');
  console.log('📋 Use this token in your Authorization header:');
  console.log(`Authorization: Bearer ${token}`);
  console.log('');
  console.log('🧪 Test with curl:');
  console.log(`curl -H "Authorization: Bearer ${token}" http://localhost:3002/api/v1/admin/content`);
  console.log('');
  console.log('⏰ Token expires in 24 hours');
  
} catch (error) {
  console.error('❌ Error generating token:', error);
  process.exit(1);
}