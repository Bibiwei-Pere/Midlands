"use client";
import { Cell, Pie, PieChart } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/charts";
import { ContainerDashboard } from "@/components/ui/containers";
import Error from "../../components/assets/images/dashboard/Error.svg";
import Success from "../../components/assets/images/dashboard/Success.svg";
import Calendar from "../../components/assets/images/dashboard/Calendar.svg";
import Image from "next/image";
import { useGetStatisticsByName } from "@/hooks/statistics";
import { SkeletonCard2 } from "@/components/ui/skeleton";
import { SalesChart } from "@/app/components/dashboard/Admin";
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Square } from "lucide-react";
import AdminAffiliate from "@/app/components/dashboard/AdminAffiliate";

const Reports = () => {
  const { data: sales, status: saleStatus } = useGetStatisticsByName("sale");
  const { data: topEarners, status } = useGetStatisticsByName("earners");
  const { data: sale } = useGetStatisticsByName("sale");

  console.log(status);
  console.log(saleStatus);

  const platformChartData = sales?.completedTransactions || [];
  const chartData = [
    { label: "Paid Out", value: sale?.totalApprovedPayouts, fill: "#4C9AFF" },
    { label: "Pending", value: sale?.totalPendingPayouts, fill: "#4CAF50" },
  ];

  if (status !== "success" || saleStatus !== "success") return <SkeletonCard2 />;
  else
    return (
      <>
        <ContainerDashboard>
          <div className='grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-4'>
            <div className='border border-gray-800 rounded-lg bg-black p-5 hidden md:block sm:col-span-3'>
              <h6>Revenue</h6>
              <SalesChart data={platformChartData} year={sales?.currentYear} />
            </div>
            <div className='flex flex-col gap-4 border border-gray-800 rounded-lg bg-black p-5 sm:col-span-3 xl:col-span-2'>
              <h6>Top Earners</h6>
              <div className='flex mt-3 gap-4'>
                {topEarners?.topCourses?.map((item: any, index: number) => (
                  <p key={index} className='text-white'>
                    Course {index + 1}: ₦{item?.totalAmount}
                  </p>
                ))}
              </div>

              <TopEarnersChart data={topEarners?.topCourses} year={sales?.currentYear} />
            </div>
            <div className='flex flex-col gap-4 items-center justify-center border border-gray-800 rounded-lg bg-black p-5'>
              <Image src={Success} alt='Success' />
              <h6 className='text-center'>Total Payouts</h6>
              <h6 className='text-green-500'>₦{sale?.totalApprovedPayouts}</h6>
            </div>
            <div className='flex flex-col gap-4 items-center justify-center border border-gray-800 rounded-lg bg-black p-5'>
              <Image src={Calendar} alt='Calendar' />
              <h6 className='text-center'>Pending Payouts</h6>
              <h6 className='text-yellow-500'>₦{sale?.totalPendingPayouts}</h6>
            </div>
            <div className='flex flex-col gap-4 items-center justify-center border border-gray-800 rounded-lg bg-black p-5'>
              <Image src={Error} alt='Error' />
              <h6 className='text-center'>Failed Payouts</h6>
              <h6 className='text-red-500'>₦{sale?.totalRejectedPayouts}</h6>
            </div>
            <div className=' flex flex-col items-center gap-4 border border-gray-800 rounded-lg bg-black p-5 sm:col-span-3 xl:col-span-2'>
              <h6>Affiliate Commission</h6>
              <div className='flex gap-4'>
                <div className='flex gap-3'>
                  <Square fill='#4C9AFF' className='text-[#4C9AFF]' />
                  Paid Out
                </div>
                <div className='flex gap-3'>
                  <Square fill='#4CAF50' className='text-[#4caf50]' />
                  Pending
                </div>
              </div>
              <PieChart width={250} height={250}>
                <Pie data={chartData} dataKey='value' nameKey='label' outerRadius={80} fill='#8884d8'>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₦${value}`} />
              </PieChart>
            </div>
          </div>
        </ContainerDashboard>
        <AdminAffiliate hide={"true"} />
      </>
    );
};

const chartConfig = {
  value: {
    label: "Value",
  },
  paidOut: {
    label: "Paid Out",
    color: "#4C9AFF", // Ensure this color matches your theme or design
  },
  earned: {
    label: "Earned",
    color: "#4CAF50", // Ensure this color matches your theme or design
  },
} satisfies ChartConfig;

export default Reports;

const chartConfig2 = {
  totalUsers: {
    label: "Total Users",
    color: "hsl(173 58% 39%)",
  },
};

const transformData = (courses: any) => {
  let transformed: {
    name: string; // Label for course sold
    value: any; // Total amount earned from sales
    type: any;
  }[] = [];

  courses.forEach((course: any) => {
    transformed.push(
      {
        name: "Course Sold", // Label for course sold
        value: course.totalAmount, // Total amount earned from sales
        type: course.course.title, // Course title for reference
      },
      {
        name: "Total Users", // Label for total users
        value: course.totalUsersCount, // Total number of users
        type: course.course.title, // Course title for reference
      }
    );
  });

  return transformed;
};

const TopEarnersChart = ({ data, year }: any) => {
  // Transform the data for "Course Sold" and "Total Users"
  const processedData = transformData(data);

  return (
    <div className='bg-black hidden pr-10 md:block rounded-lg py-10'>
      <ChartContainer config={chartConfig2} className='w-full h-[300px]'>
        <LineChart data={processedData}>
          {/* XAxis now displays 'Course Sold' and 'Total Users' */}
          <XAxis
            dataKey='name' // Using 'name' to display 'Course Sold' and 'Total Users'
            tickLine={false}
            tickMargin={8}
          />

          {/* YAxis shows sales in ₦ or user count */}
          <YAxis tickLine={false} tickMargin={8} tickFormatter={(value) => `₦${value / 1000}k`} />

          <Tooltip
            formatter={(value, name, props) => [
              name === "Course Sold" ? `₦${value}` : value,
              name === "Course Sold" ? "Total Sales" : "Total Users",
            ]}
            labelFormatter={(label) => `Category: ${label}`}
          />
          <Legend />

          {/* Line for total sales (Course Sold) */}
          <Line
            type='monotone'
            dataKey='value'
            stroke='hsl(217, 71%, 53%)'
            strokeWidth={2}
            name='Total Sales (Course Sold)'
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};
