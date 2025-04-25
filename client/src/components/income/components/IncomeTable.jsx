import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getClientPaymentsByParentId, getIncomeSummaryByParentId } from '@/services/clientPaymentsService';
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import FormatPrice from '@/components/common/FormatPrice';
import { ArrowUpDown } from 'lucide-react';
import { useAuthStore, usePlansStore } from '@/store/commonStore';
import IncomeSummary from './IncomeSummary';
import IncomeFilters from './IncomeFilters';
import { AvatarStack } from '@/components/ui/avatar-stack';
const IncomeTable = () => {
    const user = useAuthStore((state) => state.data);
    const plans = usePlansStore((state) => state.plans);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const { data: clientPayments, isLoading: isLoadingClientPayments, error: errorClientPayments } = useQuery({
        queryKey: ['clientPayments', month, year],
        queryFn: async () => {
            const res = await getClientPaymentsByParentId('me', 100, 0, month, year);
            return res.data;
        }
    });

    const { data: incomeSummaryData, isLoading: isLoadingIncomeSummary } = useQuery({
        queryKey: ['incomeSummary', month, year],
        queryFn: async () => {
            const res = await getIncomeSummaryByParentId('me', month, year);
            return res.data || {
                total_clients: 0,
                total_income: 0,
                total_fee: 0,
                personal_income: 0,
                downline_income: 0
            };
        }
    });

    // Map the API response to the format expected by IncomeSummary component
    const incomeSummary = useMemo(() => {
        if (isLoadingIncomeSummary || !incomeSummaryData) {
            return {
                totalClients: 0,
                totalIncome: 0,
                personalIncome: 0,
                downlineIncome: 0,
                totalFee: 0
            };
        }

        return {
            totalClients: incomeSummaryData.total_clients || 0,
            totalIncome: incomeSummaryData.total_income || 0,
            personalIncome: incomeSummaryData.personal_income || 0,
            downlineIncome: incomeSummaryData.downline_income || 0,
            totalFee: incomeSummaryData.total_fee || 0
        };
    }, [incomeSummaryData, isLoadingIncomeSummary]);

    // Table columns definition
    const columns = useMemo(() => {
        let columns = [
            {
                accessorKey: 'created_at',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => format(new Date(row.original.created_at), 'dd MMM yyyy'),
            },
            {
                accessorKey: 'parent_username',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Upline
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            {
                accessorKey: 'username',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Client
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            {
                accessorKey: 'plan_id',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Plan
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ getValue }) => plans.find(plan => plan.id === getValue())?.name || '-',
            },
            {
                accessorKey: 'amount',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Total Amount
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <FormatPrice price={parseFloat(row.original.amount)} showRupee={true} />
                ),
            },
            {
                accessorKey: 'fee',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Fee
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <FormatPrice price={parseFloat(row.original.fee)} showRupee={true} />
                ),
            },
            {
                id: 'your_income',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Your Income
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                accessorFn: (row) => {
                    let personalIncome = 0;
                    row.incomes.forEach(income => {
                        if (income.user_id === user?.id) {
                            personalIncome += parseFloat(income.amount);
                        }
                    });
                    return personalIncome;
                },
                cell: ({ getValue }) => (
                    <FormatPrice price={getValue()} showRupee={true} className="text-green-600 font-medium" />
                ),
            },
            {
                id: 'downline_income',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Downline Income
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                accessorFn: (row) => {
                    let downlineIncome = 0;
                    const incomes = row?.incomes || [];
                    const myIncome = incomes.find(income => income.user_id === user?.id);
                    const myLayer = myIncome?.layer || 0;

                    const filteredIncomes = incomes.filter(income => income.layer > myLayer);
                    filteredIncomes.forEach(income => {
                        downlineIncome += parseFloat(income.amount);
                    });
                    return downlineIncome;
                },
                cell: ({ getValue }) => (
                    <FormatPrice price={getValue()} showRupee={true} className="text-amber-600 font-medium" />
                ),
            },
            {
                id: 'downline_users',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Downline Users
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => {
                    const incomes = row.original.incomes || [];
                    const myIncome = incomes.find(income => income.user_id === user?.id);
                    const myLayer = myIncome?.layer || 0;

                    const downlineUsers = incomes.filter(income => income.layer >= myLayer)?.sort((a, b) => a.layer - b.layer) || [];
                    return <AvatarStack users={downlineUsers} maxAvatars={2} />
                }
            }
        ];
        // user is not admin then filter the columns (fee);
        if (user?.role !== 'admin') {
            columns = columns.filter(column => column.accessorKey !== 'fee');
        }
        return columns;
    }, [user, plans]);

    const table = useReactTable({
        data: clientPayments || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
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
        if (errorClientPayments) {
            toast.error(errorClientPayments.message || 'Failed to load income data');
        }
    }, [errorClientPayments]);

    return (
        <div className="space-y-6 px-5 pb-10 pt-5">
            {/* Page Header */}
            <div className="flex items-center gap-2 border-b pb-4 text-2xl font-semibold">
                <div className=" ">Income Dashboard </div>
                <div className="text-primary">{`(${user?.sr_no} - ${user?.first_name} ${user?.last_name})`}</div>
            </div>

            {/* Income Summary */}
            <IncomeSummary incomeSummary={incomeSummary} />

            {/* Filters and Export Section */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center border p-4 rounded-lg bg-card shadow-sm">
                <IncomeFilters
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    month={month}
                    setMonth={setMonth}
                    year={year}
                    setYear={setYear}
                />
            </div>

            {/* Income Table */}
            {isLoadingClientPayments ? (
                <div className="h-48 flex items-center justify-center bg-card rounded-lg border shadow-sm">
                    <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary border-r-2"></div>
                        <p className="text-sm text-muted-foreground">Loading income data...</p>
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
                                                <p>No income data found for this period.</p>
                                                <p className="text-sm">Try selecting a different month or year.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 bg-card rounded-lg border p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>
                                Showing <span className="font-medium">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to{" "}
                                <span className="font-medium">
                                    {Math.min(
                                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                        clientPayments?.length || 0
                                    )}
                                </span>{" "}
                                of <span className="font-medium">{clientPayments?.length || 0}</span> entries
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
    );
};

export default IncomeTable;