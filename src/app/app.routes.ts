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
    component: HomepageComponent,
  },
  {
    path: 'homepage',
    component: HomepageComponent,
  },
  {
    path: 'auth',
    component: AuthComponent,
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
    path: 'dashboard/examiner/edit-exam/:examId',
    component: EditExamComponent,
  },
  {
    path: 'dashboard/examiner/:examId',
    component: GiveVerdictComponent,
  },
  {
    path: 'dashboard/student',
    component: StudentDashboardComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'student',
    },
  },
  {
    path: 'dashboard/student/take-exam/:examId',
    component: TakeExamComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'student',
    },
  },
];
