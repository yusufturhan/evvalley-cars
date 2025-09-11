import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Safety Guidelines - Evvalley',
  description:
    'Essential safety tips for electric vehicles, e-scooters and e-bikes. Battery safety, charging, traffic rules and emergency readiness on Evvalley.',
  alternates: { canonical: 'https://www.evvalley.com/safety' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Safety Guidelines</h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Your safety is our top priority
            </p>
          </div>
        </div>
      </section>

      {/* Safety Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* EV Safety */}
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-[#3AB0FF] mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Electric Vehicle Safety</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Pre-Purchase Inspection
                </h3>
                <p className="text-gray-600">
                  Always inspect the vehicle thoroughly before purchase. Check battery health, 
                  charging system, and overall condition. Request maintenance records when available.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                  Battery Safety
                </h3>
                <p className="text-gray-600">
                  EV batteries are high-voltage systems. Never attempt to repair or modify 
                  battery components yourself. Always use certified technicians for battery-related work.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Info className="h-5 w-5 text-blue-500 mr-2" />
                  Charging Safety
                </h3>
                <p className="text-gray-600">
                  Use only approved charging equipment. Never charge in wet conditions or 
                  with damaged cables. Follow manufacturer guidelines for charging procedures.
                </p>
              </div>
            </div>
          </div>

          {/* E-Mobility Safety */}
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-[#78D64B] mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">E-Mobility Safety</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Protective Gear
                </h3>
                <p className="text-gray-600">
                  Always wear appropriate safety gear: helmet, knee pads, and reflective clothing. 
                  This is especially important for e-scooters and e-bikes.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                  Traffic Rules
                </h3>
                <p className="text-gray-600">
                  Follow all local traffic laws and regulations. Use designated bike lanes when available. 
                  Be aware of your surroundings and signal your intentions clearly.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Info className="h-5 w-5 text-blue-500 mr-2" />
                  Speed Limits
                </h3>
                <p className="text-gray-600">
                  Respect speed limits and ride at safe speeds for your skill level and conditions. 
                  E-scooters and e-bikes have different speed capabilities than traditional vehicles.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* General Safety Tips */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">General Safety Tips</h2>
            <p className="text-lg text-gray-600">Essential guidelines for all electric vehicle users</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center">
              <div className="bg-[#F5F9FF] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-[#3AB0FF]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Insurance</h3>
              <p className="text-gray-600">
                Ensure you have appropriate insurance coverage for your electric vehicle or e-mobility device.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center">
              <div className="bg-[#F5F9FF] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-[#78D64B]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Maintenance</h3>
              <p className="text-gray-600">
                Regular maintenance is crucial for safety. Follow manufacturer recommendations for service intervals.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center">
              <div className="bg-[#F5F9FF] p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Info className="h-8 w-8 text-[#1C1F4A]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Emergency</h3>
              <p className="text-gray-600">
                Know emergency procedures and keep emergency contact information readily available.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-sm border border-gray-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-6">
              If you have safety concerns or need assistance, don't hesitate to contact us.
            </p>
            <Link href="/contact">
              <button className="bg-[#1C1F4A] text-white px-6 py-3 rounded-lg hover:bg-[#2A2F6B] transition-colors">
                Contact Support
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 