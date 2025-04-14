import React from "react";
import Link from "next/link";
import chsLogo from "../assets/images/landingPage/chsLogo.svg"
import Image from "next/image";


const Footer = () => {
  return (
      <div className="bg-white text-black">
        {/* CTA Section */}
        <section className="max-w-screen-xl  mx-auto px-4 lg:px-8 py-16">
          <div className="bg-[#FFF7F4] rounded-2xl px-6 py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the community today</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Whether you're preparing to live on your own, applying for a job, or just trying to
              stay safe online, our learning modules are built with you in mind
            </p>
            <a
                href="#get-started"
                className="inline-flex items-center bg-chsprimary text-white px-8 py-3 rounded-md font-medium hover:opacity-70 transition-colors"
            >
              Get started
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="max-w-screen-xl mx-auto px-4 lg:px-8 py-12 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
              <div className="mb-3">
                <div className='flex gap-1 items-center'>
                  <Image src={chsLogo} alt="logo"  />
                </div>              </div>
              <p className="text-gray-600">© 2025. All rights reserved.</p>
            </div>

            {/* Navigation links */}
            <div className="flex flex-col md:flex-row items-center mb-8 md:mb-0">
              <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6 md:mb-0">
                <a href="#terms" className="text-gray-600 hover:text-gray-900">Terms</a>
                <a href="#privacy" className="text-gray-600 hover:text-gray-900">Privacy</a>
                <a href="#safeguarding" className="text-gray-600 hover:text-gray-900">Safeguarding Policy</a>
                <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
                <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
              </nav>
            </div>

            {/* Social media links */}
            <div className="flex gap-4">
              <a href="#twitter" className="text-gray-500 hover:text-gray-700">
                {/* Twitter icon */}
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#linkedin" className="text-gray-500 hover:text-gray-700">
                {/* LinkedIn icon */}
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#facebook" className="text-gray-500 hover:text-gray-700">
                {/* Facebook icon */}
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
  );
};

export default Footer;