import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../auth/useAxiosAuth";
import { useSession } from "next-auth/react";

export function useGetStatistics() {
  const queryClient = useQueryClient();
  const queryKey = `/statistics`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/statistics`);
      console.log(res);
      return res?.data;
    },
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useGetStatisticsByName(name: string) {
  const queryClient = useQueryClient();
  const queryKey = `/statistics/${name}`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/statistics/${name}`);
      console.log(res);
      return res?.data;
    },
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}
export function useGetTeacherStatistics() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const queryClient = useQueryClient();
  const queryKey = `/statistics/teacher/${userId}`;
  const axiosAuth = useAxiosAuth();
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      const res = await axiosAuth.get(`/statistics/teacher/${userId}`);
      console.log(res);
      return res?.data;
    },
    enabled: !!userId,
    retry: 3,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}
