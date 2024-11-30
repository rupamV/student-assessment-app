import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'firebase/auth';
import { Exam, NewExam } from '../../../app.model';
import { ExamService } from '../../../services/exam.service';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-edit-exam',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent],
  templateUrl: './edit-exam.component.html',
  styleUrl: './edit-exam.component.css',
})
export class EditExamComponent {
  examForm!: FormGroup;
  students: User[] = [];
  examId: string = '';
  loading = false;
  examDetails!: Exam;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private examService: ExamService
  ) {
    this.loading = true;
    this.examId = this.activatedRoute.snapshot.params['examId'];
    this.examService.fetchExamById(this.examId).then(
      (exam) => {
        if (!exam) {
          this.router.navigate(['dashboard/examiner']);
        }
        const res: Exam = exam as Exam;
        this.examDetails = res;
        this.examForm = new FormGroup({
          title: new FormControl(this.examDetails.title, {
            validators: [Validators.required, Validators.minLength(3)],
          }),
          question: new FormControl(this.examDetails.question, {
            validators: [Validators.required],
          }),
          options: new FormArray(
            this.examDetails.options.map((option) => {
              return new FormControl(option, {
                validators: [Validators.required],
              });
            })
          ),
          assignedTo: new FormControl(this.examDetails.assignedTo, {
            validators: [Validators.email],
          }),
        });
      },
      (error) => {
        console.log('Error:', error);
      }
    );
    this.userService
      .fetchUsers()
      .then(
        (users) => {
          const students = users.filter((user) => user.role === 'student');
          this.students = students;
        },
        (error) => {
          console.log('Error:', error);
        }
      )
      .finally(() => {
        this.loading = false;
      });
  }

  // Getter for the options array
  get options(): FormArray {
    return this.examForm.get('options') as FormArray;
  }

  // Getter for the assignedTo array
  get assignedTo(): FormArray {
    return this.examForm.get('assignedTo') as FormArray;
  }

  // Create an option FormControl
  createOption(): FormControl {
    return this.fb.control('', Validators.required);
  }

  // Add a new option
  addOption() {
    this.options.push(this.createOption());
  }

  // Remove an option at a given index
  removeOption(index: number) {
    this.options.removeAt(index);
  }

  // Add a new email to assignedTo array
  addAssignedTo(email: string = '') {
    this.assignedTo.push(this.fb.control(email, Validators.email));
  }

  // Remove an email from assignedTo array
  removeAssignedTo(index: number) {
    this.assignedTo.removeAt(index);
  }

  // Submit the form
  onSubmit() {
    const updatedExam: Exam = {
      id: this.examId,
      assignedTo: this.examForm.value.assignedTo,
      question: this.examForm.value.question,
      title: this.examForm.value.title,
      options: this.examForm.value.options,
      verdict: this.examDetails.verdict,
      response: this.examDetails.response,
      status: this.examDetails.status,
    };

    this.examService.updateExam(updatedExam).then(
      () => {
        console.log('Exam added successfully');
        this.router.navigate(['/dashboard/examiner']);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  isFormDirty() {
    const initialExam: Exam = {
      id: this.examId,
      assignedTo: this.examDetails.assignedTo,
      question: this.examDetails.question,
      title: this.examDetails.title,
      options: this.examDetails.options,
      verdict: this.examDetails.verdict,
      response: this.examDetails.response,
      status: this.examDetails.status,
    };

    const updatedExam: Exam = {
      id: this.examId,
      assignedTo: this.examForm.value.assignedTo,
      question: this.examForm.value.question,
      title: this.examForm.value.title,
      options: this.examForm.value.options,
      verdict: this.examDetails.verdict,
      response: this.examDetails.response,
      status: this.examDetails.status,
    };

    return JSON.stringify(updatedExam) !== JSON.stringify(initialExam);
  }
}
