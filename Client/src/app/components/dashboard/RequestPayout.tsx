"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formSchemaBookSession, requestPayoutSchema } from "../schema/Forms";
import { CalendarRange, Copy, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetUser } from "@/hooks/users";
import { usePostTransaction, useVerifyPaystack } from "@/hooks/paystack";
import { usePostPayout } from "@/hooks/payout";
import { useRouter } from "next/navigation";
import QR_Code from "../assets/images/dashboard/QR_Code.jpg";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { waitForThreeSeconds } from "@/hooks/auth";

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
        transactionId?: string;
        reference?: string;
        product?: string;
        transactionType?: string;
        notificationTitle?: string;
        notificationDesc?: string;
      }[];
    };
    onClose?: () => void;
    callback: (response: { reference: string }) => void;
  }) => {
    openIframe: () => void;
  };
};

export const RequestPayout = () => {
  const { data: user } = useGetUser();
  const { mutation } = usePostPayout();

  const onSubmit = (values: z.infer<typeof requestPayoutSchema>) => {
    mutation.mutate({
      userId: user?._id,
      amount: values.amount,
    });
  };

  const form = useForm<z.infer<typeof requestPayoutSchema>>({
    resolver: zodResolver(requestPayoutSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
        <div className='flex mb-10 justify-between items-center'>
          <h6>Affiliate Withdrawal</h6>
          <AlertDialogCancel>
            <XCircle className='hover:text-yellow-500 cursor-pointer' />
          </AlertDialogCancel>
        </div>
        <AlertDialogTitle className='text-gray-400'>
          Available Payout: <b className='font-normal'>₦ {user?.affiliate?.balance || 0}</b>
        </AlertDialogTitle>

        <FormField
          control={form.control}
          name='amount'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Withdrawal amount</FormLabel>
              <Input placeholder='Enter amount' {...field} />
              <FormMessage className='relative top-1' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='beneficiary'
          render={({}) => (
            <FormItem>
              <FormLabel>Account details</FormLabel>
              {user?.bankDetails?.bankName ? (
                <div className='flex flex-col gap-2'>
                  <p>
                    Bank name: <b className='text-white'>{user?.bankDetails?.bankName}</b>
                  </p>
                  <p>
                    Account name: <b className='text-white'>{user?.bankDetails?.accountName}</b>
                  </p>
                  <p>
                    Account number: <b className='text-white'>{user?.bankDetails?.accountNumber}</b>
                  </p>
                </div>
              ) : (
                <p className='mt-10'>
                  No bank details added yet,{" "}
                  <Link href='/dashboard/settings/Payment'>
                    <b className='text-yellow-500 cursor-pointer hover:text-white'>Click to add</b>
                  </Link>
                </p>
              )}
              <FormMessage />
              <FormMessage />
            </FormItem>
          )}
        />

        <AlertDialogFooter>
          <Button variant={"buy"} className='w-full mt-10'>
            Withdraw
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
};

export const BookSession = ({ setIsOpen, programData }: any) => {
  const [desc, setDesc] = useState(programData?.description || "");
  const [amount, setAmount] = useState(programData?.amount || 0);
  const [data, setData] = useState<any>({});
  const { mutation } = useVerifyPaystack();
  const { mutation: postTransaction } = usePostTransaction();
  const { data: user } = useGetUser();
  const navigation = useRouter();
  const [isUsdModal, setIsUsdModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isCryptoModal, setIsCryptoModal] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (data: any) => {
    let handler = PaystackPop.setup({
      key: `${process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY_LIVE}`,
      email: data.email,
      currency: "NGN",
      amount: data.amount * 1700 * 100, // Paystack requires amount in kobo
      ref: data.reference,
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

  const handleUsd = () =>
    postTransaction.mutate(
      { ...data, paymentMethod: "USD Transfer", notificationDesc: "We are currently processing your payment for" },
      {
        onSuccess: async () => {
          toast({
            variant: "success",
            title: "Success",
            description: "We are currently processing your transaction, you'll be notified shortly",
          }),
            await waitForThreeSeconds();
          window.location.reload();
        },
      }
    );
  const handleCrypto = () =>
    postTransaction.mutate(
      { ...data, paymentMethod: "Cryprocurrency", notificationDesc: "We are currently processing your payment for" },
      {
        onSuccess: async () => {
          toast({
            variant: "success",
            title: "Success",
            description: "We are currently processing your transaction, you'll be notified shortly",
          }),
            await waitForThreeSeconds();
          window.location.reload();
        },
      }
    );

  const onSubmit = (values: z.infer<typeof formSchemaBookSession>) => {
    console.log(values);

    const data = {
      userId: user?._id,
      product: values.program,
      transactionType: "Book Session",
      amount: amount,
      bookSession: {
        name: values.name,
        date: values.date,
        number: values.number,
        email: values.email,
      },
      reference: `ref_${Math.random().toString(36).slice(2)}`,
      notificationTitle: "Book Session",
      notificationDesc: "You have successfully booked",
    };

    setData(data);
    if (values.payment === "Paystack")
      postTransaction.mutate(data, {
        onSuccess: (response: any) => {
          setIsOpen(false);
          handleSubmit({
            ...data,
            transactionId: response.data.transactionId,
            username: user?.username,
            email: user?.email,
            bookSessionId: response.data.bookSessionId,
          });
        },
        onError: (error: any) => {
          console.error("Error creating transaction:", error);
        },
      });
    else if (values.payment === "USD") setIsUsdModal(true);
    else setIsCryptoModal(true);
  };

  const form = useForm<z.infer<typeof formSchemaBookSession>>({
    resolver: zodResolver(formSchemaBookSession),
  });

  useEffect(() => {
    if (user || programData)
      form.reset({
        email: user?.email,
        name: user?.username,
        program: programData?.option || "",
      });
  }, [user]);
  console.log(programData);
  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(`TLehJvNDHup7p76JbmF1LaeQPfoZq6T7WF`)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Failed to copy: ", error);
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
        <div className='flex mb-5 justify-between items-center'>
          <h6>Book One-on-One Mentorship</h6>
          <AlertDialogCancel>
            <XCircle className='hover:text-yellow-500 cursor-pointer' />
          </AlertDialogCancel>
        </div>

        <FormField
          control={form.control}
          name='program'
          render={({ field }) => (
            <FormItem>
              <span className='flex flex-col gap-5 mb-5'>
                <h6 className='text-yellow-500'>{field.value}</h6>
                <p>{desc}</p>
              </span>
              <FormLabel>Program Selection</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  const selectedProgram = program.find((item: any) => item.option === value);
                  setDesc(selectedProgram?.description || "");
                  setAmount(selectedProgram?.amount || 0);
                }}
                defaultValue={programData?.option || field.value}
              >
                <SelectTrigger className={cn(!field.value && "text-gray-400")}>
                  <SelectValue placeholder='Select program' />
                </SelectTrigger>
                <SelectContent>
                  {program.map((item) => (
                    <SelectItem key={item.option} value={item.option}>
                      {item.option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='payment'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={cn(!field.value && "text-gray-400")}>
                  <SelectValue placeholder='Select program' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Paystack'>Paystack</SelectItem>
                  <SelectItem value='Cryptocurrency'>Cryptocurrency</SelectItem>
                  <SelectItem value='USD'>USD Transfer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Full Name</FormLabel>
              <Input type='text' placeholder='Enter your name' {...field} />
              <FormMessage className='relative top-1' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Email Address</FormLabel>
              <Input type='text' placeholder='Enter your email' {...field} />
              <FormMessage className='relative top-1' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='number'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Phone Number</FormLabel>
              <Input type='text' placeholder='Enter your number' {...field} />
              <FormMessage className='relative top-1' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='date'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Preferred start date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='secondary'
                    className='rounded-md py-0 px-3 justify-start ml-0 border-gray-800 w-full'
                  >
                    <CalendarRange className='h-[20px] w-[20px] mr-2' />
                    {field.value ? (
                      field.value.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    ) : (
                      <span>Event date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date("2027-01-01") || date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex flex-col gap-2 mt-10'>
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
          <div className='flex w-full gap-2'>
            <Button variant={"success"} type='submit' className='w-full' disabled={postTransaction.isPending}>
              {postTransaction.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Book now"}
            </Button>
          </div>
        </div>
      </form>

      {isUsdModal && (
        <AlertDialog open={isUsdModal} onOpenChange={setIsUsdModal}>
          <AlertDialogContent>
            <div className='flex mb-5 justify-between items-center'>
              <h6>USD Transfer</h6>
              <span onClick={() => setIsUsdModal(false)}>
                <XCircle className='hover:text-yellow-500 cursor-pointer' />
              </span>
            </div>
            <p className='mb-4'>
              Please transfer the <b className='text-white'>${amount} USD</b> to the following account:
            </p>
            <div className='flex flex-col gap-1'>
              <p>Account Name: </p>
              <b className='text-white'>CANDLEKAPITAL GLOBAL SERVICES LTD</b>
            </div>
            <div className='flex flex-col gap-1'>
              <p>Account Number: </p>
              <b className='text-white'>5074568009</b>
            </div>
            <div className='flex flex-col gap-1'>
              <p>Bank: </p>
              <b className='text-white'>Zenith Bank</b>
            </div>

            <Button variant={"success"} className='mt-5' onClick={handleUsd} disabled={postTransaction.isPending}>
              {postTransaction.isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : " I have made the transfer"}
            </Button>
            <p className='text-red-500 text-center'>
              Do not click if you have'nt made any transfer, else you account will be suspended
            </p>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {isCryptoModal && (
        <AlertDialog open={isCryptoModal} onOpenChange={setIsCryptoModal}>
          <AlertDialogContent>
            <div className='flex mb-5 justify-between items-center'>
              <h6>Deposit Cryptocurrency</h6>
              <span onClick={() => setIsCryptoModal(false)}>
                <XCircle className='hover:text-yellow-500 cursor-pointer' />
              </span>
            </div>

            <p className='mb-4'>
              Please transfer <b className='text-white'>${amount}</b> worth of cryptocurrency to the following{" "}
              <b className='text-white'>TRC20</b> wallet address:
            </p>

            <div className='flex flex-col gap-1'>
              <Image className='w-[150px] mx-auto' src={QR_Code} width={700} height={700} alt='QR' />{" "}
            </div>

            <div className='flex flex-col gap-1'>
              <p>Wallet Address: </p>
              <div className=' py-2 px-3 flex flex-wrap gap-5 justify-between items-center rounded-lg bg-[#2A3142]'>
                <b className='text-white'>TLehJvNDHup7p76JbmF1LaeQPfoZq6T7WF</b>

                <Button
                  variant='ghost'
                  className='px-6 sm:bg-inherit w-7 sm:w-auto sm:relative mr-0'
                  onClick={handleCopyClick}
                >
                  {isCopied ? (
                    "Copied"
                  ) : (
                    <div className='flex gap-2'>
                      <Copy className='h-5 w-5' />
                    </div>
                  )}
                </Button>
              </div>
            </div>

            <Button variant={"success"} className='mt-5' onClick={handleCrypto} disabled={postTransaction.isPending}>
              {postTransaction.isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : " I have made the transfer"}
            </Button>

            <p className='text-red-500 text-center'>
              Do not click if you have'nt made any transfer, else you account will be suspended
            </p>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Form>
  );
};

const program = [
  {
    amount: 100,
    option: "Instructor's Strategies (Zoom - $100)",
    description:
      "Participate in a focused session via Zoom to learn the instructor's unique trading strategies. Gain insights into market analysis and trading techniques that cater to your style for a comprehensive overview at an affordable price.",
  },
  {
    amount: 150,
    option: "Trading Floor Experience ($150)",
    description:
      "Step onto the live trading floor for an immersive, hands-on experience in real-time market action. Perfect for those ready to take their trading journey to the next level with expert guidance and peer collaboration.",
  },
  {
    amount: 250,
    option: "Private Mentorship (Zoom - $250)",
    description:
      "Receive one-on-one mentorship via Zoom, tailored specifically to your trading style. Learn advanced strategies and get personalized support from the comfort of your home for two months of deep, impactful learning.",
  },
  {
    amount: 400,
    option: "Exclusive Trading Floor Mentorship ($400)",
    description:
      "Gain exclusive access to our premium in-person mentorship at the trading floor. This high-level program offers a personalized, intensive two-month experience designed to elevate your trading to expert levels.",
  },
  {
    amount: 1000,
    option: "Life Mentorship ($1,000)",
    description:
      "This trading program offers an enhanced exclusive experience, featuring a six-month in-class training duration instead of the standard three months. Participants will receive ongoing life mentorship beyond the initial training period, ensuring support until they become profitable and independent traders.",
  },
];
