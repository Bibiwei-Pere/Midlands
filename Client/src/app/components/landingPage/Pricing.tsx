"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/containers";
import { LandingTitle } from "@/components/ui/card";
import check from "../assets/images/landingPage/check.svg";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal3 } from "../animations/Reveal";
import dollar from "../assets/images/landingPage/$.svg";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { BookSession } from "../dashboard/RequestPayout";

export const Pricing = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [programData, setProgramData] = useState({});
  const { data: session } = useSession();
  const navigation = useRouter();
  return (
    <>
      <Container id='paths' className='bg-pricing_bg'>
        <Carousel className='relative w-full'>
          <LandingTitle
            title='Choose your path to Forex Mastery'
            header='Explore our tailored courses to guide you from beginner to expert.'
          />
          <div className='absolute top-[50%] w-full flex items-center'>
            <CarouselPrevious className='absolute left-[-8px]' />
            <CarouselNext className='absolute right-[-8px]' />
          </div>

          <CarouselContent className='flex mx-auto max-w-[1284px] mt-8 lg:mt-14 pb-5'>
            {pricingData.map((item, index: number) => (
              <CarouselItem
                key={index}
                className={`relative pricing_bg flex items-center justify-center gap-4 max-w-[320px] ${
                  item.title === "Masters/Strategy" || item.title === "Smart Trader Pack"
                    ? " h-[555px]"
                    : "h-[511px] lg:top-9"
                } px-8 py-6`}
              >
                <div className='flex flex-col items-center gap-8'>
                  <div className='flex flex-col gap-2 items-center'>
                    <h5 className='text-[14px] font-medium'>{item.title}</h5>
                    <div className='flex text-lg gap-2 items-center'>
                      ₦ <h1>{item.amount}</h1>
                    </div>
                    <span className='line-through text-gray-300 text-[14px]'>₦ {item.oldAmount}</span>
                  </div>
                  <div className='flex flex-col gap-3'>
                    {item.list.map((item) => (
                      <Reveal3 key={item}>
                        <div className='flex gap-3 items-center'>
                          <Image src={check} alt='check' />
                          <p>{item}</p>
                        </div>
                      </Reveal3>
                    ))}
                    <Button
                      onClick={() => {
                        localStorage.setItem("redirectUrl", `/dashboard/course/${item.id}`);
                        navigation.push(`/dashboard/course/${item.id}`);
                      }}
                      className='flex items-center gap-2'
                    >
                      Start Learning
                      <ArrowUpRight className='w-5' />
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </Container>
      <Container className='bg-pricing_bg'>
        <Carousel
          className='relative w-full'
          // plugins={[plugin.current]}
          // onMouseEnter={plugin.current.stop}
          // onMouseLeave={plugin.current.reset}
        >
          <LandingTitle title='Private Mentorship' header='' />
          <div className='absolute top-[50%] w-full flex items-center'>
            <CarouselPrevious className='absolute left-[-8px]' />
            <CarouselNext className='absolute right-[-8px]' />
          </div>

          <CarouselContent className='flex w-full mx-auto max-w-[1284px] mt-8 pb-5'>
            {pricingData2.map((item, index: number) => (
              <CarouselItem
                key={index}
                className={`relative pricing_bg flex-shrink-0 m-0 p-0 flex items-center justify-center gap-4 max-w-[320px] h-[531px]
               px-8 py-6`}
              >
                <div className='object-cover flex flex-col items-center gap-8'>
                  <div className='flex flex-col gap-2 items-center'>
                    <h5 className='text-[14px] font-medium'>{item.title}</h5>
                    <div className='flex text-lg gap-2 items-center'>
                      <Image src={dollar} alt='dollar' />
                      <h1>{item.amount}</h1>
                    </div>
                    <span className='line-through text-gray-300 text-[14px]'>$ {item.oldAmount}</span>
                  </div>
                  <div className='flex flex-col gap-3'>
                    {item.list.map((item) => (
                      <Reveal3 key={item}>
                        <div className='flex items-start gap-3'>
                          <Image src={check} alt='check' />
                          <p>{item}</p>
                        </div>
                      </Reveal3>
                    ))}
                    {session ? (
                      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                        <AlertDialogTrigger onClick={() => setProgramData(item?.data)} asChild>
                          <Button className='flex items-center gap-2'>
                            Start Learning
                            <ArrowUpRight className='w-5' />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <BookSession setIsOpen={setIsOpen} programData={programData} />
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Link href='/dashboard'>
                        <Button className='flex items-center gap-2'>
                          Start Learning
                          <ArrowUpRight className='w-5' />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </Container>
    </>
  );
};

const pricingData = [
  {
    title: "Beginner",
    amount: "24,900",
    list: [
      "Access to Recorded videos for one month",
      "Access to Mentor's contact",
      "Access to Weekly general review of the beginners program",
      "Certificate of completion",
    ],
    oldAmount: "40,000",
    id: "672581394d7fb1baf0983b30",
  },
  {
    title: "Smart Trader Pack",
    amount: "129,900",
    list: [
      "Combination of all 3 courses",
      "Access to Forex Mastery Foundations course",
      "Access to Intermediate trading strategies course",
      "Access to Advanced market techniques course",
      "Certificate of completion upon finishing the bundle",
    ],
    oldAmount: "270,000",
    id: "672a7ecf131c8c4834606d02",
  },
  {
    title: "Masters/Strategy",
    amount: "89,900",
    list: [
      "All in Intermediate plus access to Telegram channel",
      "Access to Weekly analysis",
      "Access to funding upon qualifications",
      "Access to helpful financial reports",
      "Access to intermittent dinner and traders hangouts",
      "Graduation and certification",
    ],
    oldAmount: "150,000",
    id: "6725e17f61ada31c6e6736e9",
  },
  {
    title: "Intermediate",
    amount: "49,900",
    list: [
      "Access to Recorded videos for one month",
      "Access to Mentor's contact",
      "Access to Weekly general review of the intermediate program",
      "Certificate of completion",
      "Access to trading room",
    ],
    oldAmount: "80,000",
    id: "6725c3e33af7a0c2afea100b",
  },
];

const pricingData2 = [
  {
    title: "Instructor's strategies ONLY",
    amount: "100",
    list: ["3 meeting times in a week ONLY (Zoom or on-site)"],
    oldAmount: "150",
    data: {
      amount: 100,
      option: "Instructor's strategies (Zoom - $100)",
      description:
        "Participate in a focused session via Zoom to learn the instructor's unique trading strategies. Gain insights into market analysis and trading techniques that cater to your style for a comprehensive overview at an affordable price.",
    },
  },
  {
    title: "Trading Floor Experience",
    amount: "150",
    list: [
      "General class participation @ the trading floor",
      "Access to Weekly analysis",
      "Access to telegram channel",
      "1 month in class @ Gwarimpa campus",
      "3 times a week",
      "Certificate of participation",
    ],
    oldAmount: "200",
    data: {
      amount: 150,
      option: "Trading Floor Experience ($150)",
      description:
        "Step onto the live trading floor for an immersive, hands-on experience in real-time market action. Perfect for those ready to take their trading journey to the next level with expert guidance and peer collaboration.",
    },
  },
  {
    title: "Private Mentorship",
    amount: "250",
    list: [
      "Access to Weekly analysis",
      "Access to telegram channel",
      "Certificate of participation",
      "2 months Duration on Zoom",
      "2 times a week",
      // "3 months mentorship",
    ],
    oldAmount: "300",
    data: {
      amount: 250,
      option: "Private Mentorship (Zoom - $250)",
      description:
        "Receive one-on-one mentorship via Zoom, tailored specifically to your trading style. Learn advanced strategies and get personalized support from the comfort of your home for two months of deep, impactful learning.",
    },
  },
  {
    title: "Exclusive Trading Floor Experience",
    amount: "400",
    list: [
      "All in Private Mentorship plus",
      "One on one with Dr Jude",
      "3 months extra Mentorship after the regular class sessions. So we'll be together for 6 months in total",
      "3 months Duration in class @ The Trading Floor or Zoom as preferred",
    ],
    oldAmount: "450",
    data: {
      amount: 400,
      option: "Exclusive Trading Floor Mentorship ($400)",
      description:
        "Gain exclusive access to our premium in-person mentorship at the trading floor. This high-level program offers a personalized, intensive two-month experience designed to elevate your trading to expert levels.",
    },
  },
  {
    title: "Life Mentorship",
    amount: "1,000",
    list: [
      "All in Exclusive trading experience plus",
      "6 months in class instead of 3 months",
      "Life mentorship instead of 6 months. Meaning after the regular class sessions we'll be together UNTIL you're profitable and can stand on your own.",
    ],
    oldAmount: "2,000",
    data: {
      amount: 1000,
      option: "Life Mentorship ($1,000)",
      description:
        "This trading program offers an enhanced exclusive experience, featuring a six-month in-class training duration instead of the standard three months. Participants will receive ongoing life mentorship beyond the initial training period, ensuring support until they become profitable and independent traders.",
    },
  },
];
