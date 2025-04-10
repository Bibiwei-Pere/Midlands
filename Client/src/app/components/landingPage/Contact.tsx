"use client";
import React from "react";
import { Reveal1, Reveal3 } from "../animations/Reveal";
import Image from "next/image";
import ContactImage from "../assets/images/contact.png";
import Arrow from "../assets/images/Arrow.svg";
import Ornament from "../assets/images/Ornament.svg";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Headphones, PhoneCall } from "lucide-react";

export const Contact = () => {
  return (
    <section className="relative py-24 lg:px-8 xl:px-24 px-4 hidden lg:block max-w-screen-2xl mx-auto">
      <div className="bg-[#6C0871] rounded-xl p-10 flex gap-8">
        <div className=" relative flex flex-col gap-8 justify-start items-start max-w-[60%]">
          <Reveal1>
            <h2 className="text-white">
              Contact us today and let us know what you need
            </h2>
          </Reveal1>
          <Reveal3>
            <p className="text-white max-w-[80%]">
              We invite you to explore the transformative potential of
              PurpleDove ERP. Discover how our all-in-one platform can
              streamline your business operations, improve efficiency, and drive
              growth.
            </p>
          </Reveal3>
          <Link
            href="https://calendly.com/lassod/purpledove-webinar-session"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant={"secondary"} className="mt-6">
              Contact Us
            </Button>
          </Link>
          <div className="absolute right-[-30%] top-0 ">
            <Image className="mt-14 h-14" src={Arrow} alt="Arrow" />
          </div>
        </div>
      </div>
      <Image
        className="absolute max-w-[440px] xl:max-w-[640px] bottom-0 right-0"
        src={ContactImage}
        alt="ContactImage"
      />
    </section>
  );
};

export const ContactPromo = () => {
  // const phoneNumber = "+2347064699173";
  // const phoneNumber2 = "+447983451470";
  const emailAddress = "info@purpledove.net";
  return (
    <section className="relative pt-0 xl:pt-24 pb-24 px-4 max-w-screen-2xl mx-auto overflow-hidden">
      <div className="flex flex-col items-center gap-16">
        <Reveal1>
          <h2 className="max-w-[694px] text-center">
            Contact us today and let us know what you need
          </h2>
        </Reveal1>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          <div className="border bg-white rounded-xl py-7 px-5 flex flex-col gap-6 w-full md:max-w-[354px] items-center">
            <PhoneCall className="text-[#A700AF]" />
            <div className="flex flex-col items-center gap-3">
              <h5>Contact Us</h5>
              <p className="text-center">
                Contact us to seek help from us, we will help you as soon as
                possible
              </p>
              {/*<div className="text-center">
                <div className="relative inline-block text-md cursor-pointer group">
                  <span className="underline-offset-4">
                    <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
                  </span>
                  <div className="absolute w-full bg-white py-[2px] text-center top-10 left-0 opacity-0 invisible transform shadow-md transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:visible group-hover:top-[-40px] ">
                    <p className="m-0 font-semibold">
                      <a href={`tel:${phoneNumber}`}> Call </a>
                    </p>
                    <div className="absolute bottom-[-8px] left-[80%] transform -translate-x-1/2 border-t-[8px] border-l-[7px] border-r-[7px] border-b-0 border-solid border-t-white border-l-transparent border-r-transparent"></div>
                  </div>
                </div>{" "}
                /{" "} 
                <div className="relative inline-block text-md cursor-pointer group">
                  <span className="underline-offset-4">
                    <a href={`tel:${phoneNumber2}`}>{phoneNumber2}</a>
                  </span>
                  <div className="absolute w-full bg-white py-[2px] text-center top-10 left-0 opacity-0 invisible transform shadow-md transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:visible group-hover:top-[-40px]">
                    <p className="m-0 font-semibold">
                      <a href={`tel:${phoneNumber2}`}> Call </a>
                    </p>
                    <div className="absolute bottom-[-8px] left-[80%] transform -translate-x-1/2 border-t-[8px] border-l-[7px] border-r-[7px] border-b-0 border-solid border-t-white border-l-transparent border-r-transparent"></div>
                  </div>
                </div>
              </div>*/}
              <Link href="/promo/contact">
                <Button className="mt-6">Call us now</Button>
              </Link>
            </div>
          </div>
          <div className="border bg-white rounded-xl py-7 px-5 flex flex-col gap-6 w-full md:max-w-[354px] items-center">
            <Headphones className="text-[#A700AF]" />
            <div className="flex flex-col items-center gap-3">
              <h5>Customer Service</h5>
              <p className="text-center">
                Contact us to seek help from us, we will help you as soon as
                possible
              </p>
              <div className="text-center">
                <div className="relative inline-block text-[18px] cursor-pointer group">
                  <span className=" decoration-gray-500 underline-offset-4">
                    <a href={`mailto:${emailAddress}`}>{emailAddress}</a>
                  </span>
                  <div className="absolute w-full bg-white p-1 text-center top-10 left-0 opacity-0 invisible transform shadow-md transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:visible group-hover:top-0">
                    <p className="m-0  font-semibold">
                      {" "}
                      <a href={`mailto:${emailAddress}`}>{emailAddress}</a>
                    </p>
                    <div className="absolute bottom-[-8px] left-[80%] transform -translate-x-1/2 border-t-[8px] border-l-[7px] border-r-[7px] border-b-0 border-solid border-t-white border-l-transparent border-r-transparent"></div>
                  </div>
                </div>
              </div>
              <Link href="/promo/contact">
                <Button className="mt-6">Contact us</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Image
        className="absolute hidden xl:block bottom-0 right-0"
        src={Ornament}
        alt="Ornament"
      />
      <Image
        className="absolute hidden xl:block top-0 left-0 rotate-180"
        src={Ornament}
        alt="Ornament"
      />
    </section>
  );
};
