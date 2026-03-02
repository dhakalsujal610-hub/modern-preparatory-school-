export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getStatusColor = (status) => {
  const colors = {
    Pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    Approved: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    Rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  }
  return colors[status] || colors.Pending
}

export const getGradeLabel = (grade) => {
  return `Grade ${grade}`
}
