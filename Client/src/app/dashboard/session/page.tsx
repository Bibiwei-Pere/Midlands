"use client";
import React, { useEffect, useState } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookSessionCol } from "@/app/components/schema/Columns";
import Image from "next/image";
import empty from "../../components/assets/images/dashboard/empty.svg";
import { ContainerDashboard, DashboardHeader } from "@/components/ui/containers";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { FaFilter } from "react-icons/fa";
import { useGetAllBook } from "@/hooks/bookSession";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

const BookSession = ({ hide }: any) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 }); // Set default page size to 10

  const { data: bookSessions } = useGetAllBook();
  console.log(bookSessions);
  useEffect(() => {
    if (bookSessions) {
      setData(bookSessions);
    }
  }, [bookSessions]);

  const table = useReactTable({
    data: data,
    columns: BookSessionCol,
    filterFns: {},
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <>
      {hide !== "true" && (
        <DashboardHeader>
          <div className='flex flex-col gap-2'>
            <h2>Private Sessions</h2>
          </div>
        </DashboardHeader>
      )}
      <ContainerDashboard>
        <div className='relative'>
          <div className='max-w-full'>
            <DashboardHeader className='z-1 top-0 pt-5 pb-10'>
              <h4>Sessions</h4>
              <Input
                placeholder='Search name...'
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                className='max-w-sm'
              />
              <DropdownFilterMenu table={table} />
            </DashboardHeader>
            <div className='relative h-full'>
              <Table className='bg-black'>
                <TableHeader className='bg-black'>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder ? null : (
                              <div
                                {...{
                                  className: header.column.getCanSort() ? "cursor-pointer select-none" : "",
                                  onClick: header.column.getToggleSortingHandler(),
                                }}
                              >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {{
                                  // asc: <ArrowUp />,
                                  // desc: <ArrowDown />,
                                }[header.column.getIsSorted() as string] ?? null}
                              </div>
                            )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={table.getAllColumns().length}>
                        <div className='flex flex-col items-center justify-center w-full h-[200px] gap-4'>
                          <Image src={empty} alt='empty' width={100} height={100} className='w-[100px] h-auto' />
                          <p className='text-[#666666] text-center'>No data yet</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </TableBody>
                <div className='absolute w-full bottom-0 flex items-center justify-end space-x-2 py-4'>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => table.previousPage()}
                          isActive={table.getCanPreviousPage()}
                        />
                      </PaginationItem>

                      <PaginationItem>
                        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
                          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </div>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => table.getCanNextPage() && table.nextPage()}
                          isActive={table.getCanNextPage()}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </Table>
            </div>
          </div>
        </div>
      </ContainerDashboard>
    </>
  );
};

export default BookSession;

const DropdownFilterMenu = ({ table }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
      <DropdownMenuTrigger asChild>
        <div className='flex gap-3 border hover:border-yellow-500 hover:text-yellow-500 max-w-[120px] items-center py-[5px] px-4 rounded-lg cursor-pointer'>
          <FaFilter className='w-4 h-4 cursor-pointer' />
          Filter
          {isOpen ? <FaChevronUp className='w-3 h-3' /> : <FaChevronDown className='w-3 h-3' />}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mr-0 sm:max-h-[250px] max-h-[300px] flex flex-col gap-3 bg-white p-4 sm:p-6 overflow-y-scroll'>
        {table.getAllColumns().map((column: any) =>
          column.getCanFilter() && !["_id", "name", "date", "actions"].includes(column.id) ? (
            <div key={column.id} className='flex flex-col gap-1'>
              <label>{column.columnDef.header}:</label>
              {column.columnDef.meta?.filterVariant === "select" ? (
                <Select onValueChange={(value) => column.setFilterValue(value === "all" ? undefined : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${column.columnDef.header}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All</SelectItem>
                    <SelectItem value='User'>User</SelectItem>
                    <SelectItem value='Teacher'>Teacher</SelectItem>
                    <SelectItem value='Admin'>Admin</SelectItem>
                  </SelectContent>
                </Select>
              ) : column.columnDef.meta?.filterVariant === "status" ? (
                <Select onValueChange={(value) => column.setFilterValue(value === "all" ? undefined : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${column.columnDef.header}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All</SelectItem>
                    <SelectItem value='Pending'>Pending</SelectItem>
                    <SelectItem value='Successful'>Successful</SelectItem>
                    <SelectItem value='Failed'>Failed</SelectItem>
                  </SelectContent>
                </Select>
              ) : column.columnDef.meta?.filterVariant === "sessionStatus" ? (
                <Select onValueChange={(value) => column.setFilterValue(value === "all" ? undefined : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${column.columnDef.header}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All</SelectItem>
                    <SelectItem value='Past'>Past</SelectItem>
                    <SelectItem value='Upcoming'>Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  onChange={(e) => column.setFilterValue(e.target.value)}
                  placeholder={`Search ${column.columnDef.header}`}
                  type='text'
                  className='text-white'
                />
              )}
            </div>
          ) : null
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
