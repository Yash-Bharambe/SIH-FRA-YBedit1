import React, { useState } from 'react';
import { Award, Calendar, MapPin, DollarSign, Filter, ExternalLink } from 'lucide-react';

const mockSchemes = [
  {
    id: 1,
    name: 'PM-KISAN Scheme',
    description: 'Direct income support to farmers with small and marginal holdings',
    eligibility: ['Small farmers', 'Marginal land holders', 'Agricultural plots'],
    funding: 6000,
    deadline: '2024-03-31',
    status: 'active' as const,
    states: ['Karnataka', 'Maharashtra', 'Tamil Nadu'],
    zoneTypes: ['agricultural'],
    category: 'Income Support'
  },
  {
    id: 2,
    name: 'Forest Rights Act',
    description: 'Recognition of forest dwelling communities and their rights over forest land',
    eligibility: ['Forest dwelling communities', 'Tribal populations', 'Forest plots'],
    funding: 25000,
    deadline: '2024-06-30',
    status: 'active' as const,
    states: ['Karnataka', 'Maharashtra'],
    zoneTypes: ['forest'],
    category: 'Land Rights'
  },
  {
    id: 3,
    name: 'Watershed Development Scheme',
    description: 'Sustainable development of natural resources in watershed areas',
    eligibility: ['Water scarce areas', 'Degraded lands', 'Rural communities'],
    funding: 150000,
    deadline: '2024-12-31',
    status: 'active' as const,
    states: ['Karnataka', 'Tamil Nadu', 'Gujarat'],
    zoneTypes: ['agricultural', 'water'],
    category: 'Water Conservation'
  },
  {
    id: 4,
    name: 'Soil Health Card Scheme',
    description: 'Soil testing and nutrient management for sustainable agriculture',
    eligibility: ['All farmers', 'Agricultural land', 'Cooperative societies'],
    funding: 5000,
    deadline: '2024-04-15',
    status: 'active' as const,
    states: ['All States'],
    zoneTypes: ['agricultural'],
    category: 'Soil Management'
  },
  {
    id: 5,
    name: 'National Afforestation Programme',
    description: 'Afforestation and eco-restoration of degraded forest lands',
    eligibility: ['Degraded forest land', 'Community participation', 'JFM committees'],
    funding: 75000,
    deadline: '2024-08-31',
    status: 'upcoming' as const,
    states: ['Karnataka', 'Kerala', 'Tamil Nadu'],
    zoneTypes: ['forest', 'water'],
    category: 'Afforestation'
  }
];

export const GovernmentSchemes: React.FC = () => {
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');

  const filteredSchemes = mockSchemes.filter(scheme => {
    const stateMatch = selectedState === 'all' || 
                     scheme.states.includes(selectedState) || 
                     scheme.states.includes('All States');
    const categoryMatch = selectedCategory === 'all' || scheme.category === selectedCategory;
    const zoneMatch = selectedZone === 'all' || scheme.zoneTypes.includes(selectedZone);
    
    return stateMatch && categoryMatch && zoneMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <Award className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Decision Support System</h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            AI-powered scheme eligibility assessment and government scheme discovery. 
            Find the most suitable government schemes for your land and requirements.
          </p>
        </div>
      </div>

      {/* Government Schemes Content */}
      <div className="space-y-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Filter Schemes</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <select 
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                  >
                    <option value="all">All States</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Kerala">Kerala</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                  >
                    <option value="all">All Categories</option>
                    <option value="Income Support">Income Support</option>
                    <option value="Land Rights">Land Rights</option>
                    <option value="Water Conservation">Water Conservation</option>
                    <option value="Soil Management">Soil Management</option>
                    <option value="Afforestation">Afforestation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zone Type</label>
                  <select 
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                  >
                    <option value="all">All Zones</option>
                    <option value="agricultural">Agricultural</option>
                    <option value="forest">Forest</option>
                    <option value="water">Water Bodies</option>
                    <option value="residential">Residential</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{filteredSchemes.length}</div>
              <div className="text-sm text-gray-600">Available Schemes</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                {filteredSchemes.filter(s => s.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active Schemes</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatCurrency(filteredSchemes.reduce((sum, scheme) => sum + scheme.funding, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Funding</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">47</div>
              <div className="text-sm text-gray-600">Eligible Plots</div>
            </div>
          </div>

          {/* Schemes List */}
          <div className="space-y-6">
            {filteredSchemes.map((scheme) => (
              <div key={scheme.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-emerald-50 rounded-lg">
                        <Award className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{scheme.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(scheme.status)}`}>
                            {scheme.status}
                          </span>
                        </div>
                        <p className="text-gray-600 max-w-3xl">{scheme.description}</p>
                        <div className="mt-2">
                          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            {scheme.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                      <ExternalLink className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Eligibility</h4>
                      <div className="flex flex-wrap gap-2">
                        {scheme.eligibility.map((criteria, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            {criteria}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Coverage</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{scheme.states.join(', ')}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {scheme.zoneTypes.map((zone, index) => (
                            <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full capitalize">
                              {zone}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold text-gray-900">{formatCurrency(scheme.funding)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Deadline: {new Date(scheme.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSchemes.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
              <div className="text-center">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No schemes found</h3>
                <p className="text-gray-600">Try adjusting your filters to find relevant schemes.</p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};