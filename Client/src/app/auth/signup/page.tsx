"use client";
import Image from "next/image";
import React, { useState } from "react";
import Google from "../../components/assets/images/auth/google.svg";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/app/components/schema/Forms";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, ErrorModal } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { ContainerAuth } from "@/components/ui/containers";
import { WrapperAuth } from "@/components/ui/wrappers";
import { Checkbox } from "@/components/ui/checkbox";
import { useSignup } from "@/hooks/auth";
import { signIn } from "next-auth/react";
import { REGEXP_ONLY_DIGITS } from "input-otp";

const Signup = () => {
  const [errorModal, setErrorModal] = useState(false);
  const [hide, setHide] = useState(true);
  const [hide2, setHide2] = useState(true);
  const navigation = useRouter();

  const { mutation, response } = useSignup();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (values: z.infer<typeof signupSchema>) =>
    mutation.mutate({ ...values, email: values.email.toLocaleLowerCase() });

  React.useEffect(() => {
    if (mutation.isError) setErrorModal(true);
  }, [mutation.isError]);

  return (
    <ContainerAuth>
      <WrapperAuth>
        <h1>Sign up To Get Started</h1>
        <p className='text-center'>Create an account to get started on mywebsite</p>
        <div className='grid grid-cols-2 mt-2 mb-4'>
          <Button
            onClick={() => navigation.push("signup")}
            variant={"buy"}
            className='bg-[#FFFFFF26] max-w-full w-full rounded-e-none'
          >
            Create account
          </Button>
          <Button onClick={() => navigation.push("login")} className='bg-[#FFFFFF0D] w-full rounded-s-none'>
            Log In
          </Button>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>

                  <Input
                    autoComplete='user-names' // Use "new-password" to prevent autofill
                    type='text'
                    placeholder='Enter your username'
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>

                  <Input
                    autoComplete='user-emails' // Use "new-password" to prevent autofill
                    type='email'
                    placeholder='Enter your email'
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <Input placeholder='Enter your phone number' pattern={REGEXP_ONLY_DIGITS} {...field} />
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
                      autoComplete='new-passwords' // Use "new-password" to prevent autofill
                      type={`${hide ? "password" : "text"}`}
                      placeholder='Password must be atleast 6 characters'
                      {...field}
                    />
                    {hide ? (
                      <EyeOff
                        className='absolute right-3 text-gray-600 top-2 hover:text-white cursor bg-black pl-1 sm:pl-0-pointer'
                        onClick={() => setHide(!hide)}
                      />
                    ) : (
                      <Eye
                        className='absolute right-3 text-gray-600 top-2 hover:text-white cursor bg-black pl-1 sm:pl-0-pointer'
                        onClick={() => setHide(!hide)}
                      />
                    )}
                  </div>
                  <FormMessage className='top-1' />
                </FormItem>
              )}
            />
            <FormField
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <div className='relative flex justify-between w-full'>
                    <Input
                      autoComplete='new-passwordss' // Use "new-password" to prevent autofill
                      type={`${hide2 ? "password" : "text"}`}
                      placeholder='Password must be atleast 6 characters'
                      {...field}
                    />
                    {hide2 ? (
                      <EyeOff
                        className='absolute right-3 text-gray-600 top-2 hover:text-white cursor bg-black pl-1 sm:pl-0-pointer'
                        onClick={() => setHide2(!hide2)}
                      />
                    ) : (
                      <Eye
                        className='absolute right-3 text-gray-600 top-2 hover:text-white cursor bg-black pl-1 sm:pl-0-pointer'
                        onClick={() => setHide2(!hide2)}
                      />
                    )}
                  </div>
                  <FormMessage className='top-1' />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-2'>
              <Checkbox required />
              <p className='text-white text-[12px]'>
                {/* <p className='text-white'> */}I agree to the{" "}
                <b
                  onClick={() => navigation.push("/terms")}
                  className='hover:text-yellow-500 border-b hover:border-yellow-500 cursor-pointer'
                >
                  Terms Of Service
                </b>{" "}
                and{" "}
                <b
                  onClick={() => navigation.push("/privacy")}
                  className='hover:text-yellow-500 cursor-pointer border-b hover:border-yellow-500 '
                >
                  Privacy Policy
                </b>
              </p>{" "}
            </div>
            <Button
              variant={"buy"}
              className='max-w-[350px] w-full mt-5 mb-3'
              type='submit'
              disabled={mutation.isPending}
            >
              {mutation.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Sign Up"}
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
                <p className='hidden sm:block'>Sign up with Google</p>
              </Button>
            </div>
          </form>
        </Form>
      </WrapperAuth>
      {mutation.isError && (
        <AlertDialog open={errorModal}>
          <ErrorModal description={response}>
            <AlertDialogAction onClick={() => setErrorModal(false)}>Close</AlertDialogAction>
          </ErrorModal>
        </AlertDialog>
      )}
    </ContainerAuth>
  );
};

export default Signup;
