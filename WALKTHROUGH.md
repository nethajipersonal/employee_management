# Employee Management System - Implementation Walkthrough

## Overview
We have successfully built a comprehensive Employee Management System (EMS) with the following core modules:
1.  **Authentication & RBAC**: Secure login with Admin, Manager, and Employee roles.
2.  **Employee Management**: Full CRUD operations, profile management, and detailed employee records.
3.  **Attendance Tracking**: Real-time clock-in/out, daily logs, and history tracking.
4.  **Leave Management**: Leave application, approval workflow, and balance tracking.
5.  **Payroll Management**: Automated salary slip generation and PDF download.

## Features Implemented

### 1. Authentication & Security
- **NextAuth.js** integration for secure session management.
- **Role-Based Access Control (RBAC)** protecting all routes.
- **Middleware** to redirect unauthorized users.
- **Bcrypt** password hashing for security.

### 2. Employee Management
- **Add Employee**: Comprehensive form with personal, employment, and salary details.
- **Employee List**: Searchable and filterable data table.
- **Profile View**: Detailed view of employee information.
- **User Model**: Updated with phone, gender, DOB, address, and document fields.

### 3. Attendance Management
- **Clock In/Out**: Real-time timer with status tracking (Present, Late, Absent).
- **Attendance History**: Employee view of past attendance records.
- **Logic**: Prevents double clock-in, calculates total hours automatically.

### 4. Leave Management
- **Apply Leave**: Form with date range and type selection (Casual, Sick, Earned, LOP).
- **Approval Workflow**: Managers can approve or reject leaves with comments.
- **Balance Tracking**: Automatically deducts approved leaves from employee balance.
- **Validation**: Prevents applying for more days than available balance.

### 5. Payroll Management
- **Generate Payroll**: Admin can generate payslips for all employees for a specific month.
- **Salary Calculation**: Automated calculation of earnings and deductions based on salary structure.
- **PDF Download**: Professional payslip generation using `jspdf`.
- **History**: Employees can view and download past payslips.

### 6. Project Management
- **Projects**: Create and manage projects with status, priority, and deadlines.
- **Kanban Board**: Visual task management with drag-and-drop support (To Do, In Progress, Review, Done).
- **Tasks**: Detailed task creation with assignment, due dates, and priority.
- **Team Assignment**: Assign employees to projects and tasks.

### 7. Team Management
- **Manager Dashboard**: View all team members in the department.
- **Employee Details**: Quick access to contact info and status.
- **Team Overview**: Visual representation of the team structure.

### 8. Expense Management
- **Claims**: Employees can submit expense claims with categories and receipts.
- **Approvals**: Managers can approve or reject claims.
- **Tracking**: View status of all submitted expenses.

### 9. System Monitoring
- **Activity Log**: Admins can view a chronological log of user actions (login, updates, deletions) for security and auditing.

## Setup & Usage

### Prerequisites
- Node.js installed.
- MongoDB running (Local or Atlas).

### Installation
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Variables**:
    Update `.env.local` with your MongoDB URI and NextAuth secret.
    ```env
    MONGODB_URI=mongodb://localhost:27017/employee_management
    NEXTAUTH_SECRET=your_secret_key
    NEXTAUTH_URL=http://localhost:3000
    ```
3.  **Seed Database**:
    ```bash
    curl -X POST http://localhost:3000/api/seed
    ```
    *Note: Ensure MongoDB is running before seeding.*

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

### User Roles & Credentials (Demo)
- **Admin**: `admin@company.com` / `admin123`
- **Manager**: `manager@company.com` / `manager123`
- **Employee**: `employee@company.com` / `employee123`

## Next Steps
- **Reports Module**: Add export functionality for attendance and leave reports.
- **Notifications**: Integrate email service (Nodemailer) for real-time alerts.
- **Advanced Features**: Implement face recognition or QR attendance if hardware permits.
