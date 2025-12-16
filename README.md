# Employee Management System

A comprehensive employee management system built with Next.js, Material-UI, TypeScript, and MongoDB. Features include leave management, salary/payslip generation, project management, and time tracking with clock in/out functionality.

## ✨ Features

### Core Functionalities
- **🔐 Authentication & Authorization**: Role-based access control (Admin, Manager, Employee)
- **📋 Leave Management**: Apply, approve/reject leaves with balance tracking
- **💰 Salary & Payslip**: Auto salary calculation, payslip generation with PDF download
- **📊 Project Management**: Create projects, assign teams, track milestones
- **⏰ Time Tracking**: Clock in/out with auto lock mechanism, attendance reports
- **👥 Employee Management**: Complete CRUD operations for employee data
- **📊 Dashboards**: Role-specific dashboards with analytics

### Technology Stack
- **Frontend**: Next.js 16, React 19, TypeScript
- **UI Library**: Material-UI (MUI) v7
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js v4
- **PDF Generation**: jsPDF
- **Charts**: Recharts
- **Git Hooks**: Husky & lint-staged

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local installation or MongoDB Atlas account)
- Git

### Installation

1. **Clone the repository**
   ```bash
   cd /Users/nethajilp/Personal/employee_management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env.local` and update the values:
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your configuration:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/employee_management
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/employee_management

   # NextAuth Configuration  
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-key-here

   # Application
   NODE_ENV=development
   ```

   **Generate a secure NextAuth secret:**
   ```bash
   openssl rand -base64 32
   ```

4. **Setup MongoDB**

   **Option A: Local MongoDB**
   - Install MongoDB from https://www.mongodb.com/try/download/community
   - Start MongoDB service:
     ```bash
     # macOS
     brew services start mongodb-community
     
     # Linux
     sudo systemctl start mongod
     ```

   **Option B: MongoDB Atlas (Cloud)**
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get connection string and update `MONGODB_URI` in `.env.local`

5. **Seed the database with demo data**
   
   Start the development server first, then seed:
   ```bash
   npm run dev
   ```

   In another terminal, run:
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

   Or visit http://localhost:3000/api/seed in your browser (it will show an error but data will be seeded).

6. **Access the application**
   
   Open http://localhost:3000 in your browser

### Demo Credentials

After seeding, use these credentials to login:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | admin123 |
| Manager | manager@company.com | manager123 |
| Employee | employee@company.com | employee123 |

## 📁 Project Structure

```
employee_management/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Auth routes
│   │   │   └── login/           # Login page
│   │   ├── admin/               # Admin dashboard & pages
│   │   ├── manager/             # Manager dashboard
│   │   ├── employee/            # Employee dashboard
│   │   ├── dashboard/           # Shared dashboard
│   │   ├── leaves/              # Leave management (todo)
│   │   ├── payslips/            # Payslip management (todo)
│   │   ├── projects/            # Project management (todo)
│   │   ├── timetrack/           # Time tracking (todo)
│   │   ├── api/                 # API routes
│   │   │   ├── auth/            # NextAuth
│   │   │   └── seed/            # Database seeding
│   │   └── layout.tsx           # Root layout
│   ├── components/              # React components
│   │   ├── layouts/             # Layout components
│   │   └── providers/           # Context providers
│   ├── lib/                     # Utilities
│   │   ├── mongodb.ts           # MongoDB connection
│   │   └── auth.ts              # NextAuth config
│   ├── models/                  # Mongoose models
│   │   ├── User.ts
│   │   ├── Leave.ts
│   │   ├── Payslip.ts
│   │   ├── Project.ts
│   │   └── TimeLog.ts
│   ├── types/                   # TypeScript types
│   ├── theme.ts                 # MUI theme
│   └── middleware.ts            # Route protection
├── public/                      # Static files
├── .env.local                   # Environment variables (gitignored)
├── .env.example                 # Example env file
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 User Roles & Permissions

### Admin
- Full access to all features
- Manage all employees (CRUD)
- Approve/reject all leave requests
- Generate payslips for all employees
- Manage all projects
- View all time logs and attendance

### Manager
- View team members
- Approve/reject team leave requests
- View team payslips
- Manage assigned projects
- View team attendance

### Employee
- View personal dashboard
- Apply for leaves
- View personal payslips
- Clock in/out for attendance
- View assigned projects
- View personal attendance history

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

### Git Hooks

This project uses Husky for git hooks:
- **pre-commit**: Runs lint-staged to format and lint staged files

## 📝 API Routes

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth endpoints (signin, signout, etc.)

### Database
- `POST /api/seed` - Seed database with demo data

### Employees (Coming Soon)
- `GET /api/employees` - List all employees
- `POST /api/employees` - Create employee
- `GET /api/employees/[id]` - Get employee details
- `PUT /api/employees/[id]` - Update employee
- `DELETE /api/employees/[id]` - Delete employee

### Leaves (Coming Soon)
- `GET /api/leaves` - List leaves
- `POST /api/leaves` - Create leave request
- `PUT /api/leaves/[id]` - Update leave (approve/reject)

### Payslips (Coming Soon)
- `GET /api/payslips` - List payslips
- `POST /api/payslips` - Generate payslip
- `GET /api/payslips/[id]/download` - Download PDF

### Projects (Coming Soon)
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `PUT /api/projects/[id]` - Update project

### Time Tracking (Coming Soon)
- `GET /api/timetrack` - List time logs
- `POST /api/timetrack` -Clock in/out
- `PUT /api/timetrack/[id]` - Lock time entry

## 🎨 UI/UX Design Principles

- **Modern & Premium**: Gradient backgrounds, smooth transitions, hover effects
- **Responsive**: Mobile-first design, works on all screen sizes
- **Accessible**: WCAG compliant color contrasts, keyboard navigation
- **Consistent**: MUI theme system for unified design language
- **Performant**: Optimized bundle size, lazy loading, SSR

## 🚧 Current Status

### ✅ Completed
- Project setup with Next.js, TypeScript, MUI
- MongoDB connection and models
- NextAuth authentication
- Role-based access control
- Responsive navigation layout
- Admin/Manager/Employee dashboards
- Login page with demo credentials
- Database seeding script

### 🔨 In Progress
- Leave management module
- Payslip generation & PDF download
- Project management features
- Time tracking & clock in/out
- Employee CRUD operations

### 📋 Planned
- Advanced analytics & charts
- Email notifications
- File upload for documents
- Advanced search & filters
- Export data (CSV/Excel)
- Audit logs
- Performance reviews module

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running locally or Atlas connection string is correct
- Check firewall settings for MongoDB port (27017)
- Verify `.env.local` has correct `MONGODB_URI`

### Next Auth Error
- Ensure `NEXTAUTH_SECRET` is set in `.env.local`
- Generate new secret with `openssl rand -base64 32`
- Clear browser cookies and try again

### Build Errors
- Delete `.next` folder and `node_modules`
- Run `npm install` again
- Check for TypeScript errors with `npm run lint`

## 📄 License

This project is for educational and demonstration purposes.

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using Next.js, Material-UI, and MongoDB**
