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
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { SupportCol } from "@/app/components/schema/Columns";
import { useGetTicket } from "@/hooks/ticket";
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
import { NewTicket } from "@/app/components/dashboard/Tickets";
import { SkeletonCard2 } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import Support from "@/app/components/dashboard/Support";

const SupportPage = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 }); // Set default page size to 10

  const { data: tickets, status } = useGetTicket();
  const { data: session } = useSession();

  useEffect(() => {
    if (tickets) {
      setData(tickets);
    }
  }, [tickets]);

  const table = useReactTable({
    data: data, // setting the data in the table in the state
    columns: SupportCol,
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
      <Support />

      {/* {session?.user?.role === "Admin" ? (
        <ContainerDashboard>
          <DashboardHeader>
            <div className='flex flex-col gap-2'>
              <h2>Help & Support</h2>
              <p>Manage all your Support tickets on mywebsite.</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"buy"} className='mr-0 flex items-center gap-2'>
                  <Plus className='w-5 h-5' />
                  New Ticket
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <NewTicket edit='none' />
              </AlertDialogContent>
            </AlertDialog>
          </DashboardHeader>
          <div className='md:mt-10'>
            <div className='relative'>
              <div className='max-w-full'>
                <DashboardHeader className='z-1'>
                  <h4>Support tickets</h4>
                  <Input
                    placeholder='Search tickets'
                    value={(table.getColumn("subject")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("subject")?.setFilterValue(event.target.value)}
                    className='max-w-sm'
                  />
                </DashboardHeader>

                {status !== "success" ? (
                  <SkeletonCard2 />
                ) : (
                  <div className='relative h-[714px] mt-5'>
                    <Table>
                      <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                              return (
                                <TableHead key={header.id}>
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(header.column.columnDef.header, header.getContext())}
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
                )}
              </div>
            </div>
          </div>
        </ContainerDashboard>
      ) : (
        <Support />
      )} */}
    </>
  );
};

export default SupportPage;
