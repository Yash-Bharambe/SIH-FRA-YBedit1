import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, XCircle, MapPin, Calendar, Download, Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { claimsService, Claim } from '../../services/claimsService';

export const MyClaims: React.FC = () => {
  const { currentUser } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.id) {
      loadClaims();
    } else {
      setLoading(false);
    }
  }, [currentUser?.id]);

  const loadClaims = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use a mock user ID for testing since we're using mock data
      const userId = currentUser?.id || 'public-1';
      const userClaims = await claimsService.getUserClaims(userId);
      const userStats = await claimsService.getUserClaimStats(userId);
      
      setClaims(userClaims);
      setStats(userStats);
    } catch (error) {
      console.error('Error loading claims:', error);
      setError('Failed to load claims. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-forest-accent" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-forest-medium" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-gray-600">Loading your claims...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center py-12">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Claims</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadClaims}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome {currentUser?.user_metadata?.name || currentUser?.email || 'User'}
            </h1>
            <p className="text-gray-600">Manage your FRA claims and track their status</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
              <span>Poduchunapadar, Odisha</span>
            </div>
            <button
              onClick={loadClaims}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Claims</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{stats.approved}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-amber-600 mb-2">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">{stats.rejected}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
      </div>

      {/* Claims List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Your FRA Claims</h3>
            <div className="text-sm text-gray-500">
              Showing {claims.length} claim{claims.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {claims.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No claims submitted yet</h3>
            <p className="text-gray-600 mb-6">Submit your first FRA claim to get started.</p>
            <button className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Submit New Claim
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {claims.map((claim) => (
              <div key={claim.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      claim.status === 'approved' ? 'bg-green-50' :
                      claim.status === 'pending' ? 'bg-amber-50' :
                      'bg-red-50'
                    }`}>
                      {getStatusIcon(claim.status)}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        Claim #{claim.id?.slice(-8)}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{claim.village}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(claim.created_at!)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                      claim.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </span>
                    {claim.document_url && (
                      <a
                        href={claim.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Download Document"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 font-medium">Area:</span>
                    <p className="text-gray-900 font-semibold">{claim.area} hectares</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">Coordinates:</span>
                    <p className="text-gray-900 font-semibold">
                      {claim.coordinates}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">Status:</span>
                    <p className="text-gray-900 font-semibold">
                      {claim.status === 'approved' && claim.approved_at
                        ? `Approved on ${formatDate(claim.approved_at)}`
                        : claim.status.charAt(0).toUpperCase() + claim.status.slice(1)
                      }
                    </p>
                  </div>
                </div>

                {claim.status === 'rejected' && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      This claim was rejected. Please review the requirements and submit a new claim.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Currently showing data for Poduchunapadar – 100% Mapping Success</h3>
          <p className="text-gray-300">
            Forest Rights Act Implementation Portal • Ministry of Tribal Affairs
          </p>
        </div>
      </div>
    </div>
  );
};
