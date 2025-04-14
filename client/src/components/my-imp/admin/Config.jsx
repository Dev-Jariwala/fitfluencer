import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '../ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { PencilIcon, InfoIcon, PlusIcon } from 'lucide-react';

// Configuration schema for form validation
const configSchema = z.object({
  key: z.string().min(2, { message: 'Key must be at least 2 characters' }),
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  type: z.enum(['string', 'number', 'boolean', 'array', 'object']),
  value: z.string().min(1, { message: 'Value is required' }),
});

// Sample config data
const initialConfigs = [
  {
    id: 1,
    key: 'site_name',
    name: 'Site Name',
    type: 'string',
    value: 'FitFluencer',
  },
  {
    id: 2,
    key: 'max_users',
    name: 'Maximum Users',
    type: 'number',
    value: '5000',
  },
  {
    id: 3,
    key: 'maintenance_mode',
    name: 'Maintenance Mode',
    type: 'boolean',
    value: 'false',
  },
  {
    id: 4,
    key: 'payment_gateways',
    name: 'Payment Gateways',
    type: 'array',
    value: '["stripe", "paypal", "razorpay"]',
  },
  {
    id: 5,
    key: 'smtp_config',
    name: 'SMTP Configuration',
    type: 'object',
    value: '{"host": "smtp.example.com", "port": 587, "secure": true}',
  },
];

const Config = () => {
  const [configs, setConfigs] = useState(initialConfigs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [sorting, setSorting] = useState([]);

  // Form setup
  const form = useForm({
    resolver: zodResolver(configSchema),
    defaultValues: {
      key: '',
      name: '',
      type: 'string',
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
      accessorKey: 'key',
      header: 'Key',
    },
    {
      accessorKey: 'name',
      header: 'Name',
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
        const config = row.original;
        let displayValue = config.value;

        // Format display value based on type
        if (config.type === 'boolean') {
          displayValue = config.value === 'true' ? 'Yes' : 'No';
        } else if (config.type === 'array' || config.type === 'object') {
          try {
            displayValue = (
              <span className="font-mono text-xs bg-gray-100 p-1 rounded">
                {JSON.parse(config.value).toString().substring(0, 30)}
                {JSON.parse(config.value).toString().length > 30 ? '...' : ''}
              </span>
            );
            // eslint-disable-next-line no-unused-vars
          } catch (error) {
            displayValue = 'Invalid JSON';
          }
        }

        return displayValue;
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
    data: configs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  // Handle editing a config
  const handleEdit = (config) => {
    setEditingConfig(config);
    form.reset({
      key: config.key,
      name: config.name,
      type: config.type,
      value: config.value,
    });
    setIsDialogOpen(true);
  };

  // Handle adding a new config
  const handleAddNew = () => {
    setEditingConfig(null);
    form.reset({
      key: '',
      name: '',
      type: 'string',
      value: '',
    });
    setIsDialogOpen(true);
  };

  // Handle form submission
  const onSubmit = (data) => {
    if (editingConfig) {
      // Update existing config
      setConfigs(configs.map(config =>
        config.id === editingConfig.id ? { ...config, ...data } : config
      ));
    } else {
      // Add new config
      const newConfig = {
        id: configs.length > 0 ? Math.max(...configs.map(c => c.id)) + 1 : 1,
        ...data,
      };
      setConfigs([...configs, newConfig]);
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Configuration</h2>
        <Button onClick={handleAddNew}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Config
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
                  No configurations found.
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
              {editingConfig ? 'Edit Configuration' : 'Add New Configuration'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key</FormLabel>
                      <FormControl>
                        <Input placeholder="config_key" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Display Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="array">Array</SelectItem>
                        <SelectItem value="object">Object</SelectItem>
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
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          form.watch('type') === 'array'
                            ? '["item1", "item2"]'
                            : form.watch('type') === 'object'
                              ? '{"key": "value"}'
                              : form.watch('type') === 'boolean'
                                ? 'true or false'
                                : 'Value'
                        }
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
                  {editingConfig ? 'Update Config' : 'Add Config'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Config; 