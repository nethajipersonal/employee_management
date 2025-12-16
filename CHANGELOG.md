# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Features
- **Authentication**: Implemented secure login with NextAuth.js, RBAC (Admin, Manager, Employee), and password hashing.
- **Employee Management**: Added full CRUD operations for employees, detailed profile views, and search/filter capabilities.
- **Attendance**: Implemented real-time clock-in/out system with status tracking and history.
- **Leave Management**: Added leave application workflow, approval system for managers, and automated balance tracking.
- **Payroll**: Implemented automated salary slip generation with PDF download (jspdf) and history view.
- **Project Management**: Added Kanban board for task management, project creation, and team assignment.
- **Team Management**: Created manager dashboard for team overview and member details.
- **Expense Management**: Added claim submission system with approval workflow and status tracking.
- **Activity Logs**: Implemented system-wide auditing for admin actions.
- **Chat System**: Added real-time chat functionality, including channels and notifications.

### Enhancements
- **UI/UX**: Refactored Dashboard Sidebar for a premium, modern look with dark theme and improved navigation states.
- **UI/UX**: Applied modern design aesthetics including "Glassmorphism" and vibrant color palettes across the application.
- **Dashboard**: Improved layout responsiveness and table designs to occupy full width.
- **Navigation**: Added breadcrumbs for better user navigation context.
- **Performance**: Optimized client-side interactions for modal openings and status updates.

### Bug Fixes
- **PDF Generation**: Resolved issues with PDF download functionality in the Payroll module.
- **MUI Errors**: Fixed `fontSize` validation errors in Material UI theme configuration (ensuring numbers instead of strings).
- **Sidebar**: Fixed "Cannot read properties of undefined" error in Chat Sidebar related to user avatars.
- **Layout**: Fixed visual offsets and spacing consistency in the main layout.
