import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import useAxiosAuth from "../auth/useAxiosAuth";
import { useState } from "react";
import axiosInstance from "@/lib/axios-instance";
import { ErrorProp } from "@/app/components/schema/Types";
import { waitForThreeSeconds } from "../auth";
import { useToast } from "@/components/ui/use-toast";

export function useGetNotification() {
  const session = useSession();
  const userId = session?.data?.user?.id;

  const queryClient = useQueryClient();
  const queryKey = `/notification/${userId}`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/notification/${userId}`);
      console.log(res);
      return res?.data;
    },
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export const useDeleteNotification = () => {
  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.delete(`/notification/${data.id}`);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data.message);
    },
    onSuccess: async (response) => {
      console.log("success", response);
    },
  });

  return { mutation };
};

export const usePostNotification = () => {
  const [response, setResponse] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.delete(`/notification`, data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data.message);
      setResponse(error.response.data.message);
    },
    onSuccess: async (response) => {
      console.log("success", response);
      toast({
        variant: "success",
        title: "Successful",
        description: "Notification as been deleted",
      });
      await waitForThreeSeconds();

      window.location.reload();
    },
  });

  return { mutation, response };
};

export const useUpdateNotification = () => {
  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.patch(`/notification`, data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data);
    },
    onSuccess: async (response) => {
      console.log("success", response);
    },
  });

  return { mutation };
};
