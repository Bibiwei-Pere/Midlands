"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { checkoutSchema } from "@/app/components/schema/Forms";
import { usePostTransaction, useVerifyPaystack } from "@/hooks/paystack";
import { useGetUser } from "@/hooks/users";
import { Loader2 } from "lucide-react";
import { useGetCourse } from "@/hooks/course";
import ReactPlayer from "react-player/lazy";
import { Check, ChevronDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SkeletonCard1 } from "@/components/ui/skeleton";
import { shortenText } from "@/app/components/dashboard/CourseCard";
import { ContainerDashboard } from "@/components/ui/containers";
import { Input } from "@/components/ui/input";

declare var PaystackPop: {
  setup: (options: {
    key: string;
    email: string;
    currency: string;
    amount: number;
    ref?: string;
    metadata?: {
      custom_fields?: {
        display_name: string;
        variable_name: string;
        value: string;
      }[];
    };
    onClose?: () => void;
    callback: (response: { reference: string }) => void;
  }) => {
    openIframe: () => void;
  };
};

const ConfirmCheckout = ({ params }: any) => {
  const { courseId } = params;
  const user = useGetUser();
  const { mutation } = useVerifyPaystack();
  const { mutation: postTransaction } = usePostTransaction();
  const course = useGetCourse(courseId);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    if (user?.data)
      form.reset({
        firstName: user?.data?.firstname || "",
        lastName: user?.data?.lastname || "",
        email: user?.data?.email || "",
      });
  }, [user?.data]);

  const handleSubmit = (data: any) => {
    console.log(data);

    let handler = PaystackPop.setup({
      key: `${process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY_LIVE}`,
      email: data.email,
      currency: "NGN",
      amount: data.amount * 100, // Paystack requires amount in kobo
      ref: data.reference, // unique reference
      metadata: {
        custom_fields: [
          {
            display_name: data.username,
            variable_name: data.product,
            value: data.email,
          },
        ],
      },
      callback: function (response) {
        console.log(response);
        mutation.mutate(data);
      },
    });

    handler.openIframe();
  };

  const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
    console.log(values);

    const data = {
      userId: user?.data?._id,
      product: course?.data?.title === "3in1" ? "Smart Trader Pack" : course?.data?.title,
      transactionType: "Paystack",
      amount: course?.data?.price,
      duration: course?.data?.durationHours,
      reference: `ref_${Math.random().toString(36).slice(2)}`,
      courseId: courseId,
      instructorId: course?.data?.user,
      notificationTitle: "New Course",
      notificationDesc: "You have successfully purchased",
    };

    postTransaction.mutate(data, {
      onSuccess: (response: any) => {
        console.log(response);
        handleSubmit({
          ...data,
          transactionId: response.data.transactionId,
          username: user?.data?.username,
          email: user?.data?.email,
        });
      },
      onError: (error) => {
        console.error("Error creating transaction:", error);
      },
    });

    // call the handle Submit function
  };

  if (user?.status !== "success" || course?.status !== "success") return <SkeletonCard1 />;
  else
    return (
      <ContainerDashboard>
        <h1 className='text-left'>Checkout</h1>

        <Form {...form}>
          <form>
            <div className='flex flex-col md:flex-row border-t border-gray-700 items-start gap-0 md:gap-6'>
              <div className='flex md:border-r py-0 pt-10 md:pt-0 md:py-10 pr-4 md:pr-8 border-gray-700 flex-col gap-5 w-full'>
                <div className='flex flex-col gap-5 mt-4'>
                  <h4>Account Details</h4>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='firstName'
                      render={({ field }) => (
                        <FormItem className='mt-4'>
                          <FormLabel className='bottom-0'>First name</FormLabel>
                          <Input {...field} placeholder='Enter First name' />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='lastName'
                      render={({ field }) => (
                        <FormItem className='mt-4'>
                          <FormLabel className='bottom-0'>Last name</FormLabel>
                          <Input {...field} placeholder='Enter Last name' />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem className='mt-4'>
                        <FormLabel className='bottom-0'>Email</FormLabel>
                        <Input {...field} placeholder='Enter Email address' />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex flex-col gap-5 mt-4'>
                  <h4>Billing Address</h4>
                  <FormField
                    control={form.control}
                    name='country'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country of residence</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant='secondary'
                              role='combobox'
                              className='rounded-md py-0 px-3 justify-between ml-0 border-gray-800 w-full hover:text-white hover:bg-black'
                            >
                              {field.value
                                ? countries.find((country) => country.name === field.value)?.name
                                : "Select a country"}
                              <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className='w-full p-0'>
                            <Command>
                              <CommandInput placeholder='Search countries...' />
                              <CommandList>
                                <CommandEmpty>No country found.</CommandEmpty>
                                <CommandGroup>
                                  {countries.map((country) => (
                                    <CommandItem
                                      value={country.name}
                                      key={country.name}
                                      onSelect={() => {
                                        form.setValue("country", country.name);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          country.name === field.value ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      <Image
                                        src={country.flag}
                                        alt={country.name}
                                        width={50}
                                        height={50}
                                        className='w-5 h-5 mr-3 rounded-full'
                                      />
                                      {country.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name='payment'
                    render={({ field }) => (
                      <FormItem className='mt-4'>
                        <FormLabel className='bottom-0'>Payment method</FormLabel>

                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder='Select payment method' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='Paystack'>Paystack</SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </div>

                <h4 className='mt-6 md:mt-14'>Order details</h4>

                <div className='flex flex-col gap-4 max-w-[373px] bg-[#0607155f] p-4 rounded-md'>
                  <div className='relative w-full  h-[182px] rounded-md'>
                    <ReactPlayer width={340} height={192} controls url={course?.data?.featuredVideo?.url} />
                  </div>
                  <h5 className='leading-6'>{shortenText(course?.data?.title, 70)}</h5>
                  <p className='leading-6'>{shortenText(course?.data?.miniDescription, 100)}</p>
                </div>
              </div>
              <div className='flex py-5 md:py-10 flex-col gap-5 pr-4 w-full md:w-[561px]'>
                <div className='flex flex-col gap-4 py-4 border-b border-gray-800'>
                  <h6>Order Summary</h6>
                  <div className='flex gap-2 items-center justify-between'>
                    <p>Price</p>
                    <h5 className='font-medium'>₦ {course?.data?.price.toLocaleString("en-NG")}</h5>
                  </div>
                  <div className='flex gap-2 items-center justify-between'>
                    <p>Discounts</p>
                    <h5>₦ 0</h5>
                  </div>
                </div>
                <div className='flex flex-col gap-2 py-1'>
                  <div className='flex gap-2 items-center justify-between'>
                    <p>Total</p>
                    <h5>₦ {course?.data?.price.toLocaleString("en-NG")}</h5>
                  </div>
                </div>
                <p className='text-center text-white mt-10'>
                  By completing your purchase you agree to our Terms of Service
                </p>
                <Button
                  type='button'
                  className='my-5 w-full'
                  disabled={postTransaction.isPending}
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {postTransaction.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Checkout"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </ContainerDashboard>
    );
};

export default ConfirmCheckout;

const countries = [
  { name: "Nigeria", flag: "https://flagcdn.com/w320/ng.png" },
  { name: "Ghana", flag: "https://flagcdn.com/w320/gh.png" },
  { name: "South Africa", flag: "https://flagcdn.com/w320/za.png" },
  {
    name: "United Kingdom",

    flag: "https://flagcdn.com/w320/gb.png",
  },
  {
    name: "United States",

    flag: "https://flagcdn.com/w320/us.png",
  },
  { name: "Canada", flag: "https://flagcdn.com/w320/ca.png" },
  { name: "Australia", flag: "https://flagcdn.com/w320/au.png" },
  { name: "Ireland", flag: "https://flagcdn.com/w320/ie.png" },
] as const;
