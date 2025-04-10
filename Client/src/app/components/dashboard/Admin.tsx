"use client";
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartContainer } from "@/components/ui/charts";
import Up from "../assets/images/dashboard/trend-up.svg";
import React from "react";
import Image from "next/image";
import { useGetStatisticsByName } from "@/hooks/statistics";
import { SkeletonCard2 } from "@/components/ui/skeleton";
import { ReviewsStats, UsersStats } from "./Reviews";

const Admin = () => {
  const { data: users, status } = useGetStatisticsByName("users");
  const { data: sales, status: saleStatus } = useGetStatisticsByName("sale");

  console.log(users);
  console.log(sales);

  const platformChartData = users?.usersPerMonth || [];
  const financialChartData = sales?.completedTransactions || [];

  const platform = [
    {
      amount: `₦${users?.totalRevenue}`,
      title: "Total revenue generated",
    },
    {
      amount: users?.totalUsers,
      title: "Total number of users (students, teachers)",
    },
    {
      amount: users?.activeUsersLast30Days,
      title: "Number of active users (in the last 30 days)",
    },
  ];

  const financial = [
    {
      amount: sales?.totalCourseRevenue,
      title: "Life Time Course Sales",
    },
    {
      amount: sales?.totalPendingPayouts,
      title: "Pending affiliate payouts",
    },
    {
      amount: sales?.totalAmountWithApprovedPayouts,
      title: "Total completed transactions (purchases and payouts)",
    },
  ];

  return (
    <div className='flex flex-col gap-10'>
      <div className='flex flex-col gap-3'>
        <h4>Platform Overview</h4>
        {status !== "success" ? (
          <SkeletonCard2 />
        ) : (
          <div className='grid gap-3 md:grid-cols-[1fr,378px]'>
            <UsersChart data={platformChartData} year={users?.currentYear} />
            <div className='flex flex-col gap-3'>
              {platform.map((item, index) => (
                <div key={index} className='p-6 flex items-center gap-4 bg-black rounded-lg h-full'>
                  <Image src={Up} alt='Up' className='w-[48px] h-[48px] border' />
                  <span className='flex flex-col gap-2'>
                    <h2 className='md:text-[30px]'>{item.amount}</h2>
                    <p>{item.title}</p>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className='flex flex-col gap-3'>
        <h4>Financial Overview</h4>
        {saleStatus !== "success" ? (
          <SkeletonCard2 />
        ) : (
          <div className='grid gap-3 md:grid-cols-[378px,1fr]'>
            <div className='flex flex-col gap-3'>
              {financial.map((item, index) => (
                <div key={index} className='p-6 flex items-center gap-4 bg-black rounded-lg h-full'>
                  <Image src={Up} alt='Up' className='w-[48px] h-[48px] border' />
                  <span className='flex flex-col gap-2'>
                    <h2 className='md:text-[30px]'>₦{item.amount}</h2>
                    <p>{item.title}</p>
                  </span>
                </div>
              ))}
            </div>
            <SalesChart data={financialChartData} year={sales.currentYear} />
          </div>
        )}
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5'>
        <ReviewsStats />
        <UsersStats />
      </div>
      <div className='mb-20'>
        <CourseStats />
      </div>
    </div>
  );
};

export default Admin;

const chartConfig = {
  totalUsers: {
    label: "Total Users",
    color: "hsl(173 58% 39%)",
  },
};

const UsersChart = ({ data, year }: any) => {
  return (
    <div className='bg-black hidden pr-10 md:block rounded-lg py-10'>
      <h4 className='mb-10 ml-10'>User Acquisition Trends - {year || "2024"}</h4>
      <ChartContainer className='w-full max-h-[330px]' config={chartConfig}>
        <LineChart data={data}>
          <XAxis dataKey='month' tickLine={false} tickMargin={8} tickFormatter={(value) => value} />
          <YAxis tickLine={false} />

          <Tooltip />
          <Legend />

          <Line
            type='monotone'
            dataKey='totalUsers'
            stroke='hsl(217, 71%, 53%)'
            strokeWidth={2}
            name='Users'
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export const SalesChart = ({ data, year }: any) => {
  return (
    <div className='bg-black hidden pr-10 md:block rounded-lg py-10'>
      <h4 className='mb-10 ml-10'>Sales Trends - {year || "2024"}</h4>
      <ChartContainer className='w-full max-h-[330px]' config={chartConfig}>
        <LineChart data={data}>
          <XAxis dataKey='month' tickLine={false} tickMargin={8} tickFormatter={(value) => value} />
          <YAxis tickLine={false} tickMargin={8} tickFormatter={(value) => `₦${value / 1000}k`} />

          <Tooltip />
          <Legend />

          <Line
            type='monotone'
            dataKey='totalAmount'
            stroke='hsl(217, 71%, 53%)'
            strokeWidth={2}
            name='Sales'
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export const CourseStats = () => {
  const { data: courses, status } = useGetStatisticsByName("course");

  console.log(courses);

  if (status !== "success") return <SkeletonCard2 />;
  else
    return (
      <div className='flex flex-col gap-6'>
        <h4>Course Performance Overview</h4>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {courses?.map((course: any) => (
            <div
              key={course.category}
              className='bg-black border border-gray-800 p-4 relative flex flex-col gap-6 max-w-full rounded-lg overflow-hidden'
            >
              <div className='bg-yellow-500 text-black p-2 w-[50px] rounded-lg'>
                {course.price === 0 ? "Free" : "Paid"}
              </div>
              <h4>{course?.category}</h4>
              <div className='grid grid-cols-3'>
                <div className='flex flex-col gap-2'>
                  <h4>
                    ₦ {course?.totalPrice > 999 ? <>{(course?.totalPrice / 1000).toFixed(0)}k</> : course?.totalPrice}
                  </h4>
                  <p>Price</p>
                </div>
                <div className='flex flex-col gap-2'>
                  <h4>{course?.totalChapters || 0}</h4>
                  <p>Chapters</p>
                </div>
                <div className='flex flex-col gap-2'>
                  <h4>{course?.totalOrders || 0}</h4>
                  <p>orders</p>
                </div>
              </div>
              <div className='grid grid-cols-3'>
                <div className='flex flex-col gap-2'>
                  <h4>{course?.totalCertificates || 0}</h4>
                  <p>Certificates</p>
                </div>
                <div className='flex flex-col gap-2'>
                  <h4>{course?.totalRatings || 0}</h4>
                  <p>Reviews</p>
                </div>
                <div className='flex flex-col gap-2'>
                  <h4>{course?.totalUsers || 0}</h4>
                  <p>users</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
};
