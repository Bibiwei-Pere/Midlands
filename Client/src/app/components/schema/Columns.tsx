import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Category, Leaderboard, Support } from "./Types";
import { useDeleteCategory } from "@/hooks/categories";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import React, { useState } from "react";
import { formatDate, formatDateShort } from "@/hooks/auth";
import { DeleteTicket, NewTicket } from "../dashboard/Tickets";
import { DeleteUser, NewUser } from "../dashboard/User";
import { shortenText } from "../dashboard/CourseCard";
import { useRouter } from "next/navigation";
import { DeleteCourse } from "../dashboard/Course";
import Image from "next/image";
import { DeleteBookSession, DeletePayout, EditBookSession, EditPayout } from "../dashboard/Payment";

export const SupportCol: ColumnDef<Support>[] = [
  {
    accessorKey: "_id",
    header: "Ticket ID",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("_id")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("subject")}</div>,
  },
  {
    accessorKey: "status",
    header: "Payment Status",
    cell: ({ row }) => (
      <div>
        {row.getValue("status") === "Resolved" ? (
          <div className='py-1 px-2 bg-green-100 text-center max-w-[75px] text-green-700 rounded-md font-medium'>
            Resolved
          </div>
        ) : (
          <div className='py-1 px-2 text-red-700 rounded-md bg-red-100 text-center max-w-[50px] font-medium'>Open</div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => <div className='tableText'>{formatDateShort(row.getValue("createdAt"))}</div>,
  },

  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => {
      const [isEditOpen, setEditOpen] = useState(false);
      const [isDeleteOpen, setDeleteOpen] = useState(false);

      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setEditOpen(true)} // Open Edit dialog
              >
                Edit Ticket
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)} // Open Delete dialog
                style={{ color: "red", fontWeight: "500" }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={isEditOpen} onOpenChange={setEditOpen}>
            <AlertDialogContent className='left-[50%] top-[50%]'>
              <NewTicket edit='edit' data={row.original} />
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent className='left-[50%] top-[50%]'>
              <DeleteTicket data={row.original} />
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

export const ManageCourseCol: ColumnDef<any>[] = [
  {
    accessorKey: "_id",
    header: "User ID",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("_id")}</div>,
  },
  {
    accessorKey: "title",
    header: "Course title",
    cell: ({ row }) => <div className='font-medium tableText'>{shortenText(row.getValue("title"), 20)}</div>,
  },
  {
    accessorKey: "username",
    header: "Instructor",
    cell: ({ row }) => (
      <div className='font-medium tableText'>{row?.original?.instructor?.name || row.getValue("username")}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    meta: {
      filterVariant: "select",
    },
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("category") || "Beginner"}</div>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <div className='font-medium tableText'>₦{row.getValue("price")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => <div className='font-medium tableText'>{formatDate(row.getValue("createdAt"))}</div>,
  },
  {
    accessorKey: "status",
    meta: {
      filterVariant: "status",
    },
    header: "Payment Status",
    cell: ({ row }) => (
      <div>
        {row.getValue("status") === "Published" ? (
          <div className='py-1 px-2 text-center max-w-[90px] bg-green-700 rounded-md font-medium'>
            {row.getValue("status")}
          </div>
        ) : (
          <div className='py-1 px-2  rounded-full bg-red-700 text-center max-w-[85px] font-medium'>
            {row.getValue("status")}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => {
      const navigation = useRouter();
      return (
        <AlertDialog>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <MoreVertical className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigation.push(`/dashboard/course/new/${row.original._id}`)}>
                  Edit Course
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem style={{ color: "red", fontWeight: "500" }}>Delete</DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <AlertDialogContent className='left-[50%] top-[50%]'>
            <DeleteCourse id={row.original._id} />
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];

export const ManageUsersCol: ColumnDef<any>[] = [
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("username")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("phone") || "Not Added"}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("role") || "User"}</div>,
    meta: {
      filterVariant: "select",
    },
  },
  {
    accessorKey: "activeCourses",
    header: "Enrolled Courses",
    cell: ({ row }) => <div className='font-medium tableText'>{row?.original?.activeCourseList?.length || 0}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "Registration Date",
    cell: ({ row }) => <div className='font-medium tableText'>{formatDate(row.getValue("createdAt"))}</div>,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    meta: {
      filterVariant: "boolean",
    },
    cell: ({ row }) => (
      <div>
        {row.getValue("isActive") ? (
          <div className='py-1 px-2 text-center text-white rounded-full max-w-[90px] bg-green-700 font-medium'>
            Active
          </div>
        ) : (
          <div className='py-1 px-2 text-white rounded-full bg-red-700 text-center max-w-[85px] font-medium'>
            Inactive
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => {
      const [isEditOpen, setEditOpen] = useState(false);
      const [isDeleteOpen, setDeleteOpen] = useState(false);
      console.log(row.original);
      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => (window.location.href = `/dashboard/admin/user-profile/${row.original._id}`)}
              >
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditOpen(true)}>Edit User</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteOpen(true)} style={{ color: "red", fontWeight: "500" }}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={isEditOpen} onOpenChange={setEditOpen}>
            <AlertDialogContent className='left-[50%] top-[50%]'>
              <NewUser edit='edit' data={row.original} />
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent className='left-[50%] top-[50%]'>
              <DeleteUser data={row.original} />
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

export const OrdersCol: ColumnDef<any>[] = [
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("username")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("phone") || "Not Added"}</div>,
  },
  {
    accessorKey: "transactionType",
    header: "Type",
    meta: {
      filterVariant: "transactionType",
    },
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("transactionType")}</div>,
  },
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => <div className='font-medium tableText'>{shortenText(row.getValue("product"), 30)}</div>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <div className='font-medium tableText'>{`₦${row.getValue("amount")}` || "0"}</div>,
  },
  {
    accessorKey: "activeCourses",
    header: "Enrolled Courses",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("activeCourses") || 0}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => <div className='font-medium tableText'>{formatDate(row.getValue("createdAt"))}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      filterVariant: "status",
    },
    cell: ({ row }) => (
      <div>
        {row.getValue("status") === "Successful" ? (
          <div className='py-1 px-2 text-center text-white rounded-full max-w-[90px] bg-green-500 font-medium'>
            {row.getValue("status")}
          </div>
        ) : row.getValue("status") === "Pending" ? (
          <div className='py-1 px-2  text-white rounded-full bg-red-700 text-center w-[80px] font-medium'>
            {row.getValue("status")}
          </div>
        ) : (
          <div className='py-1 px-2 text-center text-white rounded-full max-w-[80px] bg-yellow-600 font-medium'>
            Pending
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => {
      const [isEditOpen, setEditOpen] = useState(false);
      const [isDeleteOpen, setDeleteOpen] = useState(false);
      console.log(row.original.phone);
      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setEditOpen(true)}>View User</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteOpen(true)} style={{ color: "red", fontWeight: "500" }}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={isEditOpen} onOpenChange={setEditOpen}>
            <AlertDialogContent className='left-[50%] top-[50%]'>
              <NewUser edit='edit' data={row.original} />
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent className='left-[50%] top-[50%]'>
              <DeleteUser data={row.original} />
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

export const ManageAffiliateCol: ColumnDef<any>[] = [
  {
    accessorKey: "_id",
    header: "Transaction ID",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("_id")}</div>,
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("username") || "User"}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("email")}</div>,
  },

  {
    accessorKey: "createdAt",
    header: "Request Date",
    cell: ({ row }) => <div className='font-medium tableText'>{formatDate(row.getValue("createdAt"))}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    meta: {
      filterVariant: "select",
    },
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("role") || "User"}</div>,
  },
  {
    accessorKey: "amount",
    header: "Amount requested",
    cell: ({ row }) => <div className='font-medium tableText'>₦{row.getValue("amount") || 0}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      filterVariant: "status",
    },
    cell: ({ row }) => (
      <div>
        {row.getValue("status") === "Approved" ? (
          <div className='py-1 px-2 text-center text-white rounded-full max-w-[90px] bg-green-500 font-medium'>
            {row.getValue("status")}
          </div>
        ) : row.getValue("status") === "Rejected" ? (
          <div className='py-1 px-2  text-white rounded-full bg-red-500 text-center max-w-[85px] font-medium'>
            {row.getValue("status")}
          </div>
        ) : (
          <div className='py-1 px-2  text-black rounded-full bg-yellow-500 text-center w-[145px] font-medium'>
            {row.getValue("status")}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => {
      const [isEditOpen, setEditOpen] = useState(false);
      const [isDeleteOpen, setDeleteOpen] = useState(false);

      console.log(row.original);
      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setEditOpen(true)}>Edit Payout</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteOpen(true)} style={{ color: "red", fontWeight: "500" }}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={isEditOpen} onOpenChange={setEditOpen}>
            <AlertDialogContent className='left-[50%] top-[50%]'>
              <EditPayout data={row.original} />
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent className='left-[50%] top-[50%]'>
              <DeletePayout id={row.original._id} />
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

export const BookSessionCol: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "number",
    header: "Phone",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("number") || "Not Added"}</div>,
  },
  {
    accessorKey: "date",
    header: "Session Date",
    cell: ({ row }) => <div className='font-medium tableText'>{formatDate(row.getValue("date"))}</div>,
  },
  {
    accessorKey: "program",
    header: "Program",

    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("program")}</div>,
  },
  {
    accessorKey: "sessionStatus",
    header: "Session Status",
    meta: {
      filterVariant: "sessionStatus",
    },
    cell: ({ row }) => (
      <div>
        {row.getValue("sessionStatus") === "Upcoming" ? (
          <div className='py-1 px-2 text-center text-green-700 rounded-full max-w-[90px] bg-green-300 font-medium'>
            {row.getValue("sessionStatus")}
          </div>
        ) : (
          <div className='py-1 px-2  text-red-700 rounded-full bg-red-300 text-center w-[65px] font-medium'>
            {row.getValue("sessionStatus")}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Payment Status",
    meta: {
      filterVariant: "status",
    },
    cell: ({ row }) => (
      <div>
        {row.getValue("status") === "Successful" ? (
          <div className='py-1 px-2 text-center text-white rounded-full max-w-[90px] bg-green-500 font-medium'>
            {row.getValue("status")}
          </div>
        ) : row.getValue("status") === "Pending" ? (
          <div className='py-1 px-2  text-white rounded-full bg-red-700 text-center w-[80px] font-medium'>
            {row.getValue("status")}
          </div>
        ) : (
          <div className='py-1 px-2 text-center text-white rounded-full max-w-[80px] bg-yellow-600 font-medium'>
            Pending
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => {
      const [isEditOpen, setEditOpen] = useState(false);
      const [isDeleteOpen, setDeleteOpen] = useState(false);

      console.log(row.original);
      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setEditOpen(true)}>Edit Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteOpen(true)} style={{ color: "red", fontWeight: "500" }}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={isEditOpen} onOpenChange={setEditOpen}>
            <AlertDialogContent className='left-[50%] top-[50%]'>
              <EditBookSession data={row.original} />
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent className='left-[50%] top-[50%]'>
              <DeleteBookSession id={row.original._id} />
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

export const LeaderboardCol: ColumnDef<Leaderboard>[] = [
  {
    accessorKey: "rank",
    header: "RANK",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("rank")}</div>,
  },
  {
    accessorKey: "name",
    header: "NAME",
    cell: ({ row }) => {
      console.log(row.original);
      return (
        <div className='flex gap-2 items-center font-medium '>
          <Image
            alt='Avatar'
            height={300}
            width={300}
            className='relative object-cover flex justify-center h-[26px] w-[26px] shrink-0 overflow-hidden rounded-full'
            src={row.original.name.avatar || "/noavatar.png"}
          />
          <div className='tableText'>{row.original.name.fullName}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "courses",
    header: "COURSE",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("courses")}</div>,
  },
  {
    accessorKey: "hour",
    header: "HOUR",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("hour") || 0}</div>,
  },
  {
    accessorKey: "point",
    header: "POINT",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("point") || 0}</div>,
  },
];

const ActionsCell = ({
  row,
}: {
  row: {
    original: {
      _id: string;
    };
  };
}) => {
  const { mutation: del } = useDeleteCategory();
  // const { mutation: edit } = useEditCategory();

  const handleDelete = () => {
    del.mutate({
      categoryId: row.original._id,
    });
  };

  // const onEditCategory = (values: { name: string; }) => {
  //   edit.mutate({
  //     categoryId: row.original._id,
  //     name: values.name,
  //   });
  // };

  return (
    <AlertDialog>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreVertical className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>Edit Category</DropdownMenuItem>
            </AlertDialogTrigger>
            <DropdownMenuItem onClick={handleDelete} style={{ color: "red", fontWeight: "500" }}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AlertDialogContent className='left-[50%] top-[50%]'>{/* Implement your form logic here */}</AlertDialogContent>
    </AlertDialog>
  );
};

export const CategoriesCol: ColumnDef<Category>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className='border border-gray-300'
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className='border border-gray-300'
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <h6>{row.getValue("name")}</h6>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
