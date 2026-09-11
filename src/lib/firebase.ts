import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
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
        displayName: result.user.displayName || 'Community Member',
        email: result.user.email || '',
        photoURL:
          result.user.photoURL ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        bio: 'SkillSpace Community Member',
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

export async function saveListingToFirestore(listing: LiveListing): Promise<void> {
  const path = `listings/${listing.id}`;
  try {
    const listingRef = doc(db, 'listings', listing.id);
    await setDoc(listingRef, listing);
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
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const items: LiveListing[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as LiveListing);
        });
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
