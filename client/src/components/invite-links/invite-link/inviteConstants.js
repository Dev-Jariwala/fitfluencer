/**
 * Constants for the invite link cards configuration
 */

import { User } from "lucide-react";

export const CLIENT_CARD_CONFIG = {
  title: 'Client',
  subtitle: 'For health seekers & trainees',
  description: 'Generate a personalized link for clients to join your platform with pre-filled credentials and instant access.',
  iconBgClass: 'bg-blue-100 dark:bg-blue-900/30',
  iconTextClass: 'text-blue-600 dark:text-blue-400',
  cardAccentClass: 'bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-transparent',
  linkLabelClass: 'text-blue-700 dark:text-blue-300',
  linkBgClass: 'bg-gradient-to-r from-blue-500/10 to-blue-600/5 dark:from-blue-900/20 dark:to-blue-800/10',
  imageSrc: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  features: ['Health tracking & monitoring', 'Nutrition meal plans'],
  buttonColor: 'bg-blue-600',
  buttonHoverColor: 'bg-blue-700',
  roleKey: 'client',
  ringColor: 'ring-blue-500',
  linkType: 'blue',
  cardType: 'client',
  icon: "sadf",
};

export const DIETITIAN_CARD_CONFIG = {
  title: 'Dietitian',
  subtitle: 'For nutrition experts',
  description: 'Generate a personalized link for dietitians to join your platform with professional access and tools.',
  iconBgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
  iconTextClass: 'text-emerald-600 dark:text-emerald-400',
  cardAccentClass: 'bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/20 dark:to-transparent',
  linkLabelClass: 'text-emerald-700 dark:text-emerald-300',
  linkBgClass: 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 dark:from-emerald-900/20 dark:to-emerald-800/10',
  imageSrc: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  features: ['Nutrition counseling', 'Diet plan creation'],
  buttonColor: 'bg-emerald-600',
  buttonHoverColor: 'bg-emerald-700',
  roleKey: 'dietitian',
  ringColor: 'ring-emerald-500',
  linkType: 'emerald',
  cardType: 'dietitian',
  icon: "sdf",
}; 