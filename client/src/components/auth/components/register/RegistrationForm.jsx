import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import PersonalInfoStep from './steps/PersonalInfoStep';
import PhysicalStatsStep from './steps/PhysicalStatsStep';
import AddressStep from './steps/AddressStep';
import FormStepper from './FormStepper';
import FormNavigation from './FormNavigation';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '@/services/userService';
import AccountInfoStep from './steps/AccountInfoStep';
import InviterInfo from './InviterInfo';

// Form validation schema
const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email").optional(),
  gender: z.string().min(1, "Please select a gender"),
  dob: z.string().min(1, "Please select a date of birth")
    .refine((val) => {
      const birthDate = new Date(val);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 15;
    }, "You must be at least 15 years old to register"),
  height: z.string().min(1, "Please enter your height"),
  weight: z.string().min(1, "Please enter your weight"),
  fitnessGoal: z.string().min(1, "Please select a fitness goal"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const steps = [
  { id: 'account', title: 'Account Info' },
  { id: 'personal', title: 'Personal Info' },
  { id: 'physical', title: 'Physical Stats' },
  { id: 'address', title: 'Address' },
];

const RegistrationForm = ({ tokenData }) => {
  console.log("tokenData", tokenData);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationDirection, setAnimationDirection] = useState('forward');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      phone: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      email: "",
      gender: "",
      dob: "",
      height: "",
      weight: "",
      fitnessGoal: "",
      address: "",
      city: "",
      state: "",
    },
    mode: "onChange"
  });

  const { formState } = form;
  const { errors, isSubmitting, isValid } = formState;

  const goToNextStep = async () => {
    // Get fields for current step to validate
    const fieldsToValidate = {
      0: ["username", "phone", "password", "confirmPassword"],
      1: ["firstName", "lastName", "email", "gender", "dob"],
      2: ["height", "weight", "fitnessGoal"],
      3: ["address", "city", "state"]
    }[currentStep];

    // Trigger validation for only the fields in the current step
    const result = await form.trigger(fieldsToValidate);

    if (result) {
      setAnimationDirection('forward');
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    } else {
      // Show error toast if validation fails
      toast.error("Please fix the errors before proceeding");
    }
  };

  const goToPrevStep = () => {
    setAnimationDirection('backward');
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const registerUserMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (res) => {
      const successMessage = res.data.message || 'Registration successful!';
      toast.success(successMessage);
      setTimeout(() => window.location.href = '/plans', 1500);
    },
    onError: (error) => {
      toast.error(`Error registering: ${JSON.stringify(error)}`);
    }
  })

  const onSubmit = (data) => {
    registerUserMutation.mutate({ ...data, token: tokenData.token });
  };

  // Determine if current step is complete
  const isStepComplete = (stepIndex) => {
    const fieldsToValidate = {
      0: ["username", "phone", "password", "confirmPassword"],
      1: ["firstName", "lastName", "email", "gender", "dob"],
      2: ["height", "weight", "fitnessGoal"],
      3: ["address", "city", "state"]
    }[stepIndex];

    return fieldsToValidate.every(field => !errors[field] && form.getValues(field));
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <AccountInfoStep form={form} animationDirection={animationDirection} />;
      case 1:
        return <PersonalInfoStep form={form} animationDirection={animationDirection} />;
      case 2:
        return <PhysicalStatsStep form={form} animationDirection={animationDirection} />;
      case 3:
        return <AddressStep form={form} animationDirection={animationDirection} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-emerald-100">
      {/* Progress stepper */}
      <div className="bg-emerald-50 p-5 border-b border-emerald-100">
        <FormStepper
          steps={steps}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          isStepComplete={isStepComplete}
        />
      </div>

      <div className="p-6 md:p-8">
        {/* Inviter Info Section */}
        {tokenData && tokenData.created_by && tokenData.additional_data && (
          <InviterInfo 
            inviter={tokenData.inviter} 
            inviteeRoleId={tokenData.additional_data.roleId} 
          />
        )}
        
        <h2 className="text-2xl font-bold text-emerald-700 mb-6">Create Your Account</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderStep()}

            <div className="pt-6 space-y-4">
              <Separator className="bg-emerald-100" />
              <FormNavigation
                currentStep={currentStep}
                stepsLength={steps.length}
                goToPrevStep={goToPrevStep}
                goToNextStep={goToNextStep}
                isSubmitting={isSubmitting}
                isValid={isValid}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegistrationForm; 