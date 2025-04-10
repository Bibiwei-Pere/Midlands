import React from "react";
import empty from "../assets/images/dashboard/empty.svg";
import Image from "next/image";
import { formatDateShort } from "@/hooks/auth";
import { BellRing, CreditCard, User2 } from "lucide-react";
import { shortenText } from "./CourseCard";

const RecentActivity = ({ data }: { data: any }) => {
  console.log(data);
  return (
    <div className='bg-black px-6 border border-gray-800 rounded-lg max-w-full h-[405px] overflow-auto'>
      <h6 className='sticky top-0 bg-black py-4 w-full h-10'></h6>

      {data.length > 0 ? (
        data.map((item: any) => (
          <div className='grid grid-cols-[30px,1fr,250px,150px,115px] rounded-md overflow-scroll hover:bg-gray-800 p-3 gap-3 items-center'>
            {item?.transactionType === "Paystack" ? (
              <BellRing className='w-[30px] border rounded-full p-[5px] text-[#ffffffb2] h-auto' />
            ) : item.title === "Withdrawals" ? (
              <CreditCard className='w-[30px] border rounded-full p-[5px] text-[#ffffffb2] h-auto' />
            ) : (
              <User2 className='w-[30px] border rounded-full p-[5px] text-[#ffffffb2] h-auto' />
            )}
            {item.transactionType === "Paystack" && item.product !== "Withdrawal" && item.completed === true ? (
              <p>Succesful Course purchase </p>
            ) : item.transactionType === "Paystack" && item.product !== "Withdrawal" && item.completed === false ? (
              <p>Failed Course purchase </p>
            ) : item.title === "Les" ? (
              <p>Completed Lesson</p>
            ) : item.title === "Withdrawals" ? (
              <p>Withdrew Affiliate Earnings</p>
            ) : (
              <p>{item.transactionType}</p>
            )}
            <p className='ml-7'>{shortenText(item?.product, 50)}</p>
            <p className='ml-6 text-left'>{formatDateShort(item.createdAt)}</p>
            <p
              className={`ml-7 ${
                item?.status === "Successful"
                  ? "text-green-500"
                  : item?.status === "Pending"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {item?.status === "Successful" ? "Successful" : item?.status === "Pending" ? "Pending" : "Failed"}
            </p>
          </div>
        ))
      ) : (
        <div className='flex flex-col items-center justify-center w-full h-[200px] gap-4'>
          <Image src={empty} alt='empty' width={100} height={100} className='w-[100px] h-auto' />
          <p className=' text-center'>No transactions yet</p>
        </div>
      )}
      <h6 className='sticky bottom-[-2px] bg-black py-4 w-full h-10'></h6>
    </div>
  );
};

export default RecentActivity;
