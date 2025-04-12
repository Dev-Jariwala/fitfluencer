import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { verifyInviteLink } from '@/services/userService';
import LoadingState from './LoadingState';
import InvalidLink from './InvalidLink';
import ExpiredLink from './ExpiredLink';
import RegistrationForm from './RegistrationForm';

const TokenVerification = ({ token }) => {
  // Query to verify the invite link
  const { 
    data: verificationData, 
    isLoading, 
    isError,
    error
  } = useQuery({
    queryKey: ['verifyInviteLink', token],
    queryFn: async () => {
      const res = await verifyInviteLink({ token });
      return res.data;
    },
    enabled: !!token
  });

  // Handle different states
  if (!token) {
    return <InvalidLink message="No invitation token found" />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (!verificationData?.isVerified || isError) {
    return <InvalidLink message={error?.response?.data?.message || "Invalid invitation link"} />;
  }

  // Pass the verified token data to the registration form
  return <RegistrationForm tokenData={verificationData?.data} />;
};

export default TokenVerification; 