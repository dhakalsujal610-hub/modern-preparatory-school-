import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import LoadingSkeleton from '../components/LoadingSkeleton'

export default function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/applications')
      const apps = response.data.applications || response.data
      // Get only approved applications
      const studentsList = apps.filter(app => app.status === 'Approved')
      setStudents(studentsList)
    } catch (err) {
      console.error('Failed to fetch students:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(student =>
    student.student_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="page-enter space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Students</h1>
        <p className="text-slate-600 mt-2">Manage enrolled students</p>
      </div>

      {/* Search */}
      <div className="card p-6">
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-500 text-lg">No students found</p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div key={student.id} className="card p-6 hover:shadow-lg transition-smooth">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                  {student.student_name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{student.student_name}</h3>
                  <p className="text-sm text-slate-600">Grade {student.grade_applying}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-600">Date of Birth</p>
                  <p className="font-medium text-slate-900">{student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-600">Parent</p>
                  <p className="font-medium text-slate-900">{student.parent_name}</p>
                </div>
                <div>
                  <p className="text-slate-600">Contact</p>
                  <p className="font-medium text-slate-900">{student.phone}</p>
                </div>
                <div>
                  <p className="text-slate-600">Email</p>
                  <p className="font-medium text-slate-900 truncate">{student.email}</p>
                </div>
              </div>

              <button className="w-full mt-4 btn-primary text-sm py-2">
                View Profile
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
