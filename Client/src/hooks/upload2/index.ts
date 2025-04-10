import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../auth/useAxiosAuth";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios-instance";
import { ErrorProp } from "@/app/components/schema/Types";
import { useToast } from "@/components/ui/use-toast";

export function useGetUpload(fileName: string) {
  const queryClient = useQueryClient();
  const queryKey = `/upload/${fileName}`;
  const axiosAuth = useAxiosAuth();

  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const previousData = queryClient.getQueryData([queryKey]);
      if (previousData) return previousData;

      try {
        const res = await axiosAuth.get(`/upload/${fileName}`);
        return res?.data?.signedUrl; // Return only the signed URL
      } catch (error) {
        console.error("Error fetching signed URL:", error);
        throw error; // Let it retry based on retry settings
      }
    },
    retry: 3, // Retry fetching if failed (e.g., due to expiration)
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export const useDeleteUpload = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.delete(`/upload`, { data });
    },
    onError: (error: ErrorProp) => {
      console.log(error.response.data);
      toast({
        variant: "destructive",
        title: "An error occured.",
        description: error.response.data.error,
      });
    },
    onSuccess: async (response) => {
      console.log("success", response);
      toast({
        variant: "success",
        title: "Successful",
        description: "File as been deleted",
      });
    },
  });

  return { mutation };
};

// export const usePostUpload = () => {
//   const [response, setResponse] = useState({});
//   const [progress, setProgress] = useState(0);
//   const { toast } = useToast();

//   // Upload a single chunk
//   const uploadChunk = async (chunk, chunkNumber, totalChunks, uniqueFileName) => {
//     const formData = new FormData();
//     formData.append("file", chunk);
//     formData.append("chunkNumber", chunkNumber);
//     formData.append("totalChunks", totalChunks);
//     formData.append("uniqueFileName", uniqueFileName);

//     return axiosInstance.post("/upload/upload-chunk", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//       onUploadProgress: (progressEvent) => {
//         const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//         setProgress((prevProgress) => Math.min(prevProgress + percent / totalChunks, 100));
//       },
//     });
//   };

//   const mutation = useMutation({
//     mutationFn: async (file: any) => {
//       const initResponse = await axiosInstance.post("/upload", file, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         timeout: 120000000,
//         onUploadProgress: (progressEvent: any) => {
//           const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           setProgress(percentage); // Update progress
//         },
//       });

//       console.log(initResponse);
//       // Step 2: Check the backend's response for file size handling
//       if (initResponse.data.uploadType === "direct") {
//         // If small file, directly upload without chunking
//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("uniqueFileName", uniqueFileName);

//         await axiosInstance.post("/upload/direct-upload", formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
//       } else {
//         // If large file, upload in chunks
//         const chunkSize = 5 * 1024 * 1024; // 5 MB
//         const totalChunks = Math.ceil(file.size / chunkSize);

//         for (let i = 0; i < totalChunks; i++) {
//           const start = i * chunkSize;
//           const end = Math.min(start + chunkSize, file.size);
//           const chunk = file.slice(start, end);

//           await uploadChunk(chunk, i + 1, totalChunks, uniqueFileName);
//         }

//         // Finalize the upload after all chunks are uploaded
//         await axiosInstance.post("/upload/finalize-upload", { uniqueFileName });
//       }
//     },
//     onError: (error) => {
//       console.error("Upload error:", error);
//       toast({
//         variant: "destructive",
//         title: "An error occurred!",
//         description: "Please try again.",
//       });
//       setResponse(error?.response?.data?.message || "An error occurred.");
//       setProgress(0); // Reset progress in case of error
//     },
//     onSuccess: (response) => {
//       console.log("Upload success:", response);
//       toast({
//         variant: "success",
//         title: "Upload Successful",
//         description: "File upload completed.",
//       });
//       setResponse(response.data);
//       setProgress(100); // Set progress to 100% on success
//     },
//   });

//   useEffect(() => {
//     if (mutation.isSuccess || mutation.isError) {
//       setProgress(0); // Reset progress when upload completes or fails
//     }
//   }, [mutation.isSuccess, mutation.isError]);

//   return { mutation, response, progress };
// };

export const usePostUpload = () => {
  const [response, setResponse] = useState<any>({});
  const [progress, setProgress] = useState(0); // Track progress
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axiosInstance.post("/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000000 * 10000000,
        onUploadProgress: (progressEvent: any) => {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentage); // Update progress
        },
      });
    },
    onError: (error: any) => {
      console.log(error);
      console.log(error.response);
      toast({
        variant: "destructive",
        title: "An error occured.",
        description: "Please try again",
      });
      setResponse(error?.response?.data?.message);
    },
    onSuccess: (response) => {
      console.log("Success:", response.data);
      toast({
        variant: "success",
        title: "Successful",
        description: "File upload successful",
      });
      setResponse(response.data.data);
      setProgress(100); // Set progress to 100% after successful upload
    },
  });

  // Reset progress when file is uploaded or mutation is reset
  useEffect(() => {
    if (mutation.isSuccess) {
      setProgress(0); // Reset progress after upload
    }
  }, [mutation.isSuccess]);

  return { mutation, response, progress };
};
