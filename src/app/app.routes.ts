import { Routes } from '@angular/router';
import { ExaminerDashboardComponent } from './components/examiner-dashboard/examiner-dashboard.component';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { AddExamComponent } from './components/examiner-dashboard/add-exam/add-exam.component';
import { GiveVerdictComponent } from './components/examiner-dashboard/give-verdict/give-verdict.component';
import { EditExamComponent } from './components/examiner-dashboard/edit-exam/edit-exam.component';
import { TakeExamComponent } from './components/student-dashboard/take-exam/take-exam.component';
import { AuthComponent } from './auth/auth.component';
import { HomepageComponent } from './components/homepage/homepage.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/homepage/homepage.component').then(
        (m) => m.HomepageComponent
      ),
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'dashboard/examiner',
    loadComponent: () =>
      import(
        './components/examiner-dashboard/examiner-dashboard.component'
      ).then((m) => m.ExaminerDashboardComponent),
    canActivate: [AuthGuard],
    data: {
      role: 'examiner',
    },
  },
  {
    path: 'dashboard/examiner/add-exam',
    loadComponent: () =>
      import(
        './components/examiner-dashboard/add-exam/add-exam.component'
      ).then((m) => m.AddExamComponent),
  },
  {
    path: 'dashboard/examiner/edit-exam/:examId',
    loadComponent: () =>
      import(
        './components/examiner-dashboard/edit-exam/edit-exam.component'
      ).then((m) => m.EditExamComponent),
  },
  {
    path: 'dashboard/examiner/:examId',
    loadComponent: () =>
      import(
        './components/examiner-dashboard/give-verdict/give-verdict.component'
      ).then((m) => m.GiveVerdictComponent),
  },
  {
    path: 'dashboard/student',
    loadComponent: () =>
      import('./components/student-dashboard/student-dashboard.component').then(
        (m) => m.StudentDashboardComponent
      ),
    canActivate: [AuthGuard],
    data: {
      role: 'student',
    },
  },
  {
    path: 'dashboard/student/take-exam/:examId',
    loadComponent: () =>
      import(
        './components/student-dashboard/take-exam/take-exam.component'
      ).then((m) => m.TakeExamComponent),
    canActivate: [AuthGuard],
    data: {
      role: 'student',
    },
  },
];
