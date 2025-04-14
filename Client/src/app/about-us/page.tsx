import React from "react";
import Header from "@/app/components/landingPage/Header";
import About from "@/app/components/landingPage/AboutUs";
import Footer from "@/app/components/landingPage/Footer";

export default function Home() {
    return (
        <main>
            <Header />
            <About />
            <Footer />
        </main>
    );
}
