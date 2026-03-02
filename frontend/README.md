# Riverside Academy Admin Dashboard

A modern, production-level React admin dashboard for managing student applications at Riverside Academy.

## Features

✨ **Modern UI/UX**
- Clean, professional design with Tailwind CSS
- Responsive layout (mobile, tablet, desktop)
- Smooth animations and transitions
- Dark mode support ready

📊 **Dashboard**
- Key metrics cards with trends
- Line chart for applications over time
- Bar chart for applications by grade
- Pie chart for status distribution
- Recent applications widget

📋 **Applications Management**
- Advanced data table with sorting
- Search functionality (student, parent, email)
- Status filter (Pending, Approved, Rejected)
- Grade filter
- Pagination
- View detailed application information
- Approve/Reject applications
- Delete applications

👨‍🎓 **Students**
- View enrolled students
- Student cards with key information
- Search functionality

⚙️ **Settings**
- School information management
- Preferences (timezone, language, theme)
- Security options

🔐 **Authentication**
- Secure login system
- Session management
- Protected routes

## Tech Stack

- **Frontend:** React 18, React Router, Tailwind CSS
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Build Tool:** Vite
- **Icons:** Heroicons

## Installation

### Prerequisites
- Node.js 16+ installed
- Backend server running on `http://localhost:3000`

### Setup

1. **Navigate to the frontend directory:**
\`\`\`bash
cd frontend
\`\`\`

2. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

3. **Start the development server:**
\`\`\`bash
npm run dev
\`\`\`

The dashboard will be available at `http://localhost:5173`

### Build for Production

\`\`\`bash
npm run build
npm run preview
\`\`\`

## Project Structure

\`\`\`
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── DashboardCard.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── ApplicationModal.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── Toast.jsx
│   │   └── LoadingSkeleton.jsx
│   ├── pages/               # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Applications.jsx
│   │   ├── Students.jsx
│   │   └── Settings.jsx
│   ├── hooks/               # Custom hooks
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
\`\`\`

## API Integration

The dashboard communicates with your backend at `http://localhost:3000`. Ensure the backend has these endpoints:

- `POST /auth/login` - User authentication
- `GET /applications` - Get all applications
- `GET /applications/:id` - Get application details
- `PUT /applications/:id` - Update application status
- `DELETE /applications/:id` - Delete application

## Default Credentials

- **Username:** admin
- **Password:** password

## Color Palette

- Primary Blue: `#2563eb` to `#1e40af`
- Background: `#f8fafc`
- Card: `#ffffff`
- Text Primary: `#0f172a`
- Text Secondary: `#64748b`
- Success: `#16a34a`
- Warning: `#eab308`
- Danger: `#dc2626`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

All rights reserved © 2025 Riverside Academy

## Support

For issues or questions, please contact the development team.
