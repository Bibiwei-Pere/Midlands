import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import useAxiosAuth from "../auth/useAxiosAuth";
import axiosInstance from "@/lib/axios-instance";
import { ErrorProp } from "@/app/components/schema/Types";
import { waitForThreeSeconds } from "../auth";
import { useToast } from "@/components/ui/use-toast";

export function useGetAllSignal() {
  const queryClient = useQueryClient();
  const queryKey = `/signal`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/signal`);
      console.log(res);
      return res?.data;
    },
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useGetUserSignals() {
  const session = useSession();
  const userId = session?.data?.user?.id;

  const queryClient = useQueryClient();
  const queryKey = `/signal/user/${userId}`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/signal/user/${userId}`);
      console.log(res);
      return res?.data;
    },
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useGetSignal(signalId: string) {
  const queryClient = useQueryClient();
  const queryKey = `/signal/${signalId}`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/signal/${signalId}`);
      console.log(res);
      return res?.data;
    },
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export const useDeleteSignal = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      console.log(data);
      return axiosInstance.delete(`/signal/${data.signalId}`);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data.message);
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
        description: "Signal as been deleted",
      });
      await waitForThreeSeconds();
      window.location.href = "/dashboard";
    },
  });

  return { mutation };
};

export const usePostSignal = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.post(`/signal`, data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data);
      toast({
        variant: "destructive",
        title: "Successful",
        description: error.response.data.message,
      });
    },
    onSuccess: async (response) => {
      console.log("success", response);
      toast({
        variant: "success",
        title: "Successful",
        description: response.data.message,
      });
      await waitForThreeSeconds();

      window.location.reload();
    },
  });

  return { mutation };
};

export const useUpdateSignal = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.patch(`/signal`, data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data);
      toast({
        variant: "success",
        title: "Successful",
        description: error.response.data.message,
      });
    },
    onSuccess: async (response) => {
      console.log("success", response);
    },
  });

  return { mutation };
};
