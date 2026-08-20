import { initializeApp } from "firebase/app";

// Mock the initializeApp function to prevent actual Firebase initialization during tests
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));
describe('Firebase Initialization', () => {
  let originalFirebaseApiKey: string | undefined;

  beforeEach(() => {
    // Store the original environment variable
    originalFirebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  });

  afterEach(() => {
    // Restore the original environment variable
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = originalFirebaseApiKey;
    // Clear any mocks
    jest.clearAllMocks();
  });

  test('should initialize firebase if NEXT_PUBLIC_FIREBASE_API_KEY is present', () => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test_api_key';

    // Import the file that initializes Firebase.
    // We use a dynamic import here to ensure the environment variable is set before import.
    require('../src/lib/firebase');

    expect(initializeApp).toHaveBeenCalledTimes(1);
    // You might want to check the config object passed to initializeApp if your config is more complex
    // expect(initializeApp).toHaveBeenCalledWith(expect.objectContaining({ apiKey: 'test_api_key' }));
  });

  test('should throw an error if NEXT_PUBLIC_FIREBASE_API_KEY is missing', () => {
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    // We expect the import to throw an error because the API key is missing
    expect(() => {
      require('../src/lib/firebase');
    }).toThrow('Missing Firebase API Key'); // Assuming your firebase.ts throws this specific error

    expect(initializeApp).not.toHaveBeenCalled();
  });

  test('should throw an error if NEXT_PUBLIC_FIREBASE_API_KEY is an empty string', () => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = '';

    // We expect the import to throw an error because the API key is empty
    expect(() => {
      require('../src/lib/firebase');
    }).toThrow('Missing Firebase API Key'); // Assuming your firebase.ts throws this specific error

    expect(initializeApp).not.toHaveBeenCalled();
  });
});
