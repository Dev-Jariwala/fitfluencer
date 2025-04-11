import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { CalendarIcon } from 'lucide-react';
import { format, getYear, setMonth, setYear } from 'date-fns';
import { Calendar } from './calendar';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

const DatePicker = ({
    value,
    onChange,
    startYear = getYear(new Date()) - 100,
    endYear = getYear(new Date()) + 100,
}) => {
    const [date, setDate] = useState(value || new Date());
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

    const handleMonthChange = (value) => {
        const newDate = setMonth(date, months.indexOf(value));
        setDate(newDate);
        onChange && onChange(newDate);
    }

    const handleYearChange = (value) => {
        const newDate = setYear(date, parseInt(value));
        setDate(newDate);
        onChange && onChange(newDate);
    }

    const handleDateChange = (value) => {
        if (value) {    
            setDate(value);
            onChange && onChange(value);
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="flex items-center justify-between px-3 py-2">
                    <Select value={months[date.getMonth()]} onValueChange={handleMonthChange}>
                        <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((month) => (
                                <SelectItem key={month} value={month}>{month}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={date.getFullYear().toString()} onValueChange={handleYearChange}>
                        <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    month={date}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

export default DatePicker;