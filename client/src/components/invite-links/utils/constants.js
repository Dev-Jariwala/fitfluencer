import { CheckCircle, XCircle, Clock, UserPlus, Mail, User } from 'lucide-react'

export const INVITE_STATUS = {
    active: {
        label: 'Active',
        color: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-100',
        icon: UserPlus
    },
    used: {
        label: 'Used',
        color: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-100',
        icon: CheckCircle
    },
    expired: {
        label: 'Expired',
        color: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-100',
        icon: XCircle
    },
}

export const ROLE_COLORS = {
    'admin': 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-100',
    'dietitian': 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-100',
    'client': 'bg-fuchsia-100 dark:bg-fuchsia-900/50 text-fuchsia-800 dark:text-fuchsia-100',
    'default': 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-100'
} 