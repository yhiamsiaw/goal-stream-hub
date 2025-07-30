import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Match } from '@/types/Match';

const COLLECTION_NAME = 'competitions';

export const matchService = {
  // Get all matches
  async getAllMatches(): Promise<Match[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('kickoff.date', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Match));
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  },

  // Get live matches
  async getLiveMatches(): Promise<Match[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        where('score.status', '==', 'LIVE'),
        orderBy('kickoff.date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Match));
    } catch (error) {
      console.error('Error fetching live matches:', error);
      throw error;
    }
  },

  // Get hot matches
  async getHotMatches(): Promise<Match[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        where('score.type', '==', 'HOT'),
        orderBy('kickoff.date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Match));
    } catch (error) {
      console.error('Error fetching hot matches:', error);
      throw error;
    }
  },

  // Get match by ID
  async getMatchById(id: string): Promise<Match | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Match;
      }
      return null;
    } catch (error) {
      console.error('Error fetching match:', error);
      throw error;
    }
  },

  // Add new match
  async addMatch(match: Omit<Match, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...match,
        createdAt: now,
        updatedAt: now
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding match:', error);
      throw error;
    }
  },

  // Update match
  async updateMatch(id: string, match: Partial<Match>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...match,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating match:', error);
      throw error;
    }
  },

  // Delete match
  async deleteMatch(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error('Error deleting match:', error);
      throw error;
    }
  }
};