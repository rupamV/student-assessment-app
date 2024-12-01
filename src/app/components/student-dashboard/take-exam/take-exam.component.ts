import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { Exam } from '../../../app.model';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-take-exam',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './take-exam.component.html',
  styleUrl: './take-exam.component.css',
})
export class TakeExamComponent {
  examId: string = '';
  examDetails!: Exam;
  loading = false;
  isSubmitting = false;
  userResponse: string = '';
  constructor(
    private activeRoute: ActivatedRoute,
    private examService: ExamService,
    private router: Router,
    private userService: UserService
  ) {
    this.examId = this.activeRoute.snapshot.params['examId'];
    this.examService
      .fetchExamById(this.examId)
      .then(
        (exam) => {
          if (!exam) {
            this.router.navigate(['dashboard/examiner']);
          }
          const res: Exam = exam as Exam;
          this.examDetails = res;
        },
        (error) => {
          console.log('Error:', error);
        }
      )
      .finally(() => {
        this.loading = false;
      });
  }

  submitExam() {
    this.isSubmitting = true;
    const updatedExamData: Exam = {
      ...this.examDetails,
      id: this.examId,
      response: this.userResponse,
      status: 'attempted',
    };
    // console.log('Updated Exam Data:', updatedExamData);
    this.examService
      .updateExam(updatedExamData)
      .then(
        (res) => {
          console.log('Exam submitted successfully');
          this.router.navigate(['dashboard/student']);
        },
        (error) => {
          console.log('Error:', error);
        }
      )
      .finally(() => {
        this.isSubmitting = false;
      });
  }
}
