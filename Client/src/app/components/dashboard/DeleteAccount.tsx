"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteUser } from "@/hooks/users";
import { useSession } from "next-auth/react";

export const DeletedAccount = () => {
  const { data: session } = useSession();
  const { mutation } = useDeleteUser();
  return (
    <div className='max-w-[640px] mx-auto sm:px-5 py-4 sm:mt-14 sm:mb-10'>
      <div className='flex gap-4 border border-gray-800 rounded-lg p-4 flex-col w-full'>
        <h6>Delete Your Account</h6>
        <p>Permanently close and delete your account. Once deleted, your account cannot be restored.</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className='mx-auto' variant={"destructive"}>
              Request deletion of account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className='bg-transparent left-[50%] top-[50%] px-4'>
            <div className='rounded-lg p-4 sm:px-6 sm:py-5 bg-white'>
              <AlertDialogHeader className='flex-row gap-4'>
                <div className='rounded-full w-[48px] h-[48px] p-[10px] flex items-center justify-center bg-[#FFFAEB]'>
                  <div className='rounded-full w-[32px] h-[32px] p-[5px] flex items-center justify-center bg-yellow-100'>
                    <AlertTriangle className='text-red-700' />
                  </div>
                </div>
                <div className='flex flex-col gap-4 w-full'>
                  <div>
                    <h6 className='text-left text-black pb-2 leading-[1.3]'>Delete Account</h6>
                    <p className='text-left text-gray-600 mb-2'>
                      Your account will be Permanently deleted from this platform
                    </p>
                  </div>
                </div>
              </AlertDialogHeader>
              <div className='flex justify-end mt-2'>
                <div className='flex max-w-[235px] gap-2'>
                  <AlertDialogCancel>
                    <Button variant={"outline"}>Close</Button>
                  </AlertDialogCancel>
                  <Button
                    variant={"destructive"}
                    onClick={() =>
                      mutation.mutate(
                        { userId: session?.user?.id },
                        {
                          onSuccess: () => (window.location.href = "/auth/login"),
                        }
                      )
                    }
                    className='ml-0 mt-0 w-[116px]'
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Continue"}
                  </Button>
                </div>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
