"use client";
import React from "react";
import { ContainerDashboard } from "@/components/ui/containers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Support = () => {
  return (
    <ContainerDashboard>
      <h2 className='text-left'>FAQS</h2>

      <div className='flex flex-col gap-5 w-full'>
        <Tabs defaultValue='Account Management' className='w-full'>
          <TabsList className='max-w-full'>
            {faqs.map((faq) => (
              <TabsTrigger value={faq.value} key={faq.value}>
                {faq.value}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className='border-b border-gray-800'></div>
          <div className='max-w-full'>
            {faqs.map((faq) => (
              <TabsContent value={faq.value} key={faq.value} className='max-w-full mx-auto mt-10 pb-5'>
                <Accordion type='single' collapsible>
                  {faq.component.map((item, index) => (
                    <AccordionItem value={item.question} key={index}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>
                        {item.answer.split("\n").map((line, index) => (
                          <React.Fragment key={index}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
      {/* <div className='py-10 md:pl-5 md:border-l border-gray-700'>
          <NewTicket edit='support' />
        </div> */}
    </ContainerDashboard>
  );
};

export default Support;

const faqs = [
  {
    value: "Account Management",
    component: [
      {
        question: "How do I reset my password?",
        answer:
          "To reset your password, follow these general steps:\n" +
          "• Go to the login page of the website or app.\n" +
          "• Click on 'Forgot Password' or a similar option.\n" +
          "• Enter your email address or username.\n" +
          "• Check your email for a reset link or code.\n" +
          "• Follow the instructions in the email.\n" +
          "• Set a new password and confirm the change.\n" +
          "Contact support for assistance.",
      },
      {
        question: "How do I change my profile picture?",
        answer:
          "To change your profile picture, follow these steps:\n" +
          "• Log in to your account.\n" +
          "• Navigate to your profile faqs.\n" +
          "• Look for 'Edit Profile' or 'Change Profile Picture.'\n" +
          "• Upload a new image from your device.\n" +
          "• Save the changes.",
      },
      {
        question: "How can I update my email address?",
        answer:
          "To update your email address, follow these steps:\n" +
          "• Log in to your account.\n" +
          "• Go to your account faqs or profile.\n" +
          "• Look for the option to edit your email address.\n" +
          "• Enter your new email address.\n" +
          "• Save the changes.",
      },
    ],
  },
  {
    value: "Billing & Payments",
    component: [
      {
        question: "How can I view my billing history?",
        answer:
          "To view your billing history:\n" +
          "• Log in to your account.\n" +
          "• Navigate to the billing or payment section.\n" +
          "• Click on 'Billing History' to see all your past transactions.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept various payment methods, including:\n" +
          "• Credit and debit cards (Visa, MasterCard, American Express)\n" +
          "• PayPal\n" +
          "• Bank transfers (where applicable)",
      },
      {
        question: "How do I update my payment information?",
        answer:
          "To update your payment information:\n" +
          "• Log in to your account.\n" +
          "• Go to the payment faqs.\n" +
          "• Enter your new payment details and save the changes.",
      },
    ],
  },
  {
    value: "Course Issues",
    component: [
      {
        question: "What should I do if I can't access my course?",
        answer:
          "If you cannot access your course:\n" +
          "• Ensure you are logged in with the correct account.\n" +
          "• Check your enrollment status in the course section.\n" +
          "• If the issue persists, contact support for assistance.",
      },
      {
        question: "How can I report a problem with a course?",
        answer:
          "To report a problem with a course:\n" +
          "• Log in to your account.\n" +
          "• Navigate to the course in question.\n" +
          "• Look for a 'Report Issue' button or similar option to submit your feedback.",
      },
      {
        question: "Can I get a refund for a course?",
        answer:
          "Refund policies may vary by course:\n" +
          "• Check the course details for refund eligibility.\n" +
          "• Generally, refunds are available within a specified time frame of purchase.\n" +
          "• Contact customer support for assistance with your refund request.",
      },
    ],
  },
  {
    value: "Others",
    component: [
      {
        question: "How do I contact customer support?",
        answer:
          "To contact customer support:\n" +
          "• Visit the 'Contact Us' page on our website.\n" +
          "• You can find options for live chat, email, or phone support.",
      },
      {
        question: "How can I provide feedback about the platform?",
        answer:
          "To provide feedback about the platform:\n" +
          "• Navigate to the feedback section of your account.\n" +
          "• Fill out the form and submit your feedback.",
      },
      {
        question: "Where can I find tutorials on using the platform?",
        answer:
          "You can find tutorials by:\n" +
          "• Visiting the 'Help Center' on our website.\n" +
          "• Searching for specific topics in the tutorial section.",
      },
    ],
  },
];
