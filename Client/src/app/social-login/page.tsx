"use client";
import React, { useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { socialLoginSchema } from "@/app/components/schema/Forms";
import { useForm } from "react-hook-form";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ContainerAuth } from "@/components/ui/containers";
import { WrapperAuth } from "@/components/ui/wrappers";
import { useUpdateUser } from "@/hooks/users";
import { useSession } from "next-auth/react";
import { REGEXP_ONLY_DIGITS } from "input-otp";

const SocialLogin = () => {
  const [hide, setHide] = useState(true);
  const navigation = useRouter();
  const { mutation } = useUpdateUser();

  const { data: session } = useSession();
  console.log(session);

  const form = useForm<z.infer<typeof socialLoginSchema>>({
    resolver: zodResolver(socialLoginSchema),
  });

  const onSubmit = (values: z.infer<typeof socialLoginSchema>) =>
    mutation.mutate(
      {
        userId: session?.user?.id,
        phone: values.phone,
        passwordReset: {
          password: values.password,
          isGoogleSignIn: true,
        },
      },
      {
        onSuccess: () => (window.location.href = "/dashboard"),
      }
    );

  return (
    <ContainerAuth>
      <WrapperAuth>
        <p
          onClick={() => navigation.push("/auth/login")}
          className='flex mx-auto gap-3 mb-4 hover:text-white text-center'
        >
          <ArrowLeft className='w-6' />
          Back to log in
        </p>
        <h1>Set password</h1>
        {/* <p className='text-center'>Your new password must be different from previously used passwords.</p> */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
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

            <Button
              variant={"buy"}
              className='max-w-[350px] w-full mt-5 mb-3'
              type='submit'
              disabled={mutation.isPending}
            >
              {mutation.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Proceed"}
            </Button>
          </form>
        </Form>
      </WrapperAuth>
    </ContainerAuth>
  );
};

export default SocialLogin;
