"use client";
import React from "react";
import { Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialogCancel, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { useDeleteCourse } from "@/hooks/course";

export const DeleteCourse = ({ id }: any) => {
  const { mutation } = useDeleteCourse();
  return (
    <div>
      <div className='flex mb-10 justify-between items-center'>
        <h6>Delete Course</h6>
        <AlertDialogCancel>
          <XCircle className='hover:text-yellow-500 cursor-pointer' />
        </AlertDialogCancel>
      </div>

      <p>By choosing delete, this course will be permanently deleted from the platform.</p>
      <AlertDialogFooter>
        <Button
          variant={"destructive"}
          onClick={() =>
            mutation.mutate({
              courseId: id,
            })
          }
          className='w-full mt-10'
        >
          {mutation.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Delete"}
        </Button>
      </AlertDialogFooter>
    </div>
  );
};
