"use client";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userSchema } from "@/app/components/schema/Forms";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialogCancel, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useDeleteUser, usePostUser, useUpdateUser } from "@/hooks/users";
import { useSession } from "next-auth/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { waitForThreeSeconds } from "@/hooks/auth";

export const NewUser = ({ data, edit }: any) => {
  const { data: session } = useSession();
  const { mutation: update } = useUpdateUser();
  const { mutation: post } = usePostUser();

  const onSubmit = (values: z.infer<typeof userSchema>) => {
    if (edit === "edit") {
      if (values.username === data?.username) delete values.username;
      if (values.email === data?.email) delete values.email;
      update.mutate(
        {
          userId: data?._id,
          affiliate: {
            ...data.affiliate,
            balance: Number(values.balance),
            commissionRate: Number(values.commissionRate),
          },
          ...values,
        },
        {
          onSuccess: async () => {
            await waitForThreeSeconds();
            window.location.reload();
          },
        }
      );
    } else post.mutate(values);
  };

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
  });

  console.log(form.formState.errors);

  useEffect(() => {
    if (session) {
      if (edit === "edit")
        form.reset({
          username: data?.username || "",
          firstname: data?.firstname || "",
          lastname: data?.lastname || "",
          email: data?.email || "",
          phone: data?.phone || "",
          role: data?.role || "User",
          password: data?.password || "",
          commissionRate: data?.affiliate?.commissionRate?.toString() || "",
          balance: data?.affiliate?.balance?.toString() || "",
        });
    }
  }, [session]);
  console.log(data);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
        <div className='flex mb-10 justify-between items-center'>
          <h6>Create New User</h6>
          <AlertDialogCancel>
            <XCircle className='hover:text-yellow-500 cursor-pointer' />
          </AlertDialogCancel>
        </div>

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Username</FormLabel>
              <Input placeholder={data?.username ? data?.username : "Enter Username"} {...field} />
              <FormMessage className='relative top-1' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='firstname'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Firstname</FormLabel>
              <Input placeholder='Enter Firstname' {...field} />
              <FormMessage className='relative top-1' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='lastname'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Lastname</FormLabel>
              <Input placeholder='Enter Lastname' {...field} />
              <FormMessage className='relative top-1' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Email</FormLabel>
              <Input placeholder='Enter email' {...field} />
              <FormMessage className='relative top-1' />
            </FormItem>
          )}
        />
        {edit === "none" && (
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='mt-2'>
                <FormLabel>Password</FormLabel>
                <Input placeholder='********' {...field} />
                <FormMessage className='relative top-1' />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Phone</FormLabel>
              <Input pattern={REGEXP_ONLY_DIGITS} placeholder='Enter Phone' {...field} />
              <FormMessage className='relative top-1' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={cn(!field.value && "text-gray-400")}>
                  <SelectValue placeholder={field.value || "Select role"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='User'>User</SelectItem>
                  <SelectItem value='Teacher'>Teacher</SelectItem>
                  <SelectItem value='Admin'>Admin</SelectItem>
                  <SelectItem value='Sales'>Sales</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {edit === "edit" && (
          <>
            <h6 className='mt-4'>Affiliate</h6>

            <div className='grid grid-cols-2 gap-3'>
              <FormField
                control={form.control}
                name='balance'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Balance</FormLabel>
                    <Input pattern={REGEXP_ONLY_DIGITS} placeholder='0' {...field} />
                    <FormMessage className='relative top-1' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='commissionRate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CommissionRate</FormLabel>
                    <Input pattern={REGEXP_ONLY_DIGITS} placeholder='0' {...field} />
                    <FormMessage className='relative top-1' />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}

        <AlertDialogFooter>
          {edit === "edit" ? (
            <Button variant={"success"} className='w-full mt-10'>
              {update.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Update user"}
            </Button>
          ) : (
            <Button variant={"success"} className='w-full mt-10'>
              {post.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Add user"}
            </Button>
          )}
        </AlertDialogFooter>
      </form>
    </Form>
  );
};

export const DeleteUser = ({ data }: any) => {
  const { mutation } = useDeleteUser();
  return (
    <div>
      <div className='flex mb-10 justify-between items-center'>
        <h6>Delete User</h6>
        <AlertDialogCancel>
          <XCircle className='hover:text-yellow-500 cursor-pointer' />
        </AlertDialogCancel>
      </div>

      <p>By choosing delete, your user will be permanently deleted from the platform.</p>
      <AlertDialogFooter>
        <Button variant={"destructive"} onClick={() => mutation.mutate({ userId: data?._id })} className='w-full mt-10'>
          {mutation.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Delete"}
        </Button>
      </AlertDialogFooter>
    </div>
  );
};

export const countries = [
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
