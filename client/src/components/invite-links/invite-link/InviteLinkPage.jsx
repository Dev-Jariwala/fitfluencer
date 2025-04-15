import { getCanInviteDietitian } from '@/services/clientPaymentsService'
import { generateInviteLink } from '@/services/userService';
import { useAuthStore, useRolesStore } from '@/store/commonStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

import InviteCard from './InviteCard';
import { CLIENT_CARD_CONFIG, DIETITIAN_CARD_CONFIG } from './inviteConstants';
import { shortenLink, copyToClipboard, openLink, shareLink } from './inviteUtils';

/**
 * InviteLinkPage component for generating invitation links for clients and dietitians
 */
const InviteLinkPage = () => {
    // Auth and roles store data
    const user = useAuthStore(state => state.data);
    const roles = useRolesStore(state => state.roles);

    // UI State
    const [clientLink, setClientLink] = useState('');
    const [dietitianLink, setDietitianLink] = useState('');
    const [activeCard, setActiveCard] = useState(null);
    const [copyAnimation, setCopyAnimation] = useState(null);

    // Permission checks
    const canInviteClient = ['admin', 'dietitian'].includes(user?.role?.key);
    
    // Fetch whether the user can invite dietitians
    const { 
        data: canInviteDietitian, 
        error: errorCanInviteDietitian 
    } = useQuery({
        queryKey: ['canInviteDietitian'],
        queryFn: async () => {
            const data = await getCanInviteDietitian();
            return data?.data?.canInviteDietitian;
        },
        enabled: canInviteClient
    });

    // Generate invite link mutation
    const generateInviteLinkMutation = useMutation({
        mutationFn: generateInviteLink,
        onSuccess: (data) => {
            const successMessage = data?.message || 'Invite link generated successfully';
            toast.success(successMessage);
            
            // Update the appropriate link based on active card
            if (activeCard === 'client') {
                setClientLink(data?.inviteLink || '');
            } else if (activeCard === 'dietitian') {
                setDietitianLink(data?.inviteLink || '');
            }
        },
        onError: (error) => {
            toast.error(`Error generating invite link: ${JSON.stringify(error)}`);
        }
    });

    /**
     * Handle generating an invite link for a specific role
     * @param {string} roleKey - The key of the role to generate a link for
     */
    const handleGenerateInviteLink = (roleKey) => {
        const role = roles.find(role => role.key === roleKey);
        if (!role) {
            toast.error('Role not found');
            return;
        }
        
        setActiveCard(roleKey);
        generateInviteLinkMutation.mutate({ roleId: role.id });
    };

    /**
     * Handle copying a link to clipboard
     * @param {string} link - The link to copy
     * @param {string} type - The type of link (client/dietitian)
     */
    const handleCopyLink = (link, type) => {
        copyToClipboard(link, type, setCopyAnimation, (message, type) => {
            if (type === 'success') {
                toast.success(message);
            } else {
                toast.error(message);
            }
        });
    };

    /**
     * Handle sharing a link
     * @param {string} link - The link to share
     * @param {string} title - The title for the share
     */
    const handleShareLink = (link, title) => {
        shareLink(
            link, 
            title, 
            user?.name,
            (message, type) => {
                if (type === 'success') {
                    toast.success(message);
                } else {
                    toast.error(message);
                }
            },
            () => handleCopyLink(link, title.toLowerCase())
        );
    };

    // Error handling
    useEffect(() => {
        if (errorCanInviteDietitian) {
            toast.error(`Error fetching can invite dietitian: ${JSON.stringify(errorCanInviteDietitian)}`);
        }
    }, [errorCanInviteDietitian]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-background py-10 px-4"
        >
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="inline-block mb-4"
                    >
                        <span className="relative inline-flex">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 blur-xl opacity-30 rounded-full"></div>
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ ease: "linear", duration: 10, repeat: Infinity }}
                                className="relative"
                            >
                                <Sparkles size={40} className="text-emerald-500" />
                            </motion.div>
                        </span>
                    </motion.div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-6">
                        Invite Team Members
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Create personalized invitation links for clients and dietitians to join your fitness platform
                    </p>
                </motion.div>

                {/* Cards container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 px-4">
                    {/* Client Card */}
                    {canInviteClient && (
                        <InviteCard
                            {...CLIENT_CARD_CONFIG}
                            link={clientLink}
                            isGenerating={generateInviteLinkMutation.isPending}
                            activeCard={activeCard}
                            copyAnimation={copyAnimation}
                            onGenerateLink={() => handleGenerateInviteLink('client')}
                            onCopyLink={handleCopyLink}
                            onShareLink={handleShareLink}
                            onOpenLink={openLink}
                            shortenLink={shortenLink}
                        />
                    )}

                    {/* Dietitian Card */}
                    {canInviteDietitian && (
                        <InviteCard
                            {...DIETITIAN_CARD_CONFIG}
                            link={dietitianLink}
                            isGenerating={generateInviteLinkMutation.isPending}
                            activeCard={activeCard}
                            copyAnimation={copyAnimation}
                            onGenerateLink={() => handleGenerateInviteLink('dietitian')}
                            onCopyLink={handleCopyLink}
                            onShareLink={handleShareLink}
                            onOpenLink={openLink}
                            shortenLink={shortenLink}
                        />
                    )}
                </div>
                
                {/* Footer */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-12 text-sm text-slate-500 dark:text-slate-400"
                >
                    <p>Links are personalized with your account information and expire in 7 days</p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default InviteLinkPage;