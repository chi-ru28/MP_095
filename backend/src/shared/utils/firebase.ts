import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth as getFirebaseAuth } from 'firebase-admin/auth';
import { logger } from '../../infrastructure/logging/logger';

export const initializeFirebase = () => {
  try {
    if (getApps().length > 0) return getApp();

    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      logger.warn('Firebase Admin credentials not found in .env. Firebase Admin SDK will not be initialized.');
      return null;
    }

    // Handle escaped newlines in private key from .env
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

    const app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });

    logger.info('Firebase Admin SDK initialized successfully');
    return app;
  } catch (error) {
    logger.error('Failed to initialize Firebase Admin SDK:', error);
    return null;
  }
};

export const getAuth = () => {
  if (getApps().length === 0) {
    initializeFirebase();
  }
  
  if (getApps().length > 0) {
    return getFirebaseAuth();
  }
  
  return null;
};
