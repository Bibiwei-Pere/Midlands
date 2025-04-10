"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
// import Apple from "../../components/assets/images/auth/apple.svg";
// import Facebook from "../../components/assets/images/auth/facebook.svg";
import Google from "../../components/assets/images/auth/google.svg";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/app/components/schema/Forms";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, ErrorModal } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { ContainerAuth } from "@/components/ui/containers";
import { WrapperAuth } from "@/components/ui/wrappers";
import { useLogin } from "@/hooks/auth";
import { signIn } from "next-auth/react";

const Login = () => {
  const [hide, setHide] = useState(true);
  const navigation = useRouter();
  const { mutation, response, setResponse } = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) =>
    mutation.mutate({ ...values, email: values.email.toLowerCase() });

  return (
    <ContainerAuth>
      <WrapperAuth>
        <h1>Welcome back</h1>
        <p className='text-center'>Login to your account</p>
        <div className='grid grid-cols-2 mt-2 mb-4'>
          <Button onClick={() => navigation.push("signup")} className='bg-[#FFFFFF0D] w-full rounded-e-none'>
            Create account
          </Button>
          <Button
            onClick={() => navigation.push("login")}
            variant={"buy"}
            className='bg-[#FFFFFF26] max-w-full w-full rounded-s-none'
          >
            Log In
          </Button>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    autoComplete='user-emails' // Use "new-password" to prevent autofill
                    type='email'
                    placeholder='john.doe@example.com'
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className='relative flex justify-between w-full'>
                    <Input
                      autoComplete='new-passwordss' // Use "new-password" to prevent autofill
                      type={`${hide ? "password" : "text"}`}
                      placeholder='Password must be atleast 6 characters'
                      {...field}
                    />
                    {hide ? (
                      <EyeOff
                        className='absolute right-3 text-gray-600 top-2 hover:text-white cursor-pointer bg-black pl-1 sm:pl-0'
                        onClick={() => setHide(!hide)}
                      />
                    ) : (
                      <Eye
                        className='absolute right-3 text-gray-600 top-2 hover:text-white cursor-pointer bg-black pl-1 sm:pl-0'
                        onClick={() => setHide(!hide)}
                      />
                    )}
                  </div>
                  <FormMessage className='top-1' />
                </FormItem>
              )}
            />
            <div>
              <Link href='reset-password' className='hover:text-yellow-500'>
                Fogot Password?
              </Link>
            </div>
            <Button
              variant={"buy"}
              className='max-w-[350px] w-full mt-5 mb-3'
              type='submit'
              disabled={mutation.isPending}
            >
              {mutation.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Log In"}
            </Button>
            <div className='max-w-[414px] w-full mx-auto grid items-center gap-8 grid-cols-[1fr_10px_1fr]'>
              <span className='bg-white h-px'></span>
              <h6>Or</h6>
              <span className='bg-white h-px'></span>
            </div>
            <div className='max-w-[414px] flex justify-between mx-auto w-full gap-2'>
              <Button
                type='button'
                onClick={async () =>
                  await signIn("google", {
                    callbackUrl: "/dashboard",
                  })
                }
                className='w-full gap-2'
                variant={"ghost"}
              >
                <Image src={Google} alt='Envelope' />
                <p className='hidden sm:block'>Sign in with Google</p>
              </Button>
              {/* <Button className='w-full' variant={"ghost"}>
                <Image src={Apple} alt='Envelope' />
              </Button>
              <Button className='w-full' variant={"ghost"}>
                <Image src={Facebook} alt='Envelope' />
              </Button> */}
            </div>
          </form>
        </Form>
      </WrapperAuth>
      {response && (
        <AlertDialog open onOpenChange={() => setResponse("")}>
          <ErrorModal description={response}>
            <AlertDialogAction className='hover:bg-black hover:text-white'>Close</AlertDialogAction>
          </ErrorModal>
        </AlertDialog>
      )}
    </ContainerAuth>
  );
};

export default Login;
