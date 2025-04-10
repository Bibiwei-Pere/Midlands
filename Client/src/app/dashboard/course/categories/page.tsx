"use client";
import * as React from "react";
import { Pagination } from "@/components/ui/pagination";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardHeader } from "@/components/ui/containers";
import { CategoriesCol } from "@/app/components/schema/Columns";
import { useCreateCategory, useGetAllCategories } from "@/hooks/categories";
import { SkeletonCard1 } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogTrigger,
  ErrorModal,
  SuccessModal,
} from "@/components/ui/alert-dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { categorySchema } from "@/app/components/schema/Forms";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const Categories = () => {
  const [successModal, setSuccessModal] = React.useState(false);
  const [errorModal, setErrorModal] = React.useState(false);
  const [response, setResponse] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const navigation = useRouter();

  const { mutation: create, success, error, res } = useCreateCategory();

  const allCategory = useGetAllCategories();
  console.log(allCategory);

  const table = useReactTable({
    data: allCategory?.data,
    columns: CategoriesCol,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
  });

  const onuseCreateCategory = (values: z.infer<typeof categorySchema>) => {
    create.mutate({
      name: values.name,
      original: undefined,
      _id: "",
      select: "",
      id: "",
    });
    setSuccessModal(success);
    setErrorModal(error);
    setResponse(res);
  };

  if (allCategory.status !== "success") return <SkeletonCard1 />;
  else
    return (
      <div className=''>
        <DashboardHeader>
          <h3>Categories</h3>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"buy"} className='flex justify-center items-center gap-[8px]'>
                New Category
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='left-[50%] top-[50%]'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onuseCreateCategory)} className='flex flex-col gap-5 mt-4'>
                  <h1 className='text-black'>Add new category</h1>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-black'>Category name</FormLabel>
                        <Input
                          type='text'
                          className='bg-transparent border-gray-800 focus:border-black text-black'
                          placeholder='Enter category name'
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button variant={"secondary"} className='w-full'>
                    {create.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Proceed"}
                  </Button>
                </form>
              </Form>
            </AlertDialogContent>
          </AlertDialog>
        </DashboardHeader>
        <div className='mt-5'>
          <div className='relative'>
            <div className='max-w-full'>
              <div className='flex items-center py-4 '>
                <Input
                  placeholder='Search product'
                  value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                  onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                  className='max-w-sm'
                />
              </div>
              <div>
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
                      <TableRow>
                        <TableCell className='h-24 text-center'>No results.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className='items-center'>
                <Pagination />
              </div>
            </div>
          </div>
        </div>

        {errorModal && (
          <AlertDialog open onOpenChange={(open) => setErrorModal(open)}>
            <ErrorModal description={response}>
              <AlertDialogAction>Close</AlertDialogAction>
            </ErrorModal>
          </AlertDialog>
        )}
        {successModal && (
          <AlertDialog open onOpenChange={(open) => setSuccessModal(open)}>
            <SuccessModal description={response}>
              <AlertDialogAction onClick={() => navigation.push("/dashboard/course")}>Continue</AlertDialogAction>
            </SuccessModal>
          </AlertDialog>
        )}
      </div>
    );
};

export default Categories;
