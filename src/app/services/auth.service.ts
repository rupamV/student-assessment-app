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
  isVerified: boolean = false;

  async login(email: string, password: string): Promise<User> {
    try {
      const res: UserCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = res.user; // User object directly from the signIn response
      this.currentUser = await this.getUserData(email);

      // Check if the email is verified
      if (user.emailVerified) {
        this.isVerified = true; // Set isVerified to true if email is verified
        sessionStorage.setItem('user', JSON.stringify(user));
        return res.user;
      } else {
        this.isVerified = false; // Email is not verified, set isVerified to false
        throw new Error('Please verify your email address.');
      }
    } catch (error: any) {
      throw new Error(`${error.message}`);
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

      // Send the email verification link and check status
      this.isVerified = await this.sendEmailForVerification(res.user);
    } catch (error: any) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  async sendEmailForVerification(user: User): Promise<boolean> {
    let res = false;
    await sendEmailVerification(user)
      .then(() => {
        alert('Verification email sent! Please verify your email address.');
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
