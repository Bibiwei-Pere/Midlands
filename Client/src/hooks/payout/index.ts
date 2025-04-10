import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import useAxiosAuth from "../auth/useAxiosAuth";
import axiosInstance from "@/lib/axios-instance";
import { ErrorProp } from "@/app/components/schema/Types";
import { waitForThreeSeconds } from "../auth";
import { useToast } from "@/components/ui/use-toast";

export function useGetAllPayout() {
  const queryClient = useQueryClient();
  const queryKey = `/payout`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/payout`);
      console.log(res);
      return res?.data;
    },
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useGetUserPayouts() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const queryClient = useQueryClient();
  const queryKey = `/payout/user/${userId}`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/payout/user/${userId}`);
      console.log(res);
      return res?.data;
    },
    enabled: !!userId,
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useGetPayout(payoutId: string) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const queryClient = useQueryClient();
  const queryKey = `/payout/${userId}/${payoutId}`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/payout/${userId}/${payoutId}`);
      console.log(res);
      return res?.data;
    },
    enabled: !!payoutId,
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export const useDeletePayout = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      console.log(data);
      return axiosInstance.delete(`/payout/${data.payoutId}`);
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
        description: "Payout as been deleted",
      });
      await waitForThreeSeconds();
      window.location.reload();
    },
  });

  return { mutation };
};

export const usePostPayout = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.post(`/payout`, data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data);
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
        description: response.data.message,
      });
      await waitForThreeSeconds();

      window.location.reload();
    },
  });

  return { mutation };
};

export const useUpdatePayout = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.patch(`/payout`, data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data);
      toast({
        variant: "destructive",
        title: "An error occured",
        description: error.response.data.message,
      });
    },
    onSuccess: async (response) => {
      console.log("success", response);
      toast({
        variant: "success",
        title: "Successful",
        description: response.data,
      });
      await waitForThreeSeconds();
      window.location.reload();
    },
  });

  return { mutation };
};
