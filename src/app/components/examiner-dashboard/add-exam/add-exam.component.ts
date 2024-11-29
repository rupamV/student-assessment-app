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
import { NavbarComponent } from '../../navbar/navbar.component';
import { ExamService } from '../../../services/exam.service';

@Component({
  selector: 'app-add-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './add-exam.component.html',
  styleUrls: ['./add-exam.component.css'],
})
export class AddExamComponent {
  examForm: FormGroup;

  constructor(private fb: FormBuilder, private examService: ExamService) {
    this.examForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      question: ['', [Validators.required]],
      options: this.fb.array([this.createOption()]), // Initialize with one option
      assignedTo: ['', [Validators.required]],
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
  async onSubmit() {
    if (this.examForm.valid) {
      const formData = this.examForm.value;

      const assignedToEmails =
        typeof formData.assignedTo === 'string'
          ? formData.assignedTo.split(',').map((email: string) => email.trim())
          : [];

      const examData = {
        title: formData.title,
        question: formData.question,
        options: formData.options,
        assignedTo: assignedToEmails,
        status: {},
      };

      try {
        await this.examService.addExam(examData);

        alert('Exam added successfully!');
        this.examForm.reset();
        this.options.clear();
        this.examForm.get('assignedTo')?.reset('');
        this.addOption();
      } catch (error) {
        alert('Failed to add exam. Please try again.');
        console.error(error);
      }
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
