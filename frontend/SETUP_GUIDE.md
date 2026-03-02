# Riverside Academy Admin Dashboard - Setup & Usage Guide

## 📦 Project Summary

A **production-level React admin dashboard** for Riverside Academy with:
- ✅ Modern UI/UX matching your brand colors
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Advanced features (charts, filters, search, pagination)
- ✅ Professional components and architecture
- ✅ Complete API integration

## 🚀 Quick Start

### Step 1: Install Dependencies

\`\`\`bash
cd frontend
npm install
\`\`\`

### Step 2: Start Development Server

\`\`\`bash
npm run dev
\`\`\`

**The dashboard will be available at:** \`http://localhost:5173\`

### Step 3: Login

- **Username:** admin
- **Password:** password

---

## 📋 Features & Pages

### 1. **Dashboard (Overview)**
- **Key Metrics:** Total, Pending, Approved, Rejected applications
- **Charts:**
  - Line chart: Applications over time
  - Bar chart: Applications by grade
  - Pie chart: Status distribution
- **Recent applications widget**

### 2. **Applications Management**
- **Advanced Table:**
  - Sortable columns (name, date, grade, status)
  - Search: Find by student name, parent name, or email
  - Filters: Status (Pending/Approved/Rejected), Grade
  - Pagination: 10 items per page

- **Actions:**
  - View detailed application information
  - Approve applications
  - Reject applications
  - Delete applications

- **Status Badges:**
  - Pending (Yellow)
  - Approved (Green)
  - Rejected (Red)

### 3. **Students**
- View all enrolled (approved) students
- Student cards with key information
- Search functionality

### 4. **Settings**
- School information management
- User preferences (timezone, language, theme)
- Security options

---

## 🎨 Color Scheme (Matching Your Brand)

| Element | Color | Hex Code |
|---------|-------|----------|
| Primary Blue | Gradient | #2563eb → #1e40af |
| Background | Light Gray | #f8fafc |
| Cards | White | #ffffff |
| Text Primary | Dark Gray | #0f172a |
| Text Secondary | Gray | #64748b |
| Success | Green | #16a34a |
| Warning | Yellow | #eab308 |
| Danger | Red | #dc2626 |
| Borders | Light Gray | #e2e8f0 |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Top navigation bar
│   │   ├── Sidebar.jsx             # Side navigation (collapsible)
│   │   ├── DashboardCard.jsx       # Stats cards
│   │   ├── StatusBadge.jsx         # Status indicator badges
│   │   ├── ApplicationModal.jsx    # Application details modal
│   │   ├── ConfirmDialog.jsx       # Confirmation dialogs
│   │   ├── Toast.jsx               # Toast notifications
│   │   └── LoadingSkeleton.jsx     # Loading skeleton
│   │
│   ├── pages/
│   │   ├── Login.jsx               # Login page
│   │   ├── Dashboard.jsx           # Dashboard overview
│   │   ├── Applications.jsx        # Applications management
│   │   ├── Students.jsx            # Students list
│   │   └── Settings.jsx            # Settings page
│   │
│   ├── hooks/
│   │   └── useLocalStorage.js      # Local storage hook
│   │
│   ├── utils/
│   │   ├── api.js                  # Axios API instance
│   │   └── helpers.js              # Utility functions
│   │
│   ├── App.jsx                     # Main app with routing
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Global styles
│
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS config
├── postcss.config.js               # PostCSS config
├── package.json                    # Dependencies
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore file
└── README.md                       # Documentation
```

---

## 🔌 Backend API Requirements

Ensure your backend (`http://localhost:3000`) has these endpoints:

### Authentication
```
POST /auth/login
Body: { username, password }
Response: { message, token }
```

### Applications
```
GET /applications
Response: { applications: [...] }

GET /applications/:id
Response: { application: {...} }

PUT /applications/:id
Body: { status: "Approved" | "Rejected" }
Response: { success: true }

DELETE /applications/:id
Response: { success: true }
```

---

## 🛠️ Available Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (if configured)
npm run lint
```

---

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ Protected routes (login required)
- ✅ Secure API interceptors
- ✅ Auto-logout on 401 errors
- ✅ Session management with localStorage

---

## 📱 Responsive Design

- **Mobile (< 768px):**
  - Collapsible sidebar
  - Stacked layout
  - Mobile-optimized forms

- **Tablet (768px - 1024px):**
  - Side-by-side layouts
  - Adjusted grid columns

- **Desktop (> 1024px):**
  - Full sidebar
  - Multi-column grids
  - Optimized spacing

---

## 🎯 Component Highlights

### DashboardCard
- Displays key metrics
- Shows trends and icons
- Color-coded borders

### StatusBadge
- Visual status indicators
- Color-coded backgrounds
- Consistent styling

### ApplicationModal
- Detailed application view
- Student & parent information
- Action buttons (Approve/Reject)
- Document section

### ConfirmDialog
- Double-check dangerous actions
- Delete confirmations
- Accessibility-friendly

### DataTable
- Sortable columns
- Advanced filtering
- Pagination
- Row actions

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized \`dist/\` folder ready for deployment.

### Deploy to Server
1. Copy \`dist/\` contents to your web server
2. Configure nginx/Apache reverse proxy to backend
3. Set environment variables in \`.env\`

---

## 📝 Environment Variables

Create a \`.env\` file:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Riverside Academy Admin
```

---

## 🐛 Troubleshooting

### Backend Connection Issues
- Ensure backend is running on \`http://localhost:3000\`
- Check CORS settings in backend
- Verify API endpoints are correct

### Login Not Working
- Check username/password (default: admin/password)
- Verify backend auth endpoint is working
- Check browser console for errors

### Charts Not Showing
- Ensure Recharts is installed: \`npm install recharts\`
- Check that applications data is loaded
- Verify chart data format

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Recharts](https://recharts.org)
- [Axios](https://axios-http.com)

---

## 📞 Support

For questions or issues:
1. Check the browser console for errors
2. Verify backend is running
3. Review the API responses
4. Check component props in React DevTools

---

## 📄 License

All rights reserved © 2025 Riverside Academy

---

## ✨ Next Steps

1. \`npm install\` - Install dependencies
2. \`npm run dev\` - Start development server
3. Login with admin/password
4. Explore the dashboard
5. Customize colors/styling in tailwind.config.js
6. Add more features as needed

Enjoy your new admin dashboard! 🎉
