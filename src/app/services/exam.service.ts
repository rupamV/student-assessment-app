import { Injectable } from '@angular/core';
import { Exam, NewExam } from '../app.model';
import { FireStoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private exams: Exam[] = [];
  examsLoading = true;

  constructor(private firestoreService: FireStoreService) {
    this.fetchExams()
      .then(
        (exams) => {
          this.exams = exams;
        },
        (error) => {
          console.log('Error:', error);
        }
      )
      .finally(() => {
        this.examsLoading = false;
      });
  }

  fetchExams() {
    return this.firestoreService.getCollection('exams');
  }

  fetchExamById(id: string) {
    return this.firestoreService.getDocument(`exams/${id}`);
  }

  setExams(exams: Exam[]) {
    this.exams = exams;
  }

  getExams() {
    return this.exams;
  }

  getExamById(id: string) {
    return this.exams.find((task) => task.id === id);
  }

  addExam(exam: NewExam) {
    return this.firestoreService.addDocument('exams', exam);
  }

  deleteExam(id: string) {
    return this.firestoreService.deleteDocument(`exams/${id}`);
  }

  updateExam(exam: Exam) {
    console.log(exam);
    return this.firestoreService.updateDocument(`exams/${exam.id}`, exam).then(
      () => {
        const index = this.exams.findIndex((t) => t.id === exam.id);
        this.exams[index] = exam;
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
}
