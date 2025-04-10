import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Container } from "@/components/ui/containers";
import { LandingTitle } from "@/components/ui/card";

const Faq = () => {
  return (
    <Container id='faqs' className='bg-testimonial_bg'>
      <LandingTitle
        title='Frequently Asked Questions'
        header='The Frequently Asked Questions (FAQ) is designed to address
the most common queries about our Forex self-tutoring platform.
This section provides clear, concise answers to questions
related to course structure, trading capital eligibility,
and platform access.
Whether you’re curious about how the courses work,
the requirements for earning trading capital,
or need technical assistance, the FAQ section offers quick
and helpful responses to ensure a smooth learning experience.'
      />
      <div>
        <Accordion type='single' collapsible>
          {faqData.map((item, index) => (
            <AccordionItem value={item.title} key={index}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>{item.text}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Container>
  );
};

export default Faq;

const faqData = [
  {
    title: "What is mywebsite?",
    text: "mywebsite is an online self-tutoring platform designed to teach you Forex trading from beginner to advanced levels. We offer comprehensive courses, market analysis, with the opportunity to receive trading capital upon course completion.",
  },
  {
    title: "Who is the mywebsite platform for?",
    text: "mywebsite is ideal for beginners with no prior knowledge of Forex, as well as intermediate and advanced traders looking to refine their skills and gain practical trading experience.",
  },
  {
    title: "How do I get started on mywebsite?",
    text: "Simply sign up on our platform, select the course level that matches your expertise (beginner, intermediate, or advanced), and begin your self-paced learning journey.",
  },
  {
    title: "What does the beginner course include?",
    text: "The beginner course includes video lectures, downloadable eBooks, infographics, quizzes, and a practical trading demo. It covers the basics of Forex, market analysis, pips, leverage, and lot sizes.",
  },
  {
    title: "Do I need any prior experience to enroll?",
    text: "No, our beginner course is designed for complete novices. You will learn everything from the ground up, with no prior trading experience required.",
  },
  {
    title: "What is the passing requirement for quizzes and exams?",
    text: "All quizzes and exams require a 100% passing score to ensure full comprehension of the material. Retakes are available until you achieve this score.",
  },
  {
    title: "Will I receive trading capital after completing the course?",
    text: "Yes, upon successfully completing the course with a perfect score on all assessments, you may be eligible for trading capital to start live trading.",
  },
  {
    title: "What happens if I fail a quiz or the final exam?",
    text: "Don’t worry! You can retake any quiz or the final exam as many times as needed until you pass with 100%.",
  },
];
