"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { SkeletonCard2 } from "@/components/ui/skeleton";
import { ContainerDashboard } from "@/components/ui/containers";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { CourseCard2, CourseCardCatalogue } from "../../components/dashboard/CourseCard";
import Link from "next/link";
import { useGetUser } from "@/hooks/users";
import { useGetUserCourses, useGetAllCourse } from "@/hooks/course";
import empty from "../../components/assets/images/dashboard/empty.svg";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ReviewsStats, UsersStats } from "@/app/components/dashboard/Reviews";

const CoursePage = () => {
  const { data: session } = useSession();
  const courses = useGetUserCourses();
  const allCourses = useGetAllCourse();
  const user = useGetUser();

  if (allCourses?.status !== "success") return <SkeletonCard2 />;
  else
    return (
      <ContainerDashboard>
        <div className='flex justify-between'>
          <h2>Courses</h2>

          {session?.user?.role !== "User" && (
            <Link href={`course/new/${"add"}`}>
              <Button className='mr-0' variant={"buy"}>
                Add New Course
              </Button>
            </Link>
          )}
        </div>
        <div className='flex flex-col gap-6'>
          {session?.user?.role === "User" && (
            <div className='flex flex-col gap-6 mt-10'>
              <h4>Enrolled course(s)</h4>
              <Carousel>
                <CarouselContent className='flex gap-4 relative pb-8'>
                  {user?.data?.activeCourseList.length ? (
                    user?.data?.activeCourseList.map((course: any) => (
                      <CarouselItem
                        key={course.courseId}
                        className='relative max-w-[383px] p-0 rounded-lg overflow-hidden'
                      >
                        <CourseCard2 data={course} />
                      </CarouselItem>
                    ))
                  ) : (
                    <div className='flex flex-col items-center justify-center w-full h-[200px] gap-4'>
                      <Image src={empty} alt='empty' width={100} height={100} className='w-[100px] h-auto' />
                      <p className='text-[#666666] text-center'>No data yet</p>
                    </div>
                  )}
                </CarouselContent>
              </Carousel>
            </div>
          )}
          {session?.user?.role !== "User" && (
            <div className='flex flex-col gap-6 mt-10'>
              <h4>Created course(s)</h4>
              <Carousel>
                <CarouselContent className='flex relative gap-5 pb-5'>
                  {courses?.data?.length ? (
                    courses?.data?.map((course: any) => (
                      <CarouselItem key={course._id} className='relative max-w-[383px] p-0 rounded-lg overflow-hidden'>
                        <CourseCard2 data={course} />
                      </CarouselItem>
                    ))
                  ) : (
                    <div className='flex flex-col items-center justify-center w-full h-[200px] gap-4'>
                      <Image src={empty} alt='empty' width={100} height={100} className='w-[100px] h-auto' />
                      <p className='text-[#666666] text-center'>No data yet</p>
                    </div>
                  )}
                </CarouselContent>
              </Carousel>
            </div>
          )}

          {session?.user?.role !== "User" && (
            <div className='hidden md:flex gap-4'>
              <div className='flex flex-col gap-6 mt-10'>
                <h4>Course Stats Overview</h4>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                  <ReviewsStats />
                  <UsersStats />
                </div>
              </div>
            </div>
          )}

          <div className='flex flex-col gap-6 mt-10'>
            <h4>Course Catalogue</h4>
            <Carousel>
              <CarouselContent className='flex relative gap-5 pb-5'>
                {allCourses?.data.length ? (
                  allCourses?.data.map((course: any) => (
                    <CarouselItem key={course._id} className='relative max-w-[383px] p-0 rounded-lg overflow-hidden'>
                      <CourseCardCatalogue course={course} />
                    </CarouselItem>
                  ))
                ) : (
                  <div className='flex flex-col items-center justify-center w-full h-[200px] gap-4'>
                    <Image src={empty} alt='empty' width={100} height={100} className='w-[100px] h-auto' />
                    <p className='text-[#666666] text-center'>No data yet</p>
                  </div>
                )}
                <CarouselItem className='relative max-w-[363px] ml-5 p-0 rounded-lg overflow-hidden'></CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </ContainerDashboard>
    );
};

export default CoursePage;
