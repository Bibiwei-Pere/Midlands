"use client";
import axiosInstance from "@/lib/axios-instance";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRefreshToken } from "./useRefreshToken";

const useAxiosAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log(session);
  const refreshToken = useRefreshToken();

  useEffect(() => {
    if (status === "loading") return; // Exit if session is still loading
    if (!session) return router.push("/auth/login");
    // if (!session) return console.log("No session");

    const requestIntercept = axiosInstance.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) config.headers["Authorization"] = `Bearer ${session?.accessToken}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    let retryCount = 0;
    const maxRetries = 4;
    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response, // Pass through any successful response
      async (error) => {
        const prevRequest = error?.config;

        if (retryCount < maxRetries && error?.response?.status === 403 && !prevRequest?.sent) {
          retryCount += 1; // Increment the retry count
          await refreshToken();
          prevRequest.sent = true; // Mark this request as sent to prevent looping
          return axiosInstance(prevRequest); // Retry the request
        }
        console.log(error.response);

        if (error?.response?.status === 403 && retryCount >= maxRetries) {
          await signOut({ redirect: false });
          router.push("/auth/login");
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept);
      axiosInstance.interceptors.response.eject(responseIntercept);
    };
  }, [session, status, router]);

  return axiosInstance;
};

export default useAxiosAuth;
