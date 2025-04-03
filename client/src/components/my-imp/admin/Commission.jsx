import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { PencilIcon, InfoIcon, PlusIcon } from 'lucide-react';

// Commission schema for form validation
const commissionSchema = z.object({
  max_downline: z.coerce.number().int().positive({ message: 'Max downline must be a positive integer' }),
  type: z.enum(['percentage', 'fixed']),
  value: z.coerce.number().positive({ message: 'Value must be positive' }),
});

// Sample commission data
const initialCommissions = [
  {
    id: 1,
    max_downline: 5,
    type: 'percentage',
    value: 10,
  },
  {
    id: 2,
    max_downline: 10,
    type: 'percentage',
    value: 15,
  },
  {
    id: 3,
    max_downline: 20,
    type: 'percentage',
    value: 20,
  },
  {
    id: 4,
    max_downline: 50,
    type: 'percentage',
    value: 25,
  },
  {
    id: 5,
    max_downline: 100,
    type: 'fixed',
    value: 1000,
  },
];

const Commission = () => {
  const [commissions, setCommissions] = useState(initialCommissions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCommission, setEditingCommission] = useState(null);
  const [sorting, setSorting] = useState([]);

  // Form setup
  const form = useForm({
    resolver: zodResolver(commissionSchema),
    defaultValues: {
      max_downline: '',
      type: 'percentage',
      value: '',
    },
  });

  // Table columns definition
  const columns = [
    {
      accessorKey: 'id',
      header: 'Sr No',
    },
    {
      accessorKey: 'max_downline',
      header: 'Max Downline',
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <span className="capitalize">{row.original.type}</span>
      ),
    },
    {
      accessorKey: 'value',
      header: 'Value',
      cell: ({ row }) => {
        const commission = row.original;
        if (commission.type === 'percentage') {
          return `${commission.value}%`;
        }
        return `$${commission.value.toFixed(2)}`;
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
            onClick={() => handleEdit(row.original)}
            title="Edit"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            title="View Details"
          >
            <InfoIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Table instance
  const table = useReactTable({
    data: commissions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  // Handle editing a commission
  const handleEdit = (commission) => {
    setEditingCommission(commission);
    form.reset({
      max_downline: commission.max_downline.toString(),
      type: commission.type,
      value: commission.value.toString(),
    });
    setIsDialogOpen(true);
  };

  // Handle adding a new commission
  const handleAddNew = () => {
    setEditingCommission(null);
    form.reset({
      max_downline: '',
      type: 'percentage',
      value: '',
    });
    setIsDialogOpen(true);
  };

  // Handle form submission
  const onSubmit = (data) => {
    if (editingCommission) {
      // Update existing commission
      setCommissions(commissions.map(commission => 
        commission.id === editingCommission.id ? { ...commission, ...data } : commission
      ));
    } else {
      // Add new commission
      const newCommission = {
        id: commissions.length > 0 ? Math.max(...commissions.map(c => c.id)) + 1 : 1,
        ...data,
      };
      setCommissions([...commissions, newCommission]);
    }
    
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Commission Rules</h2>
        <Button onClick={handleAddNew}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Commission Rule
        </Button>
      </div>

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
                  No commission rules found.
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {editingCommission ? 'Edit Commission Rule' : 'Add New Commission Rule'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="max_downline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Downline</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch('type') === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step={form.watch('type') === 'percentage' ? "1" : "0.01"} 
                        placeholder={form.watch('type') === 'percentage' ? "15" : "100"} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCommission ? 'Update Commission Rule' : 'Add Commission Rule'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Commission; 