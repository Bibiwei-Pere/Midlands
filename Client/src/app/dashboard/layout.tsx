"use client";
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";
import Search from "../components/dashboard/Search";
import { useGetUser } from "@/hooks/users";
import { useRouter } from "next/navigation";
import TawkTo from "../components/dashboard/Talkto";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobile, setMobile] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { data: user, status } = useGetUser();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearch(false); // Close search when clicking outside of search area
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  // Wait for user data to load, then check if redirection is needed
  useEffect(() => {
    if (status === "success") if (!user?.password) router.push("/social-login");
  }, [user]);

  if (status !== "success") return null; // Wait until the user data is fully loaded
  return (
    <div className='bg-cover bg-no-repeat max-w-screen-2xl min-h-screen mx-auto bg-testimonial_bg'>
      <Sidebar mobile={mobile} setMobile={setMobile} />
      <main className={`relative transition-all duration-300 ${mobile ? "ml-0 md:ml-[65px]" : "ml-[310px]"}`}>
        <Navbar setIsSearch={setIsSearch} isSearch={isSearch} />
        <div ref={searchRef}>{isSearch ? <Search setIsSearch={setIsSearch} /> : children}</div>
      </main>
      <div className='z-[-50]'>
        <TawkTo />
      </div>
    </div>
  );
};

export default Layout;
