import React from 'react';
import { AlertTriangle, ArrowLeft, Home, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

const InvalidLink = ({ message = "Invalid invitation link" }) => {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className=" bg-gradient-to-b from-white to-red-50 dark:from-slate-950 dark:to-slate-900 py-12 flex items-center justify-center"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border-t-4 border-red-500"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  delay: 0.5
                }}
                className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
              >
                <AlertTriangle size={48} className="text-red-500" />
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
                {message}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mb-8">
                The invitation link you're trying to use is invalid or has expired.
                Please contact the person who sent you this link for a new invitation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/"
                    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-medium transition-colors w-full"
                  >
                    <Home size={18} />
                    Return Home
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white py-3 px-6 rounded-lg font-medium transition-colors w-full"
                  >
                    <ArrowLeft size={18} />
                    Back to Login
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default InvalidLink; 