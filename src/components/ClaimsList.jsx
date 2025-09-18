import { useState, useEffect } from 'react'
import { fraService } from '../services/fraService'
import { useAuth } from '../contexts/AuthContext'

export default function ClaimsList() {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '', district: '' })
  const { currentUser } = useAuth()

  useEffect(() => {
    fetchClaims()
  }, [filters])

  const fetchClaims = async () => {
    setLoading(true)
    const { data, error } = await fraService.getClaims(filters)
    if (!error) {
      setClaims(data || [])
    }
    setLoading(false)
  }

  const handleStatusChange = async (claimId, newStatus) => {
    const reason = prompt('Please provide a reason for this status change:')
    if (reason) {
      const { error } = await fraService.updateClaimStatus(claimId, newStatus, reason)
      if (!error) {
        fetchClaims() // Refresh the list
      }
    }
  }

  if (loading) return <div>Loading claims...</div>

  return (
    <div className="claims-list">
      <h2>FRA Claims Management</h2>
      
      {/* Filters */}
      <div className="filters">
        <select 
          value={filters.status} 
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        
        <input
          type="text"
          placeholder="Filter by district"
          value={filters.district}
          onChange={(e) => setFilters({...filters, district: e.target.value})}
        />
      </div>

      {/* Claims Table */}
      <table className="claims-table">
        <thead>
          <tr>
            <th>Claim Number</th>
            <th>Applicant</th>
            <th>Type</th>
            <th>Status</th>
            <th>District</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((claim) => (
            <tr key={claim.id}>
              <td>{claim.claim_number}</td>
              <td>{claim.applicant_name}</td>
              <td>{claim.claim_type}</td>
              <td>
                <span className={`status ${claim.status}`}>
                  {claim.status}
                </span>
              </td>
              <td>{claim.district}</td>
              <td>{new Date(claim.created_at).toLocaleDateString()}</td>
              <td>
                <select 
                  onChange={(e) => handleStatusChange(claim.id, e.target.value)}
                  defaultValue=""
                >
                  <option value="">Change Status</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approve</option>
                  <option value="rejected">Reject</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
