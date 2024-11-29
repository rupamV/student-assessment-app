import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { Exam } from '../student-dashboard.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  selector: 'app-take-exam',
  templateUrl: './take-exam.component.html',
  styleUrls: ['./take-exam.component.css'],
})
export class TakeExamComponent implements OnInit {
  exam!: Exam;
  examId!: string;

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('examId')!;
    this.loadExamDetails();
  }

  // Load the full details of the exam
  async loadExamDetails() {
    try {
      const exams = await this.examService.getExams();
      this.exam = exams.find((exam) => exam.id === this.examId)!;
    } catch (error) {
      console.error('Error loading exam details:', error);
    }
  }

  async submitExam() {
    const isSubmitted = await this.examService.hasSubmittedResponse(
      this.authService.currentUser?.email!,
      this.exam.title
    );
    if (isSubmitted) {
      alert('You have already submitted the exam');
    } else {
      alert('Exam submitted successfully');
      const answers: Record<string, string> = { question: 'answer' };
      this.examService.submitAnswers(this.examId, answers);
    }
  }
}
