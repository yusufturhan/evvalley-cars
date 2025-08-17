import { FileText, Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Please read these terms carefully
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-8">
            {/* Introduction */}
            <div>
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-[#3AB0FF] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
              </div>
              <p className="text-gray-600">
                By accessing and using Evvalley ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            {/* Service Description */}
            <div>
              <div className="flex items-center mb-4">
                <Info className="h-6 w-6 text-[#78D64B] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Service Description</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Evvalley is an online marketplace that connects buyers and sellers of electric vehicles and e-mobility devices. Our services include:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Vehicle listing and browsing</li>
                <li>User-to-user messaging</li>
                <li>Payment processing (through third-party providers)</li>
                <li>User verification and safety features</li>
              </ul>
            </div>

            {/* User Responsibilities */}
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-[#1C1F4A] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">User Responsibilities</h2>
              </div>
              <p className="text-gray-600 mb-4">
                As a user of our platform, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Provide accurate and truthful information</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not engage in fraudulent or deceptive practices</li>
                <li>Respect other users' rights and privacy</li>
                <li>Not use the platform for illegal activities</li>
                <li>Maintain the security of your account</li>
              </ul>
            </div>

            {/* Listing Guidelines */}
            <div>
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-[#3AB0FF] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Listing Guidelines</h2>
              </div>
              <p className="text-gray-600 mb-4">
                When listing vehicles on our platform, you must:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Provide accurate vehicle descriptions and photos</li>
                <li>Disclose any known defects or issues</li>
                <li>Ensure the vehicle is legally owned by you</li>
                <li>Comply with local vehicle registration requirements</li>
                <li>Not list counterfeit or stolen vehicles</li>
                <li>Respond promptly to buyer inquiries</li>
              </ul>
            </div>

            {/* Prohibited Activities */}
            <div>
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-[#78D64B] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Prohibited Activities</h2>
              </div>
              <p className="text-gray-600 mb-4">
                The following activities are strictly prohibited:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Posting false or misleading information</li>
                <li>Harassing or threatening other users</li>
                <li>Attempting to circumvent our safety measures</li>
                <li>Using automated tools to access our services</li>
                <li>Sharing personal information of other users</li>
                <li>Engaging in price manipulation or fraud</li>
              </ul>
            </div>

            {/* Payment and Fees */}
            <div>
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-[#1C1F4A] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Payment and Fees</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Currently, listing vehicles on Evvalley is free for the first 100 users. We reserve the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Introduce listing fees for future users</li>
                <li>Charge commission fees on successful sales</li>
                <li>Implement premium features with associated costs</li>
                <li>Modify fee structures with 30 days notice</li>
              </ul>
            </div>

            {/* Dispute Resolution */}
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-[#3AB0FF] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Dispute Resolution</h2>
              </div>
              <p className="text-gray-600">
                In the event of disputes between users, we encourage direct communication to resolve issues. Evvalley acts as a platform facilitator and is not responsible for individual transactions. For legal disputes, users agree to resolve matters through appropriate legal channels.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div>
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-[#78D64B] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Limitation of Liability</h2>
              </div>
              <p className="text-gray-600">
                Evvalley provides this platform "as is" and makes no warranties about the accuracy, reliability, or availability of our services. We are not liable for any damages arising from the use of our platform, including but not limited to direct, indirect, incidental, or consequential damages.
              </p>
            </div>

            {/* Intellectual Property */}
            <div>
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-[#1C1F4A] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Intellectual Property</h2>
              </div>
              <p className="text-gray-600">
                All content on this platform, including but not limited to text, graphics, logos, and software, is the property of Evvalley or its licensors and is protected by copyright and other intellectual property laws. Users retain ownership of their vehicle photos and descriptions but grant us license to display them on our platform.
              </p>
            </div>

            {/* Termination */}
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-[#3AB0FF] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Account Termination</h2>
              </div>
              <p className="text-gray-600">
                We reserve the right to terminate or suspend accounts that violate these terms. Users may also terminate their accounts at any time. Upon termination, your right to use the platform ceases immediately, and we may delete your account information in accordance with our privacy policy.
              </p>
            </div>

            {/* Changes to Terms */}
            <div>
              <div className="flex items-center mb-4">
                <Info className="h-6 w-6 text-[#78D64B] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Changes to Terms</h2>
              </div>
              <p className="text-gray-600">
                We may update these terms from time to time. We will notify users of significant changes via email or through our platform. Continued use of our services after changes constitutes acceptance of the new terms.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-[#F5F9FF] rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-[#1C1F4A] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
              </div>
              <p className="text-gray-600 mb-4">
                If you have any questions about these terms of service, please contact us:
              </p>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  <span>info@evvalley.com</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
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