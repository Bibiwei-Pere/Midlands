import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../auth/useAxiosAuth";
import { useState } from "react";
import axiosInstance from "@/lib/axios-instance";
import { ErrorProp } from "@/app/components/schema/Types";
import { waitForThreeSeconds } from "../auth";
import { useToast } from "@/components/ui/use-toast";

export function useGetTicket() {
  const queryClient = useQueryClient();
  const queryKey = `/ticket`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/ticket`);
      console.log(res);
      return res?.data;
    },
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export const useDeleteTicket = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.delete(`/ticket/${data.ticketId}`, data);
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
        description: "Ticket as been deleted",
      });
      await waitForThreeSeconds();

      window.location.reload();
    },
  });

  return { mutation };
};

export const usePostTicket = () => {
  const [response, setResponse] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      console.log(data);
      return axiosInstance.post(`/ticket`, data);
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
        description: "Ticket as been Sent, you`ll get a reply shortly",
      });
      await waitForThreeSeconds();

      window.location.reload();
    },
  });

  return { mutation, response };
};

export const useUpdateTicket = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      console.log(data);
      return axiosInstance.patch(`/ticket`, data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response);
      toast({
        variant: "destructive",
        title: "An error occured",
        description: "Ticket as been updated",
      });
    },
    onSuccess: async (response) => {
      console.log("success", response);
      toast({
        variant: "success",
        title: "Successful",
        description: "Ticket as been updated",
      });
      await waitForThreeSeconds();

      window.location.reload();
    },
  });

  return { mutation };
};
