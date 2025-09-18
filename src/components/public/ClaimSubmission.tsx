import { FC } from 'react';
import FraClaimForm from './FraClaimForm';

interface ClaimSubmissionProps {
  onSuccess?: () => void;
}

export const ClaimSubmission: FC<ClaimSubmissionProps> = ({ onSuccess }) => {
  return (
    <div className="container mx-auto py-8">
      <FraClaimForm />
    </div>
  );
}