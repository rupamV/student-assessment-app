import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../services/exam.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-examiner-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './examiner-dashboard.component.html',
  styleUrls: ['./examiner-dashboard.component.css'],
})
export class ExaminerDashboardComponent implements OnInit {
  exams: any[] = []; // Stores all exams

  constructor(private examService: ExamService, private router: Router) {}

  ngOnInit(): void {
    this.refreshData();
  }

  // Fetches all exams and updates the dashboard
  async refreshData(): Promise<void> {
    try {
      this.exams = await this.examService.getExams();
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  }

  // Deletes an exam
  async deleteExam(exam: any): Promise<void> {
    try {
      await this.examService.deleteExam({ title: exam.title });
      await this.refreshData();
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
  }

  // Navigate to the Add Exam page
  addExamPage(): void {
    this.router.navigate(['dashboard/examiner/add-exam']);
  }

  // Returns the keys of the object or an empty array if the object is undefined/null
  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  // Navigate to the 'Give Verdict' page
  viewSubmission(examId: string, userEmail: string): void {
    this.router.navigate(['dashboard/examiner/give-verdict', examId]);
  }
}
