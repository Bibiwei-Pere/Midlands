import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import useAxiosAuth from "../auth/useAxiosAuth";
import { useToast } from "@/components/ui/use-toast";
import { ErrorProp } from "@/app/components/schema/Types";
import axiosInstance, { useAxiosInstance } from "@/lib/axios-instance";
import { waitForThreeSeconds } from "../auth";
import { useEffect, useState } from "react";

export function useGetAllUser() {
  const queryClient = useQueryClient();
  const queryKey = `/users`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/users`);
      console.log(res);
      return res?.data;
    },
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useGetUser() {
  const session = useSession();
  const userId = session?.data?.user?.id;

  const queryClient = useQueryClient();
  const queryKey = `/users/${userId}`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/users/${userId}`);
      console.log(res);
      return res?.data;
    },
    enabled: !!userId,
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useGetUserAffiliateChart() {
  const session = useSession();
  const userId = session?.data?.user?.id;

  const queryClient = useQueryClient();
  const queryKey = `/users/${userId}/affiliate`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/users/${userId}/affiliate`);
      console.log(res);
      return res?.data;
    },
    enabled: !!userId,
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useGetUserById(userId: string) {
  const queryClient = useQueryClient();
  const queryKey = `/users/${userId}`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/users/${userId}`);
      console.log(res);
      return res?.data;
    },
    enabled: !!userId, // Ensure this only runs when userId is available
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export const useUpdateUser = () => {
  const { toast } = useToast();

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.accessToken) {
      useAxiosInstance(session.accessToken);
    }
  }, [session?.accessToken]);

  const mutation = useMutation({
    mutationFn: (data: any) => {
      console.log(data);
      return axiosInstance.patch("/users", data);
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
      // await waitForThreeSeconds();

      // window.location.reload();
    },
  });

  return { mutation };
};

export const usePostUser = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.post("/users", data);
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
        description: response.data.message,
      });
      await waitForThreeSeconds();

      window.location.reload();
    },
  });

  return { mutation };
};

export const useDeleteUser = () => {
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.delete(`/users/${data?.userId}`);
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
        description: "User as been deleted",
      });
      await waitForThreeSeconds();
      window.location.reload();
    },
  });

  return { mutation };
};
