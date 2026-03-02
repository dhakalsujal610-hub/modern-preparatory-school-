import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Applications', path: '/applications', icon: '📋' },
    { name: 'Students', path: '/students', icon: '👨‍🎓' },
    { name: 'Reports', path: '/reports', icon: '📈' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative right-0 w-64 h-screen bg-white border-l border-slate-200 transition-transform duration-300 z-30 ${
        isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
      }`}>
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-8">Menu</h2>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-6 border-t border-slate-200">
          <div className="text-xs text-slate-500 text-center">
            <p>Riverside Academy</p>
            <p>Admin v1.0</p>
          </div>
        </div>
      </aside>
    </>
  )
}
