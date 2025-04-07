import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import TokenVerification from './components/register/TokenVerification';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-emerald-700">
          Create Your FitFluencer Profile
        </h1>
        <p className="text-gray-500 mt-2">
          Join our community of fitness enthusiasts and begin your transformation journey
        </p>
      </motion.div>

      <TokenVerification token={token} />
    </div>
  );
};

export default RegisterPage;
