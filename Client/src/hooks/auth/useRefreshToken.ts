"use client";
import axiosInstance from "@/lib/axios-instance";
import { useSession } from "next-auth/react";

export const useRefreshToken = () => {
  const { data: session } = useSession();

  const refreshToken = async () => {
    const response = await axiosInstance.post(`/auth/refresh-token/${session?.refreshToken}`);
    const refreshedTokens = response.data;

    console.log("am the new accesstoken ", refreshedTokens);
    if (session) session.accessToken = refreshedTokens.accessToken;
  };

  return refreshToken;
};
