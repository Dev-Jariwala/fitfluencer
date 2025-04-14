import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPaymentHistory } from '@/services/clientPaymentsService'
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import { format, subMonths } from 'date-fns'
import { usePlansStore } from '@/store/commonStore'
import FormatPrice from '../common/FormatPrice'
import { PAYMENT_METHOD, PAYMENT_STATUS } from './utils/constants'
import { Download, ArrowUpDown } from 'lucide-react'
import PaymentSummary from './components/PaymentSummary'
import PaymentFilters from './components/PaymentFilters'

const PaymentHistory = () => {
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const plans = usePlansStore(state => state.plans);

    const { data: paymentHistory, isLoading: isLoadingPaymentHistory, error: errorPaymentHistory } = useQuery({
        queryKey: ['paymentHistory'],
        queryFn: async () => {
            const res = await getPaymentHistory();
            return res.data;
        }
    });


    
    // Filter payment history based on date range
    const getFilteredPaymentsByDate = () => {
        if (!paymentHistory) return [];
        if (dateFilter === 'all') return paymentHistory;
        
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
                return paymentHistory;
        }
        
        return paymentHistory.filter(payment => new Date(payment.created_at) >= filterDate);
    };
    
    // Handle CSV export
    const exportToCSV = () => {
        if (!paymentHistory || paymentHistory.length === 0) {
            toast.error('No payment data to export');
            return;
        }
        
        // Format data for CSV
        const headers = ['Date', 'Payment ID', 'Plan', 'Amount', 'Status', 'Payment Method'];
        const csvData = paymentHistory.map(payment => {
            const date = format(new Date(payment.created_at), 'dd MMM yyyy, hh:mm a');
            const plan = plans.find(p => p.id === payment.plan_id);
            const planName = plan ? plan.name : 'N/A';
            const status = PAYMENT_STATUS[payment.status]?.label || 'N/A';
            const method = PAYMENT_METHOD[payment.payment_method ?? 'na']?.label || 'N/A';
            
            return [date, payment.payment_id || 'N/A', planName, payment.amount, status, method];
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
        link.setAttribute('download', `payment_history_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Payment history exported successfully');
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
            accessorKey: 'created_at',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Date
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
            accessorKey: 'payment_id',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Payment ID
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => row.original.payment_id || 'N/A',
        },
        {
            accessorKey: 'plan_id',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Plan
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const plan = plans.find(plan => plan.id === row.original.plan_id);
                return plan ? plan.name : 'N/A';
            },
        },
        {
            accessorKey: 'amount',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Amount
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const amount = parseFloat(row.original.amount);
                const currency = row.original.currency;
                return <FormatPrice price={amount} showRupee={currency === 'INR'} />
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
                const status = PAYMENT_STATUS[row.original.status];
                return (
                    <div className={`${status.color} px-2 py-1 rounded-md flex items-center gap-2 text-xs max-w-fit`}>
                        <status.icon size={12} />
                        {status.label}
                    </div>
                )
            },
        },
        {
            accessorKey: 'payment_method',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Payment Method
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const paymentMethod = PAYMENT_METHOD[row.original.payment_method ?? 'na'];
                return (
                    <div className={`${paymentMethod?.color} px-2 py-1 rounded-md flex items-center gap-2 text-xs max-w-fit`}>
                        <paymentMethod.icon size={12} />
                        {paymentMethod?.label}
                    </div>
                )
            },
        },
        {
            accessorKey: 'receipt',
            header: 'Receipt',
            cell: ({ row }) => (
                row.original.payment_id && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/receipt/${row.original.id}`, '_blank')}
                    >
                        View
                    </Button>
                )
            ),
        }
    ];

    // Apply filters to data
    const filteredData = React.useMemo(() => {
        let filtered = getFilteredPaymentsByDate();
        
        if (statusFilter) {
            filtered = filtered.filter(payment => payment.status === statusFilter);
        }
        
        return filtered;
    }, [paymentHistory, statusFilter, dateFilter]);
    
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
        if (errorPaymentHistory) {
            toast.error(`Error fetching payment history: ${JSON.stringify(errorPaymentHistory)}`);
        }
    }, [errorPaymentHistory]);

    return (
        <div className="space-y-6 px-5 pb-10">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
                <h2 className="text-2xl font-bold tracking-tight">Payment History</h2>
            </div>
            
            {/* Payment Statistics */}
            <PaymentSummary paymentHistory={paymentHistory} />
            
            {/* Filters and Export Section */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center border p-4 rounded-lg bg-card shadow-sm">
                <PaymentFilters 
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                />
                
                <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToCSV}
                    disabled={!paymentHistory || paymentHistory.length === 0}
                    className="flex items-center gap-2 w-full lg:w-auto "
                >
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            {isLoadingPaymentHistory ? (
                <div className="h-48 flex items-center justify-center bg-card rounded-lg border shadow-sm">
                    <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary border-r-2"></div>
                        <p className="text-sm text-muted-foreground">Loading payment history...</p>
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
                                                <p>No payment history found.</p>
                                                <p className="text-sm">Try adjusting your filters.</p>
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
        </div>
    )
}

export default PaymentHistory