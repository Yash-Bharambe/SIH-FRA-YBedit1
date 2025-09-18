// Types and Interfaces
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

// Mock Data
const mockClaims: Claim[] = [
  {
    id: 'claim-1',
    user_id: 'public-1',
    village: 'Podochuanpadar',
    area: 2.5,
    coordinates: '19.9067, 83.1636',
    document_url: 'https://example.com/doc1.pdf',
    status: 'pending',
    created_at: new Date().toISOString(),
    applicantName: 'Rajesh Kumar',
    claimType: 'IFR',
    documents: ['identityProof', 'tribeCertificate', 'fraClaimForm', 'gramSabhaResolution'],
    tribalGroup: 'Kondh',
    guardianName: 'Ram Kumar',
    gender: 'male',
    age: '35'
  },
  {
    id: 'claim-2',
    user_id: 'public-2',
    village: 'Podochuanpadar',
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
    village: 'Podochuanpadar',
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
    village: 'Podochuanpadar',
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
const mockUsers: Record<string, { name: string; email: string }> = {
  'public-1': { name: 'Rajesh Kumar', email: 'rajesh.kumar@example.com' },
  'public-2': { name: 'Priya Sharma', email: 'priya.sharma@example.com' },
  'public-3': { name: 'Amit Singh', email: 'amit.singh@example.com' },
  'public-4': { name: 'Sita Gond', email: 'sita.gond@example.com' }
};

// Claims Service Class (for MongoDB integration)
export class ClaimsService {
  static async createClaim(claimData: NewClaimData & { userId: string }): Promise<Claim> {
    try {
      const claimId = `FRA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Convert landArea to correct unit (hectares)
      const areaInHectares = claimData.landUnit === 'acres' 
        ? parseFloat(claimData.landArea) * 0.404686 // Convert acres to hectares
        : parseFloat(claimData.landArea);

      const newClaim: Claim = {
        id: claimId,
        user_id: claimData.userId,
        village: 'Podochuanpadar', // Default village
        area: areaInHectares,
        coordinates: claimData.surveyNumber || '',
        status: 'pending',
        created_at: new Date().toISOString(),
        applicantName: claimData.guardianName, // Using guardianName as applicant
        claimType: claimData.claimType,
        documents: Object.entries(claimData.documents)
          .filter(([_, file]) => file !== null)
          .map(([key]) => key),
        tribalGroup: claimData.tribalGroup,
        guardianName: claimData.guardianName,
        gender: claimData.gender,
        age: claimData.age
      };
      
      // If using MongoDB, uncomment this line:
      // return await MongoDBService.createClaim(newClaim);
      
      // For now, using mock data
      mockClaims.unshift(newClaim);
      return newClaim;
    } catch (error) {
      console.error('Error creating claim:', error);
      throw error;
    }
  }

  static async getClaims(): Promise<Claim[]> {
    try {
      // If using MongoDB, uncomment this line:
      // return await MongoDBService.getClaims();
      
      // For now, using mock data
      return mockClaims;
    } catch (error) {
      console.error('Error fetching claims:', error);
      throw error;
    }
  }

  static async getClaimById(id: string): Promise<Claim | null> {
    try {
      // If using MongoDB, uncomment this line:
      // return await MongoDBService.getClaimById(id);
      
      // For now, using mock data
      return mockClaims.find(claim => claim.id === id) || null;
    } catch (error) {
      console.error('Error fetching claim:', error);
      throw error;
    }
  }
}

// Claims Service Object (for direct usage in components)
export const claimsService = {
  // Create a new claim (accepts Claim interface)
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

  // Submit a new claim (handles NewClaimData format from form)
  async submitClaim(claimData: NewClaimData, userId?: string): Promise<Claim> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Convert landArea to correct unit (hectares)
    const areaInHectares = claimData.landUnit === 'acres' 
      ? parseFloat(claimData.landArea) * 0.404686 // Convert acres to hectares
      : parseFloat(claimData.landArea);
    
    const newClaim: Claim = {
      id: `claim-${Date.now()}`,
      user_id: userId || 'current-user', // Use provided userId or fallback
      village: 'Podochuanpadar', // Default village for mock data
      area: areaInHectares,
      coordinates: claimData.surveyNumber || '',
      status: 'pending',
      created_at: new Date().toISOString(),
      applicantName: claimData.guardianName,
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

  // Get all claims for admin with user details
  async getAllClaims(): Promise<ClaimWithUser[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockClaims.map(claim => ({
      ...claim,
      user: mockUsers[claim.user_id] || { name: 'Unknown User', email: 'unknown@example.com' }
    }));
  },

  // Get all claims (simple version for admin panel)
  getClaims(): Claim[] {
    return [...mockClaims]; // Return a copy to prevent mutations
  },

  // Get a specific claim by ID
  async getClaimById(id: string): Promise<Claim | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockClaims.find(claim => claim.id === id) || null;
  },

  // Update claim status
  async updateClaimStatus(claimId: string, status: 'approved' | 'rejected'): Promise<Claim | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const claimIndex = mockClaims.findIndex(claim => claim.id === claimId);
    if (claimIndex !== -1) {
      mockClaims[claimIndex].status = status;
      if (status === 'approved') {
        mockClaims[claimIndex].approved_at = new Date().toISOString();
      }
      return mockClaims[claimIndex];
    }
    return null;
  },

  // Upload document (mock implementation)
  async uploadDocument(file: File, claimId: string): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validate file
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File size must be less than 10MB');
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only PDF, JPG, and PNG files are allowed');
    }
    
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
  },

  // Get overall claim statistics (for admin dashboard)
  async getOverallStats(): Promise<{
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    totalArea: number;
    approvedArea: number;
  }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const total = mockClaims.length;
    const approved = mockClaims.filter(c => c.status === 'approved').length;
    const pending = mockClaims.filter(c => c.status === 'pending').length;
    const rejected = mockClaims.filter(c => c.status === 'rejected').length;
    const totalArea = mockClaims.reduce((sum, claim) => sum + claim.area, 0);
    const approvedArea = mockClaims
      .filter(c => c.status === 'approved')
      .reduce((sum, claim) => sum + claim.area, 0);

    return {
      total,
      approved,
      pending,
      rejected,
      totalArea: Math.round(totalArea * 100) / 100, // Round to 2 decimal places
      approvedArea: Math.round(approvedArea * 100) / 100
    };
  }
};
