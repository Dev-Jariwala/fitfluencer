import { getInviteLinksHistory } from '@/services/userService';
import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { format, subMonths } from 'date-fns'
import { Copy, Check, Download, ArrowUpDown, Plus, Link2, RefreshCw } from 'lucide-react'
import { useRolesStore } from '@/store/commonStore';
import { INVITE_STATUS, ROLE_COLORS } from '../utils/constants';
import InviteSummary from './InviteSummary';
import InviteFilters from './InviteFilters';

const InviteLinksTable = () => {
    const roles = useRolesStore(state => state.roles);
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [copiedId, setCopiedId] = useState(null);

    const { data: inviteLinksHistory, isLoading: isLoadingInviteLinksHistory, error: errorInviteLinksHistory, refetch } = useQuery({
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
        toast.success('Invite link copied to clipboard');
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Filter invites based on date range
    const getFilteredInvitesByDate = () => {
        if (!inviteLinksHistory) return [];
        if (dateFilter === 'all') return inviteLinksHistory;

        const today = new Date();
        let filterDate;

        switch (dateFilter) {
            case 'last30':
                filterDate = subMonths(today, 1);
                break;
            case 'last90':
                filterDate = subMonths(today, 3);
                break;
            case 'last180':
                filterDate = subMonths(today, 6);
                break;
            default:
                return inviteLinksHistory;
        }

        return inviteLinksHistory.filter(invite => new Date(invite.created_at) >= filterDate);
    };

    // Handle CSV export
    const exportToCSV = () => {
        if (!inviteLinksHistory || inviteLinksHistory.length === 0) {
            toast.error('No invite data to export');
            return;
        }

        // Format data for CSV
        const headers = ['Sr No', 'Created', 'Expires', 'Token', 'Status', 'Role', 'User Joined'];

        const csvData = inviteLinksHistory.map((invite, index) => {
            const created = format(new Date(invite.created_at), 'dd MMM yyyy, hh:mm a');
            const expires = format(new Date(invite.expires_at), 'dd MMM yyyy, hh:mm a');
            const token = invite.token;

            const now = new Date();
            const status = invite.is_consumed
                ? 'Used'
                : new Date(invite.expires_at) < now
                    ? 'Expired'
                    : 'Active';

            const roleId = invite.additional_data?.roleId;
            const roleName = roleId
                ? roles?.find(role => role?.id === roleId)?.name || 'N/A'
                : 'N/A';

            const userJoined = invite.is_consumed ? 'Yes' : 'No';

            return [index + 1, created, expires, token, status, roleName, userJoined];
        });

        // Create CSV content
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `invite_links_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Invite links exported successfully');
    };

    // Table columns definition
    const columns = [
        {
            accessorKey: 'sr_no',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        No.
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: 'token',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Invite Link
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const token = row.original.token;
                const link = `${window.location.origin}/register?token=${token}`;
                const id = row.original.id;
                const shortenedToken = `${link.substring(0, 15)}...${link.substring(link.length - 10)}`;

                return (
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">{shortenedToken}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => copyToClipboard(token, id)}
                            title="Copy invite link"
                        >
                            {copiedId === id ?
                                <Check className="h-4 w-4 text-green-500" /> :
                                <Copy className="h-4 w-4" />
                            }
                        </Button>
                    </div>
                );
            },
        },
        {
            accessorKey: 'status',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
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
                    <div className={`${status.color} px-2 py-1 rounded-md flex items-center gap-2 text-xs max-w-fit`}>
                        <status.icon size={12} />
                        {status.label}
                    </div>
                )
            },
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Created
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const date = new Date(row.original.created_at);
                return format(date, 'dd MMM yyyy, hh:mm a');
            },
        },
        {
            accessorKey: 'expires_at',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Expires
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const date = new Date(row.original.expires_at);
                return format(date, 'dd MMM yyyy, hh:mm a');
            },
        },
        {
            id: 'role',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Role
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const roleId = row.original.additional_data?.roleId;
                if (!roleId) return "N/A";

                const role = roles?.find(role => role?.id === roleId);
                if (!role) return "N/A";

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
                return row.original.is_consumed && row.original.additional_data?.children_id
                    ? (
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => window.open(`/user/${row.original.additional_data.children_id}`, '_blank')}
                        >
                            <Check className="h-3 w-3" />
                            View User
                        </Button>
                    )
                    : row.original.is_consumed
                        ? <span className="text-green-600 text-xs">Registered</span>
                        : <span className="text-gray-400 text-xs">Not registered</span>;
            },
        }
    ];

    // Apply filters to data
    const filteredData = React.useMemo(() => {
        let filtered = getFilteredInvitesByDate();

        if (statusFilter !== 'all') {
            const now = new Date();

            filtered = filtered.filter(invite => {
                if (statusFilter === 'used') {
                    return invite.is_consumed;
                } else if (statusFilter === 'expired') {
                    return !invite.is_consumed && new Date(invite.expires_at) < now;
                } else if (statusFilter === 'active') {
                    return !invite.is_consumed && new Date(invite.expires_at) >= now;
                }
                return true;
            });
        }

        if (roleFilter !== 'all') {
            filtered = filtered.filter(invite => {
                return invite.additional_data?.roleId === roleFilter;
            });
        }

        return filtered.map((item) => ({
            ...item
        }));
    }, [inviteLinksHistory, statusFilter, dateFilter, roleFilter]);

    // Table instance
    const table = useReactTable({
        data: filteredData || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            const value = row.getValue(columnId);
            if (value === undefined || value === null) return false;
            return String(value).toLowerCase().includes(filterValue.toLowerCase());
        },
        state: {
            sorting,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    useEffect(() => {
        if (errorInviteLinksHistory) {
            toast.error(`Error fetching invite links: ${JSON.stringify(errorInviteLinksHistory)}`);
        }
    }, [errorInviteLinksHistory]);

    return (
        <>
            {/* Invite Statistics */}
            <InviteSummary inviteLinksHistory={inviteLinksHistory} />

            {/* Filters and Export Section */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center border p-4 rounded-lg bg-card shadow-sm">
                <InviteFilters
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                    roleFilter={roleFilter}
                    setRoleFilter={setRoleFilter}
                    roles={roles}
                />

                <Button
                    variant="secondary-outline"
                    size="sm"
                    onClick={exportToCSV}
                    disabled={!inviteLinksHistory || inviteLinksHistory.length === 0}
                    className="flex items-center gap-2 w-full lg:w-auto"
                >
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            {isLoadingInviteLinksHistory ? (
                <div className="h-48 flex items-center justify-center bg-card rounded-lg border shadow-sm">
                    <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary border-r-2"></div>
                        <p className="text-sm text-muted-foreground">Loading invite links...</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="rounded-lg border shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id} className="hover:bg-muted/60">
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id} className="font-medium">
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
                                    table.getRowModel().rows.map((row, index) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                            className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
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
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                <p>No invite links found.</p>
                                                <p className="text-sm">Try adjusting your filters or create new invites.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Enhanced Pagination UI */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 bg-card rounded-lg border p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>
                                Showing <span className="font-medium">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to{" "}
                                <span className="font-medium">
                                    {Math.min(
                                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                        filteredData?.length || 0
                                    )}
                                </span>{" "}
                                of <span className="font-medium">{filteredData?.length || 0}</span> entries
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                                className="h-8 w-8"
                            >
                                <span className="sr-only">Go to first page</span>
                                <span className="text-xs">«</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="h-8 w-8"
                            >
                                <span className="sr-only">Go to previous page</span>
                                <span className="text-xs">‹</span>
                            </Button>

                            {/* Page numbers */}
                            <div className="flex items-center gap-1 mx-2">
                                {Array.from(
                                    { length: Math.min(5, table.getPageCount()) },
                                    (_, i) => {
                                        let pageIndex = i;
                                        if (table.getPageCount() > 5) {
                                            const currentPage = table.getState().pagination.pageIndex;
                                            if (currentPage > 1 && currentPage < table.getPageCount() - 2) {
                                                pageIndex = currentPage + i - 2;
                                            } else if (currentPage >= table.getPageCount() - 2) {
                                                pageIndex = table.getPageCount() - 5 + i;
                                            }
                                        }
                                        return (
                                            pageIndex < table.getPageCount() && (
                                                <Button
                                                    key={pageIndex}
                                                    variant={table.getState().pagination.pageIndex === pageIndex ? "default" : "outline"}
                                                    size="icon"
                                                    onClick={() => table.setPageIndex(pageIndex)}
                                                    className="h-8 w-8"
                                                >
                                                    <span>{pageIndex + 1}</span>
                                                </Button>
                                            )
                                        );
                                    }
                                )}
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="h-8 w-8"
                            >
                                <span className="sr-only">Go to next page</span>
                                <span className="text-xs">›</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                                className="h-8 w-8"
                            >
                                <span className="sr-only">Go to last page</span>
                                <span className="text-xs">»</span>
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default InviteLinksTable;