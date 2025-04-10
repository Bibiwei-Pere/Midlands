"use client";
import React, { useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/app/components/schema/Forms";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { authProp, ErrorProp } from "@/app/components/schema/Types";
import { useForm } from "react-hook-form";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, ErrorModal } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { ContainerAuth } from "@/components/ui/containers";
import { WrapperAuth } from "@/components/ui/wrappers";

const ResetPassword = () => {
  const [errorModal, setErrorModal] = useState(false);
  const [response, setResponse] = useState("");
  const [email, setEmail] = useState("");
  const navigation = useRouter();

  const mutation = useMutation({
    mutationFn: (data: authProp) => {
      return axiosInstance.post(`/auth/reset-password`, data);
    },
    onError: (error: ErrorProp) => {
      setErrorModal(true);
      setResponse(error.response.data.message);
      console.log("ERROR", error.response.data.message);
    },
    onSuccess: (response) => {
      navigation.push(`reset-password/${email}`);
      console.log("success", response.data);
    },
  });

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
    setEmail(values.email);
    mutation.mutate(values);
  };

  return (
    <ContainerAuth>
      <WrapperAuth>
        <p
          onClick={() => navigation.back()}
          className='flex gap-3 mx-auto mb-4 cursor-pointer hover:text-yellow-500 text-center'
        >
          <ArrowLeft className='w-6' />
          Back to log in
        </p>
        <h1>Reset Password</h1>
        <p className='text-center'>No worries, we’ll send you reset instructions.</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input type='email' placeholder='Enter your email' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant={"buy"}
              className='max-w-[350px] w-full mt-5 mb-3'
              type='submit'
              disabled={mutation.isPending}
            >
              {mutation.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Send Link"}
            </Button>
          </form>
        </Form>
      </WrapperAuth>
      {errorModal && (
        <AlertDialog open onOpenChange={(open) => setErrorModal(open)}>
          <ErrorModal description={response}>
            <AlertDialogAction>Close</AlertDialogAction>
          </ErrorModal>
        </AlertDialog>
      )}
    </ContainerAuth>
  );
};

export default ResetPassword;
