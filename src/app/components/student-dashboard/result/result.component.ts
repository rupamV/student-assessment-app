import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { UserService } from '../../../services/user.service';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css',
})
export class ResultComponent implements OnInit {
  navigate() {
    throw new Error('Method not implemented.');
  }
  verdict: string = '';
  userEmail: string = '';

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userEmail = this.authService.currentUser?.email || '';
    this.fetchVerdict();
  }
  async fetchVerdict() {
    await this.loadVerdict();
  }
  async loadVerdict(): Promise<void> {
    try {
      const submission = await this.examService.getSubmission(this.userEmail);

      this.verdict = submission?.verdict || 'Not graded yet';
    } catch (error) {
      console.error('Error fetching verdict:', error);
    }
  }
  navigateToDash() {
    this.router.navigateByUrl('dashboard/student');
  }
}
