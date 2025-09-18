import { FC } from 'react';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import FraClaimForm from './FraClaimForm';

interface ClaimSubmissionProps {
  onSuccess?: () => void;
}

export const ClaimSubmission: FC<ClaimSubmissionProps> = ({ onSuccess }) => {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <FileText className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Forest Rights Claim</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Submit your forest rights claim under the Forest Rights Act, 2006. 
            Ensure all information is accurate and complete.
          </p>
        </div>
      </div>

      {/* Process Steps */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Submission Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-emerald-600">1</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Fill Form</p>
              <p className="text-xs text-gray-500">Complete all sections</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-emerald-600">2</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Upload Documents</p>
              <p className="text-xs text-gray-500">Required certificates</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-emerald-600">3</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Review & Submit</p>
              <p className="text-xs text-gray-500">Verify information</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-emerald-600">4</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Track Status</p>
              <p className="text-xs text-gray-500">Monitor progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Important Information</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• All fields marked with * are mandatory</li>
              <li>• Individual Forest Rights (IFR) claims are limited to 4 hectares maximum</li>
              <li>• Upload clear, legible scanned copies or photos of documents</li>
              <li>• You will receive a confirmation email after successful submission</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form Component */}
      <FraClaimForm />
    </div>
  );
};