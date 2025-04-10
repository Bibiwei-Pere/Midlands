import { cn } from "@/lib/utils";
import React from "react";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-gray-700", className)} {...props} />;
}

function SkeletonDemo() {
  return (
    <div className='flex items-center space-x-4'>
      <Skeleton className='h-12 w-12 rounded-full' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-full sm:w-[250px]' />
        <Skeleton className='h-4 w-[200px]' />
      </div>
    </div>
  );
}

function SkeletonCard1() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 flex-wrap px-4 gap-5 overflow-hidden mt-4'>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
    </div>
  );
}

function SkeletonCard2() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 flex-wrap px-4 gap-5 overflow-hidden mt-4'>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
    </div>
  );
}

function SkeletonCard3() {
  return (
    <div className='flex flex-wrap px-4 gap-5 overflow-hidden mt-4'>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
      <div className='flex flex-col space-y-3'>
        <Skeleton className='h-[165px] w-full rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
    </div>
  );
}

export { SkeletonCard1, SkeletonCard2, SkeletonCard3, SkeletonDemo };
