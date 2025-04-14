import { CircleCheckBig, CircleX, Clock, CreditCard } from "lucide-react";
import { IoWalletOutline } from "react-icons/io5";
import { BsBank2 } from "react-icons/bs";
import { GiJupiter } from "react-icons/gi";

export const PAYMENT_STATUS = {
    created: {
        label: 'Pending',
        color: 'bg-blue-100 text-blue-800',
        icon: Clock
    },
    captured: {
        label: 'Success',
        color: 'bg-green-100 text-green-800',
        icon: CircleCheckBig
    },
    failed: {
        label: 'Failed',
        color: 'bg-red-100 text-red-800',
        icon: CircleX
    },
};

export const PAYMENT_METHOD = {
    card: {
        label: 'Card',
        color: 'bg-blue-100 text-blue-800',
        icon: CreditCard
    },
    upi: {
        label: 'UPI',
        color: 'bg-green-100 text-green-800',
        icon: GiJupiter
    },
    netbanking: {
        label: 'Net Banking',
        color: 'bg-purple-100 text-purple-800',
        icon: BsBank2
    },
    wallet: {
        label: 'Wallet',
        color: 'bg-yellow-100 text-yellow-800',
        icon: IoWalletOutline
    },
    na: {
        label: 'N/A',
        color: 'bg-gray-100 text-gray-800',
        icon: CircleX
    }
};

