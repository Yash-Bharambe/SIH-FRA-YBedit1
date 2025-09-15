import React, { useState, useRef } from 'react';
import { Upload, MapPin, FileText, CheckCircle, AlertCircle, X, Mountain, Droplets, User } from 'lucide-react';
import { MapPreview } from './GPXMapPreview';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useTranslation } from 'react-i18next';
import { claimsService } from '../../services/claimsService';
import { parseLocationFile } from '../../utils/locationParser';

interface ClaimSubmissionProps {
  onSuccess?: () => void;
}

export const ClaimSubmission: React.FC<ClaimSubmissionProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation(['claims']);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: '',
    village: 'Poduchunapadar',
    area: '',
    claimType: t('claims.submission.form.claimType.individual'),
    documents: [] as File[],
    gpxFile: null as File | null,
    coordinates: null as { 
      latitude: number; 
      longitude: number;
      trackPoints?: { lat: number; lng: number; }[];
    } | null
  });
  const gpxInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const claimTypes = [
    { value: 'Individual', label: 'Individual Forest Rights (IFR)' },
    { value: 'Community', label: 'Community Rights (CR)' },
    { value: 'Community Resource Rights', label: 'Community Forest Resource Rights (CFR)' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const handleLocationFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const fileExt = file?.name.toLowerCase().split('.').pop();
    
    if (file && (fileExt === 'gpx' || fileExt === 'json' || fileExt === 'geojson')) {
      try {
        const coordinates = await parseLocationFile(file);
        if (coordinates) {
          setFormData(prev => ({
            ...prev,
            gpxFile: file,
            coordinates: coordinates
          }));
          // Clear any existing coordinate errors
          setErrors(prev => ({
            ...prev,
            gpxFile: ''
          }));
        } else {
          showError('Invalid File', 'Could not extract location data from the file.');
        }
      } catch (error) {
        console.error('Error processing location file:', error);
        showError('Processing Error', 'Failed to process the location file. Please try again.');
      }
    } else {
      showError('Invalid File', 'Please upload a valid .gpx, .json, or .geojson file.');
    }
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age.trim()) newErrors.age = 'Age is required';
    if (!formData.area.trim()) newErrors.area = 'Area is required';
    if (!formData.gpxFile) newErrors.gpxFile = 'GPX file is required';
    if (formData.documents.length === 0) newErrors.documents = 'At least one document is required';

    if (formData.coordinates) {
      const { latitude: lat, longitude: lng } = formData.coordinates;
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.gpxFile = 'Invalid latitude in GPX file (must be between -90 and 90)';
      }
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.gpxFile = 'Invalid longitude in GPX file (must be between -180 and 180)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const coordinates = formData.coordinates;
      if (!coordinates) {
        showError('Missing Location', 'Please upload a GPX file with valid coordinates');
        return;
      }

      const claimData = {
        applicantName: formData.name,
        age: parseInt(formData.age),
        village: formData.village,
        area: parseFloat(formData.area),
        coordinates: `${coordinates.latitude}, ${coordinates.longitude}`,
        claimType: formData.claimType,
        documents: formData.documents.map(file => file.name),
        userId: user?.id || '',
        status: 'pending'
      };

      await claimsService.submitClaim(claimData);
      setSubmitSuccess(true);
      showSuccess('Claim Submitted Successfully!', 'Your FRA claim has been submitted and is now under review.');
      
      // Reset form
      setFormData({
        name: '',
        age: '',
        village: 'Poduchunapadar',
        area: '',
        claimType: 'Individual',
        documents: [],
        gpxFile: null,
        coordinates: null
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting claim:', error);
      showError('Submission Failed', 'Failed to submit claim. Please try again.');
      setErrors({ submit: 'Failed to submit claim. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="space-y-8 animate-forest-fade-in">
        <div className="forest-card-elevated bg-gradient-to-br from-success/10 to-forest-light/30 border-success/20">
          <div className="text-center py-16">
            <div className="flex justify-center mb-8">
              <div className="p-6 bg-success/10 rounded-full animate-forest-bounce">
                <CheckCircle className="h-16 w-16 text-success" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-forest-primary mb-6">Claim Submitted Successfully!</h2>
            <p className="text-forest-secondary text-xl mb-8 leading-relaxed">
              Your FRA claim has been submitted and is now under review. You will receive updates on the status of your claim.
            </p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="forest-button-primary text-lg px-8 py-4"
            >
              Submit Another Claim
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-forest-fade-in">
      {/* Header */}
      <div className="forest-card-elevated bg-gradient-to-r from-forest-light/10 to-forest-accent/10 border-forest-accent/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-forest-primary mb-3">Submit FRA Claim</h1>
            <p className="text-forest-secondary text-xl">Submit your Forest Rights Act claim for Poduchunapadar, Odisha</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="forest-badge-success">
              <div className="w-3 h-3 bg-forest-accent rounded-full animate-forest-pulse mr-2"></div>
              <span>Secure Submission</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Data Reference */}
      <div className="forest-card-elevated bg-gradient-to-r from-earth-primary/10 to-earth-light/10 border-earth-primary/30">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-earth-primary/20 rounded-xl">
            <FileText className="h-6 w-6 text-earth-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-forest-primary mb-3">Sample Claim Format</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-forest-secondary font-medium mb-2">Example Individual Claim:</p>
                <p className="text-forest-primary font-bold">Ramesh Gond, Age 45, 2.5 hectares, IFR</p>
              </div>
              <div>
                <p className="text-forest-secondary font-medium mb-2">Example Community Claim:</p>
                <p className="text-forest-primary font-bold">Poduchunapadar Tribal Committee, 45.8 hectares, CFR</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Form */}
      <div className="forest-card-elevated">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-forest-primary">
                Personal Information
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="forest-form-group">
                <label htmlFor="name" className="forest-form-label">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`forest-input ${errors.name ? 'border-error' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="forest-form-error">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="forest-form-group">
                <label htmlFor="age" className="forest-form-label">
                  Age *
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={handleInputChange}
                  className={`forest-input ${errors.age ? 'border-error' : ''}`}
                  placeholder="Enter your age"
                />
                {errors.age && (
                  <p className="forest-form-error">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.age}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-forest-primary">
                Location Information
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="forest-form-group">
                <label htmlFor="village" className="forest-form-label">Village</label>
                <input
                  id="village"
                  name="village"
                  type="text"
                  value={formData.village}
                  onChange={handleInputChange}
                  className="forest-input bg-forest-light/10"
                  readOnly
                />
                <p className="forest-form-help">Pre-filled for Poduchunapadar</p>
              </div>

              <div className="col-span-2">
                <div className="forest-form-group">
                  <label className="forest-form-label">Location (GPX File) *</label>
                  <div className="space-y-4">
                    {/* Location File Upload */}
                    <div className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
                      errors.gpxFile 
                        ? 'border-error/50 hover:border-error/70' 
                        : 'border-forest-light/30 hover:border-forest-light/50'
                    }`}>
                      <input
                        type="file"
                        ref={gpxInputRef}
                        onChange={handleLocationFileUpload}
                        accept=".gpx,.json,.geojson"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-forest-medium" />
                        <p className="text-forest-deep font-medium">
                          {formData.gpxFile ? formData.gpxFile.name : 'Drop location file here or click to upload'}
                        </p>
                        <p className="text-sm text-forest-medium mt-1">
                          Upload a .gpx, .json, or .geojson file containing your claim location
                        </p>
                      </div>
                    </div>

                    {/* Show map preview if coordinates are available */}
                    {formData.coordinates && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-forest-deep mb-2">Location Preview:</p>
                        <MapPreview 
                          coordinates={formData.coordinates}
                        />
                        <div className="mt-2 grid grid-cols-2 gap-4 bg-forest-sage/5 p-2 rounded-lg text-xs text-forest-medium">
                          <div>
                            <span className="font-medium">Lat: </span>
                            {formData.coordinates.latitude.toFixed(6)}
                          </div>
                          <div>
                            <span className="font-medium">Lng: </span>
                            {formData.coordinates.longitude.toFixed(6)}
                          </div>
                        </div>
                      </div>
                    )}

                    {errors.gpxFile && (
                      <p className="forest-form-error">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {errors.gpxFile}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Land Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Mountain className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-forest-primary">
                Land Information
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="forest-form-group">
                <label htmlFor="area" className="forest-form-label">
                  Area (in hectares) *
                </label>
                <input
                  id="area"
                  name="area"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.area}
                  onChange={handleInputChange}
                  className={`forest-input ${errors.area ? 'border-error' : ''}`}
                  placeholder="Enter area in hectares"
                />
                {errors.area && (
                  <p className="forest-form-error">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.area}
                  </p>
                )}
              </div>

              <div className="forest-form-group">
                <label htmlFor="claimType" className="forest-form-label">
                  Claim Type *
                </label>
                <select
                  id="claimType"
                  name="claimType"
                  value={formData.claimType}
                  onChange={handleInputChange}
                  className="forest-select"
                >
                  {claimTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Droplets className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-forest-primary">
                Required Documents
              </h3>
            </div>
            
            <div className="border-3 border-dashed border-forest-accent/40 rounded-2xl p-12 text-center hover:border-forest-accent/60 transition-all duration-300 bg-gradient-to-br from-forest-light/5 to-forest-cream/20">
              <input
                type="file"
                id="documents"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="documents" className="cursor-pointer">
                <div className="p-6 bg-gradient-primary rounded-2xl w-fit mx-auto mb-6">
                  <Upload className="h-12 w-12 text-white" />
                </div>
                <p className="text-forest-primary font-semibold text-xl mb-3">Click to upload documents</p>
                <p className="text-forest-secondary text-lg">PDF, JPG, PNG, DOC, DOCX (Max 10MB each)</p>
              </label>
            </div>

            {errors.documents && (
              <p className="forest-form-error">
                <AlertCircle className="h-4 w-4 mr-2" />
                {errors.documents}
              </p>
            )}

            {/* Uploaded Documents */}
            {formData.documents.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-forest-primary">Uploaded Documents:</h4>
                {formData.documents.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-forest-light/10 rounded-xl border border-forest-light/20">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-forest-accent" />
                      <span className="text-forest-primary font-medium">{file.name}</span>
                      <span className="text-sm text-forest-secondary">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="p-2 text-error hover:text-error/80 rounded-lg hover:bg-error/10 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="forest-alert-error">
              <p className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-3" />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-6">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: '',
                  age: '',
                  village: 'Poduchunapadar',
                  area: '',
                  claimType: 'Individual',
                  documents: [],
                  gpxFile: null,
                  coordinates: null
                });
                setErrors({});
              }}
              className="forest-button-secondary"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="forest-button-primary flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="forest-spinner-small"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Submit Claim</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};