import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { UserCheck, SparkleIcon } from 'lucide-react';
import { getUserById } from '@/services/userService';
import { useQuery } from '@tanstack/react-query';
import { useRolesStore } from '@/store/commonStore';

/**
 * Component to display inviter information at the top of registration form
 */
const InviterInfo = ({ inviter, inviteeRoleId }) => {
  const roles = useRolesStore(state => state.roles);

  // Get role name from role ID
  const getInviteeRoleName = () => {
    if (!roles || !inviteeRoleId) return 'User';
    const role = roles.find(r => r.id === inviteeRoleId);
    return role ? role.name : 'User';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-5 mb-8 border border-emerald-200 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full p-3 text-white shadow-md">
          <UserCheck size={24} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-emerald-800">
              You've been invited!
            </h3>
            <SparkleIcon size={18} className="text-yellow-500" />
          </div>
          <p className="text-emerald-700 mb-2">
            <span className="font-semibold">{inviter?.name}</span> 
            {inviter?.role ? ` (${inviter?.role})` : ''} has invited you to join FitFluencer.
          </p>
          <p className="text-sm bg-white bg-opacity-50 inline-block px-3 py-1 rounded-full font-medium text-emerald-700 border border-emerald-200">
            You're being invited to join as a{' '}
            <span className="font-bold">{getInviteeRoleName()}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default InviterInfo; 