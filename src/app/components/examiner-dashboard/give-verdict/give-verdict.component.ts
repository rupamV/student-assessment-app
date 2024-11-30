import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { Exam, User } from '../../../app.model';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-give-verdict',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './give-verdict.component.html',
  styleUrl: './give-verdict.component.css',
})
export class GiveVerdictComponent {
  examId: string = '';
  examDetails!: Exam;
  loading = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private examService: ExamService,
    private router: Router,
    private userService: UserService
  ) {
    this.examId = this.activeRoute.snapshot.params['examId'];
    this.examService.fetchExamById(this.examId).then(
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
    );
  }
  onSubmit(verdict: 'pass' | 'fail') {
    this.loading = true;
    const updatedExam: Exam = {
      id: this.examId,
      assignedTo: this.examDetails.assignedTo,
      question: this.examDetails.question,
      title: this.examDetails.title,
      options: this.examDetails.options,
      verdict: verdict,
      response: this.examDetails.response,
      status: this.examDetails.status,
    };
    this.examService
      .updateExam(updatedExam)
      .then(
        (res) => {
          this.router.navigate(['dashboard/examiner']);
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
  giveVerdict(arg0: string) {
    this.onSubmit(arg0 as 'pass' | 'fail');
  }
}
