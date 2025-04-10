import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import useAxiosAuth from "../auth/useAxiosAuth";
import axiosInstance from "@/lib/axios-instance";
import { ErrorProp } from "@/app/components/schema/Types";
import { waitForThreeSeconds } from "../auth";
import { useToast } from "@/components/ui/use-toast";

export function useGetAllReview() {
  const queryClient = useQueryClient();
  const queryKey = `/review`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/review`);
      console.log(res);
      return res?.data;
    },
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useGetReviewByCourseId(courseId: string) {
  const queryClient = useQueryClient();
  const queryKey = `/review/${courseId}`;
  console.log(courseId);
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/review/${courseId}`);
      console.log(res);
      return res?.data;
    },
    enabled: !!courseId,
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}
export function useGetReview(courseId: string) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const queryClient = useQueryClient();
  const queryKey = `/review/${userId}/${courseId}`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/review/${userId}/${courseId}`);
      console.log(res);
      return res?.data;
    },
    enabled: !!courseId,
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export const useDeleteReview = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      console.log(data);
      return axiosInstance.delete(`/review/${data.reviewId}`);
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
        description: "Review as been deleted",
      });
      await waitForThreeSeconds();
      window.location.href = "/dashboard";
    },
  });

  return { mutation };
};

export const usePostReview = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.post(`/review`, data);
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

export const useUpdateReview = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.patch(`/review`, data);
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
