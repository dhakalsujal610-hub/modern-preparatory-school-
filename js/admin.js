/* =========================================
   RIVERSIDE ACADEMY ADMIN DASHBOARD
   Main JavaScript File (600+ lines)
   Production-Ready Code
   ========================================= */

// =========================================
// STATE MANAGEMENT
// =========================================

const state = {
  applications: [],
  filteredApplications: [],
  currentPage: 1,
  itemsPerPage: 10,
  isAuthenticated: false,
  filters: {
    search: '',
    status: '',
    grade: '',
    sortBy: 'date-desc'
  },
  confirmAction: null
};

// =========================================
// API CONFIGURATION
// =========================================

const API_BASE_URL = 'http://localhost:3000/api';


// =========================================
// UTILITY FUNCTIONS
// =========================================

/**
 * Formats date string to readable format
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Returns status badge HTML
 */
function getStatusBadgeHTML(status) {
  const badgeClasses = {
    'Pending': 'badge-pending',
    'Approved': 'badge-approved',
    'Rejected': 'badge-rejected'
  };
  const badgeClass = badgeClasses[status] || 'badge-pending';
  return `<span class="badge ${badgeClass}">${status}</span>`;
}

/**
 * Shows toast notification
 */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastContent = document.getElementById('toast-content');
  
  const typeClasses = {
    'success': 'toast-success',
    'error': 'toast-error',
    'warning': 'toast-warning',
    'info': 'toast-info'
  };
  
  toastContent.className = `card border p-4 ${typeClasses[type] || 'toast-success'}`;
  toastContent.textContent = message;
  
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

/**
 * Shows confirmation dialog
 */
function showConfirmDialog(title, message, onConfirm, isDangerous = false) {
  const dialog = document.getElementById('confirm-dialog');
  const titleEl = document.getElementById('confirm-title');
  const messageEl = document.getElementById('confirm-message');
  const confirmBtn = document.getElementById('confirm-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  
  titleEl.textContent = title;
  messageEl.textContent = message;
  
  confirmBtn.textContent = isDangerous ? 'Delete' : 'Confirm';
  confirmBtn.className = isDangerous 
    ? 'btn-danger' 
    : 'btn-primary';
  
  dialog.classList.remove('hidden');
  
  const handleConfirm = () => {
    onConfirm();
    dialog.classList.add('hidden');
    confirmBtn.removeEventListener('click', handleConfirm);
    cancelBtn.removeEventListener('click', handleCancel);
  };
  
  const handleCancel = () => {
    dialog.classList.add('hidden');
    confirmBtn.removeEventListener('click', handleConfirm);
    cancelBtn.removeEventListener('click', handleCancel);
  };
  
  confirmBtn.addEventListener('click', handleConfirm);
  cancelBtn.addEventListener('click', handleCancel);
}

// =========================================
// AUTHENTICATION
// =========================================

/**
 * Handle login form submission
 */
async function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  const loginForm = document.getElementById('login-form');
  const submitBtn = loginForm.querySelector('button[type="submit"]');
  const errorEl = document.getElementById('login-error');
  
  errorEl.classList.add('hidden');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Logging in...';
  
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      errorEl.textContent = data.message || 'Login failed';
      errorEl.classList.remove('hidden');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Login';
      return;
    }
    
    // store a simple flag; backend session handles auth
    localStorage.setItem('authToken', 'true');
    state.isAuthenticated = true;
    showLoginScreen(false);
    await loadApplications();
    showToast('Logged in successfully', 'success');
    
  } catch (error) {
    console.error('Login error:', error);
    errorEl.textContent = 'An error occurred. Please try again.';
    errorEl.classList.remove('hidden');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Login';
  }
}

/**
 * Handle logout
 */
function handleLogout() {
  localStorage.removeItem('authToken');
  state.isAuthenticated = false;
  showLoginScreen(true);
  showToast('Logged out successfully', 'info');
}

/**
 * Toggle login/dashboard screens
 */
function showLoginScreen(show) {
  const loginContainer = document.getElementById('login-container');
  const dashboardContainer = document.getElementById('dashboard-container');
  
  if (show) {
    loginContainer.classList.remove('hidden');
    dashboardContainer.classList.add('hidden');
  } else {
    loginContainer.classList.add('hidden');
    dashboardContainer.classList.remove('hidden');
  }
}

// =========================================
// DATA FETCHING
// =========================================

/**
 * Fetch all applications from backend
 */
async function loadApplications() {
  try {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      credentials: 'include'
    });
    
    if (response.status === 401) {
      handleLogout();
      return;
    }
    
    const data = await response.json();
    state.applications = Array.isArray(data) ? data : (data.applications || []);
    
    applyFilters();
    updateDashboard();
    renderApplicationsTable();
    renderStudents();
    
  } catch (error) {
    console.error('Failed to load applications:', error);
    showToast('Failed to load applications', 'error');
  }
}

// =========================================
// FILTERING & SEARCHING
// =========================================

/**
 * Apply all filters and sorting to applications
 */
function applyFilters() {
  let filtered = [...state.applications];
  
  // Search filter
  if (state.filters.search) {
    const searchLower = state.filters.search.toLowerCase();
    filtered = filtered.filter(app =>
      app.student_name?.toLowerCase().includes(searchLower) ||
      app.parent_name?.toLowerCase().includes(searchLower) ||
      app.email?.toLowerCase().includes(searchLower)
    );
  }
  
  // Status filter
  if (state.filters.status) {
    filtered = filtered.filter(app => app.status === state.filters.status);
  }
  
  // Grade filter
  if (state.filters.grade) {
    filtered = filtered.filter(app => app.grade_applying === state.filters.grade);
  }
  
  // Sorting
  filtered.sort((a, b) => {
    switch (state.filters.sortBy) {
      case 'date-asc':
        return new Date(a.submitted_at || a.createdAt) - new Date(b.submitted_at || b.createdAt);
      case 'date-desc':
        return new Date(b.submitted_at || b.createdAt) - new Date(a.submitted_at || a.createdAt);
      case 'name':
        return a.student_name.localeCompare(b.student_name);
      default:
        return 0;
    }
  });
  
  state.filteredApplications = filtered;
  state.currentPage = 1;
}

/**
 * Handle search input
 */
function handleSearchInput(e) {
  state.filters.search = e.target.value;
  applyFilters();
  renderApplicationsTable();
}

/**
 * Handle status filter change
 */
function handleStatusFilterChange(e) {
  state.filters.status = e.target.value;
  applyFilters();
  renderApplicationsTable();
}

/**
 * Handle grade filter change
 */
function handleGradeFilterChange(e) {
  state.filters.grade = e.target.value;
  applyFilters();
  renderApplicationsTable();
}

/**
 * Handle sort change
 */
function handleSortChange(e) {
  state.filters.sortBy = e.target.value;
  applyFilters();
  renderApplicationsTable();
}

// =========================================
// TABLE RENDERING
// =========================================

/**
 * Render applications table
 */
function renderApplicationsTable() {
  const tbody = document.getElementById('applications-table-body');
  const paginationContainer = document.getElementById('pagination-container');
  
  // Calculate pagination
  const totalPages = Math.ceil(state.filteredApplications.length / state.itemsPerPage);
  const startIdx = (state.currentPage - 1) * state.itemsPerPage;
  const endIdx = startIdx + state.itemsPerPage;
  const paginatedApps = state.filteredApplications.slice(startIdx, endIdx);
  
  // Handle empty state
  if (paginatedApps.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-8 text-center text-slate-500">
          <div class="flex flex-col items-center">
            <span class="text-4xl mb-2">📭</span>
            <p>No applications found</p>
          </div>
        </td>
      </tr>
    `;
    paginationContainer.classList.add('hidden');
    return;
  }
  
  // Render rows
  tbody.innerHTML = paginatedApps.map(app => `
    <tr>
      <td class="px-6 py-4">
        <p class="font-medium text-slate-900">${app.student_name || '—'}</p>
        <p class="text-sm text-slate-600">${formatDate(app.date_of_birth)}</p>
      </td>
      <td class="px-6 py-4">
        <p class="font-medium text-slate-900">${app.parent_name || '—'}</p>
        <p class="text-sm text-slate-600">${app.phone || '—'}</p>
      </td>
      <td class="px-6 py-4">
        <span class="font-medium text-slate-900">Grade ${app.grade_applying || '—'}</span>
      </td>
      <td class="px-6 py-4">
        ${getStatusBadgeHTML(app.status)}
      </td>
      <td class="px-6 py-4 text-sm text-slate-600">
        ${formatDate(app.submitted_at)}
      </td>
      <td class="px-6 py-4">
        <div class="flex items-center gap-2">
          <button onclick="viewApplicationDetails(${app.id})" class="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors">
            View
          </button>
          <button onclick="deleteApplication(${app.id})" class="px-3 py-1 text-xs font-medium bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors">
            Delete
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  
  // Update pagination
  if (totalPages > 1) {
    paginationContainer.classList.remove('hidden');
    document.getElementById('pagination-info').textContent = `Page ${state.currentPage} of ${totalPages}`;
    
    const prevBtn = document.getElementById('btn-prev-page');
    const nextBtn = document.getElementById('btn-next-page');
    
    prevBtn.disabled = state.currentPage === 1;
    nextBtn.disabled = state.currentPage === totalPages;
    
    prevBtn.onclick = () => {
      if (state.currentPage > 1) {
        state.currentPage--;
        renderApplicationsTable();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    nextBtn.onclick = () => {
      if (state.currentPage < totalPages) {
        state.currentPage++;
        renderApplicationsTable();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
  } else {
    paginationContainer.classList.add('hidden');
  }
}

// =========================================
// APPLICATIONS MODAL
// =========================================

/**
 * View detailed application information
 */
function viewApplicationDetails(appId) {
  const app = state.applications.find(a => a.id === appId);
  if (!app) return;
  
  const modal = document.getElementById('app-modal');
  const modalContent = document.getElementById('modal-content');
  
  modalContent.innerHTML = `
    <!-- Student Information -->
    <div>
      <h3 class="text-lg font-semibold text-slate-900 mb-4">Student Information</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-slate-600">Student Name</p>
          <p class="font-medium text-slate-900">${app.student_name || '—'}</p>
        </div>
        <div>
          <p class="text-sm text-slate-600">Date of Birth</p>
          <p class="font-medium text-slate-900">${formatDate(app.date_of_birth)}</p>
        </div>
        <div>
          <p class="text-sm text-slate-600">Grade Applying</p>
          <p class="font-medium text-slate-900">Grade ${app.grade_applying || '—'}</p>
        </div>
        <div>
          <p class="text-sm text-slate-600">Previous School</p>
          <p class="font-medium text-slate-900">${app.previous_school || '—'}</p>
        </div>
      </div>
    </div>

    <!-- Parent Information -->
    <div>
      <h3 class="text-lg font-semibold text-slate-900 mb-4">Parent Information</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-slate-600">Parent Name</p>
          <p class="font-medium text-slate-900">${app.parent_name || '—'}</p>
        </div>
        <div>
          <p class="text-sm text-slate-600">Phone</p>
          <p class="font-medium text-slate-900">${app.phone || '—'}</p>
        </div>
        <div class="col-span-2">
          <p class="text-sm text-slate-600">Email</p>
          <p class="font-medium text-slate-900">${app.email || '—'}</p>
        </div>
        <div class="col-span-2">
          <p class="text-sm text-slate-600">Address</p>
          <p class="font-medium text-slate-900">${app.address || '—'}</p>
        </div>
      </div>
    </div>

    <!-- Documents -->
    <div>
      <h3 class="text-lg font-semibold text-slate-900 mb-4">Documents</h3>
      <p class="text-slate-700">${app.documents_info || 'No documents submitted'}</p>
    </div>

    <!-- Status & Actions -->
    <div>
      <h3 class="text-lg font-semibold text-slate-900 mb-4">Application Status</h3>
      <p class="text-sm text-slate-600 mb-3">Current Status:</p>
      <div class="mb-4">${getStatusBadgeHTML(app.status)}</div>
      
      ${app.status === 'Pending' ? `
        <div class="space-y-3">
          <button onclick="approveApplication(${app.id})" class="w-full btn-success py-2 text-sm font-semibold">
            Approve Application
          </button>
          <button onclick="rejectApplication(${app.id})" class="w-full btn-danger py-2 text-sm font-semibold">
            Reject Application
          </button>
        </div>
      ` : ''}
    </div>
  `;
  
  modal.classList.remove('hidden');
}

/**
 * Approve application
 */
async function approveApplication(appId) {
  showConfirmDialog(
    'Approve Application',
    'Are you sure you want to approve this application?',
    async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/applications/${appId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({ status: 'Approved' }),
          credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to approve');
        
        showToast('Application approved successfully', 'success');
        document.getElementById('app-modal').classList.add('hidden');
        await loadApplications();
        
      } catch (error) {
        console.error('Error:', error);
        showToast('Failed to approve application', 'error');
      }
    }
  );
}

/**
 * Reject application
 */
async function rejectApplication(appId) {
  showConfirmDialog(
    'Reject Application',
    'Are you sure you want to reject this application?',
    async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/applications/${appId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({ status: 'Rejected' }),
          credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to reject');
        
        showToast('Application rejected', 'success');
        document.getElementById('app-modal').classList.add('hidden');
        await loadApplications();
        
      } catch (error) {
        console.error('Error:', error);
        showToast('Failed to reject application', 'error');
      }
    }
  );
}

/**
 * Delete application
 */
function deleteApplication(appId) {
  showConfirmDialog(
    'Delete Application',
    'This action cannot be undone. Are you sure you want to delete this application?',
    async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/applications/${appId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to delete');
        
        showToast('Application deleted successfully', 'success');
        await loadApplications();
        
      } catch (error) {
        console.error('Error:', error);
        showToast('Failed to delete application', 'error');
      }
    },
    true
  );
}

// =========================================
// DASHBOARD STATS
// =========================================

/**
 * Update dashboard statistics
 */
function updateDashboard() {
  const total = state.applications.length;
  const pending = state.applications.filter(a => a.status === 'Pending').length;
  const approved = state.applications.filter(a => a.status === 'Approved').length;
  const rejected = state.applications.filter(a => a.status === 'Rejected').length;
  
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-pending-info').textContent = `${pending} waiting`;
  document.getElementById('stat-approved').textContent = approved;
  document.getElementById('stat-rejected').textContent = rejected;
  
  // Render recent applications
  const recentAppsContainer = document.getElementById('recent-apps');
  const recentApps = state.applications.slice(0, 5);
  
  if (recentApps.length === 0) {
    recentAppsContainer.innerHTML = '<p class="text-slate-500 text-center py-8">No applications yet</p>';
    return;
  }
  
  recentAppsContainer.innerHTML = recentApps.map(app => `
    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <div>
        <p class="font-medium text-slate-900">${app.student_name}</p>
        <p class="text-xs text-slate-600">Grade ${app.grade_applying}</p>
      </div>
      ${getStatusBadgeHTML(app.status)}
    </div>
  `).join('');
}

// =========================================
// STUDENTS PAGE
// =========================================

/**
 * Render students list
 */
function renderStudents() {
  const grid = document.getElementById('students-grid');
  const approvedStudents = state.applications.filter(a => a.status === 'Approved');
  
  if (approvedStudents.length === 0) {
    grid.innerHTML = '<p class="col-span-full text-center text-slate-500 py-12">No enrolled students yet</p>';
    return;
  }
  
  grid.innerHTML = approvedStudents.map(student => `
    <div class="card p-6 hover:shadow-lg transition-smooth">
      <div class="flex items-start gap-4 mb-4">
        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          ${student.student_name[0]}
        </div>
        <div>
          <h3 class="font-bold text-slate-900">${student.student_name}</h3>
          <p class="text-sm text-slate-600">Grade ${student.grade_applying}</p>
        </div>
      </div>
      
      <div class="space-y-3 text-sm">
        <div>
          <p class="text-slate-600">Date of Birth</p>
          <p class="font-medium text-slate-900">${formatDate(student.date_of_birth)}</p>
        </div>
        <div>
          <p class="text-slate-600">Parent</p>
          <p class="font-medium text-slate-900">${student.parent_name}</p>
        </div>
        <div>
          <p class="text-slate-600">Contact</p>
          <p class="font-medium text-slate-900">${student.phone}</p>
        </div>
        <div>
          <p class="text-slate-600">Email</p>
          <p class="font-medium text-slate-900 truncate">${student.email}</p>
        </div>
      </div>
      
      <button class="w-full mt-4 btn-primary text-sm py-2">View Profile</button>
    </div>
  `).join('');
}

// =========================================
// NAVIGATION
// =========================================

/**
 * Handle section navigation
 */
function navigateToSection(event) {
  event.preventDefault();
  const link = event.target.closest('.nav-link');
  if (!link) return;
  const sectionId = link.dataset.section;
  if (!sectionId) return;

  // Hide all sections
  document.getElementById('dashboard-section').classList.add('hidden');
  document.getElementById('applications-section').classList.add('hidden');
  document.getElementById('students-section').classList.add('hidden');
  document.getElementById('reports-section').classList.add('hidden');
  document.getElementById('settings-section').classList.add('hidden');

  // Show selected section
  const targetSection = document.getElementById(`${sectionId}-section`);
  if (targetSection) targetSection.classList.remove('hidden');

  // Update nav links
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  link.classList.add('active');

  // Close mobile sidebar
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.remove('sidebar-open');
  overlay.classList.remove('show');
}

// =========================================
// EVENT LISTENERS
// =========================================

document.addEventListener('DOMContentLoaded', async () => {
  // Login form
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  
  // Logout button
  document.getElementById('logout-btn').addEventListener('click', handleLogout);
  
  // Profile dropdown
  document.getElementById('profile-toggle').addEventListener('click', (e) => {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.classList.toggle('hidden');
  });
  
  // Close profile dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('profile-dropdown');
    const toggle = document.getElementById('profile-toggle');
    if (!dropdown.contains(e.target) && !toggle.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
  
  // Modal close buttons
  document.getElementById('modal-close-btn').addEventListener('click', () => {
    document.getElementById('app-modal').classList.add('hidden');
  });
  
  // Filters
  document.getElementById('filter-search').addEventListener('input', handleSearchInput);
  document.getElementById('filter-status').addEventListener('change', handleStatusFilterChange);
  document.getElementById('filter-grade').addEventListener('change', handleGradeFilterChange);
  document.getElementById('filter-sort').addEventListener('change', handleSortChange);
  
  // Student search
  document.getElementById('student-search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const approvedStudents = state.applications.filter(a => a.status === 'Approved');
    const filtered = approvedStudents.filter(s => s.student_name.toLowerCase().includes(searchTerm));
    
    const grid = document.getElementById('students-grid');
    if (filtered.length === 0) {
      grid.innerHTML = '<p class="col-span-full text-center text-slate-500 py-12">No students found</p>';
      return;
    }
    
    grid.innerHTML = filtered.map(student => `
      <div class="card p-6 hover:shadow-lg transition-smooth">
        <div class="flex items-start gap-4 mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            ${student.student_name[0]}
          </div>
          <div>
            <h3 class="font-bold text-slate-900">${student.student_name}</h3>
            <p class="text-sm text-slate-600">Grade ${student.grade_applying}</p>
          </div>
        </div>
        
        <div class="space-y-3 text-sm">
          <div>
            <p class="text-slate-600">Date of Birth</p>
            <p class="font-medium text-slate-900">${formatDate(student.date_of_birth)}</p>
          </div>
          <div>
            <p class="text-slate-600">Parent</p>
            <p class="font-medium text-slate-900">${student.parent_name}</p>
          </div>
          <div>
            <p class="text-slate-600">Contact</p>
            <p class="font-medium text-slate-900">${student.phone}</p>
          </div>
          <div>
            <p class="text-slate-600">Email</p>
            <p class="font-medium text-slate-900 truncate">${student.email}</p>
          </div>
        </div>
        
        <button class="w-full mt-4 btn-primary text-sm py-2">View Profile</button>
      </div>
    `).join('');
  });
  
  // Sidebar navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', navigateToSection);
  });
  
  // Menu toggle
  document.getElementById('menu-toggle').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('sidebar-open');
    overlay.classList.toggle('show');
  });
  
  // Sidebar overlay click
  document.getElementById('sidebar-overlay').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.remove('sidebar-open');
    overlay.classList.remove('show');
  });
  
  // Check authentication and load data
  const token = localStorage.getItem('authToken');
  if (token) {
    state.isAuthenticated = true;
    showLoginScreen(false);
    await loadApplications();
  } else {
    showLoginScreen(true);
  }
});

// =========================================
// END OF admin.js
// ========================================= 