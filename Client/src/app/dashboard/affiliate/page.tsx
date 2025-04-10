"use client";
import { Button } from "@/components/ui/button";
import { ContainerDashboard, DashboardHeader } from "@/components/ui/containers";
import React from "react";
import { Copy, MousePointerClick, Users } from "lucide-react";
import { useGetUser, useGetUserAffiliateChart } from "@/hooks/users";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { RequestPayout } from "@/app/components/dashboard/RequestPayout";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/charts";
import { Area, AreaChart, XAxis, Bar, BarChart } from "recharts";
import { FaInbox } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { SkeletonCard2 } from "@/components/ui/skeleton";
import AdminAffiliate from "@/app/components/dashboard/AdminAffiliate";
import { useGetUserPayouts } from "@/hooks/payout";
import { formatDateShort } from "@/hooks/auth";

const Affiliate = () => {
  const user = useGetUser();
  const { data: payouts, status: payoutStatus } = useGetUserPayouts();
  const { data: session, status } = useSession();
  const { data: chartData, status: chartLoading } = useGetUserAffiliateChart(); // Hook to fetch chart data
  console.log(payouts);
  console.log(user?.data);

  const formattedUsername = user?.data?.username?.toLowerCase().replace(/\s+/g, "-") || "no-username";

  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopyClick = () => {
    console.log("first");
    navigator.clipboard
      .writeText(`https://mywebsite.com/partners/${formattedUsername}`)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Failed to copy: ", error);
      });
  };

  const affiliateStats = [
    {
      title: "Current balance",
      amount: user?.data?.affiliate?.balance,
    },
    {
      title: "Lifetime earnings",
      amount: user?.data?.affiliate?.lifetimeEarnings,
    },
    {
      title: "Total withdrawn",
      amount: user?.data?.affiliate?.withdrawalCount,
    },
  ];

  const withdrawalStats = [
    {
      title: "Withdrawal Status",
      id: "status",
      amount: payoutStatus === "success" ? payouts[0]?.status : "--",
    },
    {
      title: "Commission Rate Overview",
      amount: `${user?.data?.affiliate?.commissionRate}%`,
    },
    {
      title: "Next Payment Date",
      amount: formatDateShort(user?.data?.affiliate?.dueDate),
    },
  ];

  const performanceStats = [
    {
      icon: MousePointerClick,
      title: "Clicks",
      amount: user?.data?.affiliate?.count,
    },
    {
      icon: FaInbox,
      title: "Conversions",
      amount: user?.data?.affiliate?.conversion,
    },
    {
      icon: Users,
      title: "Conversion rate",
      amount: (user?.data?.affiliate?.conversion / 100) * user?.data?.affiliate?.count,
    },
  ];

  const monthlyData = chartData?.monthlyData || [];
  const weeklyData = chartData?.weeklyData || []; // Assume weeklyData is provided by backend

  if (status === "loading" || chartLoading !== "success") return <SkeletonCard2 />;
  else
    return (
      <>
        {session?.user?.role === "Admin" ? (
          <AdminAffiliate hide={"false"} />
        ) : (
          <>
            <DashboardHeader>
              <h2>Affiliate Program</h2>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className='mr-0' variant={"outline"}>
                    Request Withdrawal
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <RequestPayout />
                </AlertDialogContent>
              </AlertDialog>
            </DashboardHeader>
            <ContainerDashboard className='bg-black'>
              <div className='flex flex-col gap-10'>
                <div className='flex flex-col gap-4'>
                  <h4>Referral Link</h4>
                  <div className='flex gap-3 items-center'>
                    <div className='w-full overflow-hidden relative py-2 px-3 flex gap-5 justify-between items-center rounded-lg bg-[#2A3142]'>
                      <h3>https://mywebsite.com/partners/{formattedUsername}</h3>
                      <Button
                        variant='ghost'
                        className='absolute right-0 bg-yellow-600 sm:bg-inherit w-7 sm:w-auto sm:relative mr-0'
                        onClick={handleCopyClick}
                      >
                        {isCopied ? (
                          "Copied"
                        ) : (
                          <div className='flex gap-2'>
                            <p className='hidden md:block'> Copy Link</p>
                            <Copy className='h-5 w-5' />
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col gap-4'>
                  <h4>Earnings</h4>
                  <span className='grid md:grid-cols-3 gap-3'>
                    {affiliateStats.map((item: any) => (
                      <div className='flex flex-col gap-4 border border-gray-800 rounded-lg p-5'>
                        <p>{item.title}</p>
                        <h4 className='text-[24px]'>₦{item?.amount || 0}</h4>
                      </div>
                    ))}
                  </span>
                </div>

                <div className='flex flex-col gap-2'>
                  <span className='grid md:grid-cols-3 gap-3'>
                    {withdrawalStats.map((item: any) => (
                      <div
                        key={item.title}
                        className='flex flex-col gap-4 border h-[100px] justify-center border-gray-800 rounded-lg p-5'
                      >
                        <p>{item.title}</p>
                        {item.id === "status" ? (
                          <>
                            {item.amount === "Approved" ? (
                              <h4 className='text-[24px] text-green-500'>
                                {item.amount} {/* Use item.amount instead of item.title */}
                              </h4>
                            ) : item.amount === "Rejected" ? (
                              <h4 className='text-[24px] text-red-600'>
                                {item.amount} {/* Use item.amount instead of item.title */}
                              </h4>
                            ) : (
                              <h4 className='text-[24px] text-yellow-500'>{item.amount}</h4>
                            )}
                          </>
                        ) : (
                          <div className='flex flex-col gap-4'>
                            <h4 className='text-[24px]'>{item?.amount || 0}</h4>
                          </div>
                        )}
                      </div>
                    ))}
                  </span>
                </div>

                <div className='flex flex-col gap-2'>
                  <span className='hidden md:grid md:grid-cols-2 gap-3'>
                    <AffiliateChart data={monthlyData} />
                    <AffiliateBarChart data={weeklyData} />
                  </span>
                </div>

                <div className='flex flex-col gap-4'>
                  <h4>Performance</h4>
                  <span className='grid md:grid-cols-3 gap-3'>
                    {performanceStats.map((item: any) => (
                      <div className='flex flex-col gap-2 border border-gray-800 rounded-lg p-5'>
                        <item.icon />
                        <h6>{item.title}</h6>
                        <p>{item?.amount || "--"}</p>
                      </div>
                    ))}
                  </span>
                </div>
              </div>
            </ContainerDashboard>
          </>
        )}
      </>
    );
};

export default Affiliate;

const chartConfig = {
  users: {
    label: "Users",
    color: "hsl(200, 50%, 50%)", // Customize color as needed
  },
} satisfies ChartConfig;

const AffiliateChart = ({ data }: any) => {
  return (
    <div className='bg-transparent md:block rounded-lg border border-gray-800 px-4 lg:px-6'>
      <h4 className='text-black'>Monthly User Referrals</h4>
      <ChartContainer config={chartConfig}>
        <AreaChart data={data}>
          <XAxis dataKey='month' tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Area
            dataKey='users'
            type='monotone'
            fill='url(#fillUsers)'
            fillOpacity={0.4}
            stroke='var(--color-users)'
            stackId='a'
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

const AffiliateBarChart = ({ data }: any) => {
  return (
    <div className='bg-transparent md:block rounded-lg border border-gray-800 p-4'>
      <h4 className='text-black'>Weekly User Referrals</h4>
      <ChartContainer config={chartConfig}>
        <BarChart data={data}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <XAxis
            dataKey='date'
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { weekday: "short" })}
          />
          <Bar dataKey='users' fill='var(--color-users)' radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};
