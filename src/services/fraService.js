import { supabase } from '../lib/supabaseClient'

export const fraService = {
  // Claims operations
  async getClaims(filters = {}) {
    let query = supabase
      .from('claims')
      .select(`
        *,
        applicant:users!applicant_id(name, email),
        documents(id, document_type, verification_status)
      `)
    
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.district) {
      query = query.eq('district', filters.district)
    }
    if (filters.state) {
      query = query.eq('state', filters.state)
    }
    
    const { data, error } = await query
    return { data, error }
  },

  async createClaim(claimData) {
    const { data, error } = await supabase
      .from('claims')
      .insert(claimData)
      .select()
    
    return { data, error }
  },

  async updateClaimStatus(claimId, newStatus, reason = '') {
    const { data: claim, error: updateError } = await supabase
      .from('claims')
      .update({ 
        status: newStatus, 
        updated_at: new Date().toISOString(),
        approved_at: newStatus === 'approved' ? new Date().toISOString() : null
      })
      .eq('id', claimId)
      .select()

    if (!updateError && claim) {
      // Log the status change
      await supabase
        .from('audit_logs')
        .insert({
          claim_id: claimId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          action: `Status changed to ${newStatus}`,
          new_status: newStatus,
          reason: reason,
          timestamp: new Date().toISOString()
        })
    }

    return { data: claim, error: updateError }
  },

  // Geospatial queries
  async findNearbyClaims(latitude, longitude, radiusMeters = 1000) {
    const { data, error } = await supabase
      .rpc('nearby_claims', {
        target_lat: latitude,
        target_lng: longitude,
        radius_meters: radiusMeters
      })
    
    return { data, error }
  },

  // Analytics
  async getClaimStatistics(district = null) {
    const { data, error } = await supabase
      .rpc('claim_statistics', {
        district_filter: district
      })
    
    return { data, error }
  },

  // Document operations
  async uploadDocument(claimId, file, documentType) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${claimId}/${documentType}_${Date.now()}.${fileExt}`
    
    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('claim-documents')
      .upload(fileName, file)

    if (uploadError) return { data: null, error: uploadError }

    // Save metadata to documents table
    const { data, error } = await supabase
      .from('documents')
      .insert({
        claim_id: claimId,
        document_type: documentType,
        filename: file.name,
        file_path: uploadData.path,
        file_size: file.size
      })
      .select()

    return { data, error }
  },

  async searchDocuments(searchQuery, claimId = null) {
    const { data, error } = await supabase
      .rpc('search_documents', {
        search_query: searchQuery,
        claim_filter: claimId
      })
    
    return { data, error }
  }
}
