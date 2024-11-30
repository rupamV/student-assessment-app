import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Exam } from '../../app.model';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../services/exam.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css',
})
export class StudentDashboardComponent {
  loading = false;
  exams: Exam[] = [];

  constructor(
    private examService: ExamService,
    private authService: AuthService,
    private router: Router
  ) {
    this.fetchData();
  }
  fetchData() {
    this.loading = true;
    const userId = this.authService.currentUser?.uid;
    this.examService
      .fetchExams()
      .then(
        (exams) => {
          this.exams = exams.filter((exam) => exam.assignedTo === userId);
          console.log(this.exams);
        },
        (error) => {
          console.log('Error:', error);
        }
      )
      .finally(() => {
        this.loading = false;
      });
  }

  getStatus(status: string) {
    if (status === 'attempted') {
      return 'Attempted';
    } else {
      return 'Pending';
    }
  }
  takeExam(examId: string) {
    this.router.navigate(['dashboard/student/take-exam', examId]);
  }
}
