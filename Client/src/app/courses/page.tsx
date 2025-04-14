import React from "react";
import Header from "@/app/components/landingPage/Header";
import Footer from "@/app/components/landingPage/Footer";
import Courses from "@/app/components/landingPage/Courses";

export default function Home() {
    return (
        <main>
            <Header />
            <Courses />
            <Footer />
        </main>
    );
}
