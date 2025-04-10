"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Logo from "../components/assets/images/landingPage/Logo.svg";
import heroImage from "../components/assets/images/landingPage/Coming_soon.png";
import Image from "next/image";
import { Reveal3 } from "../components/animations/Reveal";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetAllComing, usePostComingSoon } from "@/hooks/coming-soon";
import { Loader2 } from "lucide-react";

const ComingSoon = () => {
  const ab = useGetAllComing();
  console.log(ab.data);
  const { mutation } = usePostComingSoon();
  const emailSchema = z.object({
    email: z.string().min(2, { message: "Email is required" }).default(""),
    name: z.string().min(2, { message: "Name is required" }).default(""),
    phone: z.string().min(2, { message: "Phone is required" }).default(""),
  });

  const onSubmit = (values: z.infer<typeof emailSchema>) => {
    console.log(values);
    mutation.mutate(values);
  };

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
  });

  return (
    <section className='flex min-h-screen mb-10 md:mb-0 items-center justify-center'>
      <section className='bg-black grid grid-flow-row md:grid-flow-col md:grid-cols-[1fr,411px] lg:grid-cols-[1fr,611px] xl:min-h-[969px] items-center justify-center max-w-screen-2xl mx-auto md:gap-20 lg:gap-32'>
        <div className='flex relative h-full flex-col pl-4 pr-4 md:pl-10 lg:pl-20 md:pr-0 lg:pr-10 pt-32 pb-10 gap-3 items-center md:items-start justify-center mx-auto'>
          <Image className='absolute left-2 md:left-8 lg:left-[60px] top-[40px]' src={Logo} alt='Logo' />
          <h4 className='text-yellow-500'>COMING SOON</h4>
          <h1 className='max-w-[457px] xl:max-w-[557px] text-center md:text-left'>Get your dancing shoes ready</h1>

          <Reveal3>
            <p className='max-w-[457px] leading-7 mt-3 text-center md:text-left'>
              We're putting the finishing touches on our website and getting ready to launch. Sign up for updates and be
              the first to know when we go live.
            </p>
          </Reveal3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col w-full gap-3'>
              <div className='grid grid-cols-2 gap-2'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='mt-4 w-full'>
                      <Input placeholder='Full name' {...field} />
                      <FormMessage className='relative top-1' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem className='mt-4 w-full'>
                      <Input placeholder='Phone number' {...field} />
                      <FormMessage className='relative top-1' />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='mt-4 w-full'>
                    <Input placeholder='Email address' {...field} />
                    <FormMessage className='relative top-1' />
                  </FormItem>
                )}
              />
              <Button variant={"buy"} className='max-w-[350px]'>
                {mutation.isPending ? <Loader2 className='h-4 w-5 animate-spin' /> : "Invite me"}
              </Button>
            </form>
          </Form>

          <p className='max-w-full leading-7 mt-3 text-center md:text-left'>
            Sign up for updates to be the first to know when we launch. No spam, just important information and
            exclusive offers.
          </p>
        </div>
        <div className='relative m-4 md:m-0 max-h-[310px] md:max-h-full rounded-lg md:rounded-none overflow-hidden border-gray-400'>
          <Image className='w-full mx-auto' src={heroImage} alt='heroImage' />
        </div>
      </section>
    </section>
  );
};

export default ComingSoon;
