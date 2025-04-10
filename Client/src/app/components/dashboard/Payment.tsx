"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formSchemaPayment, payoutSchema } from "../schema/Forms";
import { Check, ChevronDown, Loader2, XCircle } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useGetUser, useUpdateUser } from "@/hooks/users";
import { waitForThreeSeconds } from "@/hooks/auth";
import { useDeletePayout, useUpdatePayout } from "@/hooks/payout";
import { AlertDialogCancel, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetBanks, useVerifyAccountNumber } from "@/hooks/paystack";
import { useDeleteBook, useUpdateBook } from "@/hooks/bookSession";

export const PaymentSetup = () => {
  const [bankCode, setBankCode] = useState();
  const [data, setData] = useState<any>({});
  const form = useForm<z.infer<typeof formSchemaPayment>>({
    resolver: zodResolver(formSchemaPayment),
  });

  const { mutation } = useUpdateUser();
  const { mutation: verify, response } = useVerifyAccountNumber();
  const { data: user } = useGetUser();
  const { data: banks } = useGetBanks();

  useEffect(() => {
    if (user) {
      setBankCode(user?.bankDetails?.bankCode || 0);
      form.reset({
        bankName: user?.bankDetails?.bankName || "",
        accountName: user?.bankDetails?.accountName || "",
        accountNumber: user?.bankDetails?.accountNumber || "",
      });
    }
  }, [user]);

  const handleSave = () => {
    const bankDetails = {
      bankName: data.bankName,
      accountName: response?.account_name,
      recipientCode: response?.recipient_code,
      accountNumber: data.accountNumber,
      bankCode,
    };
    mutation.mutate(
      {
        userId: user?._id,
        bankDetails,
      },
      {
        onSuccess: async () => {
          await waitForThreeSeconds();
          window.location.reload();
        },
      }
    );
  };

  const onSubmit = (values: z.infer<typeof formSchemaPayment>) => {
    setData(values);
    verify.mutate({ ...values, bankCode });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-3 mt-10 sm:gap-4 py-5 max-w-[600px] mx-auto w-full'
      >
        <h6>Your Bank Information</h6>

        <FormField
          control={form.control}
          name='bankName'
          render={({ field }) => (
            <FormItem>
              <Label>Bank name</Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='secondary'
                    role='combobox'
                    size={"sm"}
                    className='rounded-md h-10 py-0 px-3 justify-between ml-0 border-gray-800 w-full hover:text-white hover:bg-black'
                  >
                    {field.value ? field.value : "Select Bank Name"}
                    <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0'>
                  <Command>
                    <CommandInput placeholder='Search categories...' />
                    <CommandList>
                      <CommandEmpty>No bank found.</CommandEmpty>
                      <CommandGroup>
                        {banks?.map((bank: any) => (
                          <CommandItem
                            value={bank.name}
                            key={bank.name}
                            onSelect={() => {
                              form.setValue("bankName", bank.name);
                              setBankCode(bank.code);
                            }}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", bank.name === field.value ? "opacity-100" : "opacity-0")}
                            />

                            {bank.name}
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

        <FormField
          control={form.control}
          name='accountNumber'
          render={({ field }) => (
            <FormItem>
              <Label>Account Number</Label>
              <div className='flex gap-2'>
                <Input placeholder='Enter number' {...field} />
                <Button
                  type='submit'
                  disabled={verify.isPending}
                  variant={"success"}
                  className='h-[39px] m-0 max-w-[90px]'
                >
                  {verify.isPending ? <Loader2 className='w-5 h-5 animate-spin' /> : "Verify"}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='accountName'
          render={({ field }) => (
            <FormItem>
              <Label>Account Name</Label>
              <Input disabled placeholder='' value={response?.account_name || field.value} />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='button'
          onClick={handleSave}
          disabled={!response || mutation.isPending}
          variant={"buy"}
          className='max-w-[200px] mt-4 sm:w-[200px]'
        >
          {mutation.isPending ? <Loader2 className='w-5 h-5 animate-spin' /> : "Save"}
        </Button>
      </form>
    </Form>
  );
};

export const EditPayout = ({ data }: any) => {
  const { mutation: update } = useUpdatePayout();
  console.log(data);
  const onSubmit = (values: z.infer<typeof payoutSchema>) => {
    update.mutate({
      userId: data?.user,
      payoutId: data?._id,
      amount: data?.amount,
      status: values.status,
    });
  };

  const form = useForm<z.infer<typeof payoutSchema>>({
    resolver: zodResolver(payoutSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
        <div className='flex justify-between items-center'>
          <h6>Confirm Payout</h6>
          <AlertDialogCancel>
            <XCircle className='hover:text-yellow-500 cursor-pointer' />
          </AlertDialogCancel>
        </div>

        <FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={cn(!field.value && "text-gray-400")}>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Approved'>Approve</SelectItem>
                  <SelectItem value='Reject'>Reject</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <AlertDialogFooter>
          <Button variant={"success"} className='w-full mt-5' disabled={update.isPending}>
            {update.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Proceed"}
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
};

export const DeletePayout = ({ id }: any) => {
  const { mutation } = useDeletePayout();
  console.log(id);
  return (
    <div>
      <div className='flex mb-10 justify-between items-center'>
        <h6>Delete Transaction</h6>
        <AlertDialogCancel>
          <XCircle className='hover:text-yellow-500 cursor-pointer' />
        </AlertDialogCancel>
      </div>

      <p>By choosing delete, this transaction will be permanently deleted from the platform.</p>
      <AlertDialogFooter>
        <Button
          variant={"destructive"}
          onClick={() =>
            mutation.mutate({
              payoutId: id,
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

export const EditBookSession = ({ data }: any) => {
  const { mutation: update } = useUpdateBook();
  console.log(data);
  const onSubmit = (values: z.infer<typeof payoutSchema>) => {
    update.mutate({
      userId: data?.user,
      bookSessionId: data?._id,
      status: values.status,
    });
  };

  const form = useForm<z.infer<typeof payoutSchema>>({
    resolver: zodResolver(payoutSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
        <div className='flex justify-between items-center'>
          <h6>Confirm Session</h6>
          <AlertDialogCancel>
            <XCircle className='hover:text-yellow-500 cursor-pointer' />
          </AlertDialogCancel>
        </div>

        <FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={cn(!field.value && "text-gray-400")}>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Successful'>Successful</SelectItem>
                  <SelectItem value='Failed'>Failed</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <AlertDialogFooter>
          <Button variant={"success"} className='w-full mt-5' disabled={update.isPending}>
            {update.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Proceed"}
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
};

export const DeleteBookSession = ({ id }: any) => {
  const { mutation } = useDeleteBook();
  console.log(id);
  return (
    <div>
      <div className='flex mb-10 justify-between items-center'>
        <h6>Delete Session</h6>
        <AlertDialogCancel>
          <XCircle className='hover:text-yellow-500 cursor-pointer' />
        </AlertDialogCancel>
      </div>

      <p>By choosing delete, this session will be permanently deleted from the platform.</p>
      <AlertDialogFooter>
        <Button
          variant={"destructive"}
          onClick={() =>
            mutation.mutate({
              bookSessionId: id,
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
