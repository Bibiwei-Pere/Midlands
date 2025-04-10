"use client";
import React, { useEffect, useState } from "react";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CloudUpload, Loader2, Pen, Star, XCircle } from "lucide-react";
import { AddButtonContainer, Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetUser } from "@/hooks/users";
import { SkeletonCard1 } from "@/components/ui/skeleton";
import { ContainerDashboard, DashboardHeader } from "@/components/ui/containers";
import { useGetAllCourse, useGetCourse, usePostCourse, useUpdateCourse } from "@/hooks/course";
import Leaderboard from "@/app/components/dashboard/LeaderBoard";
import { CourseTab, EditableField } from "@/app/components/dashboard/CourseTab";
import { VideoUploadSingle } from "@/app/components/dashboard/FileUpload";
import ReactPlayer from "react-player/lazy";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Image from "next/image";
import { createCourseSchema } from "@/app/components/schema/Forms";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DeleteCourse } from "@/app/components/dashboard/Course";
import { UsersStats } from "@/app/components/dashboard/Reviews";
import { usePostUpload } from "@/hooks/upload2";
import { Check, ChevronDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const Course = ({ params }: { params: any }) => {
  const { courseId } = params;
  const { mutation } = usePostCourse();
  const { mutation: updateCourse } = useUpdateCourse();
  const [course, setCourse] = useState<any>({});
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<any>({});
  const [uploadedImageUrl, setUploadedImageUrl] = useState<any>({});
  const [editVideo, setEditVideo] = useState(false);
  const [editImage, setEditImage] = useState(false);
  const [formDirty, setFormDirty] = useState(false);

  const shouldFetchCourse = courseId !== "add";
  const getCourse = courseId !== "add" ? useGetCourse(courseId) : null;
  const [chapters, setChapters] = useState<any[]>([]);
  const [price, setPrice] = useState(0);
  const [courseAmount, setCourseAmount] = useState(0);
  const [courseAmountPercent, setCourseAmountPercent] = useState(0);
  const [description, setDescription] = useState("");
  const [certificate, setCertificate] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [instructorTitle, setInstructorTitle] = useState("");
  const [instructorDesc, setInstructorDesc] = useState("");
  const { mutation: uploadeImage } = usePostUpload();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCourseIds, setSelectedCourseIds] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { data: courseData } = useGetAllCourse();

  const form = useForm<z.infer<typeof createCourseSchema>>({
    resolver: zodResolver(createCourseSchema),
    mode: "onChange",
  });
  // console.log(form.formState.errors);

  useEffect(() => {
    if (getCourse?.status === "success" && getCourse?.data) {
      setCourse(getCourse.data);
      setChapters(getCourse.data.chapters);
      setPrice(getCourse.data.price);
      setDescription(getCourse.data.description);
      setCertificate(getCourse.data.certificate);
      setInstructorName(getCourse.data.instructor.name);
      setInstructorTitle(getCourse.data.instructor.title);
      setInstructorDesc(getCourse.data.instructor.description);
      setSelectedCategory(getCourse.data.category);
      setSelectedCourseIds(getCourse.data.selectedCourseIds);
      setCourseAmount(getCourse.data.price);
      // Reset the form with the fetched course data
      form.reset({
        title: getCourse.data.title || "",
        miniDescription: getCourse.data.miniDescription || "",
        category: getCourse.data.category || "Beginner",
        price: getCourse.data.price?.toString() || "0",
        name: getCourse.data.name || "",
        status: getCourse.data.status || "",
        commission: getCourse.data.commission?.toString() || "0",
        durationHours: getCourse.data.durationHours?.toString() || "0",
      });
    }
  }, [getCourse?.status, getCourse?.data, form]);

  console.log(getCourse?.data);
  console.log(uploadedVideoUrl);

  const handleUploadVideo = (response: any) => {
    setUploadedVideoUrl(response);
    setFormDirty(true);
    setEditVideo(false);
  };

  const [editMode, setEditMode] = useState({
    title: false,
    miniDesc: false,
  });

  console.log(selectedCourseIds);
  const handleDescriptionChange = (newDescription: string) => {
    setFormDirty(true);
    setDescription(newDescription);
  };
  const handleCertificateChange = (newCertificate: string) => {
    setFormDirty(true);
    setCertificate(newCertificate);
  };
  const handleInstructorNameChange = (newInstructorName: string) => {
    setFormDirty(true);
    setInstructorName(newInstructorName);
  };
  const handleInstructorTitleChange = (newinstructorTitle: string) => {
    setFormDirty(true);
    setInstructorTitle(newinstructorTitle);
  };
  const handleInstructorDescChange = (newinstructorDesc: string) => {
    setFormDirty(true);
    setInstructorDesc(newinstructorDesc);
  };
  const handleChaptersChange = (newchapters: any) => {
    setChapters(newchapters);
    setFormDirty(true);
  };
  useEffect(() => {
    const discount = (courseAmountPercent / 100) * courseAmount;
    const newPrice = courseAmount - discount;
    setPrice(newPrice);
  }, [courseAmount, courseAmountPercent]);

  const user = useGetUser();
  const handleTextareaChange = (e: any) => {
    setFormDirty(true);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px"; // Adjust the height to fit content
  };

  // Handle course selection within the dialog, allowing up to 3 selections
  const handleCourseSelection = (course: any) => {
    setSelectedCourseIds((prev: any) => {
      if (prev.includes(course)) {
        return prev.filter((item: any) => item !== course);
      } else if (prev.length < 3) {
        return [...prev, course];
      }
      return prev; // Prevent adding more than 3 items
    });
  };

  const handleCategoryChange = (value: any) => {
    setSelectedCategory(value);
    if (value === "3in1") {
      setShowDialog(true);
    } else {
      setSelectedCourseIds([]); // Reset courses if a different category is selected
    }
  };

  console.log(selectedCourseIds);

  const onSubmit = (values: z.infer<typeof createCourseSchema>) => {
    const data = {
      ...values,
      category: selectedCategory,
      selectedCourseIds,
      price: price,
      featuredImg: {
        name: uploadedImageUrl.uniqueName,
        fileId: uploadedImageUrl.fileId,
        url: uploadedImageUrl.signedUrl,
      },
      featuredVideo: {
        name: uploadedVideoUrl.uniqueName,
        fileId: uploadedVideoUrl.fileId,
        url: uploadedVideoUrl.signedUrl,
      },
      description: description,
      certificate: certificate,
      instructor: {
        name: instructorName,
        title: instructorTitle,
        description: instructorDesc,
      },
      userId: user?.data?._id,
      chapters: chapters,
    };

    console.log(data);
    if (courseId === "add") {
      console.log("first");
      mutation.mutate(data);
    } else {
      updateCourse.mutate(
        {
          ...data,
          courseId: courseId,
        },
        {
          onSuccess: () => setFormDirty(false),
        }
      );
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      const formData = new FormData();
      formData.append("file", file);

      // Start upload and track progress
      uploadeImage.mutate(formData, {
        onSuccess: (response) => {
          setUploadedImageUrl(response.data.data);
          setFormDirty(true);
          setEditImage(false);
        },
      });
    }
  };

  if (user?.status !== "success") return <SkeletonCard1 />;
  else if (courseId !== "add" && getCourse?.status !== "success") return <SkeletonCard1 />;
  else
    return (
      <Form {...form}>
        <form>
          <DashboardHeader>
            <h2>Course Management</h2>
            <div className='flex flex-col sm:flex-row items-center gap-2 max-w-[212px]'>
              {courseId !== "add" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type='button' className='mr-0'>
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <DeleteCourse id={courseId} />
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button
                type='submit'
                onClick={form.handleSubmit(onSubmit)}
                variant={`${formDirty ? "success" : "buy"}`}
                className={`mr-0 mt-0`}
                disabled={mutation.isPending || updateCourse.isPending}
              >
                {mutation.isPending || updateCourse.isPending ? <Loader2 className='w-4 h-5 animate-spin' /> : "Save"}
              </Button>
            </div>
          </DashboardHeader>
          <ContainerDashboard>
            <div className='flex flex-col gap-5 mt-4'>
              <div className='flex flex-col lg:flex-row gap-8'>
                <div className='w-full'>
                  <div className='relative flex flex-col gap-7 px-3 bg-black'>
                    <EditableField
                      field={form.register("title")}
                      className='text-yellow-500 placeholder:text-yellow-500 text-[50px] leading-[45px]'
                      placeHolder='Enter title'
                      isEditing={courseId === "add" ? !editMode.title : editMode.title}
                      courseId={courseId}
                      onToggleEdit={() => setEditMode((prev) => ({ ...prev, title: !prev.title }))}
                      handleTextareaChange={handleTextareaChange}
                    />

                    <div className='relative overflow-hidden w-full rounded-md h-[336px]'>
                      {uploadedVideoUrl?.signedUrl || (getCourse?.data?.featuredVideo?.url && !editVideo) ? (
                        <div>
                          <div className='flex items-end justify-end'>
                            {!editVideo && (
                              <Pen
                                className='cursor-pointer h-4 hover:text-yellow-500'
                                onClick={() => setEditVideo(true)}
                              />
                            )}
                          </div>

                          <ReactPlayer
                            controls
                            url={uploadedVideoUrl?.signedUrl || getCourse?.data.featuredVideo?.url}
                          />
                        </div>
                      ) : (
                        <div className='h-full pt-9'>
                          {editVideo && (
                            <XCircle
                              className='cursor-pointer absolute right-2 top-2 w-5 h-5 hover:text-yellow-500'
                              onClick={() => setEditVideo(false)}
                            />
                          )}
                          <VideoUploadSingle uploadVideo={handleUploadVideo} />
                        </div>
                      )}
                    </div>
                    <EditableField
                      field={form.register("miniDescription")}
                      placeHolder='Enter short Description'
                      className='text-[#979797] leading-normal'
                      isEditing={courseId === "add" ? !editMode.miniDesc : editMode.miniDesc}
                      courseId={courseId}
                      onToggleEdit={() =>
                        setEditMode((prev) => ({
                          ...prev,
                          miniDesc: !prev.miniDesc,
                        }))
                      }
                      handleTextareaChange={handleTextareaChange}
                    />
                  </div>
                  <div className='flex mt-8 items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <h5 className='text-yellow-500'>{course?.ratings?.average || 0}</h5>
                      {shouldFetchCourse
                        ? Array.from({ length: course?.ratings?.average }).map((_, index) => (
                            <Star fill='#FFBE00' className='text-[#FFBE00] h-4 w-4' key={index} />
                          ))
                        : Array.from({ length: 5 }).map((_, index) => (
                            <Star className='text-[#FFBE00] h-4 w-4' key={index} />
                          ))}
                      <p>( {course?.ratings?.total || 0} ratings)</p>
                    </div>
                    <p className='border-x border-gray-800 px-8'>
                      {course?.durationHours * 24 || 0} Total Hours {course?.resourcesCount || 0} Lectures
                    </p>
                    <FormField
                      control={form.control}
                      name='category'
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={(value) => handleCategoryChange(value)} defaultValue={field.value}>
                            <SelectTrigger className='w-auto gap-5 bg-transparent text-[18px] text-yellow-500 border-none font-medium'>
                              <SelectValue placeholder={field.value || "Beginner"} />
                            </SelectTrigger>
                            <SelectContent className='w-auto px-4'>
                              <SelectItem value='Beginner'>Beginner</SelectItem>
                              <SelectItem value='Intermediate'>Intermediate</SelectItem>
                              <SelectItem value='Advanced/Strategy'>Advanced/Strategy</SelectItem>
                              <SelectItem value='3in1'>3in1 Pack</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  {showDialog && (
                    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                      <AlertDialogTrigger asChild>
                        <div></div>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <h2 className='text-lg font-medium mb-4'>Select 3 Courses</h2>
                        <div className='flex flex-col gap-3'>
                          {/* Popover for Course Selection with Search */}
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant='secondary'
                                role='combobox'
                                className='rounded-md py-0 px-3 justify-between w-full border-gray-800 hover:text-white hover:bg-black'
                              >
                                {selectedCourseIds.length > 0
                                  ? `Selected Courses: ${selectedCourseIds.length}`
                                  : "Select courses"}
                                <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent className='w-full p-0'>
                              <Command>
                                <CommandInput placeholder='Search courses...' />
                                <CommandList>
                                  <CommandEmpty>No course found.</CommandEmpty>
                                  <CommandGroup>
                                    {courseData.map((course: any) => (
                                      <CommandItem
                                        key={course._id}
                                        value={course.title}
                                        onSelect={() => handleCourseSelection(course._id)}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedCourseIds.includes(course._id) ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        {course.title}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className='flex justify-end'>
                          <div className='flex gap-2 max-w-[250px]'>
                            <AlertDialogCancel
                              onClick={() => {
                                setShowDialog(false);
                                setSelectedCourseIds([]);
                              }}
                            >
                              <Button type='button' variant={"destructive"}>
                                Cancel
                              </Button>
                            </AlertDialogCancel>
                            <Button
                              type='button'
                              variant={"success"}
                              onClick={() => {
                                setShowDialog(false);
                              }}
                            >
                              Confirm
                            </Button>
                          </div>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
                <div className='flex w-full lg:w-[619px] flex-col gap-3'>
                  <div>
                    <div className='flex justify-between'>
                      <div className='flex items-end w-full justify-end'>
                        <h6>Course Featured Image</h6>
                      </div>
                    </div>
                    {uploadedImageUrl?.signedUrl || (course?.featuredImg?.url && !editImage) ? (
                      <AddButtonContainer className='relative h-[300px] overflow-hidden w-full'>
                        <div className='w-full absolute top-0'>
                          <Pen
                            className='cursor-pointer absolute top-2 right-2 h-4 hover:text-yellow-500'
                            onClick={() => setEditImage(true)}
                          />
                          <Image
                            src={uploadedImageUrl.signedUrl || course?.featuredImg?.url}
                            alt={`file-preview`}
                            width={510}
                            height={510}
                            className='max-w-full rounded-md h-auto'
                          />
                        </div>
                      </AddButtonContainer>
                    ) : (
                      <div className='w-full relative overflow-hidden pt-6'>
                        {editImage && (
                          <XCircle
                            className='cursor-pointer absolute right-2 top-2 w-5 h-5 hover:text-yellow-500'
                            onClick={() => setEditImage(false)}
                          />
                        )}
                        <div className='w-full flex gap-[25px] h-full justify-between mt-3'>
                          <div className='w-full relative border-2 border-gray-800 border-solid rounded-lg p-6 fileUpload'>
                            <input
                              type='file'
                              name='image'
                              className='absolute inset-0 w-full h-full opacity-0 z-50'
                              accept='image/png, image/jpeg, image/gif'
                              onChange={handleFileChange}
                            />
                            {uploadeImage.isPending ? (
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
                                  </label>
                                </h4>
                                <p className='mt-2 text-xs text-gray-500'>SVG, PNG, JPG, or GIF (max. 800x400px)</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className='bg-black flex justify-between items-center py-4 rounded-lg px-3'>
                    <div className='flex gap-3 items-center'>
                      <div className='flex items-center'>
                        <Input
                          className='max-w-[40px] placeholder:text-[#16A34A] text-[#16A34A] text-[20px] text-right p-0 border-none'
                          placeholder='0'
                          onChange={(e) => {
                            setFormDirty(true);
                            setCourseAmountPercent(parseInt(e.target.value));
                          }}
                        />
                        <span className='text-[#16A34A] ml-1'>% Off</span>
                      </div>
                      <h5 className='text-[#979797]'>₦{price || 40000}</h5>
                    </div>

                    <div className='flex items-center'>
                      <span className='mr-1'>₦</span>
                      <Input
                        className='border-none p-0 text-[24px] text-left max-w-[95px]'
                        placeholder='000000'
                        onChange={(e) => {
                          setFormDirty(true);
                          setCourseAmount(parseInt(e.target.value));
                        }}
                      />
                    </div>
                  </div>
                  <div className='bg-black flex justify-between items-center py-4 rounded-lg px-3'>
                    <FormField
                      control={form.control}
                      name='status'
                      render={({ field }) => (
                        <FormItem className='flex justify-between flex-row-reverse items-center w-full'>
                          <FormLabel>Status</FormLabel>

                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className='w-[130px] text-[18px] text-[#16A34A] border-none font-medium'>
                              <SelectValue placeholder={field.value || "Archived"} />
                            </SelectTrigger>
                            <SelectContent className='w-[130px]'>
                              <SelectItem value='Archived'>Archived</SelectItem>
                              <SelectItem value='Published'>Published</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='bg-black flex justify-between items-center py-4 rounded-lg px-3'>
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem className='flex justify-center items-center'>
                          <Input
                            className='max-w-[165px] placeholder:text-[#16A34A] text-[#16A34A] text-[20px] text-right p-0 border-none'
                            placeholder='Name of Course'
                            {...field}
                          />
                        </FormItem>
                      )}
                    />
                    <FormLabel className='text-right w-[120px] leading-normal'>Course Prerequisite</FormLabel>
                  </div>
                  <div className='bg-black flex justify-between items-center py-4 rounded-lg px-3'>
                    <FormField
                      control={form.control}
                      name='commission'
                      render={({ field }) => (
                        <FormItem className='flex justify-center items-center'>
                          <Input
                            pattern={REGEXP_ONLY_DIGITS}
                            className='max-w-[40px] placeholder:text-[#16A34A] text-[#16A34A] text-[20px] text-right p-0 border-none'
                            placeholder='100'
                            {...field}
                          />
                          <span className='text-[#16A34A] ml-1 pb-2'>%</span>
                        </FormItem>
                      )}
                    />
                    <FormLabel className='text-right w-[120px] leading-normal'>Afilliate Commission</FormLabel>
                  </div>
                  <div className='bg-black flex justify-between items-center py-4 rounded-lg px-3'>
                    <FormField
                      control={form.control}
                      name='durationHours'
                      render={({ field }) => (
                        <FormItem className='flex justify-center items-center'>
                          <Input
                            pattern={REGEXP_ONLY_DIGITS}
                            className='max-w-[40px] placeholder:text-[#16A34A] text-[#16A34A] text-[20px] text-right p-0 border-none'
                            placeholder='0'
                            {...field}
                          />
                          <span className='text-[#16A34A] ml-1 pb-2'>
                            days
                            <b className='font-normal text-red-500'>*</b>
                          </span>
                        </FormItem>
                      )}
                    />
                    <FormLabel className='text-right w-[120px] leading-normal'>Course Duration</FormLabel>
                  </div>
                  <UsersStats course={true} />
                </div>
              </div>
              <Leaderboard />
              <CourseTab
                courseId={courseId}
                description={description}
                certificate={certificate}
                onDescriptionChange={handleDescriptionChange}
                onCertificateChange={handleCertificateChange}
                instructorName={instructorName}
                instructorTitle={instructorTitle}
                instructorDesc={instructorDesc}
                chapters={chapters}
                onInstructorNameChange={handleInstructorNameChange}
                onInstructorTitleChange={handleInstructorTitleChange}
                onChaptersChange={handleChaptersChange}
                onInstructorDescChange={handleInstructorDescChange}
              />
            </div>
          </ContainerDashboard>
        </form>
      </Form>
    );
};

export default Course;
