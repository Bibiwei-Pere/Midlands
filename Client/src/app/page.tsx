import React from "react";
import Header from "./components/landingPage/Header";
import { Hero } from "./components/landingPage/Hero";
import Footer from "@/app/components/landingPage/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
        <Footer />
    </main>
  );
}
