"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, XCircle } from "lucide-react";
import { AddButton, AddButtonContainer, Button, FileDisplay } from "@/components/ui/button";
import { formSchemaSupport } from "@/app/components/schema/Forms";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialogCancel, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useDeleteTicket, usePostTicket, useUpdateTicket } from "@/hooks/ticket";
import { useSession } from "next-auth/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const NewTicket = ({ data, edit }: any) => {
  const { data: session } = useSession();
  const { mutation: update } = useUpdateTicket();
  const { mutation: post } = usePostTicket();

  const onSubmit = (values: z.infer<typeof formSchemaSupport>) => {
    if (edit === "edit")
      update.mutate({
        userId: session?.user?.id,
        ticketId: data?._id,
        ...values,
      });
    else
      post.mutate({
        userId: session?.user?.id,
        ...values,
      });
  };

  const form = useForm<z.infer<typeof formSchemaSupport>>({
    resolver: zodResolver(formSchemaSupport),
  });

  console.log(form.formState.errors);

  useEffect(() => {
    if (session) {
      if (edit === "edit")
        form.reset({
          subject: data?.subject || "",
          category: data?.category || "",
          description: data?.description || "",
          status: data?.status || "Open",
          email: session.user.email,
        });
      else
        form.reset({
          email: session.user.email,
        });
    }
  }, [session]);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: any) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles: any) => [...prevFiles, ...files]);
  };

  const removeFile = (index: any) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
        <div className='flex mb-5 justify-between items-center'>
          <h6>Contact Support</h6>
          {edit !== "support" && (
            <AlertDialogCancel>
              <XCircle className='hover:text-yellow-500 cursor-pointer' />
            </AlertDialogCancel>
          )}
        </div>
        <FormField
          control={form.control}
          name='subject'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Subject</FormLabel>
              <Input placeholder='Enter subject' {...field} />
              <FormMessage className='relative top-1' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticket category</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='secondary'
                    role='combobox'
                    className='rounded-md py-0 px-3 justify-between ml-0 border-gray-800 w-full hover:text-white hover:bg-black'
                  >
                    {field.value ? field.value : "Select category"}
                    <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-full p-0'>
                  <Command>
                    <CommandInput placeholder='Search countries...' />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {categories?.map((category: any) => (
                          <CommandItem
                            value={category}
                            key={category}
                            onSelect={() => form.setValue("category", category)}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", category === field.value ? "opacity-100" : "opacity-0")}
                            />
                            {category}
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
          name='description'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Description</FormLabel>
              <Textarea placeholder='Enter details...' {...field} />
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
              <Input placeholder='Admin' {...field} />
              <FormMessage className='relative top-1' />
            </FormItem>
          )}
        />
        {edit === "edit" && (
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
                    <SelectItem value='Open'>Open</SelectItem>
                    <SelectItem value='Resolved'>Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        )}

        {/* <AddButtonContainer>
          <h6>Upload attachments</h6>
          <AddButton title='Add images (PNG, JPG format)' onFileChange={handleFileChange} />
          <FileDisplay files={selectedFiles} onRemove={removeFile} />
        </AddButtonContainer> */}

        <AlertDialogFooter>
          {edit === "edit" ? (
            <Button variant={"success"} className='w-full mt-10'>
              {update.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Update"}
            </Button>
          ) : (
            <Button variant={"success"} className='w-full mt-10'>
              {post.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Send"}
            </Button>
          )}
        </AlertDialogFooter>
      </form>
    </Form>
  );
};

export const DeleteTicket = ({ data }: any) => {
  const { mutation } = useDeleteTicket();
  console.log(data);
  return (
    <div>
      <div className='flex mb-10 justify-between items-center'>
        <h6>Delete Ticket</h6>
        <AlertDialogCancel>
          <XCircle className='hover:text-yellow-500 cursor-pointer' />
        </AlertDialogCancel>
      </div>

      <p>By choosing delete, your ticket will be permanently deleted from the platform.</p>
      <AlertDialogFooter>
        <Button
          variant={"destructive"}
          onClick={() =>
            mutation.mutate({
              ticketId: data?._id,
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

const categories = [
  "Getting Started",
  "Account Setup",
  "Funding Your Wallet",
  "Transaction Issues",
  "Forex Signals",
  "Trading Strategies",
  "Market Analysis",
  "Risk Management",
  "Platform Navigation",
  "Order Types",
  "Charting Basics",
  "Technical Indicators",
  "Live Trade Examples",
  "Common Mistakes",
  "Customer Support",
  "Glossary of Terms",
  "Community Insights",
  "Advanced Trading",
  "Webinars & Workshops",
  "Others",
];
