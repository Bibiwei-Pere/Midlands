import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance, { useAxiosInstance } from "@/lib/axios-instance";
import { ErrorProp } from "@/app/components/schema/Types";
import { waitForThreeSeconds } from "../auth";
import { useToast } from "@/components/ui/use-toast";
import useAxiosAuth from "../auth/useAxiosAuth";
import { useEffect, useState } from "react";
// import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function useGetAllTransaction() {
  const queryClient = useQueryClient();
  const queryKey = `/transaction`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/transaction`);
      console.log(res);
      return res?.data;
    },
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useGetBanks() {
  const queryClient = useQueryClient();
  const queryKey = `/paystack`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/paystack`);
      console.log(res);
      return res?.data;
    },
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export const useVerifyPaystack = () => {
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (session?.accessToken) {
      useAxiosInstance(session.accessToken);
    }
  }, [session?.accessToken]);

  const mutation = useMutation({
    mutationFn: (data: any) => {
      console.log(data);
      return axiosInstance.post(`/paystack/verify`, data);
    },
    onError: (error: ErrorProp) => {
      console.log(error);
      toast({
        variant: "destructive",
        title: "An error occured.",
        description: error.response.data.message,
      });
    },
    onSuccess: async (response) => {
      console.log("success", response);
      toast({
        variant: "success",
        title: "Successful",
        description: "Transaction succesful",
      });

      await waitForThreeSeconds();
      window.location.href = "/dashboard";
      console.log("success", response);
    },
  });

  return { mutation };
};

export const useVerifyAccountNumber = () => {
  const { toast } = useToast();
  const [response, setResponse] = useState<any>({});

  const mutation = useMutation({
    mutationFn: (data: any) => {
      console.log(data);
      return axiosInstance.post(`/paystack/verify/${data.accountNumber}/${data.bankCode}`, data);
    },
    onError: (error: ErrorProp) => {
      console.log(error);
      toast({
        variant: "destructive",
        title: "An error occured.",
        description: "Your account number is incorrect",
      });
    },
    onSuccess: async (response) => {
      console.log("success", response);
      setResponse(response.data);
      toast({
        variant: "success",
        title: "Successful",
        description: "Your account number as been verified",
      });
    },
  });

  return { mutation, response };
};

export const usePostTransaction = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      console.log(data);
      return axiosInstance.post(`/transaction`, data);
    },
    onError: (error: ErrorProp) => {
      console.log("success", error);
      toast({
        variant: "destructive",
        title: "An error occured.",
        description: error.response.data.message,
      });
    },
  });

  return { mutation };
};
