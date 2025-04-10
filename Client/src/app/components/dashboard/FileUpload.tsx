"use client";
import { useDeleteUpload, usePostUpload } from "@/hooks/upload2";
import React, { useState } from "react";
import { CirclePlus, CloudUpload, Loader2, Trash, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateUser } from "@/hooks/users";
import { useSession } from "next-auth/react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const FileUpload = ({ courseId, uploadedFiles, setUploadedFiles }: any) => {
  const { mutation: deleteUpload } = useDeleteUpload();
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { mutation: fileUploadMutation, progress: fileProgress } = usePostUpload();
  const [urlInputs, setUrlInputs] = useState<any>([{ url: "", title: "", description: "", duration: "" }]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const estimateVideoDuration = (file: File) => {
    return new Promise<number>((resolve) => {
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";
      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src);
        resolve(videoElement.duration);
      };
      videoElement.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (files: FileList | null) => {
    if (files && files.length > 0) {
      const selectedFile = files[0];
      const duration = selectedFile.type.startsWith("video/") ? await estimateVideoDuration(selectedFile) : null;
      uploadFile(selectedFile, duration);
    }
  };

  const uploadFile = async (file: File, duration: number | null) => {
    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);

    fileUploadMutation.mutate(formData, {
      onSuccess: (response: any) => {
        setUploadedFiles((prevFiles: any) => [
          ...prevFiles,
          {
            name: file.name.substring(0, file.name.lastIndexOf(".")),
            size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
            type: file.name.split(".").pop(),
            uniqueName: response.data.data.uniqueName,
            url: response.data.data.signedUrl,
            date: new Date().toLocaleDateString(),
            title: `Title for ${file.name}`,
            description: `Description for ${file.name}`,
            fileId: response.data.data.fileId,
            duration: duration ? formatDuration(duration) : null,
          },
        ]);
      },
      onError: (error: any) => console.error("Upload failed:", error),
      onSettled: () => setIsUploading(false),
    });
  };

  const handleUrlUpload = () => {
    const validUrls = urlInputs.filter((input: any) => input.url);
    setUploadedFiles((prevFiles: any) => [
      ...prevFiles,
      ...validUrls.map((urlInput: any) => ({
        name: urlInput.title || "No title",
        type: "URL",
        url: urlInput.url,
        date: new Date().toLocaleDateString(),
        title: urlInput.title,
        description: urlInput.description,
        duration: urlInput.duration,
      })),
    ]);
    setUrlInputs([{ url: "", title: "", description: "", duration: "" }]);
    setIsDialogOpen(false);
  };

  const handleUrlInputChange = (field: string, value: string) => {
    const updatedUrls = [...urlInputs];
    updatedUrls[0][field] = value;
    setUrlInputs(updatedUrls);
  };

  const handleDelete = (file: any, link: any) => {
    if (link) {
      setUploadedFiles((prevFiles: any) => prevFiles.filter((f: any) => f.url !== file.url));
    } else {
      setUploadedFiles((prevFiles: any) => prevFiles.filter((f: any) => f.fileId !== file.fileId));
      deleteUpload.mutate(
        { fileName: file.uniqueName, fileId: file.fileId, courseId, fileType: "uploadedFiles" },
        {
          onSuccess: () => console.log(`File ${file.uniqueName} deleted successfully.`),
          onError: (error: any) => console.error("Error deleting file:", error),
        }
      );
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedFiles = Array.from(uploadedFiles);
    const [movedItem] = reorderedFiles.splice(result.source.index, 1);
    reorderedFiles.splice(result.destination.index, 0, movedItem);
    setUploadedFiles(reorderedFiles);
  };

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex justify-between items-center w-full mt-5'>
        <h4>Upload resources</h4>
      </div>

      <div
        className={`w-full h-full items-center justify-center relative border-2 border-solid rounded-lg p-6 fileUpload ${
          dragActive ? "border-yellow-500" : "border-gray-800"
        }`}
        onDragEnter={() => setDragActive(true)}
        onDragOver={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFileChange(e.dataTransfer.files);
        }}
      >
        {isUploading ? (
          <ProgressBar progress={fileProgress} />
        ) : (
          <div className='text-center h-[200px] flex flex-col justify-center items-center w-full'>
            <CloudUpload className='h-[37px] w-[37px]' />
            <h4 className='mt-2 text-sm font-medium text-gray-900'>
              <label htmlFor='file-upload' className='relative cursor-pointer'>
                <span className='flex justify-center'>
                  <p className='text-yellow-500'>Click to upload</p>
                  <p className='pl-[5px]'> or drag and drop</p>
                </span>
                <Input
                  id='file-upload'
                  className='hidden'
                  type='file'
                  name='files'
                  onChange={(e) => handleFileChange(e.target.files)}
                  accept='video/*,image/*,.pdf,.png,.jpg'
                  // accept='video/*,image/*,.docx,.png,.jpg'
                />
              </label>
            </h4>
            <p className='mt-2 text-xs text-gray-500'>MP4, MPEG, PNG, JPG, PDF (max. file size is 40MB)</p>
          </div>
        )}
      </div>

      <div className='mt-4'>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className='flex w-full justify-end mb-3'>
            <AlertDialogTrigger asChild>
              <button className='flex gap-[4px] hover:text-yellow-500' type='button'>
                <CirclePlus fill='#FFBE00' className='h-6 w-6 text-black' /> Click to upload Url
              </button>
            </AlertDialogTrigger>
          </div>

          <AlertDialogContent>
            <AlertDialogCancel>
              <div className='flex justify-end'>
                <XCircle className='hover:text-yellow-500 cursor-pointer' />
              </div>
            </AlertDialogCancel>
            <div className='flex flex-col gap-2'>
              <Input
                placeholder='URL'
                value={urlInputs[0].url}
                onChange={(e) => handleUrlInputChange("url", e.target.value)}
              />
              <Input
                placeholder='Title'
                value={urlInputs[0].title}
                onChange={(e) => handleUrlInputChange("title", e.target.value)}
              />
              <Textarea
                placeholder='Description'
                value={urlInputs[0].description}
                onChange={(e) => handleUrlInputChange("description", e.target.value)}
              />
              <Input
                placeholder='0:00'
                value={urlInputs[0].duration}
                onChange={(e) => handleUrlInputChange("duration", e.target.value)}
              />
              <Button type='button' className='max-w-[100px]' variant={"success"} onClick={handleUrlUpload}>
                Save
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='uploadedFiles'>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className='flex flex-col gap-4 mt-4'>
              {uploadedFiles.map((file: any, index: number) => (
                <Draggable key={file.url} draggableId={file.url} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className='flex gap-10 justify-between max-w-[1316px] w-full mx-auto hover:bg-gray-800 p-2 rounded-lg'
                    >
                      <div className='flex gap-5 w-full'>
                        <div className='relative bg-no-repeat bg-cover bg-file flex items-center justify-center w-[74px] h-[94px]'>
                          <span className='font-bold text-[11px] z-10 uppercase'>.{file.type}</span>
                        </div>
                        <div className='flex flex-col w-full gap-2'>
                          {file.type === "URL" && (
                            <Input
                              placeholder='Edit Url'
                              value={file.url}
                              onChange={(e) => {
                                const updatedFiles = [...uploadedFiles];
                                updatedFiles[index].url = e.target.value;
                                setUploadedFiles(updatedFiles);
                              }}
                            />
                          )}
                          <Input
                            placeholder='Edit Title'
                            value={file.title}
                            onChange={(e) => {
                              const updatedFiles = [...uploadedFiles];
                              updatedFiles[index].title = e.target.value;
                              setUploadedFiles(updatedFiles);
                            }}
                          />
                          <Textarea
                            placeholder='Edit Description'
                            value={file.description}
                            onChange={(e) => {
                              const updatedFiles = [...uploadedFiles];
                              updatedFiles[index].description = e.target.value;
                              setUploadedFiles(updatedFiles);
                            }}
                          />
                          {file.type === "mp4" ||
                            (file.type === "URL" && (
                              <Input
                                placeholder='0:00'
                                value={file.duration}
                                className='text-xs'
                                onChange={(e) => {
                                  const updatedFiles = [...uploadedFiles];
                                  updatedFiles[index].duration = e.target.value;
                                  setUploadedFiles(updatedFiles);
                                }}
                              />
                            ))}
                          {/* <p className='text-xs'>Duration: {file.duration}</p>} */}
                        </div>
                      </div>
                      <button
                        type='button'
                        onClick={() => handleDelete(file, file.type === "URL")}
                        className='text-red-500 hover:text-red-700'
                      >
                        <Trash className='w-6 h-6' />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export const VideoUploadSingle = ({ uploadVideo }: any) => {
  const [isUploading, setIsUploading] = useState(false);
  const { mutation: videoUploadMutation, progress: videoProgress } = usePostUpload();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File | null) => {
    if (!file && !urlInput) {
      alert("Please select a video file or enter a URL.");
      return;
    }

    setIsUploading(true);

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      videoUploadMutation.mutate(formData, {
        onSuccess: (response) => {
          uploadVideo(response.data.data);
        },
        onSettled: () => setIsUploading(false),
      });
    } else if (urlInput) {
      uploadVideo({
        signedUrl: urlInput,
      });
      setIsUploading(false);
      setIsDialogOpen(false);
      setUrlInput("");
    }
  };

  return (
    <div className='h-full w-full'>
      <div className='w-full h-[90%] items-center justify-center relative border-2 border-gray-800 border-solid rounded-lg p-6 fileUpload'>
        <input
          type='file'
          name='video'
          className='absolute inset-0 w-full h-full opacity-0 z-50'
          accept='video/mp4, video/mpeg, video/webm'
          onChange={handleFileChange}
        />
        {isUploading ? (
          <div className='text-center h-full flex flex-col justify-center items-center w-full'>
            <ProgressBar progress={videoProgress} />
          </div>
        ) : (
          <div className='text-center h-full flex flex-col justify-center items-center w-full'>
            <CloudUpload className='h-[37px] w-[37px]' />
            <h4 className='mt-2 text-sm font-medium text-gray-900'>
              <label htmlFor='video-upload' className='relative cursor-pointer'>
                <span className='flex justify-center'>
                  <p className='text-yellow-500'>Click to upload</p>
                  <p className='pl-[5px]'> or drag and drop</p>
                </span>
                <input
                  id='video-upload'
                  name='video-upload'
                  type='file'
                  className='sr-only'
                  accept='video/mp4, video/mpeg, video/webm'
                  onChange={handleFileChange}
                />
              </label>
            </h4>
            <p className='mt-2 text-xs text-gray-500'>MP4, MPEG, or WEBM (max. file size 40MB)</p>
          </div>
        )}
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className='flex mt-2 w-full justify-end mb-3'>
          <AlertDialogTrigger asChild>
            <button className='flex gap-[4px] hover:text-yellow-500' type='button'>
              <CirclePlus fill='#FFBE00' className='h-6 w-6 text-black' /> Click to upload Url
            </button>
          </AlertDialogTrigger>
        </div>
        <AlertDialogContent>
          <AlertDialogCancel>
            <div className='flex justify-end'>
              <XCircle className='w-6 h-6' />
            </div>
          </AlertDialogCancel>
          <div className='flex flex-col gap-2'>
            <Input placeholder='URL' value={urlInput} onChange={(e) => setUrlInput(e.target.value)} />
            <Button type='button' variant='success' onClick={() => handleUpload(null)}>
              Save URL
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const ProgressBar = ({ progress = 0 }) => {
  return (
    <div className='w-full'>
      <div className='py-1.5 h-6 relative w-full'>
        <div className='absolute top-0 bottom-0 left-0 w-full h-full bg-gray-800 rounded-full'></div>
        <div
          style={{
            width: `${progress}%`, // Use the progress directly
          }}
          className='absolute top-0 bottom-0 left-0 h-full transition-all duration-150 bg-green-600 rounded-full'
        ></div>
        <div className='absolute top-0 bottom-0 left-0 flex items-center justify-center w-full h-full'>
          <span className='text-xs font-bold text-white'>{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export const FileUploadSingle = ({ onUploadSuccess }: any) => {
  const { mutation } = usePostUpload(); // Use mutation hook

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      // Call handleUpload immediately after selecting the file
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Start upload and track progress
    mutation.mutate(formData, {
      onSuccess: (response) => {
        onUploadSuccess(response.data.data); // Pass the response back to parent
      },
    });
  };

  return (
    <div className='w-full flex gap-[25px] h-full justify-between mt-3'>
      <div className='w-full relative border-2 border-gray-800 border-solid rounded-lg p-6 fileUpload'>
        <input
          type='file'
          name='image'
          className='absolute inset-0 w-full h-full opacity-0 z-50'
          accept='image/png, image/jpeg, image/gif'
          onChange={handleFileChange}
        />
        {mutation.isPending ? (
          <div className='text-center flex flex-col justify-center items-center w-full'>
            <Loader2 className='animate-spin' />
          </div>
        ) : (
          <div className='text-center flex flex-col justify-center items-center w-full'>
            <CloudUpload className='h-[37px] w-[37px]' />
            <h4 className='mt-2 text-sm font-medium text-gray-900'>
              <label htmlFor='file-upload' className='relative cursor-pointer'>
                <span className='flex justify-center'>
                  <p className='text-yellow-500'>Click to upload</p>
                  <p className='hidden sm:block pl-[5px]'> or drag and drop</p>
                </span>
                <input
                  id='file-upload'
                  name='file-upload'
                  type='file'
                  className='sr-only'
                  accept='image/png, image/jpeg, image/gif'
                  onChange={handleFileChange}
                />
              </label>
            </h4>
            <p className='mt-2 text-xs text-gray-500'>SVG, PNG, JPG, or GIF (max. 800x400px)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const AvatarUpload = ({ onUploadSuccess }: any) => {
  const { mutation } = usePostUpload(); // Use mutation hook
  const { mutation: update } = useUpdateUser();
  const { data: session } = useSession();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      // Call handleUpload immediately after selecting the file
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Start upload and track progress
    mutation.mutate(formData, {
      onSuccess: (response) => {
        onUploadSuccess(response.data.data); // Pass the response back to parent
        console.log(response);
        update.mutate(
          {
            userId: session?.user?.id,
            avatar: {
              name: response.data.data.uniqueName,
              url: response.data.data.signedUrl,
              fileId: response.data.data.fileId,
            },
          },
          {
            onSuccess: () => window.location.reload(),
          }
        );
      },
    });
  };

  return (
    <div className='w-full flex gap-[25px] h-full justify-between mt-3'>
      <div className='w-full relative border-2 border-gray-800 border-solid rounded-lg p-6 fileUpload'>
        <input
          type='file'
          name='image'
          className='absolute inset-0 w-full h-full opacity-0 z-50'
          accept='image/png, image/jpeg, image/gif'
          onChange={handleFileChange}
        />
        {mutation.isPending ? (
          <div className='text-center flex flex-col justify-center items-center w-full'>
            <Loader2 className='animate-spin' />
          </div>
        ) : (
          <div className='text-center flex flex-col justify-center items-center w-full'>
            <CloudUpload className='h-[37px] w-[37px]' />
            <h4 className='mt-2 text-sm font-medium text-gray-900'>
              <label htmlFor='file-upload' className='relative cursor-pointer'>
                <span className='flex justify-center'>
                  <p className='text-yellow-500'>Click to upload</p>
                  <p className='hidden sm:block pl-[5px]'> or drag and drop</p>
                </span>
                <input
                  id='file-upload'
                  name='file-upload'
                  type='file'
                  className='sr-only'
                  accept='image/png, image/jpeg, image/gif'
                  onChange={handleFileChange}
                />
              </label>
            </h4>
            <p className='mt-2 text-xs text-gray-500'>SVG, PNG, JPG, or GIF (max. 800x400px)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const getFormattedDate = (date: any) => {
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  return `${month}-${year}`;
};

const formatDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
