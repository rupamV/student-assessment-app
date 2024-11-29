import { Routes } from '@angular/router';
import { ExaminerDashboardComponent } from './components/examiner-dashboard/examiner-dashboard.component';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { AddExamComponent } from './components/examiner-dashboard/add-exam/add-exam.component';
import { TakeExamComponent } from './components/student-dashboard/take-exam/take-exam.component';
import { GiveVerdictComponent } from './components/examiner-dashboard/give-verdict/give-verdict.component';
import { ResultComponent } from './components/student-dashboard/result/result.component';

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
    path: 'dashboard/examiner/add-exam',
    component: AddExamComponent,
  },
  {
    path: 'dashboard/student',
    component: StudentDashboardComponent,

    data: {
      role: 'student',
    },
  },
  {
    path: 'take-exam/:examId',
    component: TakeExamComponent,
  },
  {
    path: 'dashboard/examiner/give-verdict/:examId',
    component: GiveVerdictComponent,
  },
  {
    path: 'result/:examId',
    component: ResultComponent,
  },
];
