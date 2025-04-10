import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import useAxiosAuth from "../auth/useAxiosAuth";
import { useState } from "react";
import axiosInstance from "@/lib/axios-instance";
import { ErrorProp } from "@/app/components/schema/Types";
import { waitForThreeSeconds } from "../auth";
import { useToast } from "@/components/ui/use-toast";

export const usePostSMS = () => {
  const [response, setResponse] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.post(`/automate/sms`, data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data);
      setResponse(error.response.data.message);
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

  return { mutation, response };
};
