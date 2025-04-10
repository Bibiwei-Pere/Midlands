"use client";
import React, { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ContainerAuth } from "@/components/ui/containers";
import { WrapperAuth } from "@/components/ui/wrappers";
import { signOut } from "next-auth/react";

const Logout = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut({ redirect: false });
      router.push("/auth/login");
    } catch (error) {
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContainerAuth>
      <WrapperAuth>
        <p onClick={() => router.back()} className='flex gap-3 mb-4 hover:text-white text-center mx-auto'>
          <ArrowLeft className='w-6' />
          Back to Dashboard
        </p>
        <h2 className='text-center'>Sign out</h2>
        <p className='text-center'>Are you sure you want to sign out?</p>
        <Button variant={"buy"} className='max-w-[350px] w-full mt-5 mb-3' type='submit' onClick={handleLogout}>
          {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : "Sign out"}
        </Button>
      </WrapperAuth>
    </ContainerAuth>
  );
};

export default Logout;
