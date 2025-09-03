"use client";

import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { trackNewsletterSignup } from '@/lib/analytics';

interface NewsletterSignupProps {
  campaignType?: 'seller_incentives' | 'buyer_updates' | 'general';
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  className?: string;
}

export default function NewsletterSignup({
  campaignType = 'general',
  title = "Stay Updated",
  description = "Get the latest electric vehicle deals and updates",
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  className = ""
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/email-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          campaignType,
          source: 'newsletter_signup'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Successfully subscribed!');
        setEmail('');
        // Track newsletter signup event
        trackNewsletterSignup(email);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#3AB0FF] rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
                  <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent placeholder-gray-500 text-gray-900 font-medium"
          disabled={status === 'loading'}
        />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-[#3AB0FF] text-white py-3 rounded-lg hover:bg-[#2A8FE6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {status === 'loading' ? 'Subscribing...' : buttonText}
        </button>

        {status === 'success' && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}
      </form>

      <p className="text-xs text-gray-500 mt-4 text-center">
        By subscribing, you agree to receive marketing emails from Evvalley. 
        You can unsubscribe at any time.
      </p>
    </div>
  );
}
