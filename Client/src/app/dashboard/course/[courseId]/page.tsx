"use client";
import { BookOpenTextIcon, PlayCircle, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SkeletonCard2 } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ContainerDashboard } from "@/components/ui/containers";
import ReactPlayer from "react-player/lazy";
import { useGetCourse } from "@/hooks/course";
import Image from "next/image";
import { Reviews } from "@/app/components/dashboard/Reviews";
import { useGetUserById } from "@/hooks/users";
import { CourseCardSinglePage } from "@/app/components/dashboard/CourseCard";
import { formatText } from "@/lib/helpers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Checkout = ({ params }: any) => {
  const { courseId } = params;
  const navigation = useRouter();
  const [data, setData] = useState<any>([]);

  const { data: course, status } = useGetCourse(courseId);
  const { data: instructor } = useGetUserById(course?.user);
  const selectedCourseIds = course?.selectedCourseIds || [];
  const { data: course1 } = useGetCourse(selectedCourseIds[0]);
  const { data: course2 } = useGetCourse(selectedCourseIds[1]);
  const { data: course3 } = useGetCourse(selectedCourseIds[2]);

  useEffect(() => {
    if (selectedCourseIds.length > 0) {
      const coursesArray = [course1, course2, course3].filter(Boolean); // Only include defined courses
      setData(coursesArray);
    }
  }, [course1, course2, course3]);

  console.log(course);
  const courseData = [
    {
      title: "Description",
      text: course?.description,
    },
    {
      title: "Certification",
      text: course?.certificate,
    },
    {
      title: "Curriculum",
      text: "Curriculum Details:",
    },
  ];

  console.log(instructor?.avatar);
  if (status !== "success") return <SkeletonCard2 />;
  else
    return (
      <ContainerDashboard>
        <div className='flex flex-col w-full'>
          <div className='relative w-full bg-black h-[400px] sm:h-[592px] rounded-md'>
            {course?.category === "3in1" ? (
              <Image
                src={course?.featuredImg?.url}
                alt='Image'
                width={600}
                height={600}
                className='w-full h-full object-cover'
              />
            ) : (
              <ReactPlayer width='100%' height='100%' controls url={course?.featuredVideo.url} />
            )}
            {/* <ReactPlayer width='100%' height='100%' controls url={course?.featuredVideo.url} /> */}
          </div>
          <div className='flex bg-[#060715] flex-col py-8 sm:px-4 gap-8 justify-between'>
            <div>
              <h2 className='text-yellow-500 px-4 sm:px-0 leading-normal mb-5'>{course?.title}</h2>
              <div className='flex flex-col p-4 bg-gradient-to-b from-[#362A844D] from-10% via-[#362A844D] via-30% to-[#201F3F00] to-90% gap-4'>
                <div className='flex gap-2'>
                  <Image
                    src={instructor?.avatar?.url || "/noavatar.png"}
                    alt='Avatar'
                    height={300}
                    width={300}
                    className='w-12 object-cover h-12 rounded-full'
                  />
                  <div>
                    <p className='text-white'>{course?.instructor?.name || course?.username}</p>
                    <p>{course?.instructor?.title}</p>
                  </div>
                </div>
                <p className='my-3'>{course?.miniDescription}</p>
                <div className='flex items-center gap-2'>
                  <p>{course?.ratings?.average || 1}/5</p>
                  {Array.from({ length: course?.ratings?.average }).map((_, index) => (
                    <Star fill='#34A853' className='text-[#34A853] h-4 w-4' key={index} />
                  ))}
                  <p>({course?.ratings?.total || 0})</p>
                </div>
                <h4 className='md:text-[25px] text-yellow-500'>₦{course?.price.toLocaleString("en-NG")}</h4>
              </div>

              <Tabs defaultValue='course' className='mt-5'>
                <TabsList>
                  <TabsTrigger value='course'>About Course</TabsTrigger>
                  <TabsTrigger value='reviews'>Reviews</TabsTrigger>
                </TabsList>
                <div className='border-b border-gray-800'></div>

                <TabsContent value='course'>
                  <Accordion className='bg-[#060715]' type='single' collapsible>
                    {courseData.map((item, index) => (
                      <AccordionItem className='bg-transparent max-w-full' value={item.title} key={index}>
                        <AccordionTrigger>{item.title}</AccordionTrigger>
                        <AccordionContent>
                          {item.title === "Description" ? (
                            <p>{formatText(item?.text)}</p>
                          ) : item.title === "Certification" ? (
                            <p>{formatText(item?.text)}</p>
                          ) : (
                            <Accordion type='single' collapsible>
                              {course?.category === "3in1" ? (
                                <div className='flex gap-4 flex-col'>
                                  {data?.map((course: any) => (
                                    <CourseCardSinglePage course={course} />
                                  ))}
                                </div>
                              ) : (
                                course?.chapters.map((chapter: any, index: number) => {
                                  const video = chapter.uploadedFiles
                                    ? chapter.uploadedFiles.filter(
                                        (file: any) => file.type === "mp4" || file.type === "URL"
                                      )
                                    : [];

                                  return (
                                    <AccordionItem
                                      value={chapter.details?.title}
                                      key={index}
                                      className='p-0 max-w-full'
                                    >
                                      <AccordionTrigger>
                                        <div className='flex flex-col gap-1'>
                                          Chapter {index + 1}: {chapter.details?.title || "Untitled"}
                                          <div className='flex items-center'>
                                            <p>{video.length} Videos</p>
                                            <p className='border-x mx-5 px-5 border-gray-700'>
                                              {chapter.quiz?.questions ? chapter.uploadedFiles.length : 0} Lectures
                                            </p>
                                            <p>{chapter.quiz?.questions ? chapter.quiz.questions.length : 0} Quiz</p>
                                          </div>
                                        </div>
                                      </AccordionTrigger>
                                      <AccordionContent className='p-0 m-0'>
                                        {chapter?.uploadedFiles.length > 0 && (
                                          <ul>
                                            {chapter?.uploadedFiles?.map((file: any, i: number) => (
                                              <li key={i} className='border-t border-gray-800 py-2'>
                                                {file.title}
                                                <span className='flex items-center gap-3'>
                                                  {file?.type === "mp4" || file?.type === "URL" ? (
                                                    <PlayCircle fill='#FFBE00' className='text-black' />
                                                  ) : (
                                                    <BookOpenTextIcon fill='#FFBE00' className='text-black' />
                                                  )}
                                                  {file?.type === "mp4" || file?.type === "URL" ? (
                                                    <p>{file.duration || "0:00"}m</p>
                                                  ) : (
                                                    <p className='uppercase'>{file?.type}</p>
                                                  )}
                                                </span>
                                              </li>
                                            ))}
                                          </ul>
                                        )}
                                      </AccordionContent>
                                    </AccordionItem>
                                  );
                                })
                              )}
                            </Accordion>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>

                <TabsContent value='reviews'>
                  <Reviews courseId={courseId} />
                </TabsContent>
              </Tabs>

              {/* <Reviews courseId={courseId} /> */}
              <div className='flex flex-col sm:flex-row w-full gap-2 mt-10'>
                <Button
                  variant={"socials"}
                  className='w-full bg-green-600 hover:border-white hover:text-white rounded-lg mt-4'
                  type='submit'
                  onClick={() => navigation.push(`${courseId}/checkout`)}
                  // onClick={() => navigation.push("checkout/confirm")}
                >
                  Enroll now
                </Button>
                <Button
                  onClick={() => navigation.push("/dashboard/course")}
                  variant={"destructive"}
                  className='border border-[#C427FB00] bg-[#ff000045] rounded-lg text-black w-full'
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ContainerDashboard>
    );
};

export default Checkout;

// "use client";
// import { BookOpenTextIcon, PlayCircle } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import { SkeletonCard2 } from "@/components/ui/skeleton";
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// import { ContainerDashboard } from "@/components/ui/containers";
// import ReactPlayer from "react-player/lazy";
// import { useGetCourse } from "@/hooks/course";
// import Image from "next/image";
// import { useGetUserById } from "@/hooks/users";
// import { formatText } from "@/lib/helpers";
// import { CourseCardSinglePage } from "@/app/components/dashboard/CourseCard";

// const SingleCourse = ({ params }: any) => {
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

//   return (
//     <ContainerDashboard>
//       <div className='flex flex-col w-full'>
//         <div className='relative overflow-hidden w-full bg-black h-[400px] sm:h-[592px] rounded-md'>
//           {course?.category === "3in1" ? (
//             <Image
//               src={course?.featuredImg?.url}
//               alt='Image'
//               width={600}
//               height={600}
//               className='w-full h-full object-cover'
//             />
//           ) : (
//             <ReactPlayer width='100%' height='100%' controls url={course?.featuredVideo.url} />
//           )}
//         </div>
//         {status !== "success" ? (
//           <SkeletonCard2 />
//         ) : (
//           <div className='flex bg-[#060715] flex-col py-8 sm:px-4 gap-8 justify-between'>
//             <div>
//               <h2 className='text-yellow-500 px-4 sm:px-0 leading-normal mb-5'>{course?.title}</h2>
//               <div className='flex flex-col p-4 bg-gradient-to-b from-[#362A844D] from-10% via-[#362A844D] via-30% to-[#201F3F00] to-90% gap-4'>
//                 <div className='flex gap-2'>
//                   <Image
//                     src={instructor?.avatar?.url || "/noavatar.png"}
//                     alt='Avatar'
//                     height={400}
//                     width={400}
//                     className='w-12 object-cover h-12 rounded-full'
//                   />
//                   <div>
//                     <p className='text-white'>{course?.instructor?.name || course?.username}</p>
//                     <p>{course?.instructor?.title}</p>
//                   </div>
//                 </div>
//                 <p className='my-3'>{course?.miniDescription}</p>
//               </div>
//               <Accordion className='bg-[#060715]' type='single' collapsible>
//                 {courseData.map((item, index) => (
//                   <AccordionItem className='bg-transparent max-w-full' value={item.title} key={index}>
//                     <AccordionTrigger>{item.title}</AccordionTrigger>
//                     <AccordionContent>
//                       {item.title === "Description" ? (
//                         <p>{formatText(item?.text)}</p>
//                       ) : (
//                         <Accordion type='single' collapsible>
//                           {course?.category === "3in1" ? (
//                             <div className='flex gap-4 flex-col'>
//                               {data?.map((course: any) => (
//                                 <CourseCardSinglePage course={course} />
//                               ))}
//                             </div>
//                           ) : (
//                             course?.chapters.map((chapter: any, index: number) => {
//                               const video = chapter.uploadedFiles
//                                 ? chapter.uploadedFiles.filter(
//                                     (file: any) => file.type === "mp4" || file.type === "URL"
//                                   )
//                                 : [];

//                               return (
//                                 <AccordionItem value={chapter.details?.title} key={index} className='p-0 max-w-full'>
//                                   <AccordionTrigger>
//                                     <div className='flex flex-col gap-1'>
//                                       Chapter {index + 1}: {chapter.details?.title || "Untitled"}
//                                       <div className='flex items-center'>
//                                         <p>{video.length} Videos</p>
//                                         <p className='border-x mx-5 px-5 border-gray-700'>
//                                           {chapter.quiz?.questions ? chapter.uploadedFiles.length : 0} Lectures
//                                         </p>
//                                         <p>{chapter.quiz?.questions ? chapter.quiz.questions.length : 0} Quiz</p>
//                                       </div>
//                                     </div>
//                                   </AccordionTrigger>
//                                   <AccordionContent className='p-0 m-0'>
//                                     {chapter?.uploadedFiles.length > 0 && (
//                                       <ul>
//                                         {chapter?.uploadedFiles?.map((file: any, i: number) => (
//                                           <li key={i} className='border-t border-gray-800 py-2'>
//                                             {file.title}
//                                             <span className='flex items-center gap-3'>
//                                               {file?.type === "mp4" || file?.type === "URL" ? (
//                                                 <PlayCircle fill='#FFBE00' className='text-black' />
//                                               ) : (
//                                                 <BookOpenTextIcon fill='#FFBE00' className='text-black' />
//                                               )}
//                                               {file?.type === "mp4" || file?.type === "URL" ? (
//                                                 <p>{file.duration || "0:00"}m</p>
//                                               ) : (
//                                                 <p className='uppercase'>{file?.type}</p>
//                                               )}
//                                             </span>
//                                           </li>
//                                         ))}
//                                       </ul>
//                                     )}
//                                   </AccordionContent>
//                                 </AccordionItem>
//                               );
//                             })
//                           )}
//                         </Accordion>
//                       )}
//                     </AccordionContent>
//                   </AccordionItem>
//                 ))}
//               </Accordion>

//               <div className='flex w-full gap-2'>
//                 <Button
//                   onClick={() => navigation.push(`${courseId}/checkout`)}
//                   variant={"socials"}
//                   className='w-full rounded-lg mt-4'
//                 >
//                   Enter course
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
//         )}
//       </div>
//     </ContainerDashboard>
//   );
// };

// export default SingleCourse;
