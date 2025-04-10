"use client";
import React from "react";
import { Reveal3, Reveal4, Reveal5 } from "../animations/Reveal";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { LandingTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/containers";
import ReactPlayer from "react-player";

export const Testimonial = () => {
  const plugin1 = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  return (
    <Container id='testimonials' className='testimonial bg-pricing_bg flex'>
      <LandingTitle title='Testimonial' header='Real success stories from mywebsite traders' />

      <div className='grid relative grid-cols-1 lg:grid-cols-2 mt-4 gap-20 lg:gap-10'>
        <div className='w-full bg-black rounded-lg'>
          <Carousel
            opts={{
              align: "start",
            }}
            className='relative h-[300px] lg:h-[500px] w-full'
            plugins={[plugin1.current]}
            orientation='vertical'
            onMouseEnter={plugin1.current.stop}
            onMouseLeave={plugin1.current.reset}
          >
            <CarouselPrevious className='absolute left-[50%] rotate-90 top-[-20px]' />
            <CarouselContent className='flex w-full h-[300px] lg:h-[500px]'>
              {testimonialVideo.map((url: string, index: number) => (
                <CarouselItem
                  className='w-full m-0 p-0 h-full rounded-[20px] overflow-hidden flex-shrink-0'
                  key={index}
                >
                  <ReactPlayer
                    // className='w-full h-[500px] object-cover'
                    key={index}
                    style={{ position: "relative" }}
                    url={url}
                    width='100%'
                    height='100%'
                    config={{
                      youtube: {
                        playerVars: {
                          modestbranding: 1,
                          rel: 0,
                          showinfo: 0,
                        },
                      },
                    }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext className='absolute left-[50%] rotate-90 bottom-[-25px]' />
          </Carousel>
        </div>

        <Carousel
          className='relative w-full'
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <div className='hidden absolute top-[-15px] w-full lg:flex items-center'>
            <CarouselPrevious className='absolute right-[50px]' />
            <CarouselNext className='absolute right-[0]' />
          </div>
          <CarouselContent className='gap-10 mx-auto pb-5'>
            {testimonialData.map((item) => (
              <CarouselItem
                className={`${item.class} ${
                  item.class === "card_2" || item.class === "card_3"
                    ? "hidden"
                    : "bg-cover bg-no-repeat max-w-[300px] flex flex-col relative gap-5 p-[30px]"
                }`}
                key={item.icon}
              >
                <p className='w-[200px]'>{item.text1}</p>
                <Reveal3>
                  <p>{item.text}</p>
                </Reveal3>

                <div className='author absolute flex gap-4 items-center'>
                  <Reveal5>
                    <h6 className='text-sm'>{item.icon}</h6>
                  </Reveal5>
                  <div className='flex flex-col gap-1'>
                    <Reveal4>
                      <p className='text-[14px] font-medium'>{item.name}</p>
                    </Reveal4>
                    <Reveal4>
                      <p className='text-[14px] font-medium'>{item.position}</p>
                    </Reveal4>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className='absolute lg:hidden bottom-[-15px] w-full flex items-center'>
            <CarouselPrevious className='absolute right-[50px]' />
            <CarouselNext className='absolute right-[0]' />
          </div>
        </Carousel>
      </div>
    </Container>
  );
};

const testimonialData = [
  {
    class: "card_1",
    name: "Okoijesu Emmanuel,",
    position: "Active Forex Trader",
    text1: "This platform has been instrumental in my journey to becoming a forex trader.",
    icon: "O",
    text: "I’m grateful for the invaluable mentorship from Jude Iwere at Candlekapital Academy. Since joining the Masters program in 2019, his approachable and effective teaching has been transformative.",
  },
  {
    class: "card_2",
    name: "Rev. Olowu",
    position: "Rivers State",
    icon: "R",
    text1: "Understanding forex trading was crucial for diversifying my income streams",
    text: "I wish to thank pastor Jude for the Forex training I received and Bro. Emma for bringing me in contact with him. I am happy to announce that all my losses since I started anything forex has been fully recovered. So, I can say now that I am in the blues. As I reflect on my journey so far, I kind of laugh at the ignorance of the first person that taught me forex. I can boldly say he was a fraud, we actually parted ways because he wanted me to just follow him sheepishly without asking questions and I must ask questions for clarification and understanding. My rule had always been I learn and trade for myself, if I don’t, how would I become a master in it. The second instructor was good but the SMC taught by pastor Jude was the game changer for me. I am still on the learning process because in life you never graduate from learning, but I am getting better and better every day. I encourage all nearly newbies like me to stay the course press in and stay there. You will become profitable.",
  },
  {
    class: "card_3",
    name: "Tunde Oladimeji,",
    position: "Lagos State",
    icon: "T",
    text1: "I was skeptical about forex trading until I enrolled at Candlekapital",
    text: "What sets Candlekapital apart is not just the quality of the education, but the personal commitment of Dr. Jude to his students' success. His seven years of experience as a profitable forex instructor shine through in every lecture, and his genuine passion for teaching and mentoring is evident. He goes beyond the basics, providing deep insights into market dynamics that have empowered me to trade with confidence and consistency. Since completing the program, I've seen a significant improvement in my trading results. The strategies I learned have been instrumental in my ability to navigate the forex market, and I now feel equipped to make informed decisions that yield profitable outcomes. More importantly, I've gained a deeper understanding of the ethical implications of trading, something that Dr. Jude emphasizes throughout the course. This platform is not just an educational institution; it's a community where aspiring and experienced traders alike can thrive. I highly recommend",
  },
  {
    class: "card_4",
    name: "Bola Hassan,",
    position: "Active Forex Trader",
    icon: "T",
    text1: "The knowledge I've gained is both profound and practical.",
    text: "Dr. Iwere Jude’s instruction is clear, concise, and highly effective. As a Regional Sales Manager, I appreciate the structured approach to learning that Candlekapital offers. Thanks to Dr. Iwere Jude and Candlekapital, I'm now confidently navigating the forex market with success",
  },

  {
    class: "card_5",
    name: "Grace Alabi,",
    position: "Financial Analyst",
    text1: "The training I received from Candlekapital has changed my approach to forex trading",
    icon: "G",
    text: "Dr. Jude’s unique blend of banking experience and spiritual leadership offers a well-rounded education that goes beyond just numbers. I'm now a confident trader.",
  },
  {
    class: "card_6",
    name: "Esther Eze,",
    position: "Financial Analyst",
    icon: "G",
    text1: "The comprehensive training at Candlekapital is unmatched",
    text: "The comprehensive training at Candlekapital is unmatched, Dr. Iwere Jude's deep knowledge and genuine passion for teaching make all the difference.",
  },
];

const testimonialVideo = [
  "https://youtu.be/MmQlm4pinJc?si=_zvKSOhkwdMaLQVX",
  "https://www.youtube.com/watch?v=_S814N4p7KU",
  "https://www.youtube.com/watch?v=e4-5T9hfAcg",
];
