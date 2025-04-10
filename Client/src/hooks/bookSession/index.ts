import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../auth/useAxiosAuth";
import axiosInstance from "@/lib/axios-instance";
import { ErrorProp } from "@/app/components/schema/Types";
import { useToast } from "@/components/ui/use-toast";
import { waitForThreeSeconds } from "../auth";

export const queryKey = "/book";

export function useGetAllBook() {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/book`);
      console.log(res);
      return res?.data;
    },
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useGetBook(bookId: string) {
  const queryClient = useQueryClient();
  const queryKey = `/book/${bookId}`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/book/${bookId}`);
      console.log(res);
      return res?.data;
    },
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export const usePostBook = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.post("/book", data);
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
        description: "New book added",
      });
    },
  });

  return { mutation };
};

export const useUpdateBook = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.patch("/book", data);
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
        description: response.data,
      });

      await waitForThreeSeconds();
      window.location.reload();
    },
  });

  return { mutation };
};

export const useDeleteBook = () => {
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (data: any) => {
      console.log(data);
      return axiosInstance.delete(`/book/${data.bookSessionId}`);
    },
    onError: (error: ErrorProp) => {
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
