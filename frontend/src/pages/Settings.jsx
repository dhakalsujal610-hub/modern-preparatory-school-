import React, { useState } from 'react'

export default function Settings() {
  const [settings, setSettings] = useState({
    schoolName: 'Riverside Academy',
    email: 'admin@riverside.edu',
    phone: '(555) 123-4567',
    address: '100 Academy Lane, City, State 12345',
    timezone: 'UTC-5',
    language: 'English',
    theme: 'light',
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    setSaved(true)
    // persist to localStorage for now
    window.localStorage.setItem('scool_settings', JSON.stringify(settings))
    setTimeout(() => setSaved(false), 3000)
  }

  // load persisted settings
  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem('scool_settings')
      if (stored) setSettings(JSON.parse(stored))
    } catch (e) { /* ignore */ }
  }, [])

  return (
    <div className="page-enter space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">Manage your dashboard preferences and school information</p>
      </div>

      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
          ✓ Settings saved successfully
        </div>
      )}

      {/* School Information */}
      <div className="card p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">School Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">School Name</label>
              <input
                type="text"
                value={settings.schoolName}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
              <textarea
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                rows="3"
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Preferences</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="input-field"
              >
                <option>UTC-5</option>
                <option>UTC-6</option>
                <option>UTC-7</option>
                <option>UTC-8</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="input-field"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                className="input-field"
              >
                <option>Light</option>
                <option>Dark</option>
                <option>Auto</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Security</h2>
        
        <div className="space-y-3">
          <button className="w-full btn-secondary text-left py-3">
            Change Password
          </button>
          <button className="w-full btn-secondary text-left py-3">
            Two-Factor Authentication
          </button>
          <button className="w-full btn-secondary text-left py-3">
            Active Sessions
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button onClick={handleSave} className="btn-primary px-8 py-3 font-semibold">
          Save Changes
        </button>
        <button className="btn-secondary px-8 py-3 font-semibold">
          Cancel
        </button>
      </div>
    </div>
  )
}
