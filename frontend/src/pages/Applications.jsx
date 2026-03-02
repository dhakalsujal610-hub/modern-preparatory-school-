import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import StatusBadge from '../components/StatusBadge'
import StatusDropdown from '../components/StatusDropdown'
import StatusChangeModal from '../components/StatusChangeModal'
import ApplicationModal from '../components/ApplicationModal'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast from '../components/Toast'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { ChevronDownIcon, MagnifyingGlassIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [filteredApps, setFilteredApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  // Status change modal
  const [statusChangeModal, setStatusChangeModal] = useState({ 
    isOpen: false, 
    appId: null, 
    currentStatus: null, 
    newStatus: null,
    isLoading: false 
  })

  // Bulk select
  const [selectedApps, setSelectedApps] = useState(new Set())
  const [bulkAction, setBulkAction] = useState(null)
  const [bulkActionLoading, setBulkActionLoading] = useState(false)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [gradeFilter, setGradeFilter] = useState('All')
  const [sortBy, setSortBy] = useState('date')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // read statusFilter passed from dashboard or from localStorage
  useEffect(() => {
    // from react-router state
    const fromState = window.history.state && window.history.state.usr && window.history.state.usr.statusFilter
    if (fromState) {
      setStatusFilter(fromState)
    }

    const stored = window.localStorage.getItem('applicationFilter')
    if (stored) {
      setStatusFilter(stored)
      window.localStorage.removeItem('applicationFilter')
    }

    fetchApplications()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [applications, searchTerm, statusFilter, gradeFilter, sortBy])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/applications')
      const apps = response.data.applications || response.data
      setApplications(apps)
    } catch (err) {
      showToast('Failed to fetch applications', 'error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...applications]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.parent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    // Grade filter
    if (gradeFilter !== 'All') {
      filtered = filtered.filter(app => app.grade_applying === gradeFilter)
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.student_name.localeCompare(b.student_name)
        case 'date':
          return new Date(b.submitted_at || b.createdAt) - new Date(a.submitted_at || a.createdAt)
        default:
          return 0
      }
    })

    setFilteredApps(filtered)
    setCurrentPage(1)
  }

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  const handleViewDetails = (app) => {
    console.debug('handleViewDetails invoked for app id:', app?.id)
    setSelectedApp(app)
    setModalOpen(true)
  }

  const handleApprove = async (appId) => {
    try {
      await api.put(`/api/applications/${appId}/status`, { status: 'Approved' })
      setModalOpen(false)
      showToast('Application approved successfully', 'success')
      // update local state
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'Approved' } : a))
      setFilteredApps(prev => prev.map(a => a.id === appId ? { ...a, status: 'Approved' } : a))
      if (selectedApp?.id === appId) {
        setSelectedApp(prev => prev ? { ...prev, status: 'Approved' } : null)
      }
    } catch (err) {
      showToast('Failed to approve application', 'error')
    }
  }

  const handleReject = async (appId) => {
    try {
      await api.put(`/api/applications/${appId}/status`, { status: 'Rejected' })
      setModalOpen(false)
      showToast('Application rejected', 'success')
      // update local state
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'Rejected' } : a))
      setFilteredApps(prev => prev.map(a => a.id === appId ? { ...a, status: 'Rejected' } : a))
      if (selectedApp?.id === appId) {
        setSelectedApp(prev => prev ? { ...prev, status: 'Rejected' } : null)
      }
    } catch (err) {
      showToast('Failed to reject application', 'error')
    }
  }

  const handleDelete = async (appId) => {
    try {
      await api.delete(`/api/applications/${appId}`)
      showToast('Application deleted successfully', 'success')
      setDeleteConfirm(null)
      fetchApplications()
    } catch (err) {
      showToast('Failed to delete application', 'error')
    }
  }

  // Handle status change
  const handleStatusChangeClick = (appId, currentStatus, newStatus) => {
    setStatusChangeModal({
      isOpen: true,
      appId,
      currentStatus,
      newStatus,
      isLoading: false
    })
  }

  const handleStatusChangeConfirm = async () => {
    const { appId, newStatus } = statusChangeModal
    
    try {
      setStatusChangeModal(prev => ({ ...prev, isLoading: true }))
      await api.put(`/api/applications/${appId}/status`, { status: newStatus })
      
      showToast(`Status changed to ${newStatus}`, 'success')
      setStatusChangeModal({ isOpen: false, appId: null, currentStatus: null, newStatus: null, isLoading: false })
      // Update local state immediately
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a))
      setFilteredApps(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a))
      if (selectedApp?.id === appId) {
        setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null)
      }
      // refresh counts
      // we can recalc stats by applying filter again on applications update later via effects

    } catch (err) {
      showToast('Failed to change status', 'error')
      setStatusChangeModal(prev => ({ ...prev, isLoading: false }))
    }
  }

  // Bulk select handlers
  const handleSelectApp = (appId) => {
    const newSelected = new Set(selectedApps)
    if (newSelected.has(appId)) {
      newSelected.delete(appId)
    } else {
      newSelected.add(appId)
    }
    setSelectedApps(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedApps.size === paginatedApps.length) {
      setSelectedApps(new Set())
    } else {
      setSelectedApps(new Set(paginatedApps.map(app => app.id)))
    }
  }

  // Bulk actions
  const handleBulkAction = async (action) => {
    if (selectedApps.size === 0) {
      showToast('Please select at least one application', 'warning')
      return
    }

    try {
      setBulkActionLoading(true)
      const ids = Array.from(selectedApps)

      if (action === 'delete') {
        // call bulk delete endpoint
        await api.delete('/api/applications/bulk', { data: { ids } })
        showToast(`${ids.length} application(s) deleted successfully`, 'success')
      } else {
        // call bulk status update
        await api.put('/api/applications/bulk/status', { ids, status: action })
        showToast(`${ids.length} application(s) marked as ${action}`, 'success')
      }

      setSelectedApps(new Set())
      setBulkAction(null)
      fetchApplications()
    } catch (err) {
      showToast('Failed to perform bulk action', 'error')
    } finally {
      setBulkActionLoading(false)
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedApps = filteredApps.slice(startIdx, startIdx + itemsPerPage)

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Applications</h1>
        <p className="text-slate-600 mt-2">Manage and review student applications</p>
      </div>

      {/* Filters & Bulk Actions */}
      <div className="card p-6 space-y-4">
        {/* Bulk Actions Bar */}
        {selectedApps.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <p className="text-sm font-medium text-blue-900">
              {selectedApps.size} application(s) selected
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('Approved')}
                disabled={bulkActionLoading}
                className="btn-success text-sm py-1.5 px-3 disabled:opacity-50"
              >
                Bulk Approve
              </button>
              <button
                onClick={() => handleBulkAction('Rejected')}
                disabled={bulkActionLoading}
                className="btn-danger text-sm py-1.5 px-3 disabled:opacity-50"
              >
                Bulk Reject
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={bulkActionLoading}
                className="btn-danger text-sm py-1.5 px-3 disabled:opacity-50"
              >
                {bulkActionLoading ? 'Processing...' : 'Bulk Delete'}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
            <div className="flex items-center bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200 focus-within:border-blue-600">
              <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Student, parent, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent ml-2 outline-none w-full text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>

          {/* Grade Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Grade</label>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="input-field"
            >
              <option>All</option>
              <option>1</option>
              <option>3</option>
              <option>5</option>
              <option>7</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="date">Newest First</option>
              <option value="name">Student Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedApps.size === paginatedApps.length && paginatedApps.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Student</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Parent</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Grade</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Submitted</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedApps.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl mb-2">📭</span>
                      <p>No applications found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedApps.map((app) => (
                  <tr key={app.id} className={`transition-colors ${selectedApps.has(app.id) ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedApps.has(app.id)}
                        onChange={() => handleSelectApp(app.id)}
                        className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{app.student_name}</p>
                      <p className="text-sm text-slate-600">{new Date(app.date_of_birth).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{app.parent_name}</p>
                      <p className="text-sm text-slate-600">{app.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">Grade {app.grade_applying}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusDropdown 
                        status={app.status}
                        onStatusChange={(newStatus) => handleStatusChangeClick(app.id, app.status, newStatus)}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(app)}
                          className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                        >
                          View
                        </button>
                        {app.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(app.id)}
                              className="px-3 py-1 text-xs font-medium bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(app.id)}
                              className="px-3 py-1 text-xs font-medium bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setDeleteConfirm(app.id)}
                          className="px-3 py-1 text-xs font-medium bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-600">Page {currentPage} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <ApplicationModal
        application={selectedApp}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        onStatusChange={(newStatus) => {
          if (selectedApp) {
            handleStatusChangeClick(selectedApp.id, selectedApp.status, newStatus)
          }
        }}
        onDelete={handleDelete}
      />

      {/* Status Change Confirmation Modal */}
      <StatusChangeModal
        isOpen={statusChangeModal.isOpen}
        onClose={() => setStatusChangeModal({ isOpen: false, appId: null, currentStatus: null, newStatus: null, isLoading: false })}
        onConfirm={handleStatusChangeConfirm}
        currentStatus={statusChangeModal.currentStatus}
        newStatus={statusChangeModal.newStatus}
        isLoading={statusChangeModal.isLoading}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        title="Delete Application"
        message="This action cannot be undone. Are you sure you want to delete this application?"
        isOpen={!!deleteConfirm}
        isDangerous={true}
        onConfirm={() => handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />

      {/* Toast */}
      <Toast message={toast.message} type={toast.type} isVisible={toast.show} />
    </div>
  )
}
