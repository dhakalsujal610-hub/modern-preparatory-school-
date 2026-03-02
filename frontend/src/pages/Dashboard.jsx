import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import DashboardCard from '../components/DashboardCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/applications')
        const apps = response.data.applications || response.data

        setApplications(apps)

        // Calculate stats
        const pending = apps.filter(a => a.status === 'Pending').length
        const approved = apps.filter(a => a.status === 'Approved').length
        const rejected = apps.filter(a => a.status === 'Rejected').length

        setStats({
          total: apps.length,
          pending,
          approved,
          rejected,
        })
      } catch (err) {
        console.error('Failed to fetch applications:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Navigation handlers for stats cards
  const handleCardClick = (filter) => {
    localStorage.setItem('applicationFilter', filter)
    navigate('/applications', { state: { statusFilter: filter } })
  }

  // Data for charts
  const monthlyData = [
    { month: 'Jan', count: 24 },
    { month: 'Feb', count: 35 },
    { month: 'Mar', count: 28 },
    { month: 'Apr', count: 42 },
    { month: 'May', count: 51 },
    { month: 'Jun', count: 38 },
  ]

  const gradeData = applications.reduce((acc, app) => {
    const grade = `Grade ${app.grade_applying}`
    const existing = acc.find(g => g.name === grade)
    if (existing) {
      existing.count++
    } else {
      acc.push({ name: grade, count: 1 })
    }
    return acc
  }, [])

  const statusData = [
    { name: 'Pending', value: stats?.pending || 0, color: '#eab308' },
    { name: 'Approved', value: stats?.approved || 0, color: '#16a34a' },
    { name: 'Rejected', value: stats?.rejected || 0, color: '#dc2626' },
  ]

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="page-enter space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome back! Here's what's happening with your applications.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Applications" 
          value={stats?.total || 0}
          icon="📋"
          borderColor="border-blue-600"
          trend="+12% this month"
          trendColor="text-green-600"
          isClickable={true}
          onClick={() => handleCardClick('All')}
        />
        <DashboardCard 
          title="Pending" 
          value={stats?.pending || 0}
          icon="⏳"
          borderColor="border-yellow-400"
          trend={`${stats?.pending || 0} waiting`}
          trendColor="text-yellow-600"
          isClickable={true}
          onClick={() => handleCardClick('Pending')}
        />
        <DashboardCard 
          title="Approved" 
          value={stats?.approved || 0}
          icon="✅"
          borderColor="border-green-600"
          trend="+5 this week"
          trendColor="text-green-600"
          isClickable={true}
          onClick={() => handleCardClick('Approved')}
        />
        <DashboardCard 
          title="Rejected" 
          value={stats?.rejected || 0}
          icon="❌"
          borderColor="border-red-600"
          trend="3 incomplete"
          trendColor="text-red-600"
          isClickable={true}
          onClick={() => handleCardClick('Rejected')}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Applications Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={{ fill: '#2563eb' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Applications by Grade</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Applications */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Applications</h2>
          <div className="space-y-3">
            {applications.slice(0, 5).map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{app.student_name}</p>
                  <p className="text-xs text-slate-600">Grade {app.grade_applying}</p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                  app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
