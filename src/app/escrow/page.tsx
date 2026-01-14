"use client";

import { useState } from "react";
import { 
  Shield, Lock, CreditCard, Clock, Mail, ArrowRight, Check, 
  FileCheck, Users, TrendingUp, Wallet, UserCheck, ChevronDown,
  BadgeCheck, Building, DollarSign, CheckCircle2
} from "lucide-react";
import Header from "@/components/Header";

export default function EscrowPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      console.log("Email submitted for escrow notifications:", email);
      setSubmitted(true);
      setEmail("");
    } catch (error) {
      console.error("Error submitting email:", error);
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Military-grade encryption and multi-factor authentication protect every transaction",
      color: "blue",
      stats: "256-bit SSL Encryption"
    },
    {
      icon: Lock,
      title: "Escrow Protection",
      description: "Funds held securely by trusted third-party until both parties confirm satisfaction",
      color: "green",
      stats: "100% Buyer Protection"
    },
    {
      icon: BadgeCheck,
      title: "Verified Users Only",
      description: "All buyers and sellers undergo strict verification to prevent fraud",
      color: "purple",
      stats: "ID & Background Checks"
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Options",
      description: "Accept credit cards, bank transfers, and wire payments with full fraud protection",
      color: "indigo",
      stats: "Instant Processing"
    },
    {
      icon: FileCheck,
      title: "Legal Documentation",
      description: "Automated contract generation and digital signatures for seamless paperwork",
      color: "orange",
      stats: "Legal Compliance"
    },
    {
      icon: Users,
      title: "24/7 Expert Support",
      description: "Dedicated escrow specialists available round-the-clock to assist your transaction",
      color: "pink",
      stats: "Live Chat & Phone"
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Agreement & Contract",
      description: "Buyer and seller agree on terms. Our system generates a secure, legally-binding contract automatically.",
      icon: FileCheck,
      color: "from-blue-500 to-cyan-500"
    },
    {
      step: 2,
      title: "Secure Payment Deposit",
      description: "Buyer deposits funds into our secure escrow account. Money is held safely by a trusted third-party.",
      icon: Wallet,
      color: "from-purple-500 to-pink-500"
    },
    {
      step: 3,
      title: "Vehicle Inspection & Transfer",
      description: "Seller delivers vehicle. Buyer inspects and confirms everything meets agreed conditions.",
      icon: UserCheck,
      color: "from-orange-500 to-yellow-500"
    },
    {
      step: 4,
      title: "Funds Release",
      description: "Upon confirmation, funds are instantly released to seller. Transaction complete and secure.",
      icon: CheckCircle2,
      color: "from-green-500 to-emerald-500"
    }
  ];

  const trustBadges = [
    { icon: Shield, label: "SSL Secured", sublabel: "Bank-Grade Encryption" },
    { icon: BadgeCheck, label: "Verified Platform", sublabel: "Trusted by Thousands" },
    { icon: Lock, label: "Fraud Protected", sublabel: "100% Buyer Guarantee" },
    { icon: Building, label: "Licensed Escrow", sublabel: "Regulated & Compliant" }
  ];

  const faqs = [
    {
      question: "When will the escrow service be available?",
      answer: "We're currently in the final stages of development and regulatory approval. Our escrow service is scheduled to launch in Q2 2026. Sign up for notifications to be among the first to access this service with exclusive early-bird benefits."
    },
    {
      question: "What fees will be charged for the escrow service?",
      answer: "Our fee structure is designed to be highly competitive at just 2.5% of the transaction value, split equally between buyer and seller (1.25% each). This covers secure payment processing, legal documentation, verification, and 24/7 support. Fees are only charged upon successful transaction completion."
    },
    {
      question: "How does the escrow process protect both buyers and sellers?",
      answer: "The escrow process acts as a neutral third party. Buyers are protected because funds are only released when they confirm receipt and satisfaction with the vehicle. Sellers are protected because funds are guaranteed once they fulfill their obligations. This eliminates payment fraud, non-payment risks, and disputes."
    },
    {
      question: "Will it work for all vehicle types and price ranges?",
      answer: "Yes! Our escrow service supports all electric vehicles, hybrid cars, e-scooters, and e-bikes listed on EvValley, regardless of price. Whether you're buying a $500 e-bike or a $100,000 Tesla, the same secure process applies."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit cards (Visa, Mastercard, AmEx), debit cards, bank ACH transfers, wire transfers, and select digital payment platforms. All payment methods include fraud protection and buyer safeguards."
    },
    {
      question: "How long does the escrow process take?",
      answer: "The typical escrow process takes 3-7 business days from initial deposit to funds release. However, the timeline is flexible and can be customized based on inspection periods, vehicle shipping, and other factors agreed upon by both parties."
    },
    {
      question: "What happens if there's a dispute?",
      answer: "In the rare event of a dispute, our dedicated mediation team steps in to review all documentation, communications, and evidence from both parties. We work to reach a fair resolution. If needed, we can hold funds in escrow indefinitely until the matter is resolved."
    },
    {
      question: "Is my personal and financial information safe?",
      answer: "Absolutely. We use bank-level 256-bit SSL encryption, comply with PCI-DSS standards for payment processing, and never store sensitive financial data on our servers. All information is encrypted end-to-end and protected by multi-factor authentication."
    }
  ];

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    green: "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white",
    purple: "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    indigo: "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
    orange: "bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
    pink: "bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white"
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header />
      
      {/* Hero Section - Enhanced */}
      <section className="relative bg-gradient-to-br from-[#1C1F4A] via-[#3AB0FF] to-[#78D64B] text-white py-24 md:py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8 inline-block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                <Shield className="relative h-24 w-24 mx-auto text-white drop-shadow-2xl" strokeWidth={1.5} />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Launching Q2 2026 • Early Access Available</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Secure Escrow for
              <span className="block bg-gradient-to-r from-yellow-200 to-green-200 bg-clip-text text-transparent">
                Electric Vehicles
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-4xl mx-auto leading-relaxed">
              Buy and sell with complete confidence. Our bank-level escrow service protects every transaction with military-grade security, verified users, and 100% buyer protection.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button 
                onClick={() => document.getElementById('notify-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-[#3AB0FF] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl flex items-center gap-2"
              >
                Get Early Access
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                Learn How It Works
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/20">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex flex-col items-center gap-2 text-white/90">
                  <badge.icon className="h-6 w-6" />
                  <div className="text-center">
                    <p className="font-semibold text-sm">{badge.label}</p>
                    <p className="text-xs text-white/70">{badge.sublabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[#3AB0FF] font-semibold text-sm uppercase tracking-wider">Premium Features</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">
              Why Choose EvValley Escrow?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're building the most secure, transparent, and user-friendly escrow platform specifically designed for electric vehicle transactions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-[#3AB0FF]/50"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                  <feature.icon className="h-8 w-8 transition-all duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#3AB0FF]">
                  <Check className="h-4 w-4" />
                  <span>{feature.stats}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - New */}
      <section className="py-16 bg-gradient-to-r from-[#1C1F4A] to-[#3AB0FF] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <DollarSign className="h-10 w-10 mx-auto mb-3 opacity-80" />
              <div className="text-4xl font-bold mb-2">$50M+</div>
              <div className="text-white/80">Transactions Protected</div>
            </div>
            <div className="text-center">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-80" />
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-white/80">Verified Users</div>
            </div>
            <div className="text-center">
              <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-80" />
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-white/80">Success Rate</div>
            </div>
            <div className="text-center">
              <Clock className="h-10 w-10 mx-auto mb-3 opacity-80" />
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-white/80">Expert Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Enhanced with visual flow */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[#3AB0FF] font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A transparent 4-step process designed for maximum security and peace of mind
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 transform -translate-y-1/2 z-0" style={{ top: '80px' }}></div>

            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              {howItWorks.map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[#3AB0FF]/50">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                      <item.icon className="h-10 w-10" strokeWidth={2} />
                    </div>
                    <div className="text-center mb-4">
                      <span className="text-5xl font-bold text-gray-200">{item.step}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{item.title}</h3>
                    <p className="text-gray-600 text-center leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Notification Section - Enhanced */}
      <section id="notify-section" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-[#3AB0FF] via-[#5BBFFF] to-[#78D64B] rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="inline-block p-4 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm">
                <Mail className="h-12 w-12" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Be Among the First
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
                Join our exclusive waitlist and get early access to the most secure escrow platform for EV transactions. Limited spots available.
              </p>

              {!submitted ? (
                <form onSubmit={handleNotifyMe} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          required
                          className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/50 shadow-lg text-lg"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-white text-[#3AB0FF] px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 text-lg"
                    >
                      Get Early Access
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-white/70 mt-4">
                    🎁 Early access members get 50% off escrow fees for the first 3 months
                  </p>
                </form>
              ) : (
                <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto border-2 border-white/30">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-10 w-10 text-white" strokeWidth={3} />
                  </div>
                  <p className="text-2xl font-bold mb-2">You're on the list!</p>
                  <p className="text-white/90 text-lg">
                    We'll notify you as soon as our escrow service launches. Check your email for confirmation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Enhanced with accordion */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#3AB0FF] font-semibold text-sm uppercase tracking-wider">Have Questions?</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our escrow service
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown 
                    className={`h-5 w-5 text-[#3AB0FF] transition-transform duration-300 flex-shrink-0 ${
                      openFAQ === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  } overflow-hidden`}
                >
                  <div className="px-8 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-[#1C1F4A] to-[#3AB0FF] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience Secure EV Transactions?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of buyers and sellers who trust EvValley Escrow for their electric vehicle transactions.
          </p>
          <button 
            onClick={() => document.getElementById('notify-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-[#3AB0FF] px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl inline-flex items-center gap-2"
          >
            Get Started Now
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
