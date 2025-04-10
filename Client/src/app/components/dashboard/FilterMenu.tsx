"use client";
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar"; // Import your calendar component
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";

const filterUpcoming = ["All", "Today", "Tomorrow", "This Week", "Next Week", "This Month", "Next Month", "Next Year"];
const filterPast = ["All", "Today", "Yesterday", "Last Week", "Last Month", "Last Year"];

export const FilterMenu = ({
  customRangeStart,
  customRangeEnd,
  setCustomRangeStart,
  setCustomRangeEnd,
  type,
  filterDateRange,
  setFilterDateRange,
}: any) => {
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    if (type === 1) setData(filterUpcoming);
    if (type === 2) setData(filterPast);
  }, [type]);

  return (
    <Select defaultValue={filterDateRange} onValueChange={(value) => setFilterDateRange(value)}>
      <SelectTrigger className='flex gap-3 border border-white hover:border-yellow-500 hover:text-yellow-500 max-w-auto items-center py-[5px] px-4 rounded-lg cursor-pointer'>
        <FaFilter className='w-4 h-4 cursor-pointer' />
        {filterDateRange ? filterDateRange : "Filter by Date"}
      </SelectTrigger>
      <SelectContent>
        {data.map((date: string, index: number) => (
          <SelectItem key={index} value={date}>
            {date}
          </SelectItem>
        ))}
        {/* Add a custom date range option */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SelectItem value='Custom Range'>Select Custom Range</SelectItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='mr-0 sm:max-h-[250px] max-h-[300px] flex flex-col gap-3 bg-white p-4 sm:p-6 overflow-y-scroll'>
            <div className='mt-2'>
              <label className='block text-gray-700'>Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='secondary'
                    className='rounded-md py-0 px-3 justify-start ml-0 border-gray-800 w-full'
                  >
                    {customRangeStart ? customRangeStart.toLocaleDateString() : "Select Start Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={customRangeStart}
                    onSelect={(date) => setCustomRangeStart(date)}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>

              <label className='block text-gray-700 mt-4'>End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='secondary'
                    className='rounded-md py-0 px-3 justify-start ml-0 border-gray-800 w-full'
                  >
                    {customRangeEnd ? customRangeEnd.toLocaleDateString() : "Select End Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={customRangeEnd}
                    onSelect={(date) => setCustomRangeEnd(date)}
                    disabled={(date) => (customRangeStart ? date < customRangeStart : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SelectContent>
    </Select>
  );
};
