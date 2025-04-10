"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import Success from "../../app/components/assets/images/auth/success.png";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed max-w-screen-2xl min-h-screen overflow-scroll mx-auto inset-0 z-50 bg-gray-500/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed mx-auto max-h-[80vh] overflow-scroll rounded-lg left-[50%] top-[44%] sm:top-[50%] z-50 grid w-full max-w-[450px] sm:max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-black p-6 shadow-lg duration-200 overflow-y-auto",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
));

AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogAction2 = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn("bg-white absolute right-0 w-[30px] h-[30px] p-0 m-0 hover:bg-transparent", className)}
    {...props}
  />
));
AlertDialogAction2.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => <AlertDialogPrimitive.Cancel ref={ref} className={cn("", className)} {...props} />);
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

interface Props {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const ErrorModal = ({ description, children }: Props) => {
  return (
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
              <h6 className='text-left text-black pb-2 leading-[1.3]'>An error occured</h6>
              <p className='text-left text-gray-600 mb-2'>{description}</p>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className='flex mt-[10px]'>
          <div className='flex gap-[10px] max-w-[500px]'>{children}</div>
        </AlertDialogFooter>
      </div>
    </AlertDialogContent>
  );
};

const SuccessModal = ({ title, description, children }: Props) => {
  return (
    <AlertDialogContent className='left-[50%] top-[50%]'>
      <AlertDialogHeader className='flex items-center mt-10 w-full'>
        <Image src={Success} alt='Success' />
        <AlertDialogTitle className='text-black pb-2'>{!title && "Successful!"}</AlertDialogTitle>
        {description && <p className='text-gray-600'>{description}</p>}
      </AlertDialogHeader>
      <div className='flex gap-[10px] max-w-[500px]'>{children}</div>
    </AlertDialogContent>
  );
};

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  ErrorModal,
  SuccessModal,
};
