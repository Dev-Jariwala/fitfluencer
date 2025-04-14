import React from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter, Search, Calendar, BarChart2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const PaymentFilters = ({ globalFilter, setGlobalFilter, statusFilter, setStatusFilter, dateFilter, setDateFilter }) => {
    // Count of active filters
    const activeFilterCount = [
        globalFilter && globalFilter.length > 0, 
        statusFilter && statusFilter !== 'all', 
        dateFilter && dateFilter !== 'all'
    ].filter(Boolean).length;

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-3">
                <BarChart2 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium">Filters & Search</h3>
                {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                        {activeFilterCount} active
                    </Badge>
                )}
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search payments..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-8 w-full"
                    />
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select 
                        value={statusFilter} 
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="captured">Success</SelectItem>
                            <SelectItem value="created">Pending</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Select 
                        value={dateFilter} 
                        onValueChange={setDateFilter}
                    >
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filter by date" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="last30">Last 30 Days</SelectItem>
                            <SelectItem value="last90">Last 90 Days</SelectItem>
                            <SelectItem value="last180">Last 180 Days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            {activeFilterCount > 0 && (
                <div className="mt-3 flex gap-2">
                    <button 
                        onClick={() => {
                            setGlobalFilter('');
                            setStatusFilter('');
                            setDateFilter('all');
                        }}
                        className="text-xs text-muted-foreground hover:text-primary underline transition-colors"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    )
}

export default PaymentFilters