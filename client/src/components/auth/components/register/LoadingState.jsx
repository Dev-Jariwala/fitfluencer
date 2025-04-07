import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
      <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mb-4" />
      <h2 className="text-xl font-semibold text-emerald-700">Verifying invitation link...</h2>
      <p className="text-gray-500 mt-2 text-center">
        Please wait while we verify your invitation link
      </p>
    </div>
  );
};

export default LoadingState; 