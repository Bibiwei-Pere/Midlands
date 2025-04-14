import React from "react";
import Header from "@/app/components/landingPage/Header";
import Footer from "@/app/components/landingPage/Footer";
import Pricing from "@/app/components/landingPage/Pricing";

export default function Home() {
    return (
        <main>
            <Header />
            <Pricing />
            <Footer />
        </main>
    );
}
