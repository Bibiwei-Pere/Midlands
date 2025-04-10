import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../auth/useAxiosAuth";
import { useState } from "react";
import axiosInstance from "@/lib/axios-instance";
import { ErrorProp } from "@/app/components/schema/Types";

const queryKey = "/category";

export function useGetAllCategories() {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/category`);
      console.log(res);
      return res?.data;
    },
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useGetVideosByCategory(name: string) {
  console.log(name);
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/video/category/${name}`);
      console.log(res);
      return res?.data;
    },
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export const useCreateCategory = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [res, setRes] = useState("");

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.post("/category", data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data.message);
      setError(true);
      setRes(error.response.data.message);
    },
    onSuccess: (response) => {
      setSuccess(true);
      setRes(response.data.message);
      console.log("success", response);
    },
  });

  return { mutation, success, error, res };
};

export const useDeleteCategory = () => {
  const mutation = useMutation({
    mutationFn: (data: any) => {
      console.log(data);
      return axiosInstance.delete("/category", data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data.message);
    },
    onSuccess: (response) => {
      console.log("success", response);
    },
  });

  return { mutation };
};

export const useEditCategory = () => {
  const mutation = useMutation({
    mutationFn: (data: any) => {
      console.log(data);
      return axiosInstance.patch("/category", data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data.message);
    },
    onSuccess: (response) => {
      console.log("success", response);
    },
  });

  return { mutation };
};
