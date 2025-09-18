export interface NewClaimData {
  claimType: 'IFR' | 'CFRR' | 'CR';
  guardianName: string;
  gender: string;
  age: string;
  tribalGroup: string;
  landArea: string;
  landUnit: 'hectares' | 'acres';
  surveyNumber: string;
  documents: {
    identityProof: File | null;
    tribeCertificate: File | null;
    fraClaimForm: File | null;
    gramSabhaResolution: File | null;
  };
}

export interface Claim {
  id?: string;
  user_id: string;
  village: string;
  area: number;
  coordinates: string;
  document_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  approved_at?: string;
  applicantName?: string;
  claimType?: 'IFR' | 'CFRR' | 'CR';
  documents?: string[];
  tribalGroup?: string;
  guardianName?: string;
  gender?: string;
  age?: string;
}

export interface ClaimWithUser extends Claim {
  user: {
    name: string;
    email: string;
  };
}

// Mock claims data
let mockClaims: Claim[] = [
  {
    id: 'claim-1',
    user_id: 'public-1',
    village: 'Podochunapadar',
    area: 2.5,
    coordinates: '19.9067, 83.1636',
    document_url: 'https://example.com/doc1.pdf',
    status: 'pending',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    applicantName: 'Rajesh Kumar',
    claimType: 'IFR',
    documents: ['identityProof', 'tribeCertificate', 'fraClaimForm', 'gramSabhaResolution'],
    tribalGroup: 'Gond',
    guardianName: 'Mohan Kumar',
    gender: 'male',
    age: '35'
  },
  {
    id: 'claim-2',
    user_id: 'public-2',
    village: 'Podochunapadar',
    area: 1.8,
    coordinates: '19.9067, 83.1636',
    document_url: 'https://example.com/doc2.pdf',
    status: 'approved',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    approved_at: new Date(Date.now() - 86400000).toISOString(),
    applicantName: 'Priya Sharma',
    claimType: 'CFRR',
    documents: ['identityProof', 'tribeCertificate', 'fraClaimForm', 'gramSabhaResolution'],
    tribalGroup: 'Kandha',
    guardianName: 'Suresh Sharma',
    gender: 'female',
    age: '42'
  },
  {
    id: 'claim-3',
    user_id: 'public-3',
    village: 'Podochunapadar',
    area: 3.2,
    coordinates: '19.9067, 83.1636',
    document_url: 'https://example.com/doc3.pdf',
    status: 'rejected',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    applicantName: 'Amit Singh',
    claimType: 'CR',
    documents: ['identityProof', 'fraClaimForm'],
    tribalGroup: 'Gond',
    guardianName: 'Ramesh Singh',
    gender: 'male',
    age: '29'
  },
  {
    id: 'claim-4',
    user_id: 'public-4',
    village: 'Podochunapadar',
    area: 1.5,
    coordinates: '19.9067, 83.1636',
    document_url: 'https://example.com/doc4.pdf',
    status: 'pending',
    created_at: new Date(Date.now() - 345600000).toISOString(),
    applicantName: 'Sita Kumari',
    claimType: 'IFR',
    documents: ['identityProof', 'tribeCertificate', 'fraClaimForm'],
    tribalGroup: 'Kandha',
    guardianName: 'Raju Kumar',
    gender: 'female',
    age: '38'
  }
];

// Mock user data for claims
const mockUsers = {
  'public-1': { name: 'Rajesh Kumar', email: 'rajesh.kumar@example.com' },
  'public-2': { name: 'Priya Sharma', email: 'priya.sharma@example.com' },
  'public-3': { name: 'Amit Singh', email: 'amit.singh@example.com' },
  'public-4': { name: 'Sita Gond', email: 'sita.gond@example.com' }
};

export const claimsService = {
  // Create a new claim
  async createClaim(claimData: Omit<Claim, 'id' | 'status' | 'created_at'>): Promise<Claim> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newClaim: Claim = {
      id: `claim-${Date.now()}`,
      ...claimData,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    mockClaims.unshift(newClaim);
    return newClaim;
  },

  // Submit a new claim (handles NewClaimData format)
  async submitClaim(claimData: NewClaimData): Promise<Claim> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Convert landArea to correct unit (hectares)
    const areaInHectares = claimData.landUnit === 'acres' 
      ? parseFloat(claimData.landArea) * 0.404686 // Convert acres to hectares
      : parseFloat(claimData.landArea);
    
    const newClaim: Claim = {
      id: `claim-${Date.now()}`,
      user_id: 'current-user', // In real app, this would come from auth context
      village: 'Podochunapadar', // Default village for mock data
      area: areaInHectares,
      coordinates: claimData.surveyNumber || '',
      status: 'pending',
      created_at: new Date().toISOString(),
      claimType: claimData.claimType,
      documents: Object.entries(claimData.documents)
        .filter(([_, file]) => file !== null)
        .map(([key]) => key),
      tribalGroup: claimData.tribalGroup,
      guardianName: claimData.guardianName,
      gender: claimData.gender,
      age: claimData.age
    };
    
    mockClaims.unshift(newClaim);
    return newClaim;
  },

  // Get claims for a specific user
  async getUserClaims(userId: string): Promise<Claim[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockClaims.filter(claim => claim.user_id === userId);
  },

  // Get all claims for admin
  async getAllClaims(): Promise<ClaimWithUser[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockClaims.map(claim => ({
      ...claim,
      user: mockUsers[claim.user_id as keyof typeof mockUsers] || { name: 'Unknown User', email: 'unknown@example.com' }
    }));
  },

  // Get all claims (simple version for admin panel)
  getClaims(): Claim[] {
    return mockClaims;
  },

  // Update claim status
  async updateClaimStatus(claimId: string, status: 'approved' | 'rejected'): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const claimIndex = mockClaims.findIndex(claim => claim.id === claimId);
    if (claimIndex !== -1) {
      mockClaims[claimIndex].status = status;
    }
  },

  // Upload document (mock implementation)
  async uploadDocument(file: File, claimId: string): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a mock URL
    return `https://example.com/documents/${claimId}_${file.name}`;
  },

  // Get claim statistics for a user
  async getUserClaimStats(userId: string): Promise<{
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  }> {
    const claims = await this.getUserClaims(userId);
    
    return {
      total: claims.length,
      approved: claims.filter(c => c.status === 'approved').length,
      pending: claims.filter(c => c.status === 'pending').length,
      rejected: claims.filter(c => c.status === 'rejected').length,
    };
  }
};