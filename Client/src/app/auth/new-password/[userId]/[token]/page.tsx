"use client";
import React, { useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newPasswordSchema } from "@/app/components/schema/Forms";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { authProp, ErrorProp, newPasswordProp } from "@/app/components/schema/Types";
import { useForm } from "react-hook-form";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, ErrorModal } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { ContainerAuth } from "@/components/ui/containers";
import { WrapperAuth } from "@/components/ui/wrappers";
import { useToast } from "@/components/ui/use-toast";
import { waitForThreeSeconds } from "@/hooks/auth";

const NewPassword = ({ params }: newPasswordProp) => {
  const { userId, token } = params;
  const [errorModal, setErrorModal] = useState(false);
  const [response, setResponse] = useState("");
  const [hide, setHide] = useState(true);
  const [hide2, setHide2] = useState(true);
  const navigation = useRouter();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: authProp) => {
      return axiosInstance.post(`/auth/new-password/${userId}/${token}`, data);
    },
    onError: (error: ErrorProp) => {
      setErrorModal(true);
      setResponse(error.response.data.message);
      console.log("ERROR", error.response.data.message);
    },
    onSuccess: async (response) => {
      toast({
        variant: "success",
        title: "Successful",
        description: "Password reset successful",
      });
      await waitForThreeSeconds();

      window.location.href = `/auth/login`;
    },
  });

  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
  });

  const onSubmit = (values: z.infer<typeof newPasswordSchema>) => {
    mutation.mutate(values);
  };

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
        <h1>Set new password</h1>
        <p className='text-center'>Your new password must be different from previously used passwords.</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
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
            <FormField
              name='confirmPassword'
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
            <Button
              variant={"buy"}
              className='max-w-[350px] w-full mt-5 mb-3'
              type='submit'
              disabled={mutation.isPending}
            >
              {mutation.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Reset password"}
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

export default NewPassword;
