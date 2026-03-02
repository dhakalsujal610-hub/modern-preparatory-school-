import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Applications from './pages/Applications'
import Students from './pages/Students'
import Settings from './pages/Settings'
import Reports from './pages/Reports'
import Login from './pages/Login'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // verify session on mount
  useEffect(() => {
    // cleanup any old token value
    window.localStorage.removeItem('authToken')

    async function check() {
      try {
        const res = await fetch('http://localhost:3000/api/me', { credentials: 'include' })
        const data = await res.json()
        setIsAuthenticated(!!data.loggedIn)
      } catch (e) {
        setIsAuthenticated(false)
      }
    }
    check()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/api/logout', { method: 'POST', credentials: 'include' })
    } catch (e) {
      console.error('logout failed', e)
    }
    setIsAuthenticated(false)
  }

  return (
    <Router>
      <div className="flex h-screen bg-slate-50 flex-row-reverse">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} onLogout={handleLogout} />
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
                <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
                <Route path="/applications" element={isAuthenticated ? <Applications /> : <Navigate to="/login" replace />} />
                <Route path="/students" element={isAuthenticated ? <Students /> : <Navigate to="/login" replace />} />
                <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />} />
                <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  )
}
