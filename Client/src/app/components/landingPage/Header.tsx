"use client";
import React from "react";
import Link from "next/link";
import Logo from "../assets/images/landingPage/LogoIcon.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AlignRight } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const Header = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  return (
    <div className='z-50 fixed bg-black top-0 py-4 right-0 left-0 shadow-sm'>
      <div className='hidden lg:flex lg:pl-6 xl:pl-20 lg:pr-8 xl:pr-24 justify-between items-center max-w-screen-2xl mx-auto'>
        <div className='flex justify-start gap-9'>
          <div className='flex gap-1 items-center'>
            <h6>Logo</h6>
          </div>
          <ul className='flex gap-9'>
            {navContent.map((item, index: number) => (
              <Link key={index} href={item.url}>
                <p
                  className={`hover:text-[#FFBE00] hover:font-medium border-b-2 pb-1 ${
                    pathname === item.url
                      ? "text-[#FFBE00] hover:text-white border-[#FFBE00] hover:border-white"
                      : "border-black"
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
      <div className='lg:hidden z-50 flex justify-between items-center pr-4 pl-3'>
        <div className='flex gap-1 items-center'>
          <Image className='w-[40px]' src={Logo} alt='Logo' />
          <h6>Logo</h6>
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
        <AlignRight className='w-[30px] h-[30px] cursor-pointer' />
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
              <Link target='_blank' rel='noopener noreferrer' href='auth/signup'>
                <Button variant={"secondary"}>Sign Up</Button>
              </Link>
              <Link target='_blank' rel='noopener noreferrer' href='auth/login'>
                <Button variant={"secondary"}>Login</Button>
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
    url: "#features",
    title: "Features",
  },
  {
    url: "#testimonials",
    title: "Testimonials",
  },
  {
    url: "#faqs",
    title: "FAQs",
  },
];
