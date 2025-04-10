import React from "react";

const Privacy = () => {
  return (
    <div className='container mx-auto p-6'>
      <h2 className='text-4xl text-yellow-500 font-bold mb-4'>Privacy Policy</h2>
      <p className='mb-4'>
        At <strong>mywebsite</strong>, we value your privacy and are committed to protecting your personal information.
        This Privacy Policy outlines how we collect, use, and safeguard your data when you use our platform.
      </p>

      <h2 className='text-2xl font-semibold mt-8 mb-2'>1. Information We Collect</h2>
      <p className='mb-4'>
        We may collect personal information such as your name, email address, and details related to your trading
        activities when you sign up for mywebsite or use our services. We also collect non-personal information, such as
        browser type, operating system, and IP address.
      </p>

      <h2 className='text-2xl font-semibold mt-8 mb-2'>2. How We Use Your Information</h2>
      <p className='mb-4'>
        Your personal information is used to provide, manage, and improve our platform. We may use your data to
        communicate with you, support your trading education, and improve the user experience. We will not share your
        personal information with third parties except as necessary to provide our services.
      </p>

      <h2 className='text-2xl font-semibold mt-8 mb-2'>3. Cookies</h2>
      <p className='mb-4'>
        mywebsite uses cookies to enhance your experience on our platform. Cookies are small text files stored on your
        device that allow us to remember your preferences and optimize the platform for your use.
      </p>

      <h2 className='text-2xl font-semibold mt-8 mb-2'>4. Data Security</h2>
      <p className='mb-4'>
        We implement industry-standard security measures to protect your data from unauthorized access, disclosure,
        alteration, or destruction. However, no method of transmission over the internet is completely secure, and we
        cannot guarantee absolute security.
      </p>

      <h2 className='text-2xl font-semibold mt-8 mb-2'>5. Third-Party Services</h2>
      <p className='mb-4'>
        mywebsite may integrate with third-party services such as payment processors. These services have their own
        privacy policies, and we recommend reviewing them.
      </p>

      <h2 className='text-2xl font-semibold mt-8 mb-2'>6. Changes to Privacy Policy</h2>
      <p className='mb-4'>
        We may update this Privacy Policy from time to time. When we do, we will notify you by posting the updated
        policy on our platform.
      </p>

      <h2 className='text-2xl font-semibold mt-8 mb-2'>7. Contact Us</h2>
      <p className='mb-4'>
        If you have any questions about this Privacy Policy or our data practices, please contact us at{" "}
        <a href='mailto:support@mywebsite.com' className='text-blue-500'>
          support@mywebsite.com
        </a>
        .
      </p>
    </div>
  );
};

export default Privacy;
