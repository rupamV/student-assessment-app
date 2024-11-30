import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ExamService } from '../../services/exam.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserService } from '../../services/user.service';
import { Exam, User } from '../../app.model';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-examiner-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  templateUrl: './examiner-dashboard.component.html',
  styleUrl: './examiner-dashboard.component.css',
})
export class ExaminerDashboardComponent {
  exams: Exam[] = [];
  responses: any;
  userId = '';
  loading = false;

  constructor(
    private examService: ExamService,
    private userService: UserService,
    private router: Router
  ) {
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    this.examService
      .fetchExams()
      .then(
        (exams) => {
          this.exams = exams;
        },
        (error) => {
          console.log('Error:', error);
        }
      )
      .finally(() => {
        this.loading = false;
      });
  }

  getUserById(id: string): User {
    return this.userService.getUserById(id)!;
  }

  getStatus(status: string) {
    if (status === 'attempted') {
      return 'Attempted';
    } else {
      return 'Pending';
    }
  }

  addExam() {
    this.router.navigate(['dashboard/examiner/add-exam']);
  }
  async deleteExam(examId: string) {
    await this.examService.deleteExam(examId);
    this.fetchData();
  }

  editExam(arg0: any) {
    this.router.navigate(['dashboard/examiner/edit-exam/', arg0]);
  }
}
