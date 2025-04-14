import { CheckCircle, XCircle, Clock, UserPlus, Mail, User } from 'lucide-react'

export const INVITE_STATUS = {
    active: {
        label: 'Active',
        color: 'bg-blue-100 text-blue-800',
        icon: UserPlus
    },
    used: {
        label: 'Used',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle
    },
    expired: {
        label: 'Expired',
        color: 'bg-red-100 text-red-800',
        icon: XCircle
    },
}

export const ROLE_COLORS = {
    'admin': 'bg-purple-100 text-purple-800',
    'trainer': 'bg-indigo-100 text-indigo-800',
    'client': 'bg-cyan-100 text-cyan-800',
    'default': 'bg-gray-100 text-gray-800'
} 