import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { NavbarComponent } from '../../navbar/navbar.component';
import { ExamService } from '../../../services/exam.service';
import { NewExam, User } from '../../../app.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-add-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './add-exam.component.html',
  styleUrls: ['./add-exam.component.css'],
})
export class AddExamComponent {
  examForm: FormGroup;
  students: User[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private examService: ExamService
  ) {
    this.examForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      question: ['', [Validators.required]],
      options: this.fb.array([this.createOption()]), // Initialize with one option
      assignedTo: ['', [Validators.required]],
    });
    this.userService.fetchUsers().then(
      (users) => {
        const students = users.filter((user) => user.role === 'student');
        this.students = students;
      },
      (error) => {
        console.log('Error:', error);
      }
    );
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

  // Submit the form
  onSubmit() {
    if (!this.examForm.valid) return;

    const formData = this.examForm.value;

    const examData: NewExam = {
      title: formData.title,
      question: formData.question,
      options: formData.options,
      assignedTo: formData.assignedTo,
      status: 'pending',
      verdict: 'pending',
      response: '',
    };

    this.examService.addExam(examData).then(
      () => {
        console.log('Exam added successfully');
        this.router.navigate(['/dashboard/examiner']);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
}
