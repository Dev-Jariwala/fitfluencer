import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FormNavigation = ({ 
  currentStep, 
  stepsLength, 
  goToPrevStep, 
  goToNextStep, 
  isSubmitting, 
  isValid 
}) => {
  return (
    <div className="flex justify-between">
      {currentStep > 0 && (
        <Button
          type="button"
          variant="outline"
          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          onClick={goToPrevStep}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
      )}

      <div className="ml-auto">
        {currentStep < stepsLength - 1 ? (
          <Button
            type="button"
            onClick={goToNextStep}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <div className="transition-transform hover:scale-[1.03] active:scale-[0.97]">
            <Button
              type="submit"
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? "Registering..." : "Complete Registration"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormNavigation; 