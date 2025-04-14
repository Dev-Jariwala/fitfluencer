import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPaymentHistory } from '@/services/clientPaymentsService'
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'

const PaymentHistory = () => {
    const [sorting, setSorting] = useState([]);
    
    const { data: paymentHistory, isLoading: isLoadingPaymentHistory, error: errorPaymentHistory } = useQuery({
        queryKey: ['paymentHistory'],
        queryFn: async ()=>{
            const res = await getPaymentHistory();
            return res.data;
        }
    });

    // Table columns definition
    const columns = [
        {
            accessorKey: 'sr_no',
            header: 'Sr No',
        },
        {
            accessorKey: 'payment_id',
            header: 'Payment ID',
            cell: ({ row }) => row.original.payment_id || 'N/A',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => {
                const amount = parseFloat(row.original.amount);
                const currency = row.original.currency;
                return `${currency} ${amount.toLocaleString('en-IN', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`;
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <span className={`capitalize px-2 py-1 rounded-full text-xs ${
                    row.original.status === 'captured' 
                        ? 'bg-green-100 text-green-800' 
                        : row.original.status === 'created'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                }`}>
                    {row.original.status}
                </span>
            ),
        },
        {
            accessorKey: 'payment_method',
            header: 'Payment Method',
            cell: ({ row }) => row.original.payment_method || 'N/A',
        },
        {
            accessorKey: 'created_at',
            header: 'Date',
            cell: ({ row }) => {
                const date = new Date(row.original.created_at);
                return format(date, 'dd MMM yyyy, hh:mm a');
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

    // Table instance
    const table = useReactTable({
        data: paymentHistory || [],
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
        if (errorPaymentHistory) {
            toast.error(`Error fetching payment history: ${JSON.stringify(errorPaymentHistory)}`);
        }
    }, [errorPaymentHistory]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Payment History</h2>
            </div>

            {isLoadingPaymentHistory ? (
                <div className="h-48 flex items-center justify-center">
                    <p>Loading payment history...</p>
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
                                            No payment history found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between space-x-2 py-4">
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

export default PaymentHistory