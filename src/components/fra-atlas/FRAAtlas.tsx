import React, { useState } from 'react';
import { Map, Filter, Search, Download, Eye, MapPin, Users, TreePine, Mountain, Droplets, Leaf, ToggleLeft, ToggleRight, BarChart3, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const mockFRAData = [
  {
    id: 'FRA-OD-001',
    claimId: 'IFR/2024/OD/KAL/001',
    type: 'IFR',
    status: 'granted',
    applicant: 'Ramesh Gond',
    village: 'Podochunapadar',
    block: 'Kalyanasingpur',
    district: 'Rayagada',
    state: 'Odisha',
    tribalGroup: 'Gond',
    areaHectares: 2.5,
    coordinates: { lat: 19.426107, lng: 83.273541 },
    grantDate: '2024-01-15',
    documentUrl: 'https://example.com/documents/ramesh_gond_claim.pdf'
  },
  {
    id: 'FRA-OD-002',
    claimId: 'CFR/2024/OD/KAL/002',
    type: 'CFR',
    status: 'pending',
    applicant: 'Poduchunapadar Tribal Committee',
    village: 'Podochunapadar',
    block: 'Kalyanasingpur',
    district: 'Rayagada',
    state: 'Odisha',
    tribalGroup: 'Kandha',
    areaHectares: 45.8,
    coordinates: { lat: 19.426107, lng: 83.273541 },
    grantDate: null,
    documentUrl: 'https://example.com/documents/tribal_committee_claim.pdf'
  },
  {
    id: 'FRA-OD-003',
    claimId: 'CR/2024/OD/KAL/003',
    type: 'CR',
    status: 'granted',
    applicant: 'Poduchunapadar Community',
    village: 'Podochunapadar',
    block: 'Kalyanasingpur',
    district: 'Rayagada',
    state: 'Odisha',
    tribalGroup: 'Gond',
    areaHectares: 12.3,
    coordinates: { lat: 19.426107, lng: 83.273541 },
    grantDate: '2024-01-10',
    documentUrl: 'https://example.com/documents/community_rights_claim.pdf'
  },
  {
    id: 'FRA-OD-004',
    claimId: 'IFR/2024/OD/KAL/004',
    type: 'IFR',
    status: 'rejected',
    applicant: 'Lakshman Gond',
    village: 'Podochunapadar',
    block: 'Kalyanasingpur',
    district: 'Rayagada',
    state: 'Odisha',
    tribalGroup: 'Gond',
    areaHectares: 1.8,
    coordinates: { lat: 19.426107, lng: 83.273541 },
    grantDate: null,
    documentUrl: 'https://example.com/documents/lakshman_gond_claim.pdf'
  },
  {
    id: 'FRA-OD-005',
    claimId: 'IFR/2024/OD/KAL/005',
    type: 'IFR',
    status: 'granted',
    applicant: 'Sita Gond',
    village: 'Podochunapadar',
    block: 'Kalyanasingpur',
    district: 'Rayagada',
    state: 'Odisha',
    tribalGroup: 'Gond',
    areaHectares: 3.2,
    coordinates: { lat: 19.426107, lng: 83.273541 },
    grantDate: '2024-02-01',
    documentUrl: 'https://example.com/documents/sita_gond_claim.pdf'
  }
];

export const FRAAtlas: React.FC = () => {
  const [selectedState, setSelectedState] = useState('Odisha');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLayers, setActiveLayers] = useState({
    ifr: true,
    cr: true,
    cfr: true,
    forestCover: true,
    waterBodies: true,
    farmland: true
  });

  const filteredData = mockFRAData.filter(item => {
    const stateMatch = selectedState === 'all' || item.state === selectedState;
    const typeMatch = selectedType === 'all' || item.type === selectedType;
    const statusMatch = selectedStatus === 'all' || item.status === selectedStatus;
    const searchMatch = searchTerm === '' || 
      item.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.claimId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return stateMatch && typeMatch && statusMatch && searchMatch;
  });

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'granted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'IFR':
        return 'bg-emerald-100 text-emerald-800';
      case 'CR':
        return 'bg-blue-100 text-blue-800';
      case 'CFR':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadData = () => {
    const dataToDownload = filteredData.map(claim => ({
      'Claim ID': claim.claimId,
      'Applicant Name': claim.applicant,
      'Type': claim.type,
      'Status': claim.status,
      'Village': claim.village,
      'District': claim.district,
      'State': claim.state,
      'Tribal Group': claim.tribalGroup,
      'Area (Hectares)': claim.areaHectares,
      'Coordinates': `${claim.coordinates.lat}, ${claim.coordinates.lng}`,
      'Grant Date': claim.grantDate || 'Pending',
      'Document URL': claim.documentUrl || 'N/A'
    }));

    const csvContent = [
      Object.keys(dataToDownload[0]).join(','),
      ...dataToDownload.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'fra_claims_poduchunapadar.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Map className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">FRA Atlas - Podochunapadar</h1>
                <p className="text-gray-600 text-lg">Interactive mapping of Forest Rights Act claims and granted titles</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Odisha &gt; Rayagada &gt; Kalyanasingpur &gt; Podochunapadar (765015)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleDownloadData}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              <span>Download Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filter FRA Claims</h3>
          </div>
        </div>
        
        <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <select 
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            >
              <option value="Odisha">Odisha</option>
            </select>
          </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Claim Type</label>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            >
              <option value="all">All Types</option>
              <option value="IFR">Individual Forest Rights</option>
              <option value="CR">Community Rights</option>
              <option value="CFR">Community Forest Resource Rights</option>
            </select>
          </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="granted">Granted</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search claims..."
                  className="block w-full rounded-lg border border-gray-300 pl-12 pr-4 py-3 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
              />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive WebGIS Map */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Map className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Interactive WebGIS Map</h3>
          </div>
          <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600">Coverage:</div>
              <div className="flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
              <span>1 Village Active</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative h-[700px] overflow-hidden">
          {/* Map Integration */}
          <div className="w-full h-full rounded-lg relative">
            {/* Primary: OpenStreetMap with village marker */}
<iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=83.253541,19.316107,83.293541,19.536107&layer=mapnik&marker=19.426107,83.273541"
              className="w-full h-full border-0 rounded-lg"
              title="Podochunapadar Village - OpenStreetMap"
  allowFullScreen
              style={{ minHeight: '700px' }}
            />
            
            {/* Map overlay with additional information */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="font-semibold text-gray-700">Podochunapadar Village</span>
              </div>
            </div>
          </div>
          
          {/* Village Information Panel */}
          <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="text-sm font-bold mb-3 flex items-center text-emerald-600">
              <TreePine className="h-4 w-4 mr-2" />
    Village Details
  </div>
  <div className="space-y-2">
    <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm font-semibold text-gray-700">Podochunapadar</span>
    </div>
    <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-semibold text-gray-700">Rayagada District</span>
    </div>
    <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm font-semibold text-gray-700">Odisha State</span>
    </div>
    <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-semibold text-gray-700">Tribal Village</span>
    </div>
  </div>
</div>

          {/* Statistics Panel */}
          <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-200 z-20">
            <div className="text-sm font-bold text-gray-900 mb-3 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Village Statistics
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-2xl text-gray-900">{filteredData.length}</div>
                <div className="text-gray-600">Total Claims</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-green-600">
                  {filteredData.filter(c => c.status === 'granted').length}
                </div>
                <div className="text-gray-600">Granted</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-amber-600">
                  {filteredData.filter(c => c.status === 'pending').length}
                </div>
                <div className="text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-red-600">
                  {filteredData.filter(c => c.status === 'rejected').length}
                </div>
                <div className="text-gray-600">Rejected</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bhuvan Map Integration Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Map className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Bhuvan Map Integration</h3>
            </div>
            <div className="text-sm text-gray-600">Official NRSC Mapping Service</div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bhuvan Map iframe */}
            <div className="relative h-96 rounded-lg overflow-hidden border border-gray-200">
              <iframe
                src="https://bhuvan-app1.nrsc.gov.in/bhuvan/bhuvan2d.php?config=config2d&lat=19.426107&lon=83.273541&z=15&layers=B0FT0"
                className="w-full h-full border-0"
                title="Podochunapadar Village - Bhuvan Map"
                allowFullScreen
              />
              <div className="absolute top-2 right-2 bg-emerald-600 text-white px-2 py-1 rounded text-xs font-medium">
                Bhuvan Map
              </div>
            </div>
            
            {/* Map Information and Actions */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Map Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium text-gray-900">Bhuvan NRSC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-gray-900">Podochunapadar, Rayagada</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coordinates:</span>
                    <span className="font-medium text-gray-900">19.9067°N, 83.1636°E</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Zoom Level:</span>
                    <span className="font-medium text-gray-900">15 (Village Level)</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <a 
                  href="https://bhuvan-app1.nrsc.gov.in/bhuvan/bhuvan2d.php?config=config2d&lat=19.426107&lon=83.273541&z=15&layers=B0FT0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Map className="h-4 w-4 mr-2" />
                  Open Full Bhuvan Map
                </a>
                <a 
                  href="https://www.google.com/maps?q=19.426107,83.273541"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Village Information Card */}
        <div className="p-6 bg-gray-50 rounded-lg">
          <div className="flex items-start space-x-4">
            <div className="p-4 bg-emerald-100 rounded-lg">
              <MapPin className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Village: Podochunapadar, Rayagada (765015)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-gray-600 font-semibold">Patta Holders:</span>
                  <p className="text-gray-900 font-bold text-lg">Ramesh Gond, Sita Gond</p>
                </div>
                <div>
                  <span className="text-gray-600 font-semibold">DSS Eligibility:</span>
                  <p className="text-gray-900 font-bold text-lg">PM-KISAN, FRA</p>
                </div>
                <div>
                  <span className="text-gray-600 font-semibold">Claim Type:</span>
                  <p className="text-gray-900 font-bold text-lg">IFR - 2.5 hectares</p>
                </div>
                <div>
                  <span className="text-gray-600 font-semibold">Status:</span>
                  <p className="text-green-600 font-bold text-lg">Granted (2024-01-15)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Village-Level Progress Dashboard */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Village-Level FRA Progress Dashboard</h3>
            </div>
            <div className="text-sm text-gray-600">
              Podochunapadar, Rayagada District (765015)
          </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Claims */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{filteredData.length}</div>
              <div className="text-sm text-gray-600">Total Claims</div>
              <div className="text-xs text-gray-500 mt-1">All Types Combined</div>
          </div>
          
          {/* Approved Claims */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
              {filteredData.filter(c => c.status === 'granted').length}
            </div>
              <div className="text-sm text-gray-600">Approved</div>
              <div className="text-xs text-gray-500 mt-1">
              {Math.round((filteredData.filter(c => c.status === 'granted').length / filteredData.length) * 100)}% Success Rate
            </div>
          </div>
          
          {/* Pending Claims */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">
              {filteredData.filter(c => c.status === 'pending').length}
            </div>
              <div className="text-sm text-gray-600">Pending</div>
              <div className="text-xs text-gray-500 mt-1">Under Review</div>
          </div>
          
          {/* Rejected Claims */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
              {filteredData.filter(c => c.status === 'rejected').length}
            </div>
              <div className="text-sm text-gray-600">Rejected</div>
              <div className="text-xs text-gray-500 mt-1">Require Resubmission</div>
          </div>
        </div>

        {/* Progress Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Claim Type Distribution */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                  <TreePine className="h-5 w-5 text-emerald-600" />
              </div>
              Claim Type Distribution
            </h4>
            <div className="space-y-4">
              {['IFR', 'CR', 'CFR'].map(type => {
                const count = filteredData.filter(c => c.type === type).length;
                const percentage = filteredData.length > 0 ? (count / filteredData.length) * 100 : 0;
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">{type} Claims</span>
                        <span className="text-gray-900 font-bold">{count} ({percentage.toFixed(1)}%)</span>
                    </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                            type === 'IFR' ? 'bg-emerald-500' : 
                            type === 'CR' ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Timeline */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              Recent Activity
            </h4>
            <div className="space-y-4">
              {filteredData
                .filter(c => c.grantDate)
                .sort((a, b) => new Date(b.grantDate!).getTime() - new Date(a.grantDate!).getTime())
                .slice(0, 5)
                .map((claim, index) => (
                    <div key={claim.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{claim.applicant}</p>
                        <p className="text-xs text-gray-600">
                        {claim.type} • {claim.areaHectares} hectares • {new Date(claim.grantDate!).toLocaleDateString()}
                      </p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Approved</span>
                    </div>
                  ))}
                  </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};