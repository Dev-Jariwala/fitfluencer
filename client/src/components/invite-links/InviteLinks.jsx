import { getInviteLinksHistory } from '@/services/userService';
import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Copy, Check } from 'lucide-react'
import { useRolesStore } from '@/store/commonStore';

const InviteLinks = () => {
    const roles = useRolesStore(state => state.roles);
    const [sorting, setSorting] = useState([]);
    const [copiedId, setCopiedId] = useState(null);

    const { data: inviteLinksHistory, isLoading: isLoadingInviteLinksHistory, error: errorInviteLinksHistory } = useQuery({
        queryKey: ['inviteLinksHistory'],
        queryFn: async () => {
            const res = await getInviteLinksHistory();
            return res.data;
        }
    });

    // Copy invite link to clipboard
    const copyToClipboard = (token, id) => {
        navigator.clipboard.writeText(`${window.location.origin}/register?token=${token}`);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Table columns definition
    const columns = [
        {
            accessorKey: 'sr_no',
            header: 'Sr No',
        },
        {
            accessorKey: 'token',
            header: 'Invite Link',
            cell: ({ row }) => {
                const token = row.original.token;
                const link = `${window.location.origin}/register?token=${token}`;
                const id = row.original.id;
                const shortenedToken = `${link.substring(0, 15)}...${link.substring(link.length - 10)}`;
                
                return (
                    <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs">{shortenedToken}</span>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => copyToClipboard(token, id)}
                            title="Copy invite link"
                        >
                            {copiedId === id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                );
            },
        },
        {
            accessorKey: 'is_consumed',
            header: 'Status',
            cell: ({ row }) => (
                <span className={`capitalize px-2 py-1 rounded-full text-xs ${
                    row.original.is_consumed 
                        ? 'bg-green-100 text-green-800' 
                        : row.original.expires_at && new Date(row.original.expires_at) < new Date()
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                }`}>
                    {row.original.is_consumed 
                        ? 'Used' 
                        : row.original.expires_at && new Date(row.original.expires_at) < new Date()
                            ? 'Expired'
                            : 'Active'}
                </span>
            ),
        },
        {
            accessorKey: 'created_at',
            header: 'Created',
            cell: ({ row }) => {
                const date = new Date(row.original.created_at);
                return format(date, 'dd MMM yyyy, hh:mm a');
            },
        },
        {
            accessorKey: 'expires_at',
            header: 'Expires',
            cell: ({ row }) => {
                const date = new Date(row.original.expires_at);
                return format(date, 'dd MMM yyyy, hh:mm a');
            },
        },
        {
            id: 'role',
            header: 'Role',
            cell: ({ row }) => {
                const roleId = row.original.additional_data?.roleId;
                return roleId 
                    ? roles?.find(role => role?.id === roleId)?.name
                    : "N/A";
            },
        },
        {
            accessorKey: 'additional_data',
            header: 'User Joined',
            cell: ({ row }) => {
                return row.original.is_consumed && row.original.additional_data?.children_id
                    ? <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`/user/${row.original.additional_data.children_id}`, '_blank')}
                      >
                        View User
                      </Button>
                    : row.original.is_consumed 
                        ? "Yes" 
                        : "No";
            },
        },
    ];

    // Table instance
    const table = useReactTable({
        data: inviteLinksHistory || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    useEffect(() => {
        if (errorInviteLinksHistory) {
            toast.error(`Error fetching invite links history: ${JSON.stringify(errorInviteLinksHistory)}`);
        }
    }, [errorInviteLinksHistory]);

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center px-5">
                <h2 className="text-2xl font-bold">Invite Links</h2>
            </div>

            {isLoadingInviteLinksHistory ? (
                <div className="h-48 flex items-center justify-center">
                    <p>Loading invite links history...</p>
                </div>
            ) : (
                <>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No invite links found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between space-x-2 py-4 px-5">
                        <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-700">
                                Page {table.getState().pagination.pageIndex + 1} of{' '}
                                {table.getPageCount()}
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default InviteLinks