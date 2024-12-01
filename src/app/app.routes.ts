import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./components/homepage/homepage.component').then(
        (m) => m.HomepageComponent
      ),
  },
  {
    path: 'homepage',
    loadChildren: () =>
      import('./components/homepage/homepage.component').then(
        (m) => m.HomepageComponent
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'dashboard/examiner',
    loadChildren: () =>
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
    loadChildren: () =>
      import(
        './components/examiner-dashboard/add-exam/add-exam.component'
      ).then((m) => m.AddExamComponent),
  },
  {
    path: 'dashboard/examiner/edit-exam/:examId',
    loadChildren: () =>
      import(
        './components/examiner-dashboard/edit-exam/edit-exam.component'
      ).then((m) => m.EditExamComponent),
  },
  {
    path: 'dashboard/examiner/:examId',
    loadChildren: () =>
      import(
        './components/examiner-dashboard/give-verdict/give-verdict.component'
      ).then((m) => m.GiveVerdictComponent),
  },
  {
    path: 'dashboard/student',
    loadChildren: () =>
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
    loadChildren: () =>
      import(
        './components/student-dashboard/take-exam/take-exam.component'
      ).then((m) => m.TakeExamComponent),
    canActivate: [AuthGuard],
    data: {
      role: 'student',
    },
  },
];
