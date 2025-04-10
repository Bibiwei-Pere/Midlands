import React from "react";
import pdf from "../assets/images/dashboard/PDF.svg";
import Image from "next/image";
import empty from "../assets/images/dashboard/empty.svg";
import { useGetUserCertificates } from "@/hooks/certificate";
import { formatDate } from "@/hooks/auth";
import { useRouter } from "next/navigation";

const Certificates = () => {
  const { data: certificates } = useGetUserCertificates();
  const navigation = useRouter();

  return (
    <div className='bg-black rounded-lg relative px-6 max-w-full h-[405px] border border-gray-800 overflow-scroll'>
      <h6 className='sticky top-0 bg-black py-4 w-full'>Certificates</h6>
      {certificates?.length ? (
        certificates?.map((item: any) => (
          <div className='flex justify-between p-2 hover:bg-gray-800 rounded-md overflow-auto py-[5px] gap-6 items-'>
            <Image src={pdf} alt='pdf' width={100} height={100} className='w-[40px] h-auto' />
            <div className='flex gap-2 flex-col'>
              <div className='flex justify-between md:w-[300px]'>
                <p className=''>
                  {item.category}-{formatDate(item.createdAt)}
                </p>
                <p className=' ml-5'>{item.size}MB</p>
              </div>
              <p className=''>PDF</p>
            </div>
            <p
              className='ml-7 cursor-pointer text-end hover:text-white'
              onClick={() => navigation.push(`/dashboard/course/${item.courseId}/learning/chapter/certificate`)}
            >
              Download
            </p>
          </div>
        ))
      ) : (
        <div className='flex flex-col items-center justify-center w-full h-[200px] gap-4'>
          <Image src={empty} alt='empty' width={100} height={100} className='w-[100px] h-auto' />
          <p className='text-center'>No Certificates yet</p>
        </div>
      )}
      <h6 className='text-black sticky bottom-[-2px] bg-black py-4 w-full h-10'></h6>
    </div>
  );
};

export default Certificates;
