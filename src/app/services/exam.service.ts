import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  setDoc,
} from '@angular/fire/firestore';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  constructor(private firestore: Firestore, private userService: UserService) {}

  // Get all exams from Firestore
  async getExams() {
    const examsCollection = collection(this.firestore, 'exams');
    const querySnapshot = await getDocs(examsCollection);
    return querySnapshot.docs.map((doc) => doc.data());
  }

  // Get all responses from Firestore
  async getResponses() {
    const responsesCollection = collection(this.firestore, 'responses');
    const querySnapshot = await getDocs(responsesCollection);
    return querySnapshot.docs.map((doc) => doc.data());
  }

  // Add a new exam to Firestore
  async addExam(exam: { title: string; question: string; options: string[] }) {
    const examsCollection = collection(this.firestore, 'exams');
    await addDoc(examsCollection, exam);
  }

  // Delete an exam by its title
  async deleteExam(exam: { title: string }) {
    const examsCollection = collection(this.firestore, 'exams');
    const q = query(examsCollection, where('title', '==', exam.title));
    const querySnapshot = await getDocs(q);

    for (const examDoc of querySnapshot.docs) {
      const examRef = doc(this.firestore, 'exams', examDoc.id);
      await deleteDoc(examRef);
    }
  }

  // Record a student's response for an exam
  async recordResponse(examTitle: string, answer: string): Promise<boolean> {
    const currentUser = this.userService.getCurrentUser();

    if (!currentUser) {
      throw new Error('No user is logged in.');
    }

    const email = currentUser.email;
    if (!email) {
      throw new Error('Unable to fetch user email.');
    }

    const alreadySubmitted = await this.hasSubmittedResponse(email, examTitle);
    if (alreadySubmitted) return false;

    const responsesCollection = collection(this.firestore, 'responses');
    await addDoc(responsesCollection, {
      studentEmail: email,
      examTitle,
      answer,
    });
    return true;
  }

  // Check if a student has already submitted an answer for a specific exam
  async hasSubmittedResponse(
    studentEmail: string,
    examTitle: string
  ): Promise<boolean> {
    const responsesCollection = collection(this.firestore, 'responses');
    const q = query(
      responsesCollection,
      where('studentEmail', '==', studentEmail),
      where('examTitle', '==', examTitle)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  // Get all responses for a particular exam
  async getExamResponses(examTitle: string) {
    const responsesCollection = collection(this.firestore, 'responses');
    const q = query(responsesCollection, where('examTitle', '==', examTitle));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
  }

  // Assign an exam to a specific user (or users)
  async assignExamToUser(
    examTitle: string,
    studentEmails: string[]
  ): Promise<void> {
    const examsCollection = collection(this.firestore, 'exams');
    const examQuery = query(examsCollection, where('title', '==', examTitle));
    const examSnapshot = await getDocs(examQuery);

    if (!examSnapshot.empty) {
      // Get the exam document
      const examDoc = examSnapshot.docs[0];

      // Add exam to the specific students
      for (const email of studentEmails) {
        const usersCollection = collection(this.firestore, 'users');
        const userQuery = query(usersCollection, where('email', '==', email));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userRef = doc(this.firestore, 'users', userSnapshot.docs[0].id);
          await setDoc(userRef, { assignedExams: examTitle }, { merge: true });
        }
      }
    }
  }

  // Update student response verdict (Pass/Fail)
  async updateResponseVerdict(
    studentEmail: string,
    examTitle: string,
    verdict: string
  ): Promise<void> {
    const responsesCollection = collection(this.firestore, 'responses');
    const q = query(
      responsesCollection,
      where('studentEmail', '==', studentEmail),
      where('examTitle', '==', examTitle)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const responseRef = doc(
        this.firestore,
        'responses',
        querySnapshot.docs[0].id
      );
      await setDoc(responseRef, { verdict }, { merge: true });
    }
  }

  // Get a specific student's verdict for an exam
  async getStudentVerdict(
    studentEmail: string,
    examTitle: string
  ): Promise<string | null> {
    const responsesCollection = collection(this.firestore, 'responses');
    const q = query(
      responsesCollection,
      where('studentEmail', '==', studentEmail),
      where('examTitle', '==', examTitle)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const response = querySnapshot.docs[0].data();
      return response['verdict'] || null;
    }
    return null;
  }
}
