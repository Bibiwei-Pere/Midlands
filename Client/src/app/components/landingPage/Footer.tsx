import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Reveal3, Reveal5 } from "../animations/Reveal";
import { Container } from "@/components/ui/containers";
import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok, FaYoutube } from "react-icons/fa6";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowUp } from "lucide-react";
import { ContactUs } from "./Header";
import { Button } from "@/components/ui/button";
import Logo from "../assets/images/landingPage/LogoIcon.svg";

const Footer = () => {
  return (
    <Container className='gap-8 py-10 items-center justify-center' id='contacts'>
      <div className='flex w-full m-0 flex-col gap-7 md:flex-row justify-between items-center md:items-start'>
        <div className='flex gap-1 items-center'>
          <Image className='w-[40px]' src={Logo} alt='Logo' />
          <h6>mywebsite</h6>
        </div>
        <div className='flex flex-col gap-6 items-start md:items-end'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"outline"} className='text- uppercase hover:font-semibold'>
                Contact Us
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <ContactUs />
            </AlertDialogContent>
          </AlertDialog>
          <div className='flex gap-9'>
            {socialData.map((social: any, index: number) => (
              <Reveal5 key={index}>
                <Link href={social.url} target='_blank' rel='noopener noreferrer' className='hover:text-yellow-500'>
                  <social.icon className='w-5 sm:w-6 h-5 sm:h-6' />
                </Link>
              </Reveal5>
            ))}
          </div>
        </div>
      </div>
      <div className='pt-8 w-full items-center flex flex-col-reverse md:flex-row gap-5 justify-between md:items-center border-t border-gray-500 md:border-[#FFFFFF1A]'>
        <Reveal3>
          <p className='text-center'>© 2024 mywebsite</p>
        </Reveal3>
        <div className='flex gap-4 md:gap-9'>
          <p className='hover:text-yellow-500'>
            <Link href='/terms'>Terms of Service</Link>
          </p>
          <p className='hover:text-yellow-500'>
            <Link href='/privacy'>Privacy Policy</Link>
          </p>
          <p className='hidden md:block'>English</p>
          <Link href='/'>
            <ArrowUp className='hidden md:block text-white hover:text-yellow-500' />
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default Footer;

const socialData = [
  {
    icon: FaFacebook,
    url: "https://www.facebook.com/FxCandlecapital?mibextid=ZbWKwL",
  },
  {
    icon: FaTiktok,
    url: "https://www.tiktok.com/@candlecapital22?is_from_webapp=1&sender_device=pc",
  },
  {
    icon: FaInstagram,
    url: "https://www.instagram.com/fxcandlekapital_academy?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  },
  {
    icon: FaYoutube,
    url: "https://youtu.be/0_BTkn1jP-M?si=VP2OSftyGPUGthAE",
  },
  {
    icon: FaLinkedin,
    url: "https://www.linkedin.com/company/candlekapital-global-services-ltd/",
  },
];
// const navContent = [
//   {
//     url: "/",
//     title: "Home",
//   },
//   {
//     url: "#features",
//     title: "Features",
//   },
//   {
//     url: "#paths",
//     title: "Paths",
//   },
//   {
//     url: "#testimonials",
//     title: "Testimonials",
//   },
//   {
//     url: "#faqs",
//     title: "FAQs",
//   },
//   {
//     url: "#contacts",
//     title: "Contact Us",
//   },
// ];
