import React, { useState } from 'react';
import { Brain, Satellite, Mountain, Droplets, Loader2 } from 'lucide-react';

const mockPlotData = {
  plotId: 'PL-2847',
  coordinates: { lat: 19.426107, lng: 83.273541 },
  elevation: 545,
  soilType: 'Red Sandy Loam',
  waterProximity: 0.8,
  rockFormations: ['Granite', 'Quartzite'],
  vegetation: 'Mixed Deciduous Forest',
  slope: 12.5,
  drainage: 'Good',
  lastAnalyzed: '2024-01-15T10:30:00Z',
  location: 'Podochunapadar, Odisha 765015'
};

export const TerrainAnalysis: React.FC = () => {
  const [selectedPlot, setSelectedPlot] = useState('PL-2847');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <Brain className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Asset Mapping</h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Advanced satellite data analysis and machine learning for intelligent terrain mapping and asset detection.
            Leverage AI to identify and map forest resources, agricultural lands, and water bodies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analysis Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Analysis Controls</h3>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Plot</label>
              <select 
                value={selectedPlot}
                onChange={(e) => setSelectedPlot(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
              >
                <option value="PL-2847">PL-2847 - Podochunapadar, Odisha</option>
                <option value="PL-2848">PL-2848 - Rayagada District, Odisha</option>
                <option value="PL-2849">PL-2849 - Kalyanasingpur Block, Odisha</option>
              </select>
            </div>

            <button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5 mr-2" />
                  <span>Run AI Analysis</span>
                </>
              )}
            </button>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">System Status</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Satellite Data: Active</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">ML Models: Verified</span>
              </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Weather Data: Updated</span>
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* Satellite View */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Satellite className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Satellite View</h3>
            </div>
          </div>
          
          <div className="p-6">
            <div className="relative h-96 mb-4 rounded-lg overflow-hidden border border-gray-200">
              {/* WebGIS Map for Podochunapadar */}
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${mockPlotData.coordinates.lng - 0.01},${mockPlotData.coordinates.lat - 0.01},${mockPlotData.coordinates.lng + 0.01},${mockPlotData.coordinates.lat + 0.01}&layer=mapnik&marker=${mockPlotData.coordinates.lat},${mockPlotData.coordinates.lng}`}
                className="w-full h-full border-0"
                title={`${mockPlotData.location} - WebGIS Map`}
                allowFullScreen
              />
              
              {/* Map Overlay Information */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
                <div className="text-sm font-semibold text-gray-900">{mockPlotData.location}</div>
                <div className="text-xs text-gray-600">Plot {selectedPlot}</div>
              </div>
              <div className="absolute bottom-4 right-4 bg-gray-900/80 text-white px-3 py-1 rounded text-xs">
                {mockPlotData.coordinates.lat.toFixed(6)}°N, {mockPlotData.coordinates.lng.toFixed(6)}°E
            </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="font-medium">{mockPlotData.location}</span>
              </div>
              <div className="flex justify-between">
                <span>Coordinates:</span>
                <span className="font-medium">{mockPlotData.coordinates.lat.toFixed(6)}°N, {mockPlotData.coordinates.lng.toFixed(6)}°E</span>
              </div>
              <div className="flex justify-between">
                <span>Last updated:</span>
                <span className="font-medium">2 hours ago</span>
              </div>
          </div>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <Mountain className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Elevation</span>
              </div>
              <span className="text-blue-600 font-bold text-lg">{mockPlotData.elevation}m</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-amber-500 rounded"></div>
                <span className="font-semibold text-gray-900">Soil Type</span>
              </div>
              <span className="text-amber-700 font-bold text-sm">{mockPlotData.soilType}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <div className="flex items-center space-x-3">
                <Droplets className="h-5 w-5 text-cyan-600" />
                <span className="font-semibold text-gray-900">Water Distance</span>
              </div>
              <span className="text-cyan-600 font-bold text-lg">{mockPlotData.waterProximity} km</span>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="font-semibold text-gray-900 mb-3">Rock Formations</div>
              <div className="flex flex-wrap gap-2">
                {mockPlotData.rockFormations.map((rock, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                    {rock}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="font-semibold text-gray-900 mb-1">Drainage Quality</div>
              <div className="text-green-600 font-bold">{mockPlotData.drainage}</div>
            </div>
          </div>
        </div>
      </div>

      {/* WebGIS Location Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Satellite className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">WebGIS Location View</h3>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Interactive Map */}
            <div className="relative h-96 rounded-lg overflow-hidden border border-gray-200">
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${mockPlotData.coordinates.lng - 0.02},${mockPlotData.coordinates.lat - 0.02},${mockPlotData.coordinates.lng + 0.02},${mockPlotData.coordinates.lat + 0.02}&layer=mapnik&marker=${mockPlotData.coordinates.lat},${mockPlotData.coordinates.lng}`}
                className="w-full h-full border-0"
                title={`${mockPlotData.location} - Interactive WebGIS Map`}
                allowFullScreen
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
                <div className="text-sm font-semibold text-gray-900">{mockPlotData.location}</div>
                <div className="text-xs text-gray-600">Coordinates: {mockPlotData.coordinates.lat.toFixed(6)}°N, {mockPlotData.coordinates.lng.toFixed(6)}°E</div>
              </div>
            </div>
            
            {/* Location Details */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Location Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Village:</span>
                    <span className="font-medium text-gray-900">Podochunapadar</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">State:</span>
                    <span className="font-medium text-gray-900">Odisha</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pincode:</span>
                    <span className="font-medium text-gray-900">765015</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Latitude:</span>
                    <span className="font-medium text-gray-900">{mockPlotData.coordinates.lat.toFixed(6)}°N</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Longitude:</span>
                    <span className="font-medium text-gray-900">{mockPlotData.coordinates.lng.toFixed(6)}°E</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <a 
                  href={`https://www.google.com/maps?q=${mockPlotData.coordinates.lat},${mockPlotData.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Satellite className="h-4 w-4 mr-2" />
                  View on Google Maps
                </a>
                <a 
                  href={`https://www.openstreetmap.org/?mlat=${mockPlotData.coordinates.lat}&mlon=${mockPlotData.coordinates.lng}&zoom=15`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Satellite className="h-4 w-4 mr-2" />
                  Open in OpenStreetMap
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">{mockPlotData.slope}°</div>
          <div className="text-sm text-gray-600">Slope Angle</div>
          <div className="text-xs text-gray-500 mt-1">Moderate gradient</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-emerald-600 mb-2">78%</div>
          <div className="text-sm text-gray-600">Vegetation Cover</div>
          <div className="text-xs text-gray-500 mt-1">Dense forest</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">94.2%</div>
          <div className="text-sm text-gray-600">Analysis Accuracy</div>
          <div className="text-xs text-gray-500 mt-1">High confidence</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-amber-600 mb-2">A+</div>
          <div className="text-sm text-gray-600">Suitability Score</div>
          <div className="text-xs text-gray-500 mt-1">Excellent for agriculture</div>
        </div>
      </div>
    </div>
  );
};