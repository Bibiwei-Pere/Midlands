"use client";
import React from "react";
import Image from "next/image"  ;

interface CourseType {
    id: number;
    title: string;
    price: string;
    rating: number;
    reviewCount: number;
    description: string;
    imageUrl: string;
}

interface CourseCardProps {
    course: CourseType;
}

const courseData: CourseType[] = [
    {
        id: 1,
        title: "Independent Living Skills: Understanding Home Maintenance Basics",
        price: "₦20,000",
        rating: 4,
        reviewCount: 200,
        description: "Courses in this category aim to teach practical skills that empower young people to manage their homes and navigate everyday responsibilities effectively.",
        imageUrl: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: 2,
        title: "Independent Living Skills: Understanding Home Maintenance Basics",
        price: "₦20,000",
        rating: 4,
        reviewCount: 200,
        description: "Courses in this category aim to teach practical skills that empower young people to manage their homes and navigate everyday responsibilities effectively.",
        imageUrl: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: 3,
        title: "Independent Living Skills: Understanding Home Maintenance Basics",
        price: "₦20,000",
        rating: 4,
        reviewCount: 200,
        description: "Courses in this category aim to teach practical skills that empower young people to manage their homes and navigate everyday responsibilities effectively.",
        imageUrl: "https://images.pexels.com/photos/7691370/pexels-photo-7691370.jpeg"
    },
    {
        id: 4,
        title: "Independent Living Skills: Understanding Home Maintenance Basics",
        price: "₦20,000",
        rating: 4,
        reviewCount: 200,
        description: "Courses in this category aim to teach practical skills that empower young people to manage their homes and navigate everyday responsibilities effectively.",
        imageUrl: "https://images.pexels.com/photos/7691370/pexels-photo-7691370.jpeg"
    },
    {
        id: 5,
        title: "Independent Living Skills: Understanding Home Maintenance Basics",
        price: "₦20,000",
        rating: 4,
        reviewCount: 200,
        description: "Courses in this category aim to teach practical skills that empower young people to manage their homes and navigate everyday responsibilities effectively.",
        imageUrl:"https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: 6,
        title: "Independent Living Skills: Understanding Home Maintenance Basics",
        price: "₦20,000",
        rating: 4,
        reviewCount: 200,
        description: "Courses in this category aim to teach practical skills that empower young people to manage their homes and navigate everyday responsibilities effectively.",
        imageUrl: "https://images.pexels.com/photos/7691370/pexels-photo-7691370.jpeg"
    }
];


export default function Courses() {
    return (
        <div className="bg-white mt-14 text-black">
            <section className="max-w-screen-xl mx-auto px-4 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 mb-16">
                    <div>
                        <div className="mb-2">
                            <span className="text-chsprimary font-medium"> Courses</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold">Purpose</h2>
                    </div>
                    <div className="">
                        <p className="text-gray-600 mt-3">
                            To help learners easily discover and explore course content organized into CHS’s three learning pillars—Independent Living Skills, Skill Acquisition, and Safeguarding—with intuitive navigation, progress indicators, and clear learning outcomes.
                        </p>
                    </div>
                </div>
            </section>

            <div className=" py-12 px-4">
                <div className="container mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8">Course Catalogue</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courseData.map((course:CourseType) => (
                            <CourseCard  course={course} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const CourseCard: React.FC<CourseCardProps> = ({course} ) => {
    return (
        <div className="mb-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="relative w-full h-48">
                    <Image
                        src={course.imageUrl}
                        alt={course.title}
                        layout="fill"
                        objectFit="cover"
                        className="w-full"
                    />
                </div>

                <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1">
                        {course.title}
                    </h3>

                    <div className="flex justify-between items-center mb-2">
                        <p className="font-bold text-gray-900">{course.price}</p>
                        <div className="flex items-center">
                            <span className="text-gray-600 mr-1">{course.rating}/5</span>
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-4 h-4 ${i < course.rating ? 'text-green-600' : 'text-gray-300'} fill-current`}
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-gray-500 text-sm ml-1">({course.reviewCount})</span>
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">
                        {course.description}
                    </p>

                    <button className="w-full bg-chsprimary hover:opacity-70 text-white font-medium py-2 px-4 rounded-xl transition duration-200">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};