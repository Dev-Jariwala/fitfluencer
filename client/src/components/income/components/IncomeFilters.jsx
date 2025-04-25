import React from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter, Search, Calendar, BarChart2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getMonthOptions, getYearOptions } from '../utils/helper'

const IncomeFilters = ({ globalFilter, setGlobalFilter, month, setMonth, year, setYear }) => {
    // Count of active filters
    const activeFilterCount = [
        globalFilter && globalFilter.length > 0,
        month !== new Date().getMonth() + 1,
        year !== new Date().getFullYear()
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
                        placeholder="Search clients..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-8 w-full"
                    />
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Select 
                        value={month.toString()} 
                        onValueChange={(value) => setMonth(parseInt(value))}
                    >
                        <SelectTrigger className="w-full md:w-[140px]">
                            <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                            {getMonthOptions().map((monthOption) => (
                                <SelectItem key={monthOption.value} value={monthOption.value.toString()}>
                                    {monthOption.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select 
                        value={year.toString()} 
                        onValueChange={(value) => setYear(parseInt(value))}
                    >
                        <SelectTrigger className="w-full md:w-[140px]">
                            <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                            {getYearOptions().map((yearOption) => (
                                <SelectItem key={yearOption.value} value={yearOption.value.toString()}>
                                    {yearOption.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            {activeFilterCount > 0 && (
                <div className="mt-3 flex gap-2">
                    <button 
                        onClick={() => {
                            setGlobalFilter('');
                            setMonth(new Date().getMonth() + 1);
                            setYear(new Date().getFullYear());
                        }}
                        className="text-xs text-muted-foreground hover:text-primary underline transition-colors"
                    >
                        Reset to current month
                    </button>
                </div>
            )}
        </div>
    )
}

export default IncomeFilters 