"use client";
import React from "react";
import Link from "next/link";
import chsLogo from "../assets/images/landingPage/chsLogo.svg"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {AlignRight, LogOut} from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const Header = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  return (
    <div className='z-50 fixed bg-white top-0 py-4 right-0 left-0 shadow-sm'>
      <div className='hidden lg:flex lg:pl-6 xl:pl-20 lg:pr-8 xl:pr-24 justify-between items-center max-w-screen-2xl mx-auto'>
        <div className='flex items-center justify-start gap-9'>
          <div className='flex gap-1 items-center'>
            <Link href='/'>
            <Image src={chsLogo} alt="logo"  />
            </Link>
          </div>
          <ul className='flex items-cnter gap-9'>
            {navContent.map((item, index: number) => (
              <Link key={index} href={item.url}>
                <p
                  className={`hover:text-[#FFBE00] text-[16px] leading-6 tracking-[0.5px] text-chstext-primary hover:font-medium border-b-2 pb-1 ${
                    pathname === item.url
                      ? "text-[#FFBE00]  border-[#FFBE00] hover:border-white"
                      : "border-transparent"
                  }`}
                >
                  {item.title}
                </p>
              </Link>
            ))}
          </ul>
        </div>
        {session ? (
          <div className='flex gap-4 items-center'>
            <Link href='/dashboard'>
              <Button variant={"ghost"} className="text-chsprimary hover:underline hover:text-chsprimary">Dashboard</Button>
            </Link>
            <Link href='/auth/logout'>
              <button className='px-8 py-3 text-red-600 border border-red-600 flex gap-2  font-medium rounded hover:opacity-75 transition-colors'>
                logout
                <LogOut className='w-5 text-red-600' />
              </button>            </Link>
          </div>
        ) : (
          <div className='flex gap-4 items-center'>
            <Link target='_blank' rel='noopener noreferrer' href='/auth/signup'>
              <Button variant={"ghost"} className="text-chsprimary">Sign Up</Button>           </Link>

            <Link target='_blank' rel='noopener noreferrer' href='/auth/login'>
              <button className='px-8 py-3 bg-chsprimary flex gap-2 text-white font-medium rounded hover:opacity-75 transition-colors'>
                Login
              </button>
            </Link>
          </div>
        )}
      </div>
      <div className='lg:hidden z-50 flex justify-between items-center pr-4 pl-3'>
        <div className='flex gap-1 items-center'>
          <Link href='/'>
          <Image src={chsLogo} alt="logo"  />
          </Link>
        </div>
        <MobileMenu />
      </div>
    </div>
  );
};

export default Header;

const MobileMenu = () => {
  const { data: session } = useSession();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <AlignRight className='w-[30px] h-[30px] text-black cursor-pointer' />
      </SheetTrigger>
      <SheetContent>
        <div className='flex flex-col gap-5 mt-10'>
          {navContent.map((header: any) => (
            <section key={header.title}>
              <Link href={header.url} className='text-black uppercase hover:font-semibold'>
                <SheetClose asChild>
                  <span className='text-black uppercase hover:font-semibold'>{header.title}</span>
                </SheetClose>
              </Link>
            </section>
          ))}
          {session ? (
            <div className='flex gap-4 items-center'>
              <Link href='/dashboard'>
                <Button variant={"secondary"}>Dashboard</Button>
              </Link>
              <Link href='/auth/logout'>
                <Button className='ml-0'>Logout</Button>
              </Link>
            </div>
          ) : (
            <div className='flex gap-4 items-center'>
              <Link target='_blank' rel='noopener noreferrer' href='/auth/signup'>
                <Button variant={"secondary"}>Sign Up</Button>
              </Link>
              <Link target='_blank' rel='noopener noreferrer' href='/auth/login'>
                <Button>Login</Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const navContent = [
  {
    url: "/",
    title: "Home",
  },
  {
    url: "/about-us",
    title: "About Us",
  },
  {
    url: "/courses",
    title: "Courses",
  },
  {
    url: "/pricing",
    title: "Pricing",
  },
  {
    url: "/contact",
    title: "Contact Us",
  },
];
