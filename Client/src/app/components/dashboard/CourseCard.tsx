"use client";
import React, { useEffect, useState } from "react";
import Beginner from "../assets/images/dashboard/Beginner coin.png";
import Intermediate from "../assets/images/dashboard/Dollar Coin.png";
import Advanced from "../assets/images/dashboard/Gold Dollar Coins stack.png";
import Check from "../assets/images/dashboard/Check.svg";
import User from "../assets/images/dashboard/User.svg";
import Task from "../assets/images/dashboard/Task.svg";
import Quiz from "../assets/images/dashboard/Quiz.svg";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SquarePen, Star } from "lucide-react";
import ReactPlayer from "react-player/lazy";
import { useSession } from "next-auth/react";
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { ChartContainer } from "@/components/ui/charts";
import { useGetUser, useGetUserById } from "@/hooks/users";
import { useGetCourse } from "@/hooks/course";
import { SkeletonCard2, SkeletonDemo } from "@/components/ui/skeleton";
import { useGetTeacherStatistics } from "@/hooks/statistics";
import { formatDateShort } from "@/hooks/auth";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export const CourseCard = ({ course, hide }: any) => {
  const { data: courseData } = useGetCourse(course?.courseId);
  const navigation = useRouter();
  // Count the number of completed chapters
  console.log(course?.userId);
  const completedCount = course?.chapters?.filter((chapter: any) => chapter.completed).length || 0;
  const totalChapters = course?.chapters?.length || 0;

  const lastCompletedChapterId = (() => {
    if (!course?.chapters) return "chapter";
    for (let i = course.chapters.length - 1; i >= 0; i--) {
      if (course.chapters[i].completed) {
        return course.chapters[i].chapterId; // Assuming 'id' is the property holding the chapter's ID
      }
    }
    return "chapter"; // No completed chapters
  })();

  const progressValue = totalChapters > 0 ? (completedCount / totalChapters) * 100 : 0;
  return (
    <div
      onClick={() => {
        if (course?.userId)
          navigation.push(`/dashboard/course/${course.courseId}/learning/${lastCompletedChapterId}/${course?.userId}`);
        else navigation.push(`/dashboard/course/${course.courseId}/learning/${lastCompletedChapterId}`);
      }}
      className='bg-black flex flex-col gap-5 py-8 px-3 sm:px-5  w-[403px] rounded-lg'
    >
      <div className='flex justify-between items-center'>
        <Image
          src={courseData?.featuredImg?.url || Beginner}
          alt='Image'
          width={100}
          height={100}
          className='w-14 sm:w-24 h-auto'
        />

        {!hide && (
          <div className='flex gap-3'>
            <div>
              <p className='text-[#565656]'>Course availability:</p>
              <p className='text-[#565656] text-right'>{course?.duration} days left</p>
            </div>
            <Image src={Check} alt='Check' width={100} height={100} className='w-[30px] sm:w-[40px] h-auto' />
          </div>
        )}
      </div>
      {!hide ? (
        <h4 className='hover:text-yellow-500'>{courseData?.category}</h4>
      ) : (
        <h4 className='text-[#565656]'>No courses yet...</h4>
      )}
      {!hide && <p className='hover:text-yellow-500'>{courseData?.title && shortenText(courseData?.title, 90)}</p>}

      {!hide && (
        <div className='flex items-center gap-3'>
          {/* Pass the calculated progress value */}
          <Progress value={progressValue} className='w-[130px] sm:w-[174px]' />
          <div className='flex items-center'>
            <h4 className='font-normal hover:text-yellow-500 text-[#565656]'>{completedCount}/</h4>
            <h4 className='font-normal hover:text-yellow-500 text-[#4D4D4D]'>{totalChapters} Lessons</h4>
          </div>
        </div>
      )}
    </div>
  );
};

export const CourseCardTeacher = ({ data }: any) => {
  const navigation = useRouter();
  return (
    <div className='bg-black flex flex-col gap-5 py-8 px-5 w-full sm:w-[363px] rounded-lg'>
      <div className='flex justify-between items-center'>
        {data.category === "Beginner" ? (
          <Image src={Beginner} alt='Beginner' width={100} height={100} className='w-24 h-auto' />
        ) : data.category === "Intermediate" ? (
          <Image src={Intermediate} alt='Intermediate' width={100} height={100} className='w-24 h-auto' />
        ) : (
          <Image src={Advanced} alt='Advanced' width={100} height={100} className='w-24 h-auto' />
        )}

        <div
          className='flex gap-3 cursor-pointer hover:text-yellow-500'
          onClick={() => navigation.push("/dashboard/course")}
        >
          <p className='text-[#565656] hover:text-yellow-500'>Manage Course:</p>
          <SquarePen className='w-[25px] h-auto' />
        </div>
      </div>
      <h4 className='text-[#565656]'>{data?.category}</h4>
      <p className='text-white'>Total Enrolled Students: {data?.totalUsers}</p>
    </div>
  );
};

export const CourseCard2 = ({ data }: any) => {
  const [completed, setCompleted] = useState(false);
  const [chapters, setChapters] = useState<any>([]);
  const [progressCount, setProgressCount] = useState(0);
  const { data: user } = useGetUser();
  const session = useSession();
  const { data: course, status } = useGetCourse(session?.data?.user?.role !== "User" ? data?._id : data?.courseId);

  useEffect(() => {
    const thisCourse = user?.activeCourseList.find((course: any) => course.courseId === data?.courseId);
    const completedCount = thisCourse?.chapters?.filter((chapter: any) => chapter.completed).length || 0;
    const totalChapters = course?.chapters?.length || 0;

    // Update progress value: 0% if only the first chapter is completed
    const progressValue = completedCount === 1 ? 0 : totalChapters > 0 ? (completedCount / totalChapters) * 100 : 0;

    setProgressCount(progressValue);
    setChapters(thisCourse?.chapters);
    if (completedCount === totalChapters) setCompleted(true);
  }, [user, course]);

  const lastCompletedChapterId = (() => {
    if (!chapters) return "chapter";
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (chapters[i].completed) {
        return chapters[i].chapterId; // Assuming 'id' is the property holding the chapter's ID
      }
    }
    return "chapter"; // No completed chapters
  })();
  const { data: instructor } = useGetUserById(course?.user);

  if (status !== "success") return <SkeletonDemo />;
  else
    return (
      <div className='flex border border-[#0607155f] cursor-pointer overflow-hidden hover:border-white flex-col gap-4 w-full bg-[#0607155f] rounded-lg'>
        <div className='relative bg-black w-full h-[192px] rounded-lg'>
          <ReactPlayer width={383} height={202} controls url={course?.featuredVideo?.url} />
        </div>
        <div
          onClick={() =>
            (window.location.href = `${
              session?.data?.user?.id === course.user
                ? `/dashboard/course/new/${course._id}`
                : `/dashboard/course/${course._id}/learning/${lastCompletedChapterId}`
            }`)
          }
          className='flex relative flex-col gap-4 p-4'
        >
          {session?.data?.user?.role === "User" && (
            <>
              <div className='flex items-center justify-between'>
                {completed ? (
                  <Button className='border-none px-3 ml-0 bg-[#34A853] rounded-lg'>Completed</Button>
                ) : (
                  <Button className='border-none px-3 ml-0 bg-[#5B4504] rounded-lg'>In Progress</Button>
                )}
              </div>
              <div className='flex absolute top-0 right-[16px] items-center gap-3 mt-4'>
                <div style={{ width: 60, height: 60 }}>
                  <CircularProgressbar
                    value={progressCount}
                    text={`${Math.round(progressCount)}%`}
                    styles={buildStyles({
                      textColor: "#eab308",
                      textSize: "25px",
                      pathColor: "#eab308",
                      trailColor: "#5B4504",
                    })}
                  />
                </div>
              </div>
            </>
          )}
          <h4 className='text-yellow-500'>₦ {course.price.toLocaleString("en-NG")}</h4>
          <h5 className='leading-6'>{shortenText(course.title, 75)}</h5>
          <p className='leading-6'>{shortenText(course.miniDescription, 100)}</p>
          <div className='flex gap-3 items-center'>
            <Image
              src={instructor?.avatar?.url || "/noavatar.png"}
              alt='Avatar'
              height={280}
              width={280}
              className='w-8 h-8 object-cover rounded-full'
            />
            <div>
              <p className='text-white'>{course.instructor.name}</p>
              <p className='mt-[3px]'>{course.instructor.title || "IOS developer"}</p>
            </div>
          </div>
        </div>
      </div>
    );
};

export const CourseCardCatalogue = ({ course, classname, setIsSearch }: any) => {
  const navigation = useRouter();
  const { data: instructor } = useGetUserById(course.user);
  return (
    <div className={`flex flex-col gap-4 w-full bg-black rounded-lg ${classname}`}>
      <div className='relative overflow-hidden bg-black w-full h-[192px] rounded-lg'>
        {course?.category === "3in1" ? (
          <Image src={course?.featuredImg.url} alt='Image' width={600} height={600} className='object-cover' />
        ) : (
          <ReactPlayer width={383} height={202} controls url={course?.featuredVideo?.url} />
        )}
      </div>
      <div className='flex relative flex-col gap-4 p-4'>
        <div className='flex items-center justify-between'>
          <Button className='border-none px-3 ml-0 bg-[#5B4504] rounded-lg'>
            {course.category === "3in1" ? "Smart Trader Pack" : course?.category}
          </Button>
        </div>
        <h5 className='leading-6'>{shortenText(course.title, 70)}</h5>
        <div className='flex justify-between'>
          {/* <h4 className='text-yellow-500'>₦ {course.price}</h4> */}
          <h4 className='text-yellow-500'>₦ {course.price.toLocaleString("en-NG")}</h4>

          <div className='flex items-center gap-3'>
            <p>{course?.ratings?.average || 0}/5</p>
            {Array.from({ length: course?.ratings?.average || 0 }).map((_, index) => (
              <Star fill='#34A853' className='text-[#34A853] h-4 w-4' key={index} />
            ))}
          </div>
        </div>
        <p className='leading-6'>{shortenText(course?.miniDescription, 100)}</p>
        <div className='flex gap-3 items-center'>
          <Image
            src={instructor?.avatar?.url || "/noavatar.png"}
            alt='Avatar'
            height={140}
            width={140}
            className='w-8 h-8 object-cover rounded-full'
          />
          <div>
            <p className='text-white'>{course?.instructor?.name || "Jane Doe"}</p>
            <p className='mt-[3px]'>{course?.instructor?.title || "IOS developer"}</p>
          </div>
        </div>
        <Button
          onClick={() => {
            navigation.push(`/dashboard/course/${course._id}`);
            classname && setIsSearch(false);
          }}
          className='w-full max-w-full'
          variant={"buy"}
        >
          View details
        </Button>
      </div>
    </div>
  );
};

export const CourseCardSinglePage = ({ course }: any) => {
  const { data: instructor } = useGetUserById(course.user);
  return (
    <div className={`flex gap-4 border-2 hover:border-yellow-500 w-full bg-[#0607155f] rounded-lg max-w-[850px]`}>
      <div className='relative hidden sm:block overflow-hidden bg-black w-full h-full rounded-lg'>
        {course?.category === "3in1" ? (
          <Image src={course?.featuredImg.url} alt='Image' width={600} height={600} className='object-cover' />
        ) : (
          <ReactPlayer width={383} height={202} controls url={course?.featuredVideo?.url} />
        )}
      </div>
      <div className='flex w-full relative flex-col gap-4 p-4'>
        {/* <div className='flex items-center justify-between'>
          <Button className='border-none px-3 ml-0 bg-[#5B4504] rounded-lg'>{course.category || "Beginner"}</Button>
        </div> */}
        <h5 className='leading-6'>{shortenText(course.title, 70)}</h5>
        <div className='flex justify-between'>
          {/* <h4 className='text-yellow-500'>₦ {course.price}</h4> */}
          <div className='flex items-center gap-3'>
            <p>{course?.ratings?.average || 0}/5</p>
            {Array.from({ length: course?.ratings?.average || 0 }).map((_, index) => (
              <Star fill='#34A853' className='text-[#34A853] h-4 w-4' key={index} />
            ))}
          </div>
        </div>
        {/* <p className='leading-6'>{shortenText(course.description, 100)}</p> */}
        <div className='flex gap-3 items-center'>
          <Image
            src={instructor?.avatar?.url || "/noavatar.png"}
            alt='Avatar'
            height={140}
            width={140}
            className='w-8 h-8 object-cover rounded-full'
          />
          <div>
            <p className='text-white'>{course?.instructor?.name || "Jane Doe"}</p>
            <p className='mt-[3px]'>{course?.instructor?.title || "IOS developer"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CourseCardCatalogueLanding = ({ course, classname, setIsSearch }: any) => {
  const navigation = useRouter();
  return (
    <div className={`flex flex-col gap-4 w-full bg-[#0607155f] rounded-lg ${classname}`}>
      <div className='relative bg-black w-full h-[192px] rounded-lg'>
        <ReactPlayer width={383} height={202} controls url={course?.featuredVideo?.url} />
      </div>
      <div className='flex relative flex-col gap-4 p-4'>
        <div className='flex items-center justify-between'>
          <Button className='border-none px-3 ml-0 bg-[#5B4504] rounded-lg'>{course.category || "Beginner"}</Button>
        </div>
        <h5 className='leading-6'>{shortenText(course.title, 70)}</h5>
        <div className='flex justify-between'>
          <h4 className='text-yellow-500'>₦ {course.price.toLocaleString("en-NG")}</h4>
          {/* <div className='flex items-center gap-3'>
            <p>{course?.ratings?.average || 0}/5</p>
            {Array.from({ length: course?.ratings?.average || 0 }).map((_, index) => (
              <Star fill='#34A853' className='text-[#34A853] h-4 w-4' key={index} />
            ))}
          </div> */}
        </div>
        <p className='leading-6'>{shortenText(course.description, 100)}</p>
        <Button
          onClick={() => {
            navigation.push(`/dashboard/course/${course._id}`);
            classname && setIsSearch(false);
          }}
          className='w-full max-w-full'
          variant={"buy"}
        >
          View details
        </Button>
      </div>
    </div>
  );
};

export const CourseCardStats = () => {
  const { data: teachers, status } = useGetTeacherStatistics();
  console.log(teachers);

  if (status !== "success") return <SkeletonCard2 />;
  else
    return (
      <div className='flex flex-col gap-5'>
        <h4>Course Management</h4>
        <div className='flex flex-col md:flex-row gap-4'>
          {teachers.map((teacher: any) => (
            <CourseCardTeacher data={teacher} />
          ))}
        </div>
        <h4 className='mt-10'>Student Progress</h4>
        <div className='flex gap-4 flex-col md:flex-row overflow-scroll pb-5'>
          {teachers?.map((teacher: any) => (
            <div
              key={teacher.category}
              className='bg-black border border-gray-800 flex flex-col gap-5 w-full p-6 rounded-lg'
            >
              <div className='flex gap-10 h-full sm:w-[400px] items-center justify-center'>
                <div>
                  <h6>{teacher.category}</h6>
                  <p className='mt-3 mb-8'>1st Jan - {formatDateShort(new Date())}</p>

                  <div className='flex flex-col gap-4'>
                    <div className='flex gap-3'>
                      <Image src={User} alt='User' className='w-[44px] h-[44px]' />
                      <span className='flex flex-col gap-2'>
                        <h5 className='text-[#979797]'>Active</h5>
                        <h4>{teacher?.activePercentage}%</h4>
                      </span>
                    </div>
                    <div className='flex gap-3'>
                      <Image src={Task} alt='Task' className='w-[44px] h-[44px]' />
                      <span className='flex flex-col gap-2'>
                        <h5 className='text-[#979797]'>Task & Exam</h5>
                        <h4>{teacher?.quizPercentage}%</h4> {/* Updated to reflect task percentage */}
                      </span>
                    </div>
                    <div className='flex gap-3'>
                      <Image src={Quiz} alt='Quiz' className='w-[44px] h-[44px]' />
                      <span className='flex flex-col gap-2'>
                        <h5 className='text-[#979797]'>Quiz</h5>
                        <h4>{teacher?.quizPercentage}%</h4> {/* Updated to reflect quiz percentage */}
                      </span>
                    </div>
                  </div>
                </div>
                <PieChart grade={teacher.grade} /> {/* Passing grade to PieChart */}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
};

export function PieChart({ grade }: { grade?: number }) {
  // Default to 0 if no grade is provided
  const chartData = [
    {
      name: "Grade", // Represents the grade percentage
      value: grade || 70, // Fallback to 0 if no grade
      fill: "#22c55e", // Customize the color
    },
  ];

  // Correctly typing the config according to the expected ChartConfig structure
  const chartConfig = {
    label: {
      label: "Grade", // The text for the label
    },
    color: {
      color: "#000", // Customize as needed, matches the color structure
    },
  };

  return (
    <div className='w-[179px]'>
      {/* Pass the required config prop */}
      <ChartContainer config={chartConfig} className='mx-auto aspect-square max-h-[250px]'>
        <RadialBarChart
          data={chartData}
          startAngle={90} // Start from the top
          endAngle={-270} // 360-degree full circle
          innerRadius={80}
          outerRadius={110}
        >
          <PolarGrid
            gridType='circle'
            radialLines={false}
            stroke='none'
            className='first:fill-gray-700 last:fill-[#000]'
            polarRadius={[86, 74]}
          />
          <RadialBar
            dataKey='value'
            background
            cornerRadius={10}
            fillOpacity={grade === 0 ? 0 : 1} // Hide the fill when grade is 0
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                      <tspan x={viewBox.cx} y={viewBox.cy} className='fill-green-500 text-4xl font-bold'>
                        {grade || 0}%
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className='fill-white'>
                        Grades completed
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
}

export const shortenText = (text: string, maxLength: number) => {
  if (text.length > maxLength) return `${text.substring(0, maxLength)}...`;
  return text;
};
