import React from "react";
import Header from "@/app/components/landingPage/Header";
import Footer from "@/app/components/landingPage/Footer";
import ContactUsPage from "@/app/components/landingPage/Contact";

export default function Home() {
    return (
        <main>
            <Header />
            <ContactUsPage />
            <Footer />
        </main>
    );
}
