<<<<<<< HEAD
### **Task: Exam Portal**
=======
### live-https://vidyarthi-pariksha.netlify.app/
### **Task : Exam Portal**
>>>>>>> 267bdf07d5f199cedcad848e96552efbf48dcde3

Add this to your readme file.

#### **Story:**

You are tasked with building an **Exam Portal** for conducting online examinations. The portal will use **Angular** as the front end and **Firebase** for authentication, database, and deployment. The system should allow role-based access for three roles: **Admin**, **Examiner**, and **Student**. Admins will manage users and assign roles, examiners will create and manage questions, and students will take exams and view results.

---

### **Story Flow**

#### **1. Project Setup (10%)**

- Use Angular for the application and Firebase for authentication, Firestore as the database, and Firebase Hosting for deployment.
- Configure Firebase services to handle real-time data synchronization and authentication.
- Integrate a UI library like Material, Tailwind, or Ionic for responsive and professional UI components.

---

#### **2. Authentication & Authorization (15%)**

- **Login Scenarios:**

  1. **Scenario 1:** A student logs in with their email ID and receives an OTP. Upon successful authentication, they land on their dashboard where they can see available exams.
  2. **Scenario 2:** An examiner logs in using their mobile number. If the entered OTP is incorrect three times, their account gets temporarily locked with a notification to contact the admin.

- **Auth Guards:**
  - Protect routes for each role: Admins can manage users, Examiners can create exams, and Students can take exams.

---

#### **3. User Interface (15%)**

- **Admin UI Features:**

  - Dashboard: View all users and their roles.
  - Forms for adding new users and assigning roles (Student, Examiner).

- **Examiner UI Features:**

  - Dashboard: View and create exams.
  - Create questions (multiple-choice or descriptive) with options and correct answers.
  - Review results of students' exams.

- **Student UI Features:**

  - Dashboard: View available exams.
  - Take exams and submit answers.
  - View results after exams are evaluated.

- **UI Expectations:**
  - Simple and intuitive design for easy navigation.
  - Responsive UI for compatibility with different devices.

---

#### **4. Problem Solving (15%)**

- Implement logic for:
  - **Dynamic question loading:** Questions should load one by one during exams to prevent data overload.
  - **Timer management:** Automatically submit exams when the timer expires.
  - **Role assignment:** Admins can dynamically update user roles in the system.

---

#### **5. Role-Based CRUD Operations (10%)**

- **Admin:**

  - Add, update, and delete users.
  - Assign roles to users.

- **Examiner:**

  - Create and manage exams and questions.
  - Delete or update questions before exams are published.

- **Student:**
  - Take exams and view results.

---

#### **6. Angular & TypeScript Concepts (10%)**

- **Services:** Use `AuthService`, `UserService`, and `ExamService` to handle authentication, user management, and exam logic.
- **Interfaces:** Define `User`, `Exam`, and `Question` interfaces for strong type-checking.
- **Lifecycle Hooks:** Use `ngOnInit` for fetching user and exam data on dashboards.
- **Pipes:** Create a custom pipe to format dates and filter exams by availability.

---

#### **7. Coding Standards (10%)**

- Follow Osmosys Angular standards for:
  - Proper modular structure: Separate modules for authentication, user management, and exams.
  - Descriptive naming conventions.
  - Clear comments for improved readability.

---

#### **8. Code Quality (5%)**

- Focus on reusable and optimized code:
  - Use shared components for forms and tables.
  - Create reusable utility functions for validations and data formatting.

---

#### **9. Deployment & Submission (10%)**

- Deploy the application on Firebase Hosting.
- Use Git for version control with regular commits and meaningful commit messages.
- Submit the project by pushing the code to a GitHub repository before the deadline.

---

### **Dummy Data**

**Users:**

- **Admin:**

  - Name: John Admin
  - Email: admin@example.com
  - Role: Admin

- **Examiners:**

  - Name: Emma Examiner
  - Email: emma@example.com
  - Role: Examiner
  - Name: David Examiner
  - Email: david@example.com
  - Role: Examiner

- **Students:**
  - Name: Alice Student
  - Email: alice@example.com
  - Role: Student
  - Name: Bob Student
  - Email: bob@example.com
  - Role: Student

**Exams:**

1. **Exam Title:** Angular Basics

   - **Questions:**
     1. What is a component in Angular?
     2. Explain the difference between *ngIf and *ngFor.
   - **Duration:** 30 minutes

2. **Exam Title:** TypeScript Essentials
   - **Questions:**
     1. What are interfaces in TypeScript?
     2. Write a function to calculate the sum of an array of numbers.
   - **Duration:** 40 minutes

---

### **Expected Deliverables**

1. A fully functional exam portal with role-based access and dashboards for each role.
2. Dynamic question loading and a working timer for exams.
3. Proper use of Firebase services for authentication, database, and hosting.
4. Clean, modular, and reusable code following best practices.
5. GitHub repository link and hosted application URL.

---

### **Marks Distribution**

| **Criteria**                   | **Marks** |
| ------------------------------ | --------- |
| Project Setup                  | 10 Marks  |
| Authentication & Authorization | 15 Marks  |
| UI Design                      | 15 Marks  |
| Problem Solving                | 15 Marks  |
| Role-Based CRUD                | 10 Marks  |
| Angular & TypeScript Concepts  | 10 Marks  |
| Coding Standards               | 10 Marks  |
| Code Quality                   | 5 Marks   |
| Deployment & Submission        | 10 Marks  |

**Total:** 100 Marks  
**Pass Marks:** 70 Marks

## **Evaluation Criteria and Rules**

To successfully complete the assigned project and achieve a passing score, developers must adhere to the following evaluation criteria. Each criterion is designed to assess specific skills and competencies in Angular and Firebase development, along with adherence to coding standards and best practices.

---

### **Evaluation Criteria**

1. **Project Setup (Angular + Firebase) – 10%**

   - The project must be properly set up using Angular as the front end and Firebase for backend services such as authentication, Firestore for data storage, and hosting.
   - Ensure all dependencies are installed, and the environment is configured correctly for seamless integration with Firebase.

2. **User Authentication + Authorization (Auth Guard + Routing Configs) – 15%**

   - Implement a robust authentication system using Firebase Authentication (email/mobile login with OTP).
   - Authorization should be role-based, with proper routing guards to restrict access based on user roles (e.g., Admin, User).

3. **UI (User + Admin) – 15%**

   - Design a responsive and user-friendly interface for Admin and User dashboards.
   - Ensure proper navigation, intuitive layout, and a consistent theme throughout the application.

4. **Problem Solving – 15%**

   - Demonstrate logical and efficient solutions for the given problem scenarios.
   - Implement dynamic features such as form validation, real-time updates, and user-friendly workflows.

5. **Role-Based CRUD – 10%**

   - Implement Create, Read, Update, and Delete (CRUD) functionalities based on user roles.
   - Admins should manage users and tasks, while Users should interact with their assigned data.

6. **Angular + TypeScript Concepts – 10%**

   - Use Angular concepts such as Services, Lifecycle Hooks, and Pipes effectively.
   - Utilize TypeScript features like interfaces, generics, and strong typing to ensure clean and maintainable code.

7. **Coding Standards – 10%**

   - Follow Osmosys GitHub coding standards for Angular development.
   - Ensure proper file structure, modularization, naming conventions, and inline documentation.

8. **Code Quality – 5%**

   - Write reusable, optimized, and clean code.
   - Avoid redundancy and ensure scalability in the implemented features.

9. **Deployment + Submission – 10%**
   - Successfully deploy the project on Firebase Hosting without errors or bugs.
   - Ensure proper Git usage, including regular commits, meaningful commit messages, and adherence to GitHub standards.

---

### **Rules**

1. **Time Management**:

   - The test duration is **6 hours** (1:30 PM - 7:30 PM).
   - Projects must be submitted by **7:31 PM**. Late submissions will not be accepted.

2. **Submission Guidelines**:

   - Projects should be submitted as a GitHub repository link, including the deployed Firebase URL.
   - Ensure all necessary files and documentation are included in the repository.

3. **Usage of AI Tools**:

   - The use of generative AI tools (e.g., ChatGPT, Gemini, or similar AI-based extensions) is strictly prohibited.
   - However, developers are allowed to refer to official documentation and online resources for help.

4. **Teamwork**:

   - Projects must be completed individually. Collaboration with other developers is not permitted.

5. **Bug-Free Completion**:

   - Ensure the application is functional and free of critical bugs. Applications with unresolved errors will receive penalties in the final score.

6. **Pass Marks**:
   - A minimum score of **70 marks** is required to pass.
   - Passing developers will be recommended for project assignments, while those who fail will undergo an additional **7-10 days of training**.

By adhering to these guidelines and evaluation criteria, developers can demonstrate their competency in Angular development, Firebase integration, and project management.
