"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Settings, Bell, User, AlignLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useGetUser } from "@/hooks/users";
import { useGetNotification } from "@/hooks/notification";
import Link from "next/link";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { sidebarContent } from "./Sidebar";
import { AvatarDropdown, NotificationDropdown } from "./NavDropdown";
import { useSession } from "next-auth/react";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { BookSession } from "./RequestPayout";
import ceo from "../assets/images/dashboard/hero3.jpg";

const Navbar = ({
  setIsSearch,
  isSearch,
}: {
  setIsSearch: React.Dispatch<React.SetStateAction<boolean>>;
  isSearch: any;
}) => {
  const pathname = usePathname();
  const navigation = useRouter();
  const user = useGetUser();
  const [unread, setUnread] = useState(0);
  const { data: notifications } = useGetNotification();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (notifications) {
      const unreadNotifications = notifications.filter((notification: any) => notification.isRead === false);
      setUnread(unreadNotifications.length);
    }
  }, [notifications]);

  const handleNotificationRead = () => setUnread((prev) => (prev > 0 ? prev - 1 : 0));

  const handleDropdownClose = () => {
    setOpenDropdown(false);
    if (refresh) window.location.reload(); // Reloads the page when the dropdown closes
  };

  return (
    <div
      className={`w-full z-50 px-4 md:px-12 sticky top-0 pb-4 flex items-center gap-16 justify-between sm:justify-end bg-black pt-4 sm:pt-8 border-b-2 border-gray-800`}
    >
      <div className='md:hidden'>
        <MobileMenu />
      </div>

      {!isSearch && (
        <Input
          onFocus={() => setIsSearch(true)}
          placeholder='Search courses'
          className='hidden sm:flex bg-white placeholder:text-gray-600 text-black'
        />
      )}
      <ul className='flex gap-2 sm:gap-4 items-center'>
        {navbarContent.map((item) => (
          <div key={item.url} onClick={() => navigation.push(`${item.url}`)}>
            {item.title === "Avatar" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className='w-[35px] sm:w-[50px] hover:cursor-pointer h-[35px] sm:h-[50px] rounded-full overflow-hidden'>
                    <Image
                      src={user?.data?.avatar?.url || "/noavatar.png"}
                      alt='Avatar'
                      height={450}
                      width={450}
                      className='w-full h-full object-cover'
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <AvatarDropdown />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : item.title === "Notification" ? (
              <DropdownMenu
                open={openDropdown}
                onOpenChange={(isOpen) => {
                  setOpenDropdown(isOpen);
                  if (!isOpen) handleDropdownClose(); // Trigger page reload when closing
                }}
              >
                <div className='relative'>
                  {unread > 0 && (
                    <div className='rounded-full absolute top-[-12px] left-[-2px] p-[2px] flex items-center justify-center text-[11px] h-4 bg-red-600'>
                      {unread > 99 ? "99+" : unread}
                    </div>
                  )}
                  <DropdownMenuTrigger asChild>
                    <item.icon
                      className={`hover:text-[#FFBE00] hover:font-medium border-b-2 pb-1 ${
                        pathname === item.url
                          ? "text-[#FFBE00] hover:text-white border-[#FFBE00] hover:border-white"
                          : "border-black"
                      }`}
                    />
                  </DropdownMenuTrigger>
                </div>

                <DropdownMenuContent className='relative mr-0 bg-white px-6 max-h-[350px] md:max-h-[500px] py-0 overflow-y-scroll'>
                  <NotificationDropdown
                    data={notifications}
                    setRefresh={setRefresh}
                    onNotificationRead={handleNotificationRead}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <item.icon
                className={`hover:text-[#FFBE00] hover:font-medium border-b-2 pb-1 ${
                  pathname === item.url
                    ? "text-[#FFBE00] hover:text-white border-[#FFBE00] hover:border-white"
                    : "border-black"
                }`}
              />
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;

const navbarContent = [
  // {
  //   url: "#",
  //   title: "Signals",
  //   icon: Radio,
  // },
  {
    url: "/dashboard/settings/Profile",
    title: "Settings",
    icon: Settings,
  },
  {
    url: "#",
    title: "Notification",
    icon: Bell,
  },
  {
    url: "#",
    title: "Avatar",
    icon: User,
  },
];

const MobileMenu = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <Sheet>
        <SheetTrigger asChild>
          <AlignLeft className='w-[30px] h-[30px] cursor-pointer' />
        </SheetTrigger>
        <SheetContent className='pb-20 bg-yellow-50 overflow-y-scroll'>
          <div className='flex flex-col gap-5 mt-10'>
            {sidebarContent.map((sidebar) => (
              <SheetClose asChild key={sidebar.title}>
                <Link
                  href={sidebar.url}
                  className={`${
                    session?.user?.role === "Admin" ? "" : sidebar.class
                  } grid grid-cols-[30px,1fr] gap-1 items-center py-1 rounded-md px-2 hover:bg-black hover:text-yellow-500 text-black ${
                    pathname === sidebar.url && "bg-yellow-500"
                  }`}
                >
                  <sidebar.icon />
                  <h6 className='uppercase'>{sidebar.title}</h6>
                </Link>
              </SheetClose>
            ))}

            <div className='flex flex-col gap-4 mt-24'>
              <Button className='text-white'>
                <Link href='#'>Contact us now</Link>
              </Button>
              <Button className='text-white'>
                <Link target='_blank' rel='noopener noreferrer' href='https://t.me/+6QChmU03TMY4MWVk%20%20%20'>
                  Visit Telegram Community
                </Link>
              </Button>
              <div className='bg-white rounded-lg p-4 flex flex-col items-center gap-3'>
                <Image src={ceo} alt='Mentor' width={600} height={600} className='w-full' />
                <p className='text-black text-center mt-4'>Book a One-on-One Session with our mentors</p>

                <SheetClose>
                  <AlertDialogTrigger asChild>
                    <Button>Book Session</Button>
                  </AlertDialogTrigger>
                </SheetClose>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <AlertDialogContent>
        <div>
          <BookSession setIsOpen={setIsOpen} />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
