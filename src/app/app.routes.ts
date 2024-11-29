import { Routes } from '@angular/router';
import { ExaminerDashboardComponent } from './components/examiner-dashboard/examiner-dashboard.component';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'dashboard/examiner',
    component: ExaminerDashboardComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'examiner',
    },
  },
  {
    path: 'dashboard/student',
    component: StudentDashboardComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'student',
    },
  },
];
