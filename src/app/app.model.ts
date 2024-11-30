export interface User {
  uid: string;
  email: string;
  role: 'examiner' | 'student';
}

export interface Exam {
  id: string;
  title: string;
  question: string;
  options: string[];
  status: 'pending' | 'attempted';
  assignedTo: string; //uid of student
  verdict: 'pass' | 'fail' | 'pending';
  response: string;
}

export interface NewExam {
  title: string;
  question: string;
  options: string[];
  status: 'pending' | 'attempted';
  assignedTo: string; //uid of student
  verdict: 'pass' | 'fail' | 'pending';
  response: string;
}
