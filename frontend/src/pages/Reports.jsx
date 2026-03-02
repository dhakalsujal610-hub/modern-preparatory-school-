import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import LoadingSkeleton from '../components/LoadingSkeleton'

function toCSV(rows) {
  if (!rows || rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const lines = [headers.join(',')]
  for (const r of rows) {
    const vals = headers.map(h => {
      const v = r[h] == null ? '' : String(r[h]).replace(/"/g, '""')
      return `"${v}"`
    })
    lines.push(vals.join(','))
  }
  return lines.join('\n')
}

export default function Reports() {
  const [loading, setLoading] = useState(true)
  const [apps, setApps] = useState([])
  const [filterStatus, setFilterStatus] = useState('All')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  useEffect(() => { fetchReports() }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/applications')
      const data = res.data.applications || res.data
      setApps(data)
    } catch (err) {
      console.error('Failed to load reports', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = apps.filter(a => {
    if (filterStatus !== 'All' && a.status !== filterStatus) return false
    if (fromDate && new Date(a.submitted_at || a.createdAt) < new Date(fromDate)) return false
    if (toDate && new Date(a.submitted_at || a.createdAt) > new Date(toDate)) return false
    return true
  })

  const stats = {
    total: filtered.length,
    pending: filtered.filter(a => a.status === 'Pending').length,
    approved: filtered.filter(a => a.status === 'Approved').length,
    rejected: filtered.filter(a => a.status === 'Rejected').length,
  }

  const handleExport = () => {
    const csv = toCSV(filtered.map(a => ({
      id: a.id,
      student_name: a.student_name,
      parent_name: a.parent_name,
      grade: a.grade_applying,
      status: a.status,
      submitted_at: a.submitted_at || a.createdAt,
      email: a.email,
      phone: a.phone
    })))
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `applications-report-${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  if (loading) return <LoadingSkeleton />

  return (
    <div className="page-enter space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-600 mt-2">Generate and export application reports</p>
      </div>

      <div className="card p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field">
              <option>All</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">From</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">To</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="input-field" />
          </div>
          <div className="flex items-end">
            <button onClick={handleExport} className="btn-primary px-4 py-2">Export CSV</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-sm text-slate-500">Total (filtered)</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold mb-4">Applications</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Student</th>
                <th className="p-2 text-left">Grade</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="border-t">
                  <td className="p-2">{a.id}</td>
                  <td className="p-2">{a.student_name}</td>
                  <td className="p-2">{a.grade_applying}</td>
                  <td className="p-2">{a.status}</td>
                  <td className="p-2">{a.submitted_at ? new Date(a.submitted_at).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
