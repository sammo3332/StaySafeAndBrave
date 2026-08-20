
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// IMPORTANT: Ensure your Firebase project credentials in .env.local are correct.
// The "FirebaseError: Firebase: Error (auth/invalid-api-key)" error means the
// NEXT_PUBLIC_FIREBASE_API_KEY (and other config values) in your .env.local file
// is incorrect, missing, or does not match the Firebase project you are trying to connect to.
// Double-check these values in your Firebase project settings.
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let isFirebaseInitializedCorrectly = false;

if (!firebaseConfig.apiKey) {
  console.error(
    "CRITICAL FIREBASE CONFIGURATION ERROR:\n" +
    "The Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is MISSING or UNDEFINED.\n" +
    "This is required for Firebase to initialize.\n\n" +
    "Please perform the following steps:\n" +
    "1. Ensure you have a file named '.env.local' in the ROOT directory of your project.\n" +
    "2. In '.env.local', make sure you have the line: NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key_here\n" +
    "   (and other NEXT_PUBLIC_FIREBASE_... variables with their correct values from your Firebase project console).\n" +
    "3. VERY IMPORTANT: After saving changes to '.env.local', RESTART your Next.js development server.\n\n" +
    "The application will likely fail to initialize Firebase correctly without this."
  );
} else {
  try {
    // Initialize Firebase
    // Conditional initialization to prevent re-initialization in Next.js HMR
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    auth = getAuth(app);
    isFirebaseInitializedCorrectly = true;
  } catch (error: any) {
    console.error("Error initializing Firebase:", error);
    if (error.code === 'auth/invalid-api-key' || (error.message && error.message.includes("invalid-api-key"))) {
        console.error(
            "FIREBASE INITIALIZATION FAILED (INVALID API KEY):\n" +
            "The API key provided (NEXT_PUBLIC_FIREBASE_API_KEY) is invalid.\n" +
            "1. Double-check this key in your '.env.local' file.\n" +
            "2. Ensure it exactly matches the API key in your Firebase project settings (Project settings -> General -> Your apps -> SDK setup and configuration).\n" +
            "3. Remember to RESTART your Next.js development server after any changes to '.env.local'."
        );
    }
    // app and auth will remain null, isFirebaseInitializedCorrectly remains false
  }
}

export { app, auth, firebaseConfig, isFirebaseInitializedCorrectly };
