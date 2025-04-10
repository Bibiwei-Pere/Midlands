"use client";
import React from "react";
import { Reveal3 } from "../animations/Reveal";
import { LandingTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/containers";
import Ceo1 from "../assets/images/landingPage/Ceo1.jpg";
import Ceo2 from "../assets/images/landingPage/Ceo2.jpg";
import ReactPlayer from "react-player";
import Image from "next/image";

export const MeetAuthor = () => {
  return (
    <Container id='instructor' className='testimonial features_bg flex'>
      <LandingTitle title='Meet the Instructor' header='Navigating Forex with Dr Jude Iwere' />

      <div className='grid grid-cols-1 md:grid-cols-2 max-w-screen-lg mx-auto w-full'>
        <div>
          <h1 className='bg-gradient-to-r from-[#f4e6bd] from-10% via-[#fcd259] via-30% to-[#a18e55] to-90% text-transparent text-left bg-clip-text'>
            Dr Jude Iwere
          </h1>

          <h4 className='mt-5 bg-gradient-to-r text-left from-[#FFFFFF] from-10% via-[#FFFFFF] via-30% to-[#FFFFFF99] leading-7 to-90% text-transparent bg-clip-text'>
            Dr. Iwere Jude is a highly respected financial expert and educator, known for his in-depth knowledge and
            successful track record in the field of forex trading. He is the founder and CEO of Candlekapital Academy, a
            leading institution committed to educating traders in the art of profitable forex trading. Dr. Jude's
            financial career is backed by his Chartered membership in the Institute of Economics of Nigeria and his
            prestigious status as a Fellow of the Chartered Institute of Bankers of Nigeria, both of which demonstrate
            his high-level expertise and dedication to the financial industry.
          </h4>
        </div>
        <div className='h-[300px] mt-5 md:mt-24 md:ml-4  rounded-lg overflow-hidden'>
          <ReactPlayer
            style={{ position: "relative" }}
            url='https://youtu.be/KpxqNGuv_B8?si=-BGXaBWjRQLii1kn'
            width='100%'
            height='100%'
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1,
                  rel: 0,
                  showinfo: 0,
                },
              },
            }}
          />
        </div>
        <div className='md:col-span-2'>
          {bibliography.map((text: string) => (
            <Reveal3>
              <h4 className='mt-5 bg-gradient-to-r text-left from-[#FFFFFF] from-10% via-[#FFFFFF] via-30% to-[#FFFFFF99] to-90% text-transparent leading-7 bg-clip-text'>
                {text}
              </h4>
            </Reveal3>
          ))}
        </div>
        <div className='w-full mt-5 flex justify-center overflow-hidden h-[400px]'>
          <Reveal3>
            <Image
              src={Ceo1}
              alt='Image'
              width={600}
              height={600}
              className='h-[400px] md:h-full object-contain w-full'
            />
          </Reveal3>
        </div>
        <div className='w-full h-[400px] md:bg-white md:mt-5 flex justify-center overflow-hidden'>
          <Reveal3>
            <Image src={Ceo2} alt='Image' width={600} height={600} className='object-cover h-full  w-full' />
          </Reveal3>
        </div>
      </div>
    </Container>
  );
};

const bibliography = [
  // "Dr. Iwere Jude is a highly respected financial expert and educator, known for his in-depth knowledge and successful track record in the field of forex trading. He is the founder and CEO of Candlekapital Academy, a leading institution committed to educating traders in the art of profitable forex trading. Dr. Jude's financial career is backed by his Chartered membership in the Institute of Economics of Nigeria and his prestigious status as a Fellow of the Chartered Institute of Bankers of Nigeria, both of which demonstrate his high-level expertise and dedication to the financial industry.",
  "Dr. Jude holds a Master’s Degree in Divinity, reflecting his passion for both education and faith, and has also been awarded an honorary Doctor of Divinity. His role as Senior Pastor of Life Place Christian Center in Abuja complements his academic and professional pursuits, where he mentors individuals not just in financial literacy but also in their spiritual growth.",
  "With over seven years of hands-on experience as a forex trader and instructor, Dr. Jude has honed his craft to become a leading figure in the forex industry. His teaching approach at Candlekapital Academy is deeply practical, aimed at equipping students with the essential tools to navigate the financial markets successfully. Dr. Jude’s unique blend of financial acumen, practical trading experience, and mentorship has helped countless individuals become proficient traders, making him an invaluable asset to the forex trading community.",
];
