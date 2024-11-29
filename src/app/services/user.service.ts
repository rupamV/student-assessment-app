import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  // Retrieve the current user from AuthService
  getCurrentUser() {
    return this.authService.getLoggedInUser(); // Use AuthService to fetch the logged-in user
  }

  // // Get the current user's role from Firestore
  async getCurrentUserRole(): Promise<string | null> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || !currentUser.email) return null;

    const usersCollection = collection(this.firestore, 'users');
    const q = query(usersCollection, where('email', '==', currentUser.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const user = querySnapshot.docs[0].data();
      return user['role'] || null; // Return the role from Firestore
    }

    return null;
  }

  async getUserData(email: string): Promise<any> {
    const usersCollection = collection(this.firestore, 'users');
    const q = query(usersCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }

    return null;
  }

  // Check if the current user has taken the test
  async hasTakenTest(): Promise<boolean> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || !currentUser.email) return false;

    const userDocRef = doc(this.firestore, 'users', currentUser.email);
    const docSnapshot = await getDoc(userDocRef);

    return docSnapshot.exists() && docSnapshot.data()?.['testTaken'] === true;
  }

  // Mark the test as taken for the current user
  async markTestAsTaken(): Promise<void> {
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.email) {
      const userDocRef = doc(this.firestore, 'users', currentUser.email);
      await setDoc(userDocRef, { testTaken: true }, { merge: true });
    }
  }
}
