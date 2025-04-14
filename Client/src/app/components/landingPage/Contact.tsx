'use client'
import React, { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

const ContactUsPage: React.FC = () => {
  const [country, setCountry] = useState<string>('US');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: ''
  });
  const [agreeToPolicy, setAgreeToPolicy] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // Reset form or show success message
  };

  return (
      <div className="bg-white  mt-12 text-black">
        {/* Contact Info Section */}
        <section className="py-12 ">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-chsprimary font-medium">Contact us</p>
              <h2 className="text-3xl font-bold mt-2 mb-4">We'd love to hear from you</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our friendly team is always here to chat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* Email Contact */}
              <div className="text-center">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-chsprimary" size={20} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                <p className="text-gray-600 text-sm mb-2">Our friendly team is here to help.</p>
                <a
                    href="mailto:info@chsupport.org.uk"
                    className="text-chsprimary hover:underline font-medium"
                >
                  info@chsupport.org.uk
                </a>
              </div>

              {/* Office Contact */}
              <div className="text-center">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-chsprimary" size={20} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Office</h3>
                <p className="text-gray-600 text-sm mb-2">Come say hello at our office HQ.</p>
                <p className="text-chsprimary font-medium">142-143 Parrock Street Gravesend DA12 1EY</p>
              </div>

              {/* Phone Contact */}
              <div className="text-center">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-chsprimary" size={20} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                <p className="text-gray-600 text-sm mb-2">Mon-Fri from 8am to 5pm.</p>
                <a
                    href="tel:02081331554"
                    className="text-chsprimary hover:underline font-medium"
                >
                  02081331554
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
              <p className="text-chsprimary font-medium">Contact us</p>
              <h2 className="text-3xl font-bold mt-2 mb-4">Get in touch</h2>
              <p className="text-gray-600">
                We'd love to hear from you. Please fill out this form.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First name
                  </label>
                  <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#C74720] focus:border-[#C74720]"
                      required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last name
                  </label>
                  <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#C74720] focus:border-[#C74720]"
                      required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#C74720] focus:border-[#C74720]"
                    required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone number
                </label>
                <div className="flex">
                  <select
                      id="country"
                      name="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#C74720] focus:border-[#C74720]"
                  >
                    <option value="US">US</option>
                    <option value="UK">UK</option>
                    <option value="CA">CA</option>
                    <option value="AU">AU</option>
                  </select>
                  <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#C74720] focus:border-[#C74720]"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Leave us a message..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#C74720] focus:border-[#C74720]"
                    required
                />
              </div>

              {/* Privacy Policy Agreement */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                      id="agreeToPolicy"
                      name="agreeToPolicy"
                      type="checkbox"
                      checked={agreeToPolicy}
                      onChange={() => setAgreeToPolicy(!agreeToPolicy)}
                      className="h-4 w-4 text-chsprimary focus:ring-[#C74720] 0] border-gray-300 rounded"
                      required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeToPolicy" className="text-gray-600">
                    You agree to our friendly <a href="/privacy-policy" className="text-chsprimary underline">privacy policy</a>.
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                  type="submit"
                  disabled={!agreeToPolicy}
                  className={`w-full px-6 py-3 rounded-2xl  text-white font-medium shadow-sm transition ${
                      agreeToPolicy ? 'hover:opacity-70 bg-chsprimary' : 'bg-gray-500 cursor-not-allowed'
                  }`}
              >
                Send message
              </button>
            </form>
          </div>
        </section>
      </div>
  );
};

export default ContactUsPage;