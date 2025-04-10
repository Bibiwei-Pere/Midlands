"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, User, LogOut, Trash } from "lucide-react";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Flag from "../assets/images/dashboard/Flag.svg";
import CheckGreen from "../assets/images/dashboard/CheckGreen.svg";
import Plus from "../assets/images/dashboard/Plus.svg";
import { useDeleteNotification, useUpdateNotification } from "@/hooks/notification";
// import { useDeleteSignal, useUpdateSignal } from "@/hooks/signal";
import { formatDateShort } from "@/hooks/auth";
import { shortenText } from "./CourseCard";

export const NotificationDropdown = ({ data, onNotificationRead, setRefresh }: any) => {
  const [notifications, setNotifications] = useState(data); // Local state for notifications
  const { mutation } = useDeleteNotification();
  const { mutation: update } = useUpdateNotification();

  useEffect(() => {
    if (data) setNotifications(data);
  }, [data]);

  const handleRead = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRefresh(true);
    // Mutate and update local state on success
    update.mutate(
      { id, isRead: true },
      {
        onSuccess: () => {
          // Update local notifications state immediately
          setNotifications((prevNotifications: any) =>
            prevNotifications.map((notification: any) =>
              notification._id === id ? { ...notification, isRead: true } : notification
            )
          );
          onNotificationRead(); // Notify parent of read status change
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    // Optimistically update UI by removing the item before mutation
    setNotifications((prevNotifications: any) =>
      prevNotifications.filter((notification: any) => notification._id !== id)
    );
    setRefresh(true);

    mutation.mutate(
      { id },
      {
        onError: () => {
          // On error, re-add the deleted item back into the state
          setNotifications((prevNotifications: any) => [
            ...prevNotifications,
            data.find((notification: any) => notification._id === id),
          ]);
        },
      }
    );
  };
  return (
    <div className='flex flex-col max-w-[300px] gap-5'>
      <h6 className='sticky top-0 z-50 bg-white py-4 w-full h-10'>Notifications</h6>
      {notifications?.length > 0 ? (
        notifications.map((item: any) => (
          <DropdownMenuItem
            className={`p-[10px] gap-4 items-start hover:bg-gray-100 transition duration-200 ${
              item.isRead ? "bg-white shadow-none" : "bg-gray-50 shadow-md"
            }`}
            key={item._id} // Use a unique key like `_id`
            onClick={(e) => handleRead(item._id, e)}
          >
            {item.title === "Failed transaction" ? (
              <Image
                src={Flag}
                alt='Flag'
                height={140}
                width={140}
                className='w-[30px] hover:cursor-pointer h-[30px] rounded-full'
              />
            ) : item.title === "New course" || item.title === "New quiz" ? (
              <Image
                src={Plus}
                alt='Plus'
                height={140}
                width={140}
                className='w-[30px] hover:cursor-pointer h-[30px] rounded-full'
              />
            ) : (
              <Image
                src={CheckGreen}
                alt='CheckGreen'
                height={140}
                width={140}
                className='w-[30px] hover:cursor-pointer h-[30px] rounded-full'
              />
            )}

            <div className='flex flex-col gap-3'>
              <span className='w-[180px] sm:w-[200px] md:w-full text-[#666666]'>
                {item.text} <b className='text-black'>{shortenText(item.product, 100)}</b>
              </span>
              <div className='flex justify-between items-center'>
                <p className='text-[#666666] text-xs sm:text-sm'>{formatDateShort(item.createdAt)}</p>
                <Trash
                  onClick={() => handleDelete(item._id)}
                  fill='red'
                  className='cursor-pointer text-red-500 h-4 w-4 hover:w-5'
                />
              </div>
            </div>
          </DropdownMenuItem>
        ))
      ) : (
        <p className='text-[#666666]'>No new notifications</p>
      )}
      <h6 className='sticky bottom-0 bg-white py-4 w-full h-8'></h6>
    </div>
  );
};

// export const SignalDropdown = ({ data, onSignalRead }: { data: any; onSignalRead: () => void }) => {
//   const { mutation } = useDeleteSignal();
//   const { mutation: update } = useUpdateSignal();
//   const navigation = useRouter();

//   const handleNavigation = (url: string, id: string, e: React.MouseEvent) => {
//     e.preventDefault(); // Prevent default link behavior
//     e.stopPropagation(); // Stop event bubbling
//     navigation.push(url);
//     console.log(id);
//     update.mutate(
//       {
//         signalId: id,
//         isRead: true,
//       },
//       {
//         onSuccess: () => {
//           onSignalRead(); // Decrease unread count in Navbar
//         },
//       }
//     );
//   };

//   return (
//     <div className='flex flex-col max-w-[300px] sm:max-w-[500px] gap-5'>
//       <h6 className='sticky top-0 z-50 bg-white py-4 w-full h-10'>Signals</h6>
//       {data && data.length > 0 ? (
//         data.map((item: any) => (
//           <DropdownMenuItem
//             className={`p-[10px] gap-4 items-start hover:bg-gray-100 transition duration-200 ${
//               item.isRead ? "bg-white shadow-none" : "bg-gray-50 shadow-md"
//             }`}
//             key={item.title}
//           >
//             <Image
//               src={CheckGreen}
//               alt='Signal icon'
//               height={40}
//               width={40}
//               className='w-[30px] hover:cursor-pointer h-[30px] rounded-full'
//             />
//             <div className='flex flex-col gap-3'>
//               <span className='w-[180px] sm:w-[200px] md:w-full text-[#666666]'>
//                 New <b className='text-black'>{item.orderType}</b> signal for{" "}
//                 <b className='text-black'>{item.currency}</b> has been added.{" "}
//                 <p
//                   className='cursor-pointer text-yellow-500'
//                   onClick={(e) => handleNavigation(`/dashboard/signal/${item._id}`, item._id, e)}
//                 >
//                   Click to view
//                 </p>
//                 <b className='text-black'>{item.product}</b>
//               </span>
//               <div className='flex justify-between items-center'>
//                 <p className='text-[#666666] text-xs sm:text-sm'>{formatDateShort(item.createdAt)}</p>
//                 {mutation.isPending ? (
//                   <Loader2 className='h-6 w-6 animate-spin' />
//                 ) : (
//                   <Trash
//                     onClick={() =>
//                       mutation.mutate({
//                         signalId: item._id,
//                       })
//                     }
//                     fill='red'
//                     className='cursor-pointer text-red-500 h-4 w-4 hover:w-5'
//                   />
//                 )}
//               </div>
//             </div>
//           </DropdownMenuItem>
//         ))
//       ) : (
//         <p className='text-gray-500 text-center'>No new signals</p>
//       )}
//       <h6 className='sticky bottom-0 bg-white py-4 w-full h-8'></h6>
//     </div>
//   );
// };

export const AvatarDropdown = () => {
  const navigation = useRouter();

  const handleNavigation = (url: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    e.stopPropagation(); // Stop event bubbling
    console.log("Navigating to:", url); // Logging to check
    navigation.push(url);
  };

  return (
    <div>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={(e) => handleNavigation("/dashboard/profile", e)}>
        <User className='mr-2 h-4 w-4' />
        <span>Profile</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={(e) => handleNavigation("/dashboard/settings/Profile", e)}>
        <Settings className='mr-2 h-4 w-4' />
        <span>Settings</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={(e) => handleNavigation("/auth/logout", e)}>
        <LogOut className='mr-2 h-4 w-4' />
        <span>Log out</span>
      </DropdownMenuItem>
    </div>
  );
};
