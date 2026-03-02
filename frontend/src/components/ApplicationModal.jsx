import React, { useState, useEffect } from 'react'
import { XMarkIcon, CheckIcon, XCircleIcon, TrashIcon } from '@heroicons/react/24/outline'
import StatusDropdown from './StatusDropdown'

export default function ApplicationModal({ 
  application, 
  isOpen, 
  onClose, 
  onApprove, 
  onReject, 
  onStatusChange,
  onDelete 
}) {
  if (!isOpen || !application) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-slate-900">Application Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <XMarkIcon className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Student Info */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Student Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Student Name</p>
                <p className="font-medium text-slate-900">{application.student_name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Date of Birth</p>
                  <p className="font-medium text-slate-900">{application.date_of_birth ? new Date(application.date_of_birth).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Grade Applying</p>
                <p className="font-medium text-slate-900">Grade {application.grade_applying}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Previous School</p>
                <p className="font-medium text-slate-900">{application.previous_school}</p>
              </div>
            </div>
          </div>

          {/* Parent Info */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Parent Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Parent Name</p>
                <p className="font-medium text-slate-900">{application.parent_name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Phone</p>
                <p className="font-medium text-slate-900">{application.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-slate-600">Email</p>
                <p className="font-medium text-slate-900">{application.email}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-slate-600">Address</p>
                <p className="font-medium text-slate-900">{application.address}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Documents</h3>
            <p className="text-slate-700">{application.documents_info}</p>
          </div>

          {/* Actions */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            {/* Status Dropdown */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">Change Status</p>
              <StatusDropdown
                status={application.status}
                onStatusChange={onStatusChange}
              />
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {application.status === 'Pending' && (
                <>
                  <button 
                    onClick={() => onApprove(application.id)}
                    className="btn-success flex items-center justify-center gap-2 text-sm py-2"
                  >
                    <CheckIcon className="w-4 h-4" />
                    Approve
                  </button>
                  <button 
                    onClick={() => onReject(application.id)}
                    className="btn-danger flex items-center justify-center gap-2 text-sm py-2"
                  >
                    <XCircleIcon className="w-4 h-4" />
                    Reject
                  </button>
                </>
              )}
              <button 
                onClick={() => onDelete(application.id)}
                className="btn-danger flex items-center justify-center gap-2 text-sm py-2"
              >
                <TrashIcon className="w-4 h-4" />
                Delete
              </button>
              <button onClick={onClose} className="btn-secondary text-sm py-2">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
