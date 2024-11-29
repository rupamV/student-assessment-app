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
  getDoc,
  updateDoc, // Added to fetch individual documents
} from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Exam } from '../components/student-dashboard/student-dashboard.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  constructor(
    private firestore: Firestore,
    private userService: UserService,
    private authService: AuthService
  ) {}

  async addExam(exam: {
    title: string;
    question: string;
    options: string[];
    assignedTo?: string[]; // Optional, default to empty array
    status?: { [email: string]: string }; // Optional, default to empty object
  }) {
    const examsCollection = collection(this.firestore, 'exams');
    const email = this.authService.currentUser?.email;

    const examWithDefaults = {
      ...exam,
      assignedTo: exam.assignedTo || [],
      status: {},
    };

    // Populate status with 'pending' for each user in assignedTo
    if (examWithDefaults.assignedTo.length > 0) {
      examWithDefaults.status = examWithDefaults.assignedTo.reduce(
        (statusMap: { [key: string]: string }, user: string) => {
          statusMap[user] = 'pending';
          return statusMap;
        },
        {}
      );
    }

    // Add the exam to Firestore
    await addDoc(examsCollection, examWithDefaults);
  }

  // Get all exams from Firestore
  async getExams(): Promise<Exam[]> {
    const examsCollection = collection(this.firestore, 'exams');
    const querySnapshot = await getDocs(examsCollection);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log(data);

      return {
        ...data,
        question: data['question'] || '', // Ensure question is present
        options: data['options'] || [], // Ensure options is present
        id: doc.id, // Ensure id is present
        assignedTo: data['assignedTo'] || [],
        status: data['status'] || {},
        title: data['title'] || '', // Ensure title is present
      };
    });
  }

  // Delete exam based on title
  async deleteExam(exam: { title: string }) {
    const examsCollection = collection(this.firestore, 'exams');
    const q = query(examsCollection, where('title', '==', exam.title));
    const querySnapshot = await getDocs(q);

    for (const examDoc of querySnapshot.docs) {
      const examRef = doc(this.firestore, 'exams', examDoc.id);
      await deleteDoc(examRef);
    }
  }

  // Record the response for the student
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

    const examsCollection = collection(this.firestore, 'exams');
    const examQuery = query(examsCollection, where('title', '==', examTitle));
    const querySnapshot = await getDocs(examQuery);

    if (!querySnapshot.empty) {
      const examDoc = querySnapshot.docs[0];
      const examRef = doc(this.firestore, 'exams', examDoc.id);

      const currentStatus = examDoc.data()['status'] || {};
      currentStatus[email] = 'attempted';

      await setDoc(examRef, { status: currentStatus }, { merge: true });
    }

    return true;
  }

  // Check if the student has already submitted their response for the exam
  async hasSubmittedResponse(
    studentEmail: string,
    examTitle: string
  ): Promise<boolean> {
    // debugger;
    // Get the exams collection
    const examsCollection = collection(this.firestore, 'exams');
    const q = query(examsCollection, where('title', '==', examTitle));

    // Fetch the exam document matching the title
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error(`Exam with title "${examTitle}" not found.`);
    }

    // Extract the first matching exam document
    const examDoc = querySnapshot.docs[0];
    const statusMap = examDoc.data()['status'];
    console.log(statusMap);
    console.log(studentEmail);

    // Check the status of the specific student
    const status = statusMap[studentEmail];

    if (status === 'attempted') {
      return true;
    }
    return false;
  }

  // Assign exam to one or more students
  async assignExamToUser(
    examTitle: string,
    studentEmails: string[]
  ): Promise<void> {
    const examsCollection = collection(this.firestore, 'exams');
    const examQuery = query(examsCollection, where('title', '==', examTitle));
    const examSnapshot = await getDocs(examQuery);

    if (!examSnapshot.empty) {
      const examDoc = examSnapshot.docs[0];
      const examRef = doc(this.firestore, 'exams', examDoc.id);

      const currentData = examDoc.data();
      const assignedTo = currentData['assignedTo'] || [];
      const status = currentData['status'] || {};

      studentEmails.forEach((email) => {
        if (!assignedTo.includes(email)) {
          assignedTo.push(email);
          status[email] = 'pending'; // Initial status when assigned
        }
      });

      await setDoc(examRef, { assignedTo, status }, { merge: true });
    }
  }

  async getExamById(examId: string) {
    const examRef = doc(this.firestore, 'exams', examId);
    const examDoc = await getDoc(examRef);

    if (!examDoc.exists()) {
      throw new Error('Exam not found');
    }

    const examData = examDoc.data();
    return {
      ...examData,
      id: examDoc.id,
      assignedTo: examData['assignedTo'] || [],
      status: examData['status'] || {},
    };
  }

  // Submit answers (finalize exam for a student)
  // Submit answers (finalize exam for a student)
  async submitAnswers(examId: string, answers: Record<string, string>) {
    const examRef = doc(this.firestore, 'exams', examId);
    const examDoc = await getDoc(examRef);

    if (!examDoc.exists()) {
      throw new Error('Exam not found');
    }

    const examData = examDoc.data();
    const examStatus = examData?.['status'] || {}; // Ensure status exists

    const currentUser = this.userService.getCurrentUser();

    if (!currentUser) {
      throw new Error('No user is logged in.');
    }

    const email = currentUser.email;

    // Ensure the student has not submitted the exam yet
    if (email && examStatus[email] && examStatus[email] !== 'pending') {
      throw new Error('You have already submitted your answers for this exam.');
    }

    // Update the exam status to 'attempted'
    if (email) {
      examStatus[email] = 'attempted';
    } else {
      throw new Error('Unable to fetch user email.');
    }

    // Update the exam status in Firestore
    await setDoc(examRef, { status: examStatus }, { merge: true });

    // Save the student's answers in the responses collection
    const responsesCollection = collection(this.firestore, 'responses');
    for (const [questionId, answer] of Object.entries(answers)) {
      // Creating response document for each answer
      await addDoc(responsesCollection, {
        studentEmail: email,
        examId,
        questionId,
        answer,
      });
    }

    // Now save the submission record like `recordResponse` used to
    // This simulates creating a record like the `recordResponse` method
    const submissionDocRef = doc(this.firestore, `submissions/${examId}`);
    const submissionData = {
      studentEmail: email,
      examId,
      answers,
      verdict: 'pending', // Can be updated later with a final verdict
      submittedAt: new Date(),
    };

    // Save submission data (will be used later for result verdicts)
    await setDoc(submissionDocRef, submissionData);

    return true;
  }

  async getSubmission(examId: string): Promise<any> {
    debugger;
    const submissionDoc = doc(this.firestore, `submissions/${examId}`);
    const submissionSnap = await getDoc(submissionDoc);
    return submissionSnap.exists() ? submissionSnap.data() : null;
  }

  async saveVerdictToDatabase(
    examId: string,
    userEmail: string,
    verdict: string
  ): Promise<void> {
    const verdictsCollection = collection(this.firestore, 'verdicts');
    const verdictDocRef = doc(
      this.firestore,
      `verdicts/${examId}_${userEmail}`
    );

    await setDoc(verdictDocRef, {
      examId,
      userEmail,
      verdict,
    });
  }
  async getVerdict(examId: string, userEmail: string): Promise<string | null> {
    const verdictDocRef = doc(
      this.firestore,
      `verdicts/${examId}_${userEmail}`
    );
    const verdictSnap = await getDoc(verdictDocRef);

    if (verdictSnap.exists()) {
      const verdictData = verdictSnap.data();
      return verdictData['verdict'];
    } else {
      return null;
    }
  }
}
