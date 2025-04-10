"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

const Email = () => {
  return (
    <div className='flex flex-col'>
      <div className='border-b pt-10 pb-5 border-[#EAECF01A] justify-self-start'>
        <h6>Email</h6>
        <p className='my-[5px] text-sm '>Please enter your current email to change your email.</p>
      </div>
      <div className='flex flex-col gap-[15px] px-[30px] border-b py-6 border-[#EAECF01A]'>
        <div className='flex items-start justify-between gap-5 max-w-[1016px]'>
          <h6 className='w-full'>Current email</h6>
          <Input placeholder='john@yahoo.com' />
        </div>
      </div>
      <div className='flex flex-col gap-[15px] px-[30px] border-b py-6 border-[#EAECF01A]'>
        <div className='flex items-start justify-between gap-5 max-w-[1016px]'>
          <h6 className='w-full'>New email</h6>
          <div className='flex flex-col w-full'>
            <Input placeholder='john@yahoo.com' />
            <p>Your new email must be different from the current email.</p>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-[15px] px-[30px] border-b py-6 border-[#EAECF01A]'>
        <div className='flex items-start justify-between gap-5 max-w-[1016px]'>
          <h6 className='w-full'>Password</h6>
          <Input placeholder='john@yahoo.com' />
        </div>
      </div>
      <div className='flex w-full justify-end items-end'>
        <div className='flex gap-3 mt-10'>
          <Button>Cancel</Button>
          <Button variant={"buy"} className='bg-[#FFFFFF1A]'>
            Update password
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Email;
