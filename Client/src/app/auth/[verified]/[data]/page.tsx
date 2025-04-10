"use client";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, ErrorModal } from "@/components/ui/alert-dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { usePostGenerateOtp, usePostVerifyOtp } from "@/hooks/auth";
import { formSignUpVerification } from "@/app/components/schema/Forms";
import { ContainerAuth } from "@/components/ui/containers";
import { WrapperAuth } from "@/components/ui/wrappers";

const Verification = ({ params }: any) => {
  const { verified, data } = params;
  const [errorModal, setErrorModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutation: generate, response: generateRes } = usePostGenerateOtp();
  const { mutation: verify, response: verifyRes } = usePostVerifyOtp();

  useEffect(() => {
    const decodedString = decodeURIComponent(data);
    const params: any = {};

    decodedString.split("passData").forEach((part) => {
      const [key, ...valueParts] = part.split("=");
      if (key) {
        const value = valueParts.join("="); // Rejoin in case additional `&` are in values
        params[key] = value.trim(); // Trim any spaces that may accidentally exist
      }
    });

    if (params.email) setEmail(params.email);
    if (params.password) setPassword(params.password);
  }, [data]);

  const form = useForm<z.infer<typeof formSignUpVerification>>({
    resolver: zodResolver(formSignUpVerification),
  });

  const onSubmit = (values: z.infer<typeof formSignUpVerification>) => verify.mutate({ ...values, email, password });

  const handleGenerateOtp = () =>
    generate.mutate({
      email,
      password,
    });
  console.log(data);
  console.log(email);
  return (
    <ContainerAuth>
      {verified !== "true" ? (
        <WrapperAuth>
          <h2 className='text-center'>OTP Verification</h2>
          <p className='text-center'>
            Please enter the 4-digit One-Time Password sent to <b className='text-white'>{email}</b>
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='grid justify-center items-center '>
              <FormField
                control={form.control}
                name='verificationCode'
                render={({ field }) => (
                  <FormItem className=' flex flex-col items-center gap-2 mt-2'>
                    <FormLabel>One-Time Password</FormLabel>
                    <InputOTP pattern={REGEXP_ONLY_DIGITS} maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button variant={"buy"} className='w-full mt-10' type='submit' disabled={verify.isPending}>
                {verify.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Submit"}
              </Button>
            </form>
          </Form>
        </WrapperAuth>
      ) : (
        <WrapperAuth>
          <h2 className='text-center'>Verify your Account!</h2>
          <p className='text-center'>
            The acount registered with <b className='text-white'>{email}</b> as not been verified
          </p>
          <Button variant={"buy"} className='w-full' onClick={handleGenerateOtp} type='button'>
            {generate.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Verify now"}
          </Button>
        </WrapperAuth>
      )}
      {errorModal && (
        <AlertDialog open onOpenChange={(open) => setErrorModal(open)}>
          <ErrorModal description={verifyRes || generateRes}>
            <AlertDialogAction onClick={() => setErrorModal(false)}>Close</AlertDialogAction>
          </ErrorModal>
        </AlertDialog>
      )}
    </ContainerAuth>
  );
};

export default Verification;
