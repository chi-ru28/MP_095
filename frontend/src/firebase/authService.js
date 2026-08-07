import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { auth } from "./config";
import useAuthStore from "../store/useAuthStore";

const googleProvider = new GoogleAuthProvider();

// Mapper to transform firebase user to our Game User Model
const mapUserToGameModel = (firebaseUser, provider = 'email') => {
  if (!firebaseUser) return null;
  
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || 'Explorer',
    username: firebaseUser.displayName ? firebaseUser.displayName.toLowerCase().replace(/\s+/g, '_') : 'explorer_' + Math.floor(Math.random() * 1000),
    email: firebaseUser.email,
    photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
    provider: provider,
    level: 1, // Default game values
    xp: 0,
    coins: 100, // Starter coins
    createdAt: firebaseUser.metadata.creationTime,
    lastLogin: firebaseUser.metadata.lastSignInTime,
  };
};

export const signInWithGoogle = async () => {
  if (!auth) return { user: null, error: "Firebase not configured. Please add keys to .env" };
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const gameUser = mapUserToGameModel(result.user, 'google');
    useAuthStore.getState().setUser(gameUser);
    return { user: gameUser, error: null };
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    return { user: null, error: error.message };
  }
};

export const registerWithEmail = async (email, password, fullName, username) => {
  if (!auth) return { user: null, error: "Firebase not configured. Please add keys to .env" };
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Update profile with name
    await updateProfile(result.user, {
      displayName: fullName
    });
    
    // In a real app, you might save the custom username to Firestore here
    
    const gameUser = mapUserToGameModel(result.user, 'email');
    gameUser.username = username; // Override with chosen username
    gameUser.name = fullName;
    
    useAuthStore.getState().setUser(gameUser);
    return { user: gameUser, error: null };
  } catch (error) {
    console.error("Registration Error:", error);
    return { user: null, error: error.message };
  }
};

export const loginWithEmail = async (email, password) => {
  if (!auth) return { user: null, error: "Firebase not configured. Please add keys to .env" };
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const gameUser = mapUserToGameModel(result.user, 'email');
    useAuthStore.getState().setUser(gameUser);
    return { user: gameUser, error: null };
  } catch (error) {
    console.error("Login Error:", error);
    return { user: null, error: error.message };
  }
};

export const logoutUser = async () => {
  if (!auth) {
    useAuthStore.getState().logout();
    return { success: true, error: null };
  }
  try {
    await signOut(auth);
    useAuthStore.getState().logout();
    return { success: true, error: null };
  } catch (error) {
    console.error("Logout Error:", error);
    return { success: false, error: error.message };
  }
};

const API_BASE_URL = 'http://localhost:5000/api/v1';

export const sendForgotPasswordOTP = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send OTP');
    }
    
    // Developer convenience: If the backend simulated the OTP, return it
    const devOtp = data.data && data.data.devOtp ? data.data.devOtp : null;

    return { success: true, error: null, devOtp };
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return { success: false, error: error.message };
  }
};

export const resetPasswordWithOTP = async (email, otp, newPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to reset password');
    }
    return { success: true, error: null };
  } catch (error) {
    console.error("Reset Password Error:", error);
    return { success: false, error: error.message };
  }
};
