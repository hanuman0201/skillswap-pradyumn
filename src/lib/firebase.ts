import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  getDoc,
  setDoc,
  collection,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// CRITICAL: The app will break without specifying firebaseConfig.firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error handling structures as mandated by Firebase Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test helper
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase connection confirmed.');
    return true;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.warn('Firebase connection: client appears offline.', error);
      return false;
    }
    // Non-fatal if test doc isn't created yet
    return true;
  }
}

// Test connection on startup
testConnection().catch(() => {});

// Auth Helpers
export async function signInWithGoogle(): Promise<User> {
  try {
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, googleProvider);
    // Sync user profile to Firestore
    if (result.user) {
      await saveUserProfileToFirestore({
        id: result.user.uid,
        displayName: result.user.displayName || result.user.email?.split('@')[0] || 'Community Member',
        email: result.user.email || '',
        photoURL:
          result.user.photoURL ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        bio: 'SkillSpace Community Member. Open to peer skill trades and coin mentorship sessions.',
        coins: 240, // standard starter balance
        createdAt: new Date().toISOString(),
      });
    }
    return result.user;
  } catch (err: unknown) {
    console.error('Sign-in error:', err);
    throw err;
  }
}

export async function signInWithEmail(email: string, pass: string): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (err: unknown) {
    console.error('Email sign-in error:', err);
    throw err;
  }
}

export async function signUpWithEmail(
  email: string,
  pass: string,
  displayName: string
): Promise<User> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (displayName && result.user) {
      await updateProfile(result.user, { displayName });
    }
    // Sync to Firestore
    if (result.user) {
      await saveUserProfileToFirestore({
        id: result.user.uid,
        displayName: displayName || email.split('@')[0] || 'Community Member',
        email: result.user.email || email,
        photoURL:
          result.user.photoURL ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        bio: 'SkillSpace Community Member. Open to peer skill trades and coin mentorship sessions.',
        coins: 240,
        createdAt: new Date().toISOString(),
      });
    }
    return result.user;
  } catch (err: unknown) {
    console.error('Email signup error:', err);
    throw err;
  }
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

// Listing Entity Structure
export interface LiveListing {
  id: string;
  title: string;
  description: string;
  type: 'teach' | 'learn';
  category: string;
  skillsOffered: string;
  skillsWanted: string;
  tradeType: 'coins' | 'barter' | 'both';
  coinsRate: number; // 40
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorEmail?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LiveUserProfile {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  coins: number;
  createdAt: string;
}

export async function saveUserProfileToFirestore(profile: LiveUserProfile): Promise<void> {
  const path = `users/${profile.id}`;
  try {
    const userRef = doc(db, 'users', profile.id);
    const existing = await getDoc(userRef);
    if (!existing.exists()) {
      await setDoc(userRef, profile);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchUserProfileFromFirestore(userId: string): Promise<LiveUserProfile | null> {
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as LiveUserProfile;
    }
    return null;
  } catch (error) {
    console.warn('Could not fetch user profile:', error);
    return null;
  }
}

export async function updateUserProfileInFirestore(
  userId: string,
  data: Partial<LiveUserProfile>
): Promise<void> {
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveListingToFirestore(listing: LiveListing): Promise<void> {
  const path = `listings/${listing.id}`;
  try {
    // Ensure authorId matches the current authenticated UID
    const currentUid = auth.currentUser?.uid;
    const sanitizedListing: LiveListing = {
      ...listing,
      authorId: currentUid || listing.authorId,
      authorName: (listing.authorName || 'SkillSpace Member').trim().substring(0, 100),
      title: (listing.title || '').trim().substring(0, 150),
      description: (listing.description || '').trim().substring(0, 2000),
      category: (listing.category || 'Engineering & Web Development').trim().substring(0, 60),
      skillsOffered: listing.skillsOffered || '',
      skillsWanted: listing.skillsWanted || '',
      type: listing.type === 'learn' ? 'learn' : 'teach',
      tradeType: listing.tradeType || 'both',
      coinsRate: Number(listing.coinsRate) || 40,
      createdAt: listing.createdAt || new Date().toISOString(),
    };

    const listingRef = doc(db, 'listings', sanitizedListing.id);
    await setDoc(listingRef, sanitizedListing);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteListingFromFirestore(listingId: string): Promise<void> {
  const path = `listings/${listingId}`;
  try {
    const listingRef = doc(db, 'listings', listingId);
    await deleteDoc(listingRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToListings(
  onUpdate: (listings: LiveListing[]) => void
): Unsubscribe {
  const path = 'listings';
  try {
    const colRef = collection(db, path);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items: LiveListing[] = [];
        snapshot.forEach((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as LiveListing;
            items.push(data);
          }
        });
        // Sort chronologically newest first
        items.sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });
        onUpdate(items);
      },
      (error) => {
        console.warn('Listing snapshot notice:', error);
      }
    );
  } catch (error) {
    console.warn('Listing subscription initialization notice:', error);
    return () => {};
  }
}
