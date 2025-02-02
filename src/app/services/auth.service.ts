import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  UserCredential,
  User,
} from '@angular/fire/auth';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserService } from './user.service';

interface CurrentUser {
  uid: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: CurrentUser | null = null;
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    const user = sessionStorage.getItem('user');
    if (user) {
      this.currentUser = JSON.parse(user);
    }
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

  async login(email: string, password: string): Promise<User> {
    try {
      const res: UserCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = await this.getUserData(email);
      this.currentUser = user;
      sessionStorage.setItem('user', JSON.stringify(user));

      return res.user;
    } catch (error: any) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async register(email: string, password: string, role: string): Promise<void> {
    try {
      const res = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const usersCollection = collection(this.firestore, 'users');

      await addDoc(usersCollection, {
        uid: res.user.uid,
        email,
        role,
      });

      const isVerified = await this.sendEmailForVerification(res.user);
    } catch (error: any) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  async sendEmailForVerification(user: User): Promise<boolean> {
    let res = false;
    await sendEmailVerification(user)
      .then(() => {
        alert('Verification email sent!, Please verify your email address.');
        // this.router.navigate(['/verify-email']);
        res = true;
      })
      .catch(() => {
        alert('Unable to send verification email.');
        res = false;
      });
    return res;
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      sessionStorage.removeItem('user');
      this.currentUser = null;
      console.log('Logged out');

      this.router.navigate(['/auth']);
    } catch (error: any) {
      alert(`Logout failed: ${error.message}`);
    }
  }

  getLoggedInUser(): User | null {
    return this.auth.currentUser;
  }

  isUserLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  getUserRole(): string | null {
    return this.currentUser?.role || null;
  }
}
