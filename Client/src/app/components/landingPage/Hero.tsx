"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const Hero = () => {
  return (
    <section
      id='home'
      className='bg-black grid grid-flow-row gap-10 items-center justify-center pt-36 sm:pt-48 pb-24 lg:px-8 xl:px-24 px-4 max-w-screen-2xl mx-auto'
    >
      <div className='flex flex-col gap-3 items-center justify-center max-w-[535px] mx-auto'>
        <h1>Welcome</h1>
        <h1 className='bg-gradient-to-r from-[#f4e6bd] from-10% via-[#fcd259] via-30% to-[#a18e55] to-90% text-transparent bg-clip-text'>
          Your Landing Page
        </h1>
        <Button variant={"outline"}>
          <Link href='/auth/signup' target='_blank' rel='noopener noreferrer' className='flex items-center gap-2'>
            Get Started
            <ArrowUpRight className='w-5' />
          </Link>
        </Button>
      </div>
    </section>
  );
};
