"use client";

import { useState } from "react";
import { Shield, Lock, CreditCard, Clock, Mail, ArrowRight } from "lucide-react";
import Header from "@/components/Header";

export default function EscrowPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      // Here you can add logic to save the email for notifications
      console.log("Email submitted for escrow notifications:", email);
      setSubmitted(true);
      setEmail("");
    } catch (error) {
      console.error("Error submitting email:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <Shield className="h-20 w-20 mx-auto text-white/90" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Secure Escrow
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Safe and secure vehicle transactions with our upcoming escrow service
            </p>
            <div className="flex items-center justify-center space-x-2 text-white/80">
              <Clock className="h-5 w-5" />
              <span className="text-lg">Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EvValley Escrow?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're building the most secure and user-friendly escrow service for electric vehicle transactions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure Transactions</h3>
              <p className="text-gray-600">
                Your money is held securely until both parties are satisfied with the transaction
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Protected Payments</h3>
              <p className="text-gray-600">
                Multiple payment methods with fraud protection and buyer/seller safeguards
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Process</h3>
              <p className="text-gray-600">
                Simple step-by-step process with 24/7 customer support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Will Work
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple 4-step process to ensure safe vehicle transactions
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-[#3AB0FF] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Agree on Terms</h3>
              <p className="text-gray-600">
                Buyer and seller agree on price and conditions
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#3AB0FF] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600">
                Buyer pays through our secure escrow system
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#3AB0FF] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Vehicle Transfer</h3>
              <p className="text-gray-600">
                Seller transfers vehicle to buyer
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#78D64B] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Release Funds</h3>
              <p className="text-gray-600">
                Funds are released to seller upon confirmation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notification Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Be the First to Know
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Get notified when our escrow service launches and receive early access
            </p>

            {!submitted ? (
              <form onSubmit={handleNotifyMe} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-white text-[#3AB0FF] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
                  >
                    Notify Me
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white/20 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-lg font-semibold">🎉 Thank you!</p>
                <p className="text-white/90">We'll notify you as soon as our escrow service is ready.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                When will the escrow service be available?
              </h3>
              <p className="text-gray-600">
                We're working hard to launch our escrow service in the coming months. Sign up for notifications to be the first to know when it's ready.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What fees will be charged?
              </h3>
              <p className="text-gray-600">
                We're finalizing our fee structure to ensure it's competitive and transparent. Details will be announced before launch.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Will it work for all vehicle types?
              </h3>
              <p className="text-gray-600">
                Our escrow service will support all electric vehicles, hybrids, e-scooters, and e-bikes listed on EvValley.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How secure will the transactions be?
              </h3>
              <p className="text-gray-600">
                We're implementing bank-level security measures and working with trusted financial partners to ensure maximum protection for all transactions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
