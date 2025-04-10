"use client";
import { ContainerDashboard } from "@/components/ui/containers";
import { Loader2 } from "lucide-react";
import React, { useRef } from "react";
import Sign from "../../../../../../components/assets/images/dashboard/Sign.png";
import Logo2 from "../../../../../../components/assets/images/landingPage/Logo.svg";
import Image from "next/image";
import { useGetCourse } from "@/hooks/course";
import { SkeletonCard2 } from "@/components/ui/skeleton";
import { useGetUser } from "@/hooks/users";
import { formatDateShort } from "@/hooks/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { usePostCertificate } from "@/hooks/certificate";
import { useSession } from "next-auth/react";

const Certificate = ({ params }: any) => {
  const { courseId } = params;
  const navigation = useRouter();
  const { data: course, status } = useGetCourse(courseId);
  const { data: user, status: userStatus } = useGetUser();
  const { mutation } = usePostCertificate();
  const { data: session } = useSession();

  const certificateRef = useRef(null);

  const downloadCertificateAsPDF = async () => {
    const element = certificateRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
      });
      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // Fixed width for PDF
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imageData, "PNG", 0, 0, imgWidth, imgHeight);

      const pdfBlob = pdf.output("blob");
      const pdfSizeInMB = (pdfBlob.size / (1024 * 1024)).toFixed(2);

      mutation.mutate(
        {
          userId: session?.user?.id,
          courseId: course?._id,
          title: course?.title,
          category: course?.category,
          size: pdfSizeInMB,
        },
        {
          onSuccess: () => {
            pdf.save("certificate.pdf");
          },
          onError: (error) => {
            console.error("Error posting certificate details:", error);
          },
        }
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  console.log(courseId);
  console.log(course);
  console.log(user);

  if (status !== "success" || userStatus !== "success") return <SkeletonCard2 />;

  return (
    <ContainerDashboard className='flex justify-center items-center relative overflow-auto'>
      <div
        ref={certificateRef}
        className='w-[1000px] h-[700px] min-w-[1000px] min-h-[700px] flex items-center justify-center relative overflow-hidden bg-certificate bg-contain bg-o-repeat'
        style={{ maxWidth: "100%", maxHeight: "100%" }} // Ensures responsiveness within container
      >
        <div className='absolute top-[60px] bottom-[95px] left-[95px] right-[95px]'>
          <Image src={Logo2} width={150} height={150} alt='Logo' className='mt-6 ml-5' />
          <h1 className='text-black mt-[210px] xl:mt-[200px] text-[35px] font-serif italic'>
            {user?.firstname} {user?.lastname || user?.username}
          </h1>
          <p className='text-gray-700 text-center mt-5 xl:mt-0 px-10'>
            for completing {course?.durationHours} days on <b>{course?.title}</b>
          </p>
          <p className='text-black xl:mt-[65px] mt-[65px] ml-[190px]'>{formatDateShort(new Date())}</p>
          <p className='text-gray-700 mt-[8px] ml-[220px]'>Date</p>
          <Image src={Sign} width={80} height={80} alt='Signature' className='mt-[-70px] xl:mt-[-70px] ml-[500px]' />
          <p className='text-gray-700 mt-[10px] ml-[530px]'>CEO</p>
        </div>
      </div>
      <div className='grid absolute top-[680px] grid-cols-2 gap-3'>
        <Button variant='buy' className='mt-0 mb-0 w-full p-0' onClick={() => navigation.push("/dashboard/course")}>
          Enroll in another course
        </Button>
        <Button
          variant='success'
          className='w-full mt-0 mb-0'
          onClick={downloadCertificateAsPDF}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : "Download and Print Certificate"}
        </Button>
      </div>
    </ContainerDashboard>
  );
};

export default Certificate;
