"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { checkoutSchema } from "@/app/components/schema/Forms";
import { usePostTransaction, useVerifyPaystack } from "@/hooks/paystack";
import { useGetUser } from "@/hooks/users";
import { Loader2 } from "lucide-react";
import { useGetCourse } from "@/hooks/course";
import ReactPlayer from "react-player/lazy";
import { SkeletonCard1 } from "@/components/ui/skeleton";
import { shortenText } from "@/app/components/dashboard/CourseCard";
import { ContainerDashboard } from "@/components/ui/containers";
import { Input } from "@/components/ui/input";

declare var PaystackPop: {
  setup: (options: {
    key: string;
    email: string;
    currency: string;
    amount: number;
    ref?: string;
    metadata?: {
      custom_fields?: {
        display_name: string;
        variable_name: string;
        value: string;
      }[];
    };
    onClose?: () => void;
    callback: (response: { reference: string }) => void;
  }) => {
    openIframe: () => void;
  };
};

const ConfirmCheckout = ({ params }: any) => {
  const { courseId } = params;
  const user = useGetUser();
  const { mutation } = useVerifyPaystack();
  const { mutation: postTransaction } = usePostTransaction();
  const course = useGetCourse(courseId);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    if (user?.data)
      form.reset({
        firstName: user?.data?.firstname || "",
        lastName: user?.data?.lastname || "",
        email: user?.data?.email || "",
      });
  }, [user?.data]);

  const handleSubmit = (data: any) => {
    console.log(data);

    let handler = PaystackPop.setup({
      key: `${process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY_LIVE}`,
      email: data.email,
      currency: "NGN",
      amount: data.amount * 100, // Paystack requires amount in kobo
      ref: data.reference, // unique reference
      metadata: {
        custom_fields: [
          {
            display_name: data.username,
            variable_name: data.product,
            value: data.email,
          },
        ],
      },
      callback: function (response) {
        console.log(response);
        mutation.mutate(data);
      },
    });

    handler.openIframe();
  };

  const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
    console.log(values);

    const data = {
      userId: user?.data?._id,
      product: course?.data?.title === "3in1" ? "Smart Trader Pack" : course?.data?.title,
      transactionType: "Paystack",
      amount: course?.data?.price,
      duration: course?.data?.durationHours,
      reference: `ref_${Math.random().toString(36).slice(2)}`,
      courseId: courseId,
      instructorId: course?.data?.user,
      notificationTitle: "New Course",
      notificationDesc: "You have successfully purchased",
    };

    postTransaction.mutate(data, {
      onSuccess: (response: any) => {
        console.log(response);
        handleSubmit({
          ...data,
          transactionId: response.data.transactionId,
          username: user?.data?.username,
          email: user?.data?.email,
        });
      },
      onError: (error) => {
        console.error("Error creating transaction:", error);
      },
    });

    // call the handle Submit function
  };

  if (user?.status !== "success" || course?.status !== "success") return <SkeletonCard1 />;
  else
    return (
      <ContainerDashboard>
        <h1 className='text-left'>Checkout</h1>

        <Form {...form}>
          <form>
            <div className='flex flex-col md:flex-row border-t border-gray-700 items-start gap-0 md:gap-6'>
              <div className='flex md:border-r py-0 pt-10 md:pt-0 md:py-10  md:pr-8 border-gray-700 flex-col gap-5 w-full'>
                <div className='flex flex-col gap-5 mt-4'>
                  <h4>Account Details</h4>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='firstName'
                      render={({ field }) => (
                        <FormItem className='mt-4'>
                          <FormLabel className='bottom-0'>First name</FormLabel>
                          <Input {...field} placeholder='Enter First name' />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='lastName'
                      render={({ field }) => (
                        <FormItem className='mt-4'>
                          <FormLabel className='bottom-0'>Last name</FormLabel>
                          <Input {...field} placeholder='Enter Last name' />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem className='mt-4'>
                        <FormLabel className='bottom-0'>Email</FormLabel>
                        <Input {...field} placeholder='Enter Email address' />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex flex-col gap-5 mt-4'>
                  <h4>Billing Address</h4>
                  <FormField
                    control={form.control}
                    name='country'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='bottom-0'>Country of residence</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder='Select a country' />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country: any) => (
                              <SelectItem value={country.name}>{country.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name='payment'
                    render={({ field }) => (
                      <FormItem className='mt-4'>
                        <FormLabel className='bottom-0'>Payment method</FormLabel>

                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder='Select payment method' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='Paystack'>Paystack</SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </div>

                <h4 className='mt-6 md:mt-14'>Order details</h4>

                <div className='flex flex-col gap-4 max-w-[373px] bg-[#0607155f] p-4 rounded-md'>
                  <div className='relative w-full overflow-hidden  h-[182px] rounded-md'>
                    <ReactPlayer width={340} height={192} controls url={course?.data?.featuredVideo?.url} />
                  </div>
                  <h5 className='leading-6'>{shortenText(course?.data?.title, 70)}</h5>
                  <p className='leading-6'>{shortenText(course?.data?.miniDescription, 100)}</p>
                </div>
              </div>
              <div className='flex py-5 md:py-10 flex-col gap-5 pr-4 w-full md:w-[561px]'>
                <div className='flex flex-col gap-4 py-4 border-b border-gray-800'>
                  <h6>Order Summary</h6>
                  <div className='flex gap-2 items-center justify-between'>
                    <p>Price</p>
                    <h5 className='font-medium'>₦ {course?.data?.price.toLocaleString("en-NG")}</h5>
                  </div>
                  <div className='flex gap-2 items-center justify-between'>
                    <p>Discounts</p>
                    <h5>₦ 0</h5>
                  </div>
                </div>
                <div className='flex flex-col gap-2 py-1'>
                  <div className='flex gap-2 items-center justify-between'>
                    <p>Total</p>
                    <h5>₦ {course?.data?.price.toLocaleString("en-NG")}</h5>
                  </div>
                </div>
                <p className='text-center text-white mt-10'>
                  By completing your purchase you agree to our Terms of Service
                </p>
                <Button
                  type='button'
                  className='my-5 w-full'
                  disabled={postTransaction.isPending}
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {postTransaction.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Checkout"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </ContainerDashboard>
    );
};

export default ConfirmCheckout;

const countries = [
  { name: "Nigeria", flag: "https://flagcdn.com/w320/ng.png" },
  { name: "Ghana", flag: "https://flagcdn.com/w320/gh.png" },
  { name: "South Africa", flag: "https://flagcdn.com/w320/za.png" },
  {
    name: "United Kingdom",

    flag: "https://flagcdn.com/w320/gb.png",
  },
  {
    name: "United States",

    flag: "https://flagcdn.com/w320/us.png",
  },
  { name: "Canada", flag: "https://flagcdn.com/w320/ca.png" },
  { name: "Australia", flag: "https://flagcdn.com/w320/au.png" },
  { name: "Ireland", flag: "https://flagcdn.com/w320/ie.png" },
] as const;

// "use client";
// import { BookOpenTextIcon, PlayCircle, Star } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import { SkeletonCard2 } from "@/components/ui/skeleton";
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { ContainerDashboard } from "@/components/ui/containers";
// import ReactPlayer from "react-player/lazy";
// import { useGetCourse } from "@/hooks/course";
// import Image from "next/image";
// import { Reviews } from "@/app/components/dashboard/Reviews";
// import { useGetUserById } from "@/hooks/users";
// import { CourseCardSinglePage } from "@/app/components/dashboard/CourseCard";
// import { formatText } from "@/lib/helpers";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// const Checkout = ({ params }: any) => {
//   const { courseId } = params;
//   const navigation = useRouter();
//   const [data, setData] = useState<any>([]);

//   const { data: course, status } = useGetCourse(courseId);
//   const { data: instructor } = useGetUserById(course?.user);
//   const selectedCourseIds = course?.selectedCourseIds || [];
//   const { data: course1 } = useGetCourse(selectedCourseIds[0]);
//   const { data: course2 } = useGetCourse(selectedCourseIds[1]);
//   const { data: course3 } = useGetCourse(selectedCourseIds[2]);

//   useEffect(() => {
//     if (selectedCourseIds.length > 0) {
//       const coursesArray = [course1, course2, course3].filter(Boolean); // Only include defined courses
//       setData(coursesArray);
//     }
//   }, [course1, course2, course3]);

//   const courseData = [
//     {
//       title: "Description",
//       text: course?.description,
//     },
//     {
//       title: "Curriculum",
//       text: "Curriculum Details:",
//     },
//   ];

//   console.log(instructor?.avatar);
//   if (status !== "success") return <SkeletonCard2 />;
//   else
//     return (
//       <ContainerDashboard>
//         <div className='flex flex-col w-full'>
//           <div className='relative w-full bg-black h-[400px] sm:h-[592px] rounded-md'>
//             <ReactPlayer width='100%' height='100%' controls url={course?.featuredVideo.url} />
//           </div>
//           <div className='flex bg-[#060715] flex-col py-8 sm:px-4 gap-8 justify-between'>
//             <div>
//               <h2 className='text-yellow-500 px-4 sm:px-0 leading-normal mb-5'>{course?.title}</h2>
//               <div className='flex flex-col p-4 bg-gradient-to-b from-[#362A844D] from-10% via-[#362A844D] via-30% to-[#201F3F00] to-90% gap-4'>
//                 <div className='flex gap-2'>
//                   <Image
//                     src={instructor?.avatar?.url || "/noavatar.png"}
//                     alt='Avatar'
//                     height={300}
//                     width={300}
//                     className='w-12 object-cover h-12 rounded-full'
//                   />
//                   <div>
//                     <p className='text-white'>{course?.instructor?.name || course?.username}</p>
//                     <p>{course?.instructor?.title}</p>
//                   </div>
//                 </div>
//                 <p className='my-3'>{course?.miniDescription}</p>
//                 <div className='flex items-center gap-2'>
//                   <p>{course?.ratings?.average || 1}/5</p>
//                   {Array.from({ length: course?.ratings?.average }).map((_, index) => (
//                     <Star fill='#34A853' className='text-[#34A853] h-4 w-4' key={index} />
//                   ))}
//                   <p>({course?.ratings?.total || 0})</p>
//                 </div>
//                 <h4 className='md:text-[25px] text-yellow-500'>₦{course?.price}</h4>
//               </div>

//               <Tabs defaultValue='course' className='mt-5'>
//                 <TabsList>
//                   <TabsTrigger value='course'>About Course</TabsTrigger>
//                   <TabsTrigger value='reviews'>Reviews</TabsTrigger>
//                 </TabsList>
//                 <div className='border-b border-gray-800'></div>

//                 <TabsContent value='course'>
//                   <Accordion className='bg-[#060715]' type='single' collapsible>
//                     {courseData.map((item, index) => (
//                       <AccordionItem className='bg-transparent max-w-full' value={item.title} key={index}>
//                         <AccordionTrigger>{item.title}</AccordionTrigger>
//                         <AccordionContent>
//                           {item.title === "Description" ? (
//                             <p>{formatText(item?.text)}</p>
//                           ) : (
//                             <Accordion type='single' collapsible>
//                               {course?.category === "3in1" ? (
//                                 <div className='flex gap-4 flex-col'>
//                                   {data?.map((course: any) => (
//                                     <CourseCardSinglePage course={course} />
//                                   ))}
//                                 </div>
//                               ) : (
//                                 course?.chapters.map((chapter: any, index: number) => {
//                                   const video = chapter.uploadedFiles
//                                     ? chapter.uploadedFiles.filter(
//                                         (file: any) => file.type === "mp4" || file.type === "URL"
//                                       )
//                                     : [];

//                                   return (
//                                     <AccordionItem
//                                       value={chapter.details?.title}
//                                       key={index}
//                                       className='p-0 max-w-full'
//                                     >
//                                       <AccordionTrigger>
//                                         <div className='flex flex-col gap-1'>
//                                           Chapter {index + 1}: {chapter.details?.title || "Untitled"}
//                                           <div className='flex items-center'>
//                                             <p>{video.length} Videos</p>
//                                             <p className='border-x mx-5 px-5 border-gray-700'>
//                                               {chapter.quiz?.questions ? chapter.uploadedFiles.length : 0} Lectures
//                                             </p>
//                                             <p>{chapter.quiz?.questions ? chapter.quiz.questions.length : 0} Quiz</p>
//                                           </div>
//                                         </div>
//                                       </AccordionTrigger>
//                                       <AccordionContent className='p-0 m-0'>
//                                         {chapter?.uploadedFiles.length > 0 && (
//                                           <ul>
//                                             {chapter?.uploadedFiles?.map((file: any, i: number) => (
//                                               <li key={i} className='border-t border-gray-800 py-2'>
//                                                 {file.title}
//                                                 <span className='flex items-center gap-3'>
//                                                   {file?.type === "mp4" || file?.type === "URL" ? (
//                                                     <PlayCircle fill='#FFBE00' className='text-black' />
//                                                   ) : (
//                                                     <BookOpenTextIcon fill='#FFBE00' className='text-black' />
//                                                   )}
//                                                   {file?.type === "mp4" || file?.type === "URL" ? (
//                                                     <p>{file.duration || "0:00"}m</p>
//                                                   ) : (
//                                                     <p className='uppercase'>{file?.type}</p>
//                                                   )}
//                                                 </span>
//                                               </li>
//                                             ))}
//                                           </ul>
//                                         )}
//                                       </AccordionContent>
//                                     </AccordionItem>
//                                   );
//                                 })
//                               )}
//                             </Accordion>
//                           )}
//                         </AccordionContent>
//                       </AccordionItem>
//                     ))}
//                   </Accordion>
//                 </TabsContent>

//                 <TabsContent value='reviews'>
//                   <Reviews courseId={courseId} />
//                 </TabsContent>
//               </Tabs>

//               {/* <Reviews courseId={courseId} /> */}
//               <div className='flex flex-col sm:flex-row w-full gap-2 mt-10'>
//                 <Button
//                   variant={"socials"}
//                   className='w-full bg-green-600 hover:border-white hover:text-white rounded-lg mt-4'
//                   type='submit'
//                   onClick={() => navigation.push("checkout/confirm")}
//                 >
//                   Enroll now
//                 </Button>
//                 <Button
//                   onClick={() => navigation.push("/dashboard/course")}
//                   variant={"destructive"}
//                   className='border border-[#C427FB00] bg-[#ff000045] rounded-lg text-black w-full'
//                 >
//                   Close
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </ContainerDashboard>
//     );
// };

// export default Checkout;
