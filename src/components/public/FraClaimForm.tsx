import { FC, useState, ChangeEvent, FormEvent } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { claimsService } from '../../services/claimsService';

interface ClaimFormData {
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

interface DocumentUploadProps {
  label: string;
  description: string;
  documentType: keyof ClaimFormData['documents'];
  file: File | null;
  onFileChange: (e: ChangeEvent<HTMLInputElement>, type: keyof ClaimFormData['documents']) => void;
}

const DocumentUpload: FC<DocumentUploadProps> = ({ 
  label, 
  description, 
  documentType, 
  file, 
  onFileChange 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label} <span className="text-red-500">*</span>
    </label>
    <p className="text-xs text-gray-500">{description}</p>
    <div className={`relative border-2 border-dashed rounded-lg p-6 transition-all hover:shadow-sm ${
      file ? 'border-emerald-300 bg-emerald-50' : 'border-gray-300 hover:border-gray-400 bg-white'
    }`}>
      <input
        type="file"
        onChange={(e) => onFileChange(e, documentType)}
        accept=".pdf,.jpg,.jpeg,.png"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        required
      />
      <div className="flex items-center justify-center">
        {file ? (
          <div className="text-sm text-emerald-600 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{file.name}</span>
          </div>
        ) : (
          <div className="text-sm text-gray-600 text-center">
            <svg className="mx-auto h-10 w-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3v-7" />
            </svg>
            <span className="block font-medium">Click or drop file here</span>
            <span className="block text-xs mt-1 text-gray-500">PDF, JPG, PNG up to 10MB</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

const FraClaimForm: FC = () => {
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ClaimFormData>({
    claimType: 'IFR',
    guardianName: '',
    gender: '',
    age: '',
    tribalGroup: '',
    landArea: '',
    landUnit: 'hectares',
    surveyNumber: '',
    documents: {
      identityProof: null,
      tribeCertificate: null,
      fraClaimForm: null,
      gramSabhaResolution: null
    }
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, documentType: keyof ClaimFormData['documents']) => {
    const file = e.target.files?.[0] || null;
    
    // Validate file size (10MB limit)
    if (file && file.size > 10 * 1024 * 1024) {
      showError('File size must be less than 10MB');
      return;
    }

    // Validate file type
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        showError('Only PDF, JPG, and PNG files are allowed');
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: file
      }
    }));
  };

  const validateForm = (): boolean => {
    // Validate required fields
    const requiredFields = ['guardianName', 'gender', 'age', 'tribalGroup', 'landArea'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof ClaimFormData]);
    
    if (missingFields.length > 0) {
      showError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    // Validate age
    const age = parseInt(formData.age);
    if (age < 18 || age > 120) {
      showError('Please enter a valid age between 18 and 120');
      return false;
    }

    // Validate land area
    const landArea = parseFloat(formData.landArea);
    if (landArea <= 0) {
      showError('Land area must be greater than 0');
      return false;
    }

    // For Individual Forest Rights, check 4 hectare limit
    if (formData.claimType === 'IFR') {
      const areaInHectares = formData.landUnit === 'hectares' ? landArea : landArea * 0.4047; // Convert acres to hectares
      if (areaInHectares > 4) {
        showError('Individual Forest Rights claims cannot exceed 4 hectares');
        return false;
      }
    }

    // Validate document uploads
    const requiredDocuments = Object.keys(formData.documents) as (keyof ClaimFormData['documents'])[];
    const missingDocs = requiredDocuments.filter(docType => !formData.documents[docType]);

    if (missingDocs.length > 0) {
      const docLabels = {
        identityProof: 'Identity Proof',
        tribeCertificate: 'Tribe/Community Certificate',
        fraClaimForm: 'FRA Claim Form',
        gramSabhaResolution: 'Gram Sabha Resolution'
      };
      
      const missingDocNames = missingDocs.map(doc => docLabels[doc]);
      showError(`Please upload all required documents: ${missingDocNames.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert the form data to match your API structure
      const submissionData = {
        applicant_name: formData.guardianName,
        claim_type: formData.claimType.toLowerCase() as 'individual' | 'community' | 'habitat' | 'other',
        village_id: 'default-podochuanpadar-village-id', // You might need to get this from context or props
        area_ha: formData.landUnit === 'hectares' 
          ? parseFloat(formData.landArea) 
          : parseFloat(formData.landArea) * 0.4047, // Convert acres to hectares
        metadata: {
          guardianName: formData.guardianName,
          gender: formData.gender,
          age: parseInt(formData.age),
          tribalGroup: formData.tribalGroup,
          surveyNumber: formData.surveyNumber,
          landUnit: formData.landUnit,
          originalLandArea: formData.landArea
        }
      };

      // Submit claim using claimsService
      const result = await claimsService.createClaim(submissionData);
      
      if (result) {
        // Here you would typically handle document uploads separately
        // For now, we'll just show success message
        showSuccess('Your claim has been successfully submitted! Document upload functionality will be available in your dashboard.');
        
        // Reset form
        setFormData({
          claimType: 'IFR',
          guardianName: '',
          gender: '',
          age: '',
          tribalGroup: '',
          landArea: '',
          landUnit: 'hectares',
          surveyNumber: '',
          documents: {
            identityProof: null,
            tribeCertificate: null,
            fraClaimForm: null,
            gramSabhaResolution: null
          }
        });

        // Reset file inputs
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach((input) => {
          (input as HTMLInputElement).value = '';
        });
      } else {
        throw new Error('Failed to submit claim');
      }
    } catch (error: any) {
      console.error('Error submitting claim:', error);
      showError(error.message || 'There was an error submitting your claim. Please try again or contact support if the problem persists.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getClaimTypeDescription = (type: string) => {
    switch (type) {
      case 'IFR':
        return 'Rights to land cultivated by forest dwellers before December 13, 2005';
      case 'CFRR':
        return 'Rights to community forest resources like bamboo, honey, medicinal plants';
      case 'CR':
        return 'Rights to protect, regenerate, and manage community forest resources';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Forest Rights Claim Form</h2>
        <p className="mt-2 text-gray-600">Complete the form below to submit your forest rights claim</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Claim Type Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900">Type of Forest Rights Claim</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['IFR', 'CFRR', 'CR'] as const).map((type) => (
              <label key={type} className="cursor-pointer">
                <input
                  type="radio"
                  name="claimType"
                  value={type}
                  checked={formData.claimType === type}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className={`p-4 rounded-lg border-2 text-center transition-all hover:shadow-sm ${
                  formData.claimType === type 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}>
                  <div className="font-medium mb-2">
                    {type === 'IFR' && 'Individual Forest Rights'}
                    {type === 'CFRR' && 'Community Forest Resource Rights'}
                    {type === 'CR' && 'Community Rights'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {getClaimTypeDescription(type)}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="guardianName" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="guardianName"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleInputChange}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="tribalGroup" className="block text-sm font-medium text-gray-700 mb-2">
                Caste / Tribal Group <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="tribalGroup"
                name="tribalGroup"
                value={formData.tribalGroup}
                onChange={handleInputChange}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                placeholder="e.g., Kondh, Saura, etc."
                required
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="18"
                max="120"
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                placeholder="Enter age"
                required
              />
            </div>
          </div>
        </div>

        {/* Location Information Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900">Location Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 font-medium">
                Podochuanpadar
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 font-medium">
                Rayagada
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 font-medium">
                Odisha
              </div>
            </div>
          </div>
        </div>

        {/* Land Information Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900">Land Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="landArea" className="block text-sm font-medium text-gray-700 mb-2">
                Land Area <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="landArea"
                  name="landArea"
                  value={formData.landArea}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="block w-full rounded-lg border border-gray-300 pl-4 pr-12 py-3 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                  placeholder="0.00"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                  {formData.landUnit === 'hectares' ? 'ha' : 'ac'}
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="landUnit" className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select
                id="landUnit"
                name="landUnit"
                value={formData.landUnit}
                onChange={handleInputChange}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
              >
                <option value="hectares">Hectares</option>
                <option value="acres">Acres</option>
              </select>
            </div>
          </div>

          {formData.claimType === 'IFR' && formData.landArea && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Individual Forest Rights claims are limited to a maximum of 4 hectares.
                {formData.landUnit === 'acres' && (
                  <span className="block mt-1">
                    Your claim of {formData.landArea} acres equals approximately {(parseFloat(formData.landArea) * 0.4047).toFixed(2)} hectares.
                  </span>
                )}
              </p>
            </div>
          )}

          <div>
            <label htmlFor="surveyNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Survey Number / GPS Coordinates
            </label>
            <input
              type="text"
              id="surveyNumber"
              name="surveyNumber"
              value={formData.surveyNumber}
              onChange={handleInputChange}
              className="block w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
              placeholder="Enter survey number or coordinates"
            />
          </div>
        </div>

        {/* Document Uploads */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900">Required Documents</h3>
          </div>
          <p className="text-gray-600 text-sm">Please upload clear, legible scanned copies or photos of the following documents</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: 'identityProof', label: 'Identity Proof', description: 'Aadhar Card, Voter ID, or any government-issued ID' },
              { key: 'tribeCertificate', label: 'Tribe/Community Certificate', description: 'Certificate issued by competent authority' },
              { key: 'fraClaimForm', label: 'FRA Claim Form (Form-A)', description: 'Duly filled and signed Form-A' },
              { key: 'gramSabhaResolution', label: 'Gram Sabha Resolution', description: 'Resolution copy with village seal' }
            ].map(doc => (
              <DocumentUpload
                key={doc.key}
                label={doc.label}
                description={doc.description}
                documentType={doc.key as keyof ClaimFormData['documents']}
                file={formData.documents[doc.key as keyof typeof formData.documents]}
                onFileChange={handleFileUpload}
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Submit Your Claim</h3>
              <p className="text-sm text-gray-600 mt-1">Please review all information before submitting</p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                px-8 py-3 text-white text-lg font-medium rounded-lg
                transition-all relative min-w-[150px] shadow-sm
                ${isSubmitting 
                  ? 'bg-emerald-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'
                }
              `}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </div>
              ) : (
                'Submit Claim'
              )}
            </button>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            By submitting this form, you confirm that all information provided is accurate and complete.
            <br />
            You will receive a confirmation email and can track your claim status in your dashboard.
          </div>
        </div>
      </form>
    </div>
  );
};

export default FraClaimForm;
