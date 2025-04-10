"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import React from "react";
import { Form } from "@/components/ui/form";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { profileSchema } from "../schema/Forms";
import { AvatarUpload } from "./FileUpload";
import Image from "next/image";
import { useGetUser, useUpdateUser } from "@/hooks/users";
import { Eye, EyeOff } from "lucide-react";

const Profile = () => {
  const [uploadedFileUrl, setUploadedFileUrl] = useState<any>({});
  const { data: user } = useGetUser();
  const { mutation } = useUpdateUser();
  const [hide, setHide] = useState(true);
  const [hide1, setHide1] = useState(true);
  const [hide2, setHide2] = useState(true);

  const handleUploadSuccess = (response: any) => setUploadedFileUrl(response);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user)
      form.reset({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
      });
  }, [user]);

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    const data = {
      ...values,
      email: values.email !== undefined && values.email,
      passwordReset: values.passwordReset?.password !== undefined && values.passwordReset,
      userId: user._id, // Attach the uploaded file URL to the form data
    };
    console.log(data);
    mutation.mutate(data);
  };

  return (
    <div className='max-w-[640px] mx-auto sm:px-5 py-4 sm:mt-14 sm:mb-10'>
      <h6 className='mb-2'>Personal info</h6>
      <p>Update your photo and personal details here.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='border rounded-lg border-gray-600 mt-9'>
          <div className='flex flex-col gap-3 sm:gap-5 max-w-full px-4 sm:px-6 py-4 sm:py-10'>
            <div className='grid  sm:grid-cols-2 gap-3 sm:gap-5'>
              <FormField
                control={form.control}
                name='firstname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <Input type='text' placeholder='Enter your first name' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <Input type='text' placeholder='Enter your last name' {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    autoComplete='new-email' // Use an uncommon value to prevent autofill
                    type='email'
                    placeholder={`${user?.email || "Enter your email address"}`}
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='passwordReset.currentPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <div className='relative flex justify-between w-full'>
                    <Input
                      autoComplete='new-password' // Use "new-password" to prevent autofill
                      type={`${hide1 ? "password" : "text"}`}
                      placeholder='Password must be atleast 6 characters'
                      {...field}
                    />
                    {hide1 ? (
                      <EyeOff
                        className='absolute right-3 text-gray-600 top-2 hover:text-white cursor bg-black pl-1 sm:pl-0-pointer'
                        onClick={() => setHide1(!hide1)}
                      />
                    ) : (
                      <Eye
                        className='absolute right-3 text-gray-600 top-2 hover:text-white cursor bg-black pl-1 sm:pl-0-pointer'
                        onClick={() => setHide1(!hide1)}
                      />
                    )}
                  </div>
                  <FormMessage className='top-1' />
                </FormItem>
              )}
            />
            <FormField
              name='passwordReset.password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className='relative flex flex-col justify-between w-full'>
                    <Input
                      autoComplete='new-password-2' // Use "new-password" to prevent autofill
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
              name='passwordReset.confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <div className='relative flex justify-between w-full'>
                    <Input
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

            <div className='flex gap-2 sm:gap-[25px] justify- w-full mt-3'>
              <div className='h-[50px] sm:h-[70px] overflow-hidden w-[66px] sm:w-[85px] mt-2 rounded-full'>
                <Image
                  src={uploadedFileUrl?.signedUrl || user?.avatar?.url || "/noavatar.png"}
                  alt='Avatar'
                  className='object-cover w-full h-full'
                  width={300}
                  height={300}
                />
              </div>
              <AvatarUpload onUploadSuccess={handleUploadSuccess} />
            </div>
          </div>
          <div className='flex border-t border-gray-800 w-full justify-end items-end'>
            <div className='flex gap-3 p-6'>
              <Button>Cancel</Button>
              <Button variant={"buy"} className='bg-[#FFFFFF1A] mt-0'>
                Save
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
