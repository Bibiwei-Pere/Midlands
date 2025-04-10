import React from "react";
import { Reveal3 } from "../animations/Reveal";
import Image from "next/image";
import { Container } from "@/components/ui/containers";
import { LandingTitle } from "@/components/ui/card";
// import cap from "../assets/images/landingPage/cap.svg";
import card from "../assets/images/landingPage/card.svg";
import people from "../assets/images/landingPage/people.svg";
// import ex from "../assets/images/landingPage/ex.svg";
import video from "../assets/images/landingPage/video.svg";
import chat from "../assets/images/landingPage/chat.svg";
import security from "../assets/images/landingPage/security.svg";
import discount from "../assets/images/landingPage/discount.svg";
import thriftbooks from "../assets/images/landingPage/thriftbooks.svg";

const Features = () => {
  return (
    <Container id='features' className='features'>
      <LandingTitle
        title='Explore Our Unique Features'
        header='Explore our platform’s standout features designed to enhance your
            learning experience and support your trading journey.'
      />

      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-x-[100px] gap-y-[40px] mx-auto max-w-[1440px]'>
        {featuresData.map((item) => (
          <div className='features_bg flex items-center relative w-[300px] h-[208px] p-[30px]' key={item.title}>
            <Image className='w-[24px] absolute right-10 top-10' src={item.icon} alt='icon' />

            <div className='flex flex-col gap-3'>
              <h5 className='max-w-[190px]'>{item.title}</h5>
              <Reveal3>
                <p>{item.description}</p>
              </Reveal3>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Features;

const featuresData = [
  {
    title: "Forex Self-Tutoring Platform",
    description:
      "Comprehensive self-paced courses designed for all levels, from beginner to expert, with interactive lessons and real-world trading scenarios.",
    icon: chat,
  },
  {
    title: "Weekly Market Analysis",
    description:
      "Stay ahead with expert-led weekly market breakdowns, offering insights into current market trends and potential trading opportunities.",
    icon: thriftbooks,
  },
  {
    title: "Enhanced Practical Application Modules",
    description:
      "Engage in hands-on learning through practical application modules that allow students to apply theoretical knowledge, building confidence and refining their skills.",
    icon: video,
  },
  {
    title: "Trading Capital for Students",
    description:
      "Students who successfully complete their courses are eligible to receive trading capital, giving them a head start in live market trading.",
    icon: card,
  },
  {
    title: "Performance-Based Rewards",
    description:
      "Achieve milestones during the courses and receive incentives such as trading bonuses and platform credits for consistent progress.",
    icon: discount,
  },
  {
    title: "Hands-On Learning with Practice Accounts",
    description:
      "Access demo accounts to practice trading without financial risk, building confidence and experience before entering the live market.",
    icon: people,
  },
  {
    title: "Mobile & Desktop Access",
    description:
      "Learn and trade anywhere with a fully responsive platform available on both mobile and desktop, ensuring a seamless experience across devices.",
    icon: security,
  },
  {
    title: "Community Support & Mentorship",
    description:
      "Join a vibrant community of traders and receive mentorship from experienced forex professionals, guiding you through the learning journey.",
    icon: people,
  },
  {
    title: "Certification & Skill Verification",
    description:
      "Earn certificates upon course completion, validating your skills and boosting credibility in the forex trading industry.",
    icon: thriftbooks,
  },
];
