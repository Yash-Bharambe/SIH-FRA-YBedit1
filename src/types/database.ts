export interface User {
  id: string
  email: string
  role: 'admin' | 'district_officer' | 'tribal_welfare' | 'forest_dept' | 'revenue_dept' | 'ngo' | 'public'
  name: string
  department?: string
  state: string
  district: string
  created_at: string
  last_login?: string
  is_active: boolean
}

export interface Claim {
  id: string
  claim_number: string
  applicant_id: string
  claim_type: 'IFR' | 'CFRR' | 'CR'
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  applicant_name: string
  land_coordinates?: any // PostGIS GEOGRAPHY type
  land_area?: number
  land_description?: string
  gram_sabha?: string
  village: string
  district: string
  state: string
  created_at: string
  updated_at: string
  reviewed_by?: string
  approved_at?: string
}

export interface Document {
  id: string
  claim_id: string
  document_type: 'identity_proof' | 'tribal_certificate' | 'land_record' | 'gram_sabha_resolution'
  filename: string
  file_path: string
  file_size?: number
  upload_date: string
  verification_status: 'pending' | 'verified' | 'rejected'
  verified_by?: string
  ocr_text?: string
  content_hash?: string
}

export interface AuditLog {
  id: string
  claim_id: string
  user_id: string
  action: string
  old_status?: string
  new_status?: string
  reason?: string
  timestamp: string
  ip_address?: string
  user_agent?: string
}
