import React from 'react';
import { format } from 'date-fns';
import { ArrowUpDown, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { INVITE_STATUS, ROLE_COLORS } from './constants';

export const createInviteColumns = ({ roles, copyToClipboard, copiedId }) => [
    {
        accessorKey: 'sr_no',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="font-medium"
            >
                No.
                <ArrowUpDown className="ml-2 h-3 w-3" />
            </Button>
        ),
    },
    {
        accessorKey: 'token',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="font-medium"
            >
                Invite Link
                <ArrowUpDown className="ml-2 h-3 w-3" />
            </Button>
        ),
        cell: ({ row }) => {
            const token = row.original.token;
            const link = `${window.location.origin}/register?token=${token}`;
            const id = row.original.id;
            const shortenedToken = `${link.substring(0, 15)}...${link.substring(link.length - 10)}`;

            return (
                <div className="flex items-center gap-2">
                    <span className="font-mono text-xs truncate max-w-[200px]" title={link}>{shortenedToken}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-primary/10 transition-colors"
                        onClick={() => copyToClipboard(token, id)}
                        title="Copy invite link"
                    >
                        {copiedId === id ?
                            <Check className="h-3.5 w-3.5 text-green-500" /> :
                            <Copy className="h-3.5 w-3.5" />
                        }
                    </Button>
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="font-medium"
            >
                Status
                <ArrowUpDown className="ml-2 h-3 w-3" />
            </Button>
        ),
        cell: ({ row }) => {
            const now = new Date();
            let statusKey = 'active';

            if (row.original.is_consumed) {
                statusKey = 'used';
            } else if (new Date(row.original.expires_at) < now) {
                statusKey = 'expired';
            }

            const status = INVITE_STATUS[statusKey];

            return (
                <div className={`${status.color} px-2 py-1 rounded-md flex items-center gap-1 text-xs max-w-fit`}>
                    <status.icon size={10} />
                    {status.label}
                </div>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="font-medium"
            >
                Created
                <ArrowUpDown className="ml-2 h-3 w-3" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return <span className="text-sm">{format(date, 'dd MMM yyyy, hh:mm a')}</span>;
        },
    },
    {
        accessorKey: 'expires_at',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="font-medium"
            >
                Expires
                <ArrowUpDown className="ml-2 h-3 w-3" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = new Date(row.original.expires_at);
            return <span className="text-sm">{format(date, 'dd MMM yyyy, hh:mm a')}</span>;
        },
    },
    {
        id: 'role',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="font-medium"
            >
                Role
                <ArrowUpDown className="ml-2 h-3 w-3" />
            </Button>
        ),
        cell: ({ row }) => {
            const roleId = row.original.additional_data?.roleId;
            if (!roleId) return <span className="text-muted-foreground text-xs">N/A</span>;

            const role = roles?.find(role => role?.id === roleId);
            if (!role) return <span className="text-muted-foreground text-xs">N/A</span>;

            const roleName = role.name.toLowerCase();
            const colorClass = ROLE_COLORS[roleName] || ROLE_COLORS.default;

            return (
                <div className={`${colorClass} px-2 py-1 rounded-md text-xs max-w-fit`}>
                    {role.name}
                </div>
            );
        },
    },
    {
        accessorKey: 'user',
        header: 'User',
        cell: ({ row }) => {
            const hasJoinedUser = row.original.is_consumed && row.original.additional_data?.children_id;
            const isRegistered = row.original.is_consumed;
            
            return hasJoinedUser ? (
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 h-7 text-xs hover:bg-primary/10"
                    onClick={() => window.open(`/user/${row.original.additional_data.children_id}`, '_blank')}
                >
                    <Check className="h-3 w-3" />
                    View User
                </Button>
            ) : isRegistered ? (
                <span className="text-green-600 text-xs">Registered</span>
            ) : (
                <span className="text-gray-400 text-xs">Not registered</span>
            );
        },
    }
]; 