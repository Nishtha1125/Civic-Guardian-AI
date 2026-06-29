/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose from 'mongoose';

export async function connectMongoDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.log('----------------------------------------------------------------');
    console.log('ℹ️ MONGODB_URI is not set in environment variables.');
    console.log('ℹ️ Civic Guardian AI will use high-fidelity Local Fallback Store.');
    console.log('ℹ️ To activate full MongoDB mode, add MONGODB_URI to your .env');
    console.log('----------------------------------------------------------------');
    return false;
  }

  try {
    // Prevent duplicate connections
    if (mongoose.connection.readyState >= 1) {
      return true;
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    
    console.log('----------------------------------------------------------------');
    console.log('✅ Successfully connected to MongoDB database!');
    console.log('✅ Civic Guardian AI is running in cloud database mode.');
    console.log('----------------------------------------------------------------');
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    console.log('⚠️ Falling back to Local Store to maintain live app preview uptime.');
    return false;
  }
}
