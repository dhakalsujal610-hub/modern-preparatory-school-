import React, { useState } from 'react'
import { ChevronDownIcon, BellIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline'

export default function Navbar({ onMenuClick, onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button onClick={onMenuClick} className="p-2 hover:bg-slate-100 rounded-lg transition-smooth">
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Riverside Academy</h1>
                <p className="text-xs text-slate-500">Admin Dashboard</p>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="hidden md:flex items-center bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
              <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent ml-2 outline-none text-slate-700 placeholder-slate-400 w-32"
              />
            </div>

            {/* Notification */}
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-smooth">
              <BellIcon className="w-6 h-6 text-slate-600" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition-smooth"
              >
                <UserCircleIcon className="w-6 h-6 text-slate-600" />
                <ChevronDownIcon className={`w-4 h-4 text-slate-600 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                  <button className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50">Profile</button>
                  <button className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50">Settings</button>
                  <hr className="my-1" />
                  <button 
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
