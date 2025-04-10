"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { SkeletonCard2 } from "@/components/ui/skeleton";
import { ContainerDashboard } from "@/components/ui/containers";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useGetUserById } from "@/hooks/users";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CourseCard } from "@/app/components/dashboard/CourseCard";
import Certificates from "@/app/components/dashboard/Certificates";
import RecentActivity from "@/app/components/dashboard/RecentActivity";

const Dashboard = ({ params }: any) => {
  const { userId } = params;
  const [isActive, setIsActive] = useState(false);
  const { data: user, status } = useGetUserById(userId);

  useEffect(() => {
    if (user?.activeCourseList?.length > 2) setIsActive(true);
  }, [user]);

  const navigation = useRouter();
  if (status !== "success") return <SkeletonCard2 />;
  else
    return (
      <ContainerDashboard>
        <div className='flex flex-col sm:flex-row justify-between'>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <Image
                onClick={() => navigation.push("/dashboard/profile")}
                src={user?.avatar?.url || "/noavatar.png"}
                alt='Avatar'
                width={500}
                height={500}
                className='object-cover rounded-full w-14 sm:w-20 h-14 sm:h-20 cursor-pointer'
              />
              <h4>Hello, {user?.username}</h4>
            </div>
            <p>Let’s learn something new today!</p>
            <h2>Dashboard</h2>
          </div>
          {user?.role === "Admin" ? (
            <div className='flex items-start md:items-center flex-col md:flex-row gap-3 justify-end '>
              <Button
                onClick={() => navigation.push("/dashboard/admin/users")}
                className='mr-0 md:ml-0 md:w-full'
                variant={"outline"}
              >
                Manage users
              </Button>
              <Button onClick={() => navigation.push("/dashboard/admin/courses")} className='mr-0' variant={"buy"}>
                Manage courses
              </Button>
            </div>
          ) : (
            <div className='flex flex-col gap-3 mt-8 sm:mt-0 items-end'>
              <p className='font-medium'>Lifetime Affiliate Earnings: ₦ {user?.affiliate?.lifetimeEarnings || 0}</p>
              <h4>
                Available Payout: <b className='font-normal'>₦ {user?.affiliate?.balance || 0}</b>{" "}
              </h4>
            </div>
          )}
        </div>
        {isActive && (
          <Link href='https://chat.whatsapp.com/JmuEeyXaNSTBWCQCEovQIF' target='_blank' rel='noopener noreferrer'>
            <Button className='mr-0' variant={"outline"}>
              Click to join Trading Group
            </Button>
          </Link>
        )}
        <div className='flex flex-col gap-6'>
          {user.role === "User" && (
            <div className='flex flex-col gap-6 mt-10'>
              <h4>Enrolled course(s)</h4>
              <Carousel>
                <CarouselContent className='flex relative gap-5 overflow-scroll'>
                  {user.activeCourseList.length ? (
                    user.activeCourseList.map((item: any) => (
                      <CarouselItem
                        key={item.index}
                        className='relative cursor-pointer max-w-[403px] px-0 pb-5 rounded-lg overflow-hidden'
                      >
                        <CourseCard course={{ ...item, userId }} hide={false} />
                      </CarouselItem>
                    ))
                  ) : (
                    <CourseCard
                      hide={true}
                      course={{
                        category: "",
                        duration: 0,
                      }}
                    />
                  )}
                </CarouselContent>
              </Carousel>
            </div>
          )}

          <div className='flex flex-col gap-6 mt-10'>
            <h4>Recent Activity</h4>
            <div className='grid gap-4 grid-flow-row lg:grid-cols-2'>
              <RecentActivity data={user?.transactions} />
              <Certificates />
            </div>
          </div>
        </div>
      </ContainerDashboard>
    );
};

export default Dashboard;
