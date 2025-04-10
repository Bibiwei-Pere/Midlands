import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../auth/useAxiosAuth";
import axiosInstance from "@/lib/axios-instance";
import { ErrorProp } from "@/app/components/schema/Types";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { waitForThreeSeconds } from "../auth";

export const queryKey = "/course";

export function useGetAllCourseAdmin() {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/course/admin/v1/all`);
      console.log(res);
      return res?.data;
    },
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useGetAllCourse(filters = {}) {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();

  return useQuery({
    queryKey: ["courses", filters], // Include filters in the query key to refetch based on changes
    queryFn: async () => {
      const previousData = queryClient.getQueryData(["courses", filters]);
      if (previousData) return previousData;

      // Pass the filters object as query parameters using axios's params
      const res = await axiosAuth.get("/course", {
        params: filters, // This adds the filters as query parameters to the request
      });

      console.log(res);
      return res?.data;
    },
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useGetAllCourseLanding() {
  const queryClient = useQueryClient();
  console.log("here");
  return useQuery({
    queryKey: ["/auth/courses"],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;
      console.log("here");

      const res = await axiosInstance.get("/auth/courses");

      console.log(res);
      return res?.data;
    },
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useGetUserCourses() {
  const session = useSession();
  const userId = session?.data?.user?.id;

  const queryClient = useQueryClient();
  const queryKey = `/course/${userId}`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/course/${userId}`);
      console.log(res);
      return res?.data;
    },
    enabled: !!userId,
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useGetCourse(courseId: string) {
  console.log(courseId);
  const queryClient = useQueryClient();
  const queryKey = `/course/single/${courseId}`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/course/single/${courseId}`);
      console.log(res);
      return res?.data;
    },
    enabled: !!courseId,
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export const usePostCourse = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.post("/course", data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data.message);
      toast({
        variant: "destructive",
        title: "An error occured!.",
        description: error.response.data.message,
      });
    },
    onSuccess: async (response) => {
      console.log("success", response);
      toast({
        variant: "success",
        title: "Successful",
        description: "New course added",
      });

      await waitForThreeSeconds();
      window.location.href = "/dashboard/course";
    },
  });

  return { mutation };
};

export const useUpdateCourse = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.patch("/course", data);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data.message);
      toast({
        variant: "destructive",
        title: "An error occured!.",
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

      // await waitForThreeSeconds();
      // window.location.reload();
    },
  });

  return { mutation };
};

export const useDeleteCourse = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.delete(`/course/${data.courseId}`);
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data);
      toast({
        variant: "destructive",
        title: "An error occured!.",
        description: error.response.data.message,
      });
    },
    onSuccess: async (response) => {
      console.log("success", response);
      toast({
        variant: "success",
        title: "Successful",
        description: "Course as been deleted",
      });
      await waitForThreeSeconds();
      window.location.href = "/dashboard/course";
    },
  });

  return { mutation };
};

export const useEditCourse = () => {
  const mutation = useMutation({
    mutationFn: (data: any) => {
      console.log(data);
      return axiosInstance.patch("/course", data);
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
