import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instance";
import { ErrorProp } from "@/app/components/schema/Types";
import { useToast } from "@/components/ui/use-toast";
import useAxiosAuth from "../auth/useAxiosAuth";
import { useSession } from "next-auth/react";

export const queryKey = "/certificate";

export function useGetUserCertificates() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/certificate/${userId}`);
      console.log(res);
      return res?.data;
    },
    enabled: !!userId,
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export const usePostCertificate = () => {
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.post("/certificate", data);
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
    },
  });

  return { mutation };
};
