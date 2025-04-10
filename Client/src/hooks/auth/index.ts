import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import axiosInstance from "@/lib/axios-instance";
import { authProp, ErrorProp } from "@/app/components/schema/Types";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";

export const useSignup = () => {
  const [response, setResponse] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: authProp) => {
      return axiosInstance.post(`/auth/signup/`, data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data.message);
      setResponse(error.response.data.message);
    },
    onSuccess: async (response: any) => {
      const encodedPassword = encodeURIComponent(response.data.password);
      console.log(encodedPassword);
      toast({
        variant: "success",
        title: "Successful",
        description: "Welcome to mywebsite, proceed to verify your email",
      });
      await waitForThreeSeconds();
      console.log("Redirect URL:", `/auth/${true}/email=${response.data.email}passDatapassword=${encodedPassword}`);

      window.location.href = `/auth/${true}/email=${response.data.email}passDatapassword=${encodedPassword}`;
    },
  });

  return { mutation, response };
};

export const useSignupRefferal = (username: string) => {
  const [response, setResponse] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.post(`/auth/signup/${username}`, data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data.message);
      setResponse(error.response.data.message);
    },
    onSuccess: async (response: any) => {
      const encodedPassword = encodeURIComponent(response.data.password);
      console.log(encodedPassword);
      toast({
        variant: "success",
        title: "Successful",
        description: "Welcome to mywebsite, proceed to verify your email",
      });
      await waitForThreeSeconds();

      window.location.href = `/auth/${true}/email=${response.data.email}passDatapassword=${encodedPassword}`;
    },
  });

  return { mutation, response };
};

export const useContactUs = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.post(`/auth/contact-us`, data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data.message);
      toast({
        variant: "destructive",
        title: "An error occured",
        description: error.response.data.message,
      });
    },
    onSuccess: async () => {
      toast({
        variant: "success",
        title: "Successful",
        description: "Message sent",
      });
      await waitForThreeSeconds();

      window.location.reload();
    },
  });

  return { mutation };
};

export const usePostVerifyOtp = () => {
  const [response, setResponse] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      console.log(data);
      console.log("Verifying VERIFICATIONCODE:", data);
      return axiosInstance.post(`/auth/verify-email`, data);
    },
    onError: (error: any) => {
      console.log("Verification error:", error.response.data);
      setResponse(error.response.data.message);
      toast({
        variant: "destructive",
        title: "An error occured",
        description: error.response.data.message,
      });
    },
    onSuccess: async (response: any) => {
      console.log("Verification success:", response.data);

      await signIn("credentials", {
        redirect: false,
        email: response.data.email,
        password: response.data.password,
      });

      toast({
        variant: "success",
        title: "Successful!",
        description: "Welcome to mywebsite",
      });

      await new Promise((resolve) => setTimeout(resolve, 6000));

      // Redirect to the dashboard
      window.location.href = "/dashboard";
    },
  });

  return { mutation, response };
};

export const usePostGenerateOtp = () => {
  const [response, setResponse] = useState("");

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.post("/auth/generateOtp", data);
    },
    onError: (error: any) => {
      setResponse(error?.response?.data?.message || "Error generating OTP");
    },
    onSuccess: (response) => {
      const encodedPassword = encodeURIComponent(response.data.password);
      console.log(encodedPassword);
      console.log("OTP generation success", response.data);
      window.location.href = `/auth/${true}/email=${response.data.email}passDatapassword=${encodedPassword}`;
    },
  });

  return { mutation, response };
};

export const useLogin = () => {
  const [response, setResponse] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: authProp) => {
      return axiosInstance.post(`/auth/login`, data);
    },
    onError: async (error: any) => {
      console.log(error.response);
      if (error.response.status === 401) {
        toast({
          variant: "destructive",
          title: "An error occurred",
          description: error.response.data.message,
        });

        const encodedPassword = encodeURIComponent(error.response.data.password);
        console.log(encodedPassword);
        await waitForThreeSeconds();
        window.location.href = `/auth/${false}/email=${error.response.data.email}passDatapassword=${encodedPassword}`;
      } else if (error.response.status === 402)
        window.location.href = `/auth/social-login/google/${error.response.data.email}`;
      else setResponse(error.response.data.message);
    },
    onSuccess: async (response: any) => {
      console.log(response.data);
      await signIn("credentials", {
        redirect: false,
        email: response.data.email,
        password: response.data.password,
      });
      toast({
        variant: "success",
        title: "Successful",
        description: "Welcome to mywebsite",
      });
      await waitForThreeSeconds();

      // Retrieve the stored URL and redirect
      const redirectUrl = localStorage.getItem("redirectUrl") || "/dashboard";
      localStorage.removeItem("redirectUrl"); // Clean up

      window.location.href = redirectUrl;

      // window.location.href = "/dashboard";
    },
  });

  return { mutation, response, setResponse };
};

export const waitForThreeSeconds = () => new Promise((resolve) => setTimeout(resolve, 3000));

export function formatDate(dateString: any) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const suffix = (day: any) => {
    if (day > 3 && day < 21) return "th"; // covers 4-20
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${suffix(day)} ${month} ${year}`;
}
export function formatDateShort(dateString: any) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  const suffix = (day: any) => {
    if (day > 3 && day < 21) return "th"; // covers 4-20
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${suffix(day)} ${month} ${year}`;
}
