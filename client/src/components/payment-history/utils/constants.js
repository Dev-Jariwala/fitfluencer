import { CircleCheckBig, CircleX, Clock, CreditCard } from "lucide-react";
import { IoWalletOutline } from "react-icons/io5";
import { BsBank2 } from "react-icons/bs";
import { GiJupiter } from "react-icons/gi";

export const PAYMENT_STATUS = {
    created: {
        label: 'Pending',
        color: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-100',
        icon: Clock
    },
    captured: {
        label: 'Success',
        color: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-100',
        icon: CircleCheckBig
    },
    failed: {
        label: 'Failed',
        color: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-100',
        icon: CircleX
    },
};

export const PAYMENT_METHOD = {
    card: {
        label: 'Card',
        color: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-100',
        icon: CreditCard
    },
    upi: {
        label: 'UPI',
        color: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-100',
        icon: GiJupiter
    },
    netbanking: {
        label: 'Net Banking',
        color: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-100',
        icon: BsBank2
    },
    wallet: {
        label: 'Wallet',
        color: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-100',
        icon: IoWalletOutline
    },
    na: {
        label: 'N/A',
        color: 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-100',
        icon: CircleX
    }
};

