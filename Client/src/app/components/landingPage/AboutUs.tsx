"use client";
import React from "react";
import Image from "next/image";
import { Phone, MapPin, MessageSquare } from "lucide-react"
import AboutPageImage from "@/app/components/assets/images/landingPage/about_page_image.svg"

export default function AboutUs() {
    return (
        <div className="bg-white mt-14 text-black">
            <section className="max-w-screen-xl mx-auto px-4 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 mb-16">
                    <div>
                        <div className="mb-2">
                            <span className="text-chsprimary font-medium">About us</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold">About the Academy</h2>
                    </div>
                    <div className="">
                        <p className="text-gray-600 mt-3">
                            To communicate the heart, purpose, and principles behind the CHS Learning
                            Platform — ensuring that learners, support workers, and guardians
                            understand the platform's mission, values, and safeguarding-first approach.
                        </p>
                    </div>
                </div>

                {/* Mission and Vision section */}
                <div className="text-center mb-16">
                    <div className="inline-block px-4 py-1 border bg-[#F9EDE9] border-[#C74720] rounded-full text-chsprimary text-sm font-medium mb-6">
                        Mission & Vision
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                        Empowering Young Lives Through Learning
                    </h3>

                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Helping young people build confidence, life skills, and independence through
                        safe, engaging digital learning.
                    </p>
                </div>

                {/* Image section */}
                <div className="rounded-lg overflow-hidden">
                    <Image src={AboutPageImage} alt="About Us" />
                </div>
            </section>


            <section className="max-w-screen-xl flex flex-col gap-4 mx-auto px-4 lg:px-8 py-12">
                {/* Vision Section */}
                <div className="">
                    <h3 className="text-2xl font-bold mb-6">Our Vision</h3>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <p className="text-gray-600">
                            To inspire, educate, and empower young people in supported living to live independently,
                            confidently, and safely in a modern world
                        </p>
                    </div>
                </div>

                {/* Mission Section */}
                <div className="">
                    <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <p className="text-gray-600">
                            We are committed to creating a safe and engaging online learning space where young people
                            can develop practical life skills, strengthen their personal well-being, and gain confidence to
                            thrive independently. Through innovative digital learning, we aim to transform futures—one
                            learner at a time.
                        </p>
                    </div>
                </div>

                {/* Who It's For Section */}
                <div className="">
                    <h3 className="text-2xl font-bold mb-6">Who It's For</h3>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <p className="text-gray-800 font-medium mb-4">This platform is specially designed for:</p>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-start">
                                <span className="text-gray-800 mr-3">•</span>
                                <span className="text-gray-600">Young people aged 13 to 25.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-gray-800 mr-3">•</span>
                                <span className="text-gray-600">Those living in semi-independent, shared accommodation, or supported housing.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-gray-800 mr-3">•</span>
                                <span className="text-gray-600">Learners seeking confidence in managing daily life, developing employable skills, and staying safe in both physical and digital spaces.</span>
                            </li>
                        </ul>
                        <p className="">
                            The CHS Learning Platform is inclusive, accessible, and built with the diverse challenges of
                            supported living environments in mind
                        </p>
                    </div>
                </div>

                {/* Course Design Philosophy Section */}
                <div className="">
                    <h3 className="text-2xl font-bold mb-6">Our Course Design Philosophy</h3>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <p className="text-black text-lg font-medium mb-4">We believe in learning that is:</p>
                        <ul className="space-y-4 mb-6">
                            <li className="flex items-start">
                                <span className="text-gray-800 mr-3">•</span>
                                <div>
                                    <span className="text-gray-800 font-medium">Short & Digestible:</span>
                                    <span className="text-gray-600"> Lessons are 5-15 minutes long to keep attention high and reduce overwhelm.</span>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-gray-800 mr-3">•</span>
                                <div>
                                    <span className="text-gray-800 font-medium">Relatable:</span>
                                    <span className="text-gray-600"> Content uses modern, real-world scenarios and youth-friendly language.</span>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-gray-800 mr-3">•</span>
                                <div>
                                    <span className="text-gray-800 font-medium">Gamified:</span>
                                    <span className="text-gray-600"> Learners earn XP, badges, and certificates as they progress, making learning motivating and measurable.</span>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-gray-800 mr-3">•</span>
                                <div>
                                    <span className="text-gray-800 font-medium">Mobile-Optimized:</span>
                                    <span className="text-gray-600"> Courses are easy to access from smartphones, ensuring anytime, anywhere learning.</span>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-gray-800 mr-3">•</span>
                                <div>
                                    <span className="text-gray-800 font-medium">Interactive:</span>
                                    <span className="text-gray-600"> Includes quizzes, role-plays, simulations, and action-based activities to build real-life application.</span>
                                </div>
                            </li>
                        </ul>
                        <p className="text-black">
                            All content is informed by the everyday realities young people face and is designed to build
                            capacity, not just deliver content.
                        </p>
                    </div>
                </div>

                {/* Safeguarding & Compliance Section */}
                <div>
                    <h3 className="text-2xl font-bold mb-3">Safeguarding & Compliance</h3>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <p className="text-black text-lg font-medium mb-4">The CHS Learning Platform is developed with:</p>
                        <ul className="space-y-4 mb-4">
                            <li className="flex items-start">
                                <span className="text-gray-800 mr-3">•</span>
                                <div>
                                    <span className="text-gray-800 font-medium">Integrated Safeguarding Tools:</span>
                                    <span className="text-gray-600"> "Feel Unsafe" and "Report Content" buttons accessible on every screen, Anonymous safeguarding reporting form.</span>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-gray-800 mr-3">•</span>
                                <div>
                                    <span className="text-gray-800 font-medium">GDPR Compliance:</span>
                                    <span className="text-gray-600"> Data collection is minimal, transparent, and fully secure.</span>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-gray-800 mr-3">•</span>
                                <div>
                                    <span className="text-gray-800 font-medium">Trained Support Staff:</span>
                                    <span className="text-gray-600"> All staff and platform administrators undergo annual safeguarding training.</span>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-gray-800 mr-3">•</span>
                                <div>
                                    <span className="text-gray-800 font-medium">Clear Reporting Channels:</span>
                                    <span className="text-gray-600"> Direct contact options for learners needing help or experiencing distress.</span>
                                </div>
                            </li>
                        </ul>
                        <p className="text-black">
                            Our policies and response workflows are designed to ensure that every learner is protected,
                            supported, and heard.
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Email Contact Card */}
                        <div className="bg-gray-100 p-8 rounded-lg">
                            <div className="flex flex-col items-start">
                                <div className="bg-chsprimary p-3 rounded-lg mb-6">
                                    <MessageSquare className="text-white" size={24} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Email us at</h3>
                                <p className="text-gray-600 mb-4">We would like to hear from you</p>
                                <a
                                    href="mailto:info@chsupport.org.uk"
                                    className="text-chsprimary font-medium hover:underline"
                                >
                                    info@chsupport.org.uk
                                </a>
                            </div>
                        </div>

                        {/* Meet Team Card */}
                        <div className="bg-gray-100 p-8 rounded-lg">
                            <div className="flex flex-col items-start">
                                <div className="bg-chsprimary p-3 rounded-lg mb-6">
                                    <MapPin className="text-white" size={24} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Meet our team</h3>
                                <p className="text-gray-600 mb-4">Come meet our head office</p>
                                <div className="text-chsprimary font-medium">
                                    <p className="text-chsprimary ">142-143 Parrock Street</p>
                                    <p className="text-chsprimary ">Gravesend DA12 1EY</p>
                                </div>
                            </div>
                        </div>

                        {/* Call Us Card */}
                        <div className="bg-gray-100 p-8 rounded-lg">
                            <div className="flex flex-col items-start">
                                <div className="bg-chsprimary p-3 rounded-lg mb-6">
                                    <Phone className="text-white" size={24} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Call us</h3>
                                <p className="text-gray-600 mb-4">You can reach us on</p>
                                <a
                                    href="tel:02081331554"
                                    className="text-chsprimary font-medium hover:underline"
                                >
                                    02081331554
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
