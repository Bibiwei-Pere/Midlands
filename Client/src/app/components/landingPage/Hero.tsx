"use client";
import React from "react";
import HeroImage from "@/app/components/assets/images/landingPage/hero_image.svg"
import Image from "next/image"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Partner1 from "src/app/components/assets/images/landingPage/partner1.svg"
import Partner2 from "src/app/components/assets/images/landingPage/partner2.svg"
import Partner3 from "src/app/components/assets/images/landingPage/partner3.svg"
import Partner4 from "src/app/components/assets/images/landingPage/partner4.svg"
import Partner5 from "src/app/components/assets/images/landingPage/partner5.svg"
import HeroUnderline from "src/app/components/assets/images/landingPage/hero_underline.svg"
import HeroImage2 from "src/app/components/assets/images/landingPage/hero_image2.svg"
import HeroImage3 from "src/app/components/assets/images/landingPage/hero_image3.svg"

export const Hero = () => {
  return (
      <div className="bg-white">
      <section
          id='home'
          className=' grid mt-8 grid-cols-1 md:grid-cols-2 gap-10 items-center justify-between py-16 lg:px-8 xl:px-24 px-4  mx-auto'
      >
        <div className='flex flex-col text-black gap-5'>
          <div className="">
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <div className="flex flex-wrap items-end gap-2">
                <div className="relative inline-block">
                  <span>Educate</span>
                  <Image
                      src={HeroUnderline}
                      alt="underline"
                      className="absolute left-0 -bottom-2  w-full h-[14px] lg:h-[20px] object-contain"
                  />
                </div>
                <span>Learning,</span>
              </div>
              <div>Transform Futures</div>
            </div>

          </div>
          <p className='text-gray-600 text-lg max-w-md mt-2'>
            A safe, engaging, and supportive digital academy for
            young people in supported living
          </p>
          <div className='flex flex-wrap gap-4 mt-4'>
            <Link href='/auth/signup' target='_blank' rel='noopener noreferrer' className='flex items-center gap-2'>
              <button className='px-8 py-3 bg-chsprimary flex gap-2 text-white font-medium rounded hover:opacity-75 transition-colors'>
                Get started
                <ArrowUpRight className='w-5' />
              </button>
            </Link>
            <button className='px-8 py-3 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300 transition-colors'>
              Browse courses
            </button>
          </div>
        </div>

        <div className='relative'>
          <Image src={HeroImage} alt="hero image" />
        </div>
      </section>

        <section className="max-w-screen-2xl text-black  mx-auto px-4 lg:px-8 xl:px-24 py-16">
          {/* Partners Section */}
          <div className="mb-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Join Our Leading Partners</h2>

            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              <Image src={Partner1} alt="partner image" className="h-[75px] lg:h-[100px]"/>
              <Image src={Partner2} alt="partner image" className="h-[75px] lg:h-[100px]" />
              <Image src={Partner3} alt="partner image" className="h-[75px] lg:h-[100px]" />
              <Image src={Partner4} alt="partner image"  className="h-[75px] lg:h-[100px]"/>
              <Image src={Partner5} alt="partner image" className="h-[75px] lg:h-[100px]"/>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center border-t pt-12">
            {/* Left side - Image */}
            <div className="rounded-lg overflow-hidden">
              {/* Replace this with your actual image */}
              <div className='relative'>
                <Image src={HeroImage2} alt="hero image" />
              </div>
            </div>

            {/* Right side - Text content */}
            <div className="flex flex-col gap-5">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Welcome to the CHS Learning Platform
              </h2>

              <p className="text-gray-600">
                The CHS Learning Platform is a fully remote learning academy created by Community Hosting and Support Ltd. It's designed especially for young people aged 13-25 living in semi-independent or supported accommodation. Here, learners gain practical skills, build confidence, and learn how to navigate life safely and independently — all through short, fun, and engaging online lessons.
              </p>

              <div className="mt-4">
                <Link href='/testimonials' target='_blank' rel='noopener noreferrer' className='flex items-center gap-2'>
                  <p className="inline-flex items-center text-orange-600 font-medium">
                    See how it helped others
                    <span className="ml-2">
                    →
          </span>
                  </p>
                </Link>

              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-[#FFF7F4] to-white py-20">
          <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Feature 1: Independent Living Skills */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-red-300 flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                      <div className="text-white">
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Independent Living Skills</h3>
                <p className="text-gray-600">
                  Learn how to manage your home, budget, stay safe, and prepare for emergencies.
                </p>
              </div>

              {/* Feature 2: Skill Acquisition */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-yellow-300 flex items-center justify-center">
                    <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                      <div className="text-white">
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Skill Acquisition</h3>
                <p className="text-gray-600">
                  Build communication, job readiness, digital literacy, and time management skills.
                </p>
              </div>

              {/* Feature 3: Safeguarding */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-blue-300 flex items-center justify-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="text-white">
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Safeguarding</h3>
                <p className="text-gray-600">
                  Understand online safety, emotional resilience, abuse awareness, and healthy relationships.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-screen-xl mx-auto px-4 lg:px-8 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-16">Why Choose CHS Learning?</h2>

          <div className="flex flex-col relative md:flex-row items-center justify-between gap-8">
              <Image src={HeroImage3} alt="hero image" />

            {/* Right side - Features list */}
            <div className="lg:absolute lg:left-1/2 bg-white shadow-lg rounded-lg p-8">
              <ul className="space-y-6">
                <li className="flex items-start">
                  <span className="text-gray-800 mr-3">•</span>
                  <div>
                    <span className="font-bold text-gray-900">FULLY ONLINE</span>
                    <span className="text-gray-600"> – Learn anytime, anywhere</span>
                  </div>
                </li>

                <li className="flex items-start">
                  <span className="text-gray-800 mr-3">•</span>
                  <div>
                    <span className="font-bold text-gray-900">MOBILE-FIRST</span>
                    <span className="text-gray-600"> – designed for your phone or tablet</span>
                  </div>
                </li>

                <li className="flex items-start">
                  <span className="text-gray-800 mr-3">•</span>
                  <div>
                    <span className="font-bold text-gray-900">GAMIFIED</span>
                    <span className="text-gray-600"> – earn badges, xp, and certificates</span>
                  </div>
                </li>

                <li className="flex items-start">
                  <span className="text-gray-800 mr-3">•</span>
                  <div>
                    <span className="font-bold text-gray-900">CERTIFICATE-BASED</span>
                    <span className="text-gray-600"> – receive proof of your learning</span>
                  </div>
                </li>

                <li className="flex items-start">
                  <span className="text-gray-800 mr-3">•</span>
                  <div>
                    <span className="font-bold text-gray-900">SAFE & SECURE</span>
                    <span className="text-gray-600"> – built with safeguarding in every step</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="max-w-screen-xl mx-auto px-4 lg:px-8 py-20">
          <h2 className="text-3xl md:text-4xl text-black font-bold text-center mb-16">What Our Learners Say</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-[#1b3a4b] text-white rounded-lg p-6 flex flex-col justify-between">
              {/* User type with icon */}
              <div className="flex items-center mb-4">
        <span className="mr-2">
          {/* Grid icon placeholder - replace with your icon */}
          <div className="w-5 h-5 bg-gray-400 opacity-70 rounded"></div>
        </span>
                <span className="text-gray-300">Learner</span>
              </div>

              {/* Testimonial text */}
              <p className="mb-8">
                I've learned how to manage my money and keep my social media safe. The courses are short and fun!
              </p>

              {/* User info with avatar */}
              <div className="flex items-center mt-auto">
                {/* Avatar placeholder - replace with your image */}
                <div className="w-12 h-12 rounded-full bg-gray-400 mr-3"></div>
                <div>
                  <p className="font-medium">Hellen Chloe</p>
                  <p className="text-sm text-gray-300">17 years</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-[#1b3a4b] text-white rounded-lg p-6 flex flex-col justify-between">
              {/* User type with icon */}
              <div className="flex items-center mb-4">
        <span className="mr-2">
          {/* Support icon placeholder - replace with your icon */}
          <div className="w-5 h-5 bg-gray-400 opacity-70 rounded"></div>
        </span>
                <span className="text-gray-300">Support worker</span>
              </div>

              {/* Testimonial text */}
              <p className="mb-8">
                It's been great seeing young people take initiative after completing the courses. It's empowering.
              </p>

              {/* User info with avatar */}
              <div className="flex items-center mt-auto">
                {/* Avatar placeholder - replace with your image */}
                <div className="w-12 h-12 rounded-full bg-gray-400 mr-3"></div>
                <div>
                  <p className="font-medium">Darren John</p>
                  <p className="text-sm text-gray-300">Support Worker</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-[#1b3a4b] text-white rounded-lg p-6 flex flex-col justify-between">
              {/* User type with icon */}
              <div className="flex items-center mb-4">
        <span className="mr-2">
          {/* Grid icon placeholder - replace with your icon */}
          <div className="w-5 h-5 bg-gray-400 opacity-70 rounded"></div>
        </span>
                <span className="text-gray-300">Learner</span>
              </div>

              {/* Testimonial text */}
              <p className="mb-8">
                The safeguarding tools built into the platform make me feel protected while I learn. It's so cool!
              </p>

              {/* User info with avatar */}
              <div className="flex items-center mt-auto">
                <div className="w-12 h-12 rounded-full bg-gray-400 mr-3"></div>
                <div>
                  <p className="font-medium">Jamil Oshodi</p>
                  <p className="text-sm text-gray-300">20 years</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
};
