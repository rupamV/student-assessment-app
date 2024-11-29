import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ExamService } from '../../services/exam.service';
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-examiner-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './examiner-dashboard.component.html',
  styleUrl: './examiner-dashboard.component.css',
})
export class ExaminerDashboardComponent {
  exams: any = [
    { title: 'Math Exam', assignedTo: 'John Doe' },
    { title: 'Science Exam', assignedTo: 'Jane Smith' },
    { title: 'History Exam', assignedTo: 'Alice Johnson' },
  ];
  responses: any;

  constructor(private examService: ExamService) {
    // this.refreshData();
  }

  async deleteExam(exam: any) {
    await this.examService.deleteExam(exam);
    this.refreshData();
  }
  async refreshData() {
    this.exams = await this.examService.getExams();
    this.responses = await this.examService.getResponses();
  }
}
