"use client";
import React from "react";
import { resetPasswordProp } from "@/app/components/schema/Types";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ContainerAuth } from "@/components/ui/containers";
import { WrapperAuth } from "@/components/ui/wrappers";

const ResetPassword = ({ params }: resetPasswordProp) => {
  const { email } = params;
  const navigation = useRouter();

  return (
    <ContainerAuth>
      <WrapperAuth>
        <p
          onClick={() => navigation.push("/auth/login")}
          className='flex cursor-pointer hover:text-yellow-500 gap-3 mb-4 text-center mx-auto'
        >
          <ArrowLeft className='w-6' />
          Back to log in
        </p>
        <h2 className='text-center'>CHECK YOUR EMAIL</h2>
        <p className='text-center'>
          We sent a password reset link to <b className='text-white'>{decodeURIComponent(email)}</b>
        </p>
        {/* <Link href='https://mail.google.com/mail/u/0/'>
          <Button variant={"buy"} className='max-w-[350px] w-full mt-5 mb-3' type='submit'>
            Open email app
          </Button>
        </Link> */}
        <h6 className='mx-auto'>
          Didn’t receive the email?{" "}
          <span
            onClick={() => navigation.back()}
            className='border-b border-white hover:border-yellow-500 cursor-pointer hover:text-yellow-500'
          >
            Resend
          </span>
        </h6>
      </WrapperAuth>
    </ContainerAuth>
  );
};

export default ResetPassword;
