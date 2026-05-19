import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  type DocumentData
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const dataService = {
  // Generic list
  async list<T>(collectionPath: string, orderField: string = 'createdAt'): Promise<T[]> {
    try {
      const q = query(collection(db, collectionPath), orderBy(orderField, 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, collectionPath);
      return [];
    }
  },

  // Generic create
  async create<T extends DocumentData>(collectionPath: string, data: T): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, collectionPath), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, collectionPath);
      return '';
    }
  },

  // Generic update
  async update<T extends DocumentData>(collectionPath: string, id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, collectionPath, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${collectionPath}/${id}`);
    }
  },

  // Generic delete
  async delete(collectionPath: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionPath, id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${collectionPath}/${id}`);
    }
  },

  // Settings
  async getSettings(): Promise<any> {
    try {
      const docRef = doc(db, 'settings', 'global');
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? snapshot.data() : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'settings/global');
    }
  },

  async updateSettings(data: any): Promise<void> {
    try {
      const docRef = doc(db, 'settings', 'global');
      await updateDoc(docRef, data);
    } catch (error) {
      // If it doesn't exist, we might need setDoc, but for now we'll assume update/init
      handleFirestoreError(error, OperationType.UPDATE, 'settings/global');
    }
  }
};
