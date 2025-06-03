import React, { useState } from 'react';
import { Pencil, Trash, Info } from 'lucide-react';
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable
} from '@tanstack/react-table';

// UI Components
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const MealsTableView = ({ meals, globalFilter, onEdit, onDelete }) => {
    const [sorting, setSorting] = useState([]);

    // Table columns definition
    const columns = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => {
                const name = row.original.name;
                return (
                    <div className="flex items-center gap-2">
                        <img src={row.original.attachment} alt={name} className="w-10 h-10 rounded-full" />
                        <div className="max-w-xs truncate" title={name}>{name}</div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => {
                const description = row.original.description;
                return description ? (
                    <div className="max-w-xs truncate" title={description}>
                        {description}
                    </div>
                ) : (
                    <span className="text-muted-foreground italic">No description</span>
                );
            },
        },
        {
            accessorKey: 'quantity',
            header: 'Quantity',
            cell: ({ row }) => `${row.original.quantity} ${row.original.unit}`,
        },
        {
            accessorKey: 'calories',
            header: 'Calories',
            cell: ({ row }) => `${row.original.calories} kcal`,
        },
        {
            header: 'Macros',
            cell: ({ row }) => {
                const meal = row.original;
                return (
                    <div className="flex gap-2">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">P: {meal.protein}g</Badge>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">C: {meal.carbs}g</Badge>
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">F: {meal.fat}g</Badge>
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(row.original)}
                        title="Edit"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        title="View Details"
                    >
                        <Info className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(row.original)}
                        title="Delete"
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    // Table instance
    const table = useReactTable({
        data: meals,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: () => {},
        state: {
            sorting,
            globalFilter,
        },
    });

    return (
        <div>
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
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No meals found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
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
    );
};

export default MealsTableView; 