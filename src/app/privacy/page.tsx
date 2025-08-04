import { Lock, Shield, Eye, FileText, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Your privacy is important to us
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-8">
            {/* Introduction */}
            <div>
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-[#3AB0FF] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
              </div>
              <p className="text-gray-600 mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                list a vehicle, or contact us. This may include:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Name, email address, and contact information</li>
                <li>Vehicle information and photos</li>
                <li>Messages sent through our platform</li>
                <li>Payment information (processed securely by third-party providers)</li>
              </ul>
            </div>

            {/* How We Use Information */}
            <div>
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-[#78D64B] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
              </div>
              <p className="text-gray-600 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Communicate with you about products, services, and events</li>
              </ul>
            </div>

            {/* Information Sharing */}
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-[#1C1F4A] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Information Sharing</h2>
              </div>
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                except in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>With service providers who assist in our operations</li>
              </ul>
            </div>

            {/* Data Security */}
            <div>
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-[#3AB0FF] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
              </div>
              <p className="text-gray-600">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. However, no method of 
                transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            {/* Cookies */}
            <div>
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-[#78D64B] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Cookies and Tracking</h2>
              </div>
              <p className="text-gray-600">
                We use cookies and similar technologies to enhance your experience, analyze usage, 
                and provide personalized content. You can control cookie settings through your browser preferences.
              </p>
            </div>

            {/* Your Rights */}
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-[#1C1F4A] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
              </div>
              <p className="text-gray-600 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt out of marketing communications</li>
                <li>Lodge a complaint with supervisory authorities</li>
              </ul>
            </div>

            {/* Children's Privacy */}
            <div>
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-[#3AB0FF] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Children's Privacy</h2>
              </div>
              <p className="text-gray-600">
                Our services are not intended for children under 13 years of age. We do not knowingly 
                collect personal information from children under 13. If you believe we have collected 
                information from a child under 13, please contact us immediately.
              </p>
            </div>

            {/* Changes to Policy */}
            <div>
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-[#78D64B] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Changes to This Policy</h2>
              </div>
              <p className="text-gray-600">
                We may update this privacy policy from time to time. We will notify you of any changes 
                by posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-[#F5F9FF] rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Mail className="h-6 w-6 text-[#1C1F4A] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
              </div>
              <p className="text-gray-600 mb-4">
                If you have any questions about this privacy policy, please contact us:
              </p>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>evvalley@evvalley.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-center text-gray-500 text-sm">
              <p>Last Updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 