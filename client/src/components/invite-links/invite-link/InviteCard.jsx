import React from 'react';
import { motion } from 'motion/react';
import { Copy, Share2, ExternalLink, UserPlus, Link as LinkIcon, CheckCircle } from 'lucide-react';

/**
 * Reusable invite card component for different user types
 */
const InviteCard = ({ title, subtitle, description, icon, iconBgClass, iconTextClass, cardAccentClass, linkLabelClass, linkBgClass, imageSrc, features, link, linkType, isGenerating, activeCard, copyAnimation, onGenerateLink, onCopyLink, onShareLink, onOpenLink, shortenLink, buttonColor, buttonHoverColor, cardType, ringColor, }) => {
    const cardVariants = {
        hover: {
            scale: 1.03,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transition: { type: "spring", stiffness: 300, damping: 15 }
        },
        tap: {
            scale: 0.98,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            transition: { type: "spring", stiffness: 500, damping: 20 }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: cardType === 'client' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: cardType === 'client' ? 0.2 : 0.3 }}
            whileHover="hover"
            whileTap="tap"
            variants={cardVariants}
            className={`bg-background rounded-2xl overflow-hidden shadow-lg relative ${activeCard === cardType ? `ring-2 ${ringColor}` : ''}`}
        >
            <div className={`absolute inset-0 ${cardAccentClass} opacity-60`}></div>

            <div className="relative p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className={`h-12 w-12 rounded-xl ${iconBgClass} flex items-center justify-center mr-4`}>
                            {icon}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h3>
                            <p className="text-slate-500 dark:text-slate-400">{subtitle}</p>
                        </div>
                    </div>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.3 }}
                        className={`h-8 w-8 rounded-full ${link ? 'bg-green-500' : buttonColor} flex items-center justify-center`}
                    >
                        {link ? (
                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <UserPlus className="h-4 w-4 text-white" />
                        )}
                    </motion.div>
                </div>

                <div className="mb-8">
                    <div className="relative h-40 rounded-xl bg-blue-50 dark:bg-slate-900/50 overflow-hidden mb-6">
                        <motion.img
                            src={imageSrc}
                            alt={title}
                            className="w-full h-full object-cover object-center"
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 text-white">
                            <p className="text-sm font-semibold">Perfect for:</p>
                            {features.map((feature, index) => (
                                <p key={index} className="text-xs opacity-90">• {feature}</p>
                            ))}
                        </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                        {description}
                    </p>

                    {link ? (
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative"
                            >
                                <div className={`absolute -left-2 -top-2 h-8 w-8 ${iconBgClass} rounded-full flex items-center justify-center`}>
                                    <LinkIcon className={`h-4 w-4 ${iconTextClass}`} />
                                </div>

                                <div className={`pt-5 pb-3 px-5 ${linkBgClass} backdrop-blur-sm rounded-xl border border-${linkType}-200 dark:border-${linkType}-800/30 shadow-sm`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center">
                                            <span className={`px-2 py-1 ${iconBgClass} ${linkLabelClass} text-xs rounded-md font-medium`}>{title} Link</span>
                                        </div>
                                        <motion.div
                                            animate={copyAnimation === cardType ? { scale: [1, 1.2, 1] } : {}}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {copyAnimation === cardType ? (
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            ) : null}
                                        </motion.div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-stretch gap-3">
                                        <div className="group relative flex-grow">
                                            <div className={`absolute inset-0 bg-${linkType}-50 dark:bg-slate-700/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                                            <div className="text-sm text-slate-600 dark:text-slate-300 font-mono px-3 py-2 bg-white/70 dark:bg-slate-800/70 rounded-lg truncate relative">
                                                {shortenLink(link)}
                                                <div className="absolute inset-y-0 right-2 flex items-center">
                                                    <div className={`text-xs ${linkLabelClass} bg-${linkType}-50 dark:bg-${linkType}-900/30 px-1.5 py-0.5 rounded hidden group-hover:block`}>Click to copy</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-1">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => onCopyLink(link, cardType)}
                                                className={`${buttonColor} text-white p-2 rounded-lg hover:${buttonHoverColor} flex-1 sm:flex-initial flex items-center justify-center`}
                                                aria-label="Copy link"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => onShareLink(link, title)}
                                                className={`bg-${linkType}-500 text-white p-2 rounded-lg hover:bg-${linkType}-600 flex-1 sm:flex-initial flex items-center justify-center`}
                                                aria-label="Share link"
                                            >
                                                <Share2 className="h-4 w-4" />
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => onOpenLink(link)}
                                                className="bg-slate-700 text-white p-2 rounded-lg hover:bg-slate-800 flex-1 sm:flex-initial flex items-center justify-center"
                                                aria-label="Open link"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onGenerateLink}
                            disabled={isGenerating && activeCard === cardType}
                            className={`w-full ${isGenerating && activeCard === cardType ? `bg-${linkType}-400` : `${buttonColor} hover:${buttonHoverColor}`} text-white py-3 px-4 rounded-xl shadow-lg transition-colors font-medium flex items-center justify-center`}
                        >
                            {isGenerating && activeCard === cardType ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-5 w-5 mr-2" />
                                    Generate {title} Link
                                </>
                            )}
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default InviteCard; 