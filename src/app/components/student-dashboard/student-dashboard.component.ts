import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { UserService } from '../../services/user.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

// Define the Exam interface explicitly
export interface Exam {
  id: string;
  title: string;
  assignedTo: string[];
  status: { [email: string]: string };
  question: string;
  options: string[];
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
})
export class StudentDashboardComponent implements OnInit {
  assignedExams: Exam[] = [];
  currentUserEmail: string = '';

  constructor(
    private examService: ExamService,
    private router: Router,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.currentUserEmail = currentUser.email || ''; // Get the current user's email
      const exams = await this.examService.getExams();
      console.log(exams);
      // Ensure the fetched exams are properly typed and filter based on assigned users
      this.assignedExams = exams.filter((exam) =>
        exam.assignedTo.includes(currentUser.email!)
      );
      console.log(this.assignedExams);
    }
  }

  // Method to navigate to View Result page
  onViewResult(examId: string): void {
    this.router.navigate(['/result', examId]);
  }

  // Method to navigate to Take Exam page
  onTakeExam(examId: string): void {
    this.router.navigate(['/take-exam', examId]);
  }
}
