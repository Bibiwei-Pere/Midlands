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
import { Button } from "@/components/ui/button";
import { ManageUsersCol } from "@/app/components/schema/Columns";
import Image from "next/image";
import empty from "../../../components/assets/images/dashboard/empty.svg";
import { ContainerDashboard, DashboardHeader } from "@/components/ui/containers";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetAllUser } from "@/hooks/users";
import { CourseStats } from "@/app/components/dashboard/Admin";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { NewUser } from "@/app/components/dashboard/User";
import { SkeletonCard2 } from "@/components/ui/skeleton";
import { ReviewsStats, UsersStats } from "@/app/components/dashboard/Reviews";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { FaFilter } from "react-icons/fa";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { FilterMenu } from "@/app/components/dashboard/FilterMenu";
import { filterEventsByDate } from "@/lib/helpers";

const ManageUsers = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<any>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [filterMarket, setFilterMarket] = useState<string | null>(null);
  const [customRangeStart, setCustomRangeStart] = useState<Date | null>(null);
  const [customRangeEnd, setCustomRangeEnd] = useState<Date | null>(null);

  const { data: users, status } = useGetAllUser();

  useEffect(() => {
    if (users) {
      if (filterMarket) {
        if (customRangeStart && customRangeEnd) {
          setData(
            users.filter((user: any) => {
              const createdAt = new Date(user.createdAt);
              return createdAt >= customRangeStart && createdAt <= customRangeEnd;
            })
          );
        } else {
          setData(filterEventsByDate(users, filterMarket));
        }
      } else {
        setData(users);
      }
    }
  }, [users, filterMarket, customRangeStart, customRangeEnd]);

  console.log(filterMarket);
  console.log(data);

  const table = useReactTable({
    data: data,
    columns: ManageUsersCol,
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
      <DashboardHeader>
        <div className='flex flex-col gap-2'>
          <h2>Users Management</h2>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={"buy"} className='mr-0 flex items-center gap-2'>
              <Plus className='w-5 h-5' />
              Add Users
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <NewUser edit='none' />
          </AlertDialogContent>
        </AlertDialog>
      </DashboardHeader>
      <ContainerDashboard>
        {status !== "success" ? (
          <SkeletonCard2 />
        ) : (
          <div>
            <div className='relative'>
              <div className='max-w-full'>
                <DashboardHeader className='z-1 flex flex-wrap items-center gap-4'>
                  <h4>Users List</h4>
                  <Input
                    placeholder='Search username...'
                    value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("username")?.setFilterValue(event.target.value)}
                    className='max-w-sm'
                  />
                  <div className='flex flex-col md:flex-row gap-4'>
                    <FilterMenu
                      type={2}
                      filterDateRange={filterMarket}
                      customRangeStart={customRangeStart}
                      customRangeEnd={customRangeEnd}
                      setCustomRangeStart={setCustomRangeStart}
                      setCustomRangeEnd={setCustomRangeEnd}
                      setFilterDateRange={(value: any) => {
                        setFilterMarket(value);
                        if (!value.startsWith("Custom")) {
                          setCustomRangeStart(null);
                          setCustomRangeEnd(null);
                        }
                      }}
                    />
                    <DropdownFilterMenu table={table} />
                  </div>
                </DashboardHeader>

                <div className='relative h-full'>
                  <Table className='bg-black'>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
                              {header.isPlaceholder ? null : (
                                <div
                                  {...{
                                    className: header.column.getCanSort() ? "cursor-pointer select-none" : "",
                                    onClick: header.column.getToggleSortingHandler(),
                                  }}
                                >
                                  {flexRender(header.column.columnDef.header, header.getContext())}
                                </div>
                              )}
                            </TableHead>
                          ))}
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
                              <p className='text-[#666666] text-center'>No result found</p>
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
          </div>
        )}
        <CourseStats />
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 my-5'>
          <ReviewsStats />
          <UsersStats />
        </div>
      </ContainerDashboard>
    </>
  );
};

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
          column.getCanFilter() &&
          !["_id", "username", "createdAt", "activeCourses", "phone", "actions"].includes(column.id) ? (
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
              ) : column.columnDef.meta?.filterVariant === "boolean" ? (
                <Select
                  onValueChange={(value) =>
                    column.setFilterValue(value === "all" ? undefined : value === "true" ? true : false)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${column.columnDef.header}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All</SelectItem>
                    <SelectItem value='true'>Active</SelectItem>
                    <SelectItem value='false'>Inactive</SelectItem>
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

export default ManageUsers;
