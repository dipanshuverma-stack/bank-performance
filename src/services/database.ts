import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp, 
  getFirestore,
  addDoc
} from 'firebase/firestore';
import { db } from '@/firebase/config';

/**
 * @fileOverview Repository Pattern Service Layer.
 * Centralizes all CRUD operations to ensure data consistency and cloud-first persistence.
 */

export const DatabaseService = {
  async save(userId: string, collectionName: string, data: any, id?: string) {
    if (!db) throw new Error("Persistence Engine Offline");
    
    const colRef = collection(db, 'users', userId, collectionName);
    const docRef = id ? doc(colRef, id) : doc(colRef);
    
    const payload = {
      ...data,
      id: docRef.id,
      updatedAt: serverTimestamp(),
      createdAt: data.createdAt || serverTimestamp(),
    };

    await setDoc(docRef, payload, { merge: true });
    console.log(`[Firestore] Write Success: ${collectionName}/${docRef.id}`);
    return docRef.id;
  },

  async remove(userId: string, collectionName: string, id: string) {
    if (!db) throw new Error("Persistence Engine Offline");
    const docRef = doc(db, 'users', userId, collectionName, id);
    await deleteDoc(docRef);
    console.log(`[Firestore] Delete Success: ${collectionName}/${id}`);
  }
};
