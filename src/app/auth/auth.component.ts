import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class AuthComponent {
  isLoginMode = true; // Toggles between login and register views
  authForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private fireauth: AuthService,
    private firestore: Firestore,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [''], // Role is required only for registration
    });
  }

  // Switch between login and registration modes
  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.authForm.reset(); // Reset form when switching modes
  }

  async onSubmit() {
    if (this.authForm.invalid) {
      alert('Please fill out the form correctly.');
      return;
    }

    const { email, password, role } = this.authForm.value;

    if (this.isLoginMode) {
      await this.login(email, password);
    } else {
      await this.register(email, password, role);
    }
  }

  private async login(email: string, password: string) {
    try {
      const loggedInUser = await this.fireauth.login(email, password);

      if (loggedInUser?.uid) {
        const usersCollection = collection(this.firestore, 'users');
        const userQuery = query(
          usersCollection,
          where('uid', '==', loggedInUser.uid)
        );
        const snapshot = await getDocs(userQuery);

        if (!snapshot.empty) {
          const userData: any = snapshot.docs[0].data();
          if (userData.role === 'examiner') {
            this.router.navigate(['/dashboard/examiner']);
          } else if (userData.role === 'student') {
            this.router.navigate(['/dashboard/student']);
          } else {
            alert('Unknown role. Please contact support.');
          }
        } else {
          alert('User not found in Firestore.');
        }
      } else {
        alert('Login failed: Unable to fetch user details.');
      }
    } catch (error: unknown) {
      alert(`Login failed: ${(error as Error).message}`);
    }
  }

  private async register(email: string, password: string, role: string) {
    if (!role || (role !== 'examiner' && role !== 'student')) {
      alert('Please select a valid role: examiner or student.');
      return;
    }

    if (role === 'examiner') {
      const usersCollection = collection(this.firestore, 'users');
      const examinerQuery = query(
        usersCollection,
        where('role', '==', 'examiner')
      );
      const snapshot = await getDocs(examinerQuery);
      if (!snapshot.empty) {
        alert('An examiner already exists. Please register as a student.');
        return;
      }
    }

    try {
      await this.fireauth.register(email, password, role);
      this.router.navigate(['/auth']);
    } catch (error: any) {
      alert(`Registration failed: ${error.message}`);
    }
  }
}
