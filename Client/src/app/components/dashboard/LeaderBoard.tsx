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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LeaderboardCol } from "@/app/components/schema/Columns";
import { useGetTicket } from "@/hooks/ticket";
import Image from "next/image";
import empty from "../../components/assets/images/dashboard/empty.svg";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetStatisticsByName } from "@/hooks/statistics";
import { SkeletonCard2 } from "@/components/ui/skeleton";

const Leaderboard = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 3 }); // Set default page size to 10

  const { data: courses, status } = useGetStatisticsByName("leaderboard");

  useEffect(() => {
    if (courses) {
      setData(courses);
    }
  }, [courses]);

  const table = useReactTable({
    data: data,
    columns: LeaderboardCol,
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
    <div className='mt-10 rounded-lg bg-[#0000006b] px-6 py-4 relative max-w-full'>
      <h4>Leader Board</h4>
      {status !== "success" ? (
        <SkeletonCard2 />
      ) : (
        <div className='relative h-[340px] mt-5'>
          <Table className='bg-transparent border-none'>
            <TableHeader className='bg-transparent'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead className='text-[#979797]' key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
                    <PaginationPrevious onClick={() => table.previousPage()} isActive={table.getCanPreviousPage()} />
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
      )}
    </div>
  );
};

export default Leaderboard;
