import React from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ExpiredLink = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <Clock className="h-16 w-16 text-amber-500 mb-4" />
          <h2 className="text-xl font-semibold text-amber-700 mb-2">Invitation Link Expired</h2>
          <p className="text-gray-600 mb-6">
            This invitation link has expired. Please contact your administrator to request a new invitation.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/login')}
              className="bg-amber-500 hover:bg-amber-600 text-white w-full"
            >
              Go to Login
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/')}
              className="border-amber-200 text-amber-600 hover:bg-amber-50 w-full"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpiredLink; 