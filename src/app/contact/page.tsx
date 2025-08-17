"use client";

import { Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Get in touch with the Evvalley team
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Contact Details */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              <p className="text-lg text-gray-600 mb-8">
                Have questions about electric vehicles or our marketplace? We're here to help!
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-[#F5F9FF] p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-[#3AB0FF]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">info@evvalley.com</p>
                  <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#F5F9FF] p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-[#3AB0FF]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-600">San Francisco, CA</p>
                  <p className="text-sm text-gray-500 mt-1">United States</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">Sorry, there was an error sending your message. Please try again or email us directly at info@evvalley.com</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent placeholder:text-gray-500 placeholder:opacity-100 text-gray-900"
                    placeholder="Your first name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent placeholder:text-gray-500 placeholder:opacity-100 text-gray-900"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent placeholder:text-gray-500 placeholder:opacity-100 text-gray-900"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent text-gray-900"
                >
                  <option value="" className="text-gray-500">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="sales">Sales Question</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent placeholder:text-gray-500 placeholder:opacity-100 text-gray-900"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1C1F4A] text-white py-3 rounded-lg hover:bg-[#2A2F6B] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Find answers to common questions about our platform</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#F5F9FF] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How do I list my electric vehicle?</h3>
              <p className="text-gray-600">
                Simply click on "Sell Your EV" in the navigation, create an account, and follow the listing process. 
                You can upload photos and provide detailed information about your vehicle.
              </p>
            </div>

            <div className="bg-[#F5F9FF] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is it free to list my vehicle?</h3>
              <p className="text-gray-600">
                Yes! Listing your electric vehicle on Evvalley is completely free. Currently, there are no listing fees for the first 100 users.
              </p>
            </div>

            <div className="bg-[#F5F9FF] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How do I contact a seller?</h3>
              <p className="text-gray-600">
                When you find a vehicle you're interested in, click "Contact Seller" on the vehicle detail page. 
                You can then message the seller directly through our platform.
              </p>
            </div>

            <div className="bg-[#F5F9FF] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What types of vehicles do you accept?</h3>
              <p className="text-gray-600">
                We accept all types of electric and hybrid vehicles including EVs, hybrids, e-bikes, and e-scooters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 