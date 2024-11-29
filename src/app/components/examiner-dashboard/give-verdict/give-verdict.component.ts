import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-give-verdict',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './give-verdict.component.html',
  styleUrl: './give-verdict.component.css',
})
export class GiveVerdictComponent {
  examId: string = '';
  userEmail: string = '';
  submission: any = null;
  verdict: string = '';

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private router: Router,
    private authService: AuthService
  ) {
    this.examId = this.route.snapshot.paramMap.get('examId') || '';
    this.loadSubmission();
  }

  // Fetches the user's submission for the given exam
  async loadSubmission(): Promise<void> {
    try {
      const submission = await this.examService.getSubmission(this.examId);
      this.submission = submission;
    } catch (error) {
      console.error('Error fetching submission:', error);
    }
  }

  // Saves the verdict
  async saveVerdict(): Promise<void> {
    if (!this.verdict) {
      alert('Please select a verdict.');
      return;
    }
    try {
      await this.examService.saveVerdictToDatabase(
        this.examId,
        this.userEmail,
        this.verdict
      );
      alert('Verdict saved successfully');
      this.router.navigate(['dashboard/examiner']);
    } catch (error) {
      console.error('Error saving verdict:', error);
    }
  }
}
