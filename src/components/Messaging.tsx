"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, RefreshCw } from 'lucide-react';
import { VehicleMessage } from '@/lib/database';

interface MessagingProps {
  vehicleId: string;
  userId: string;
  otherUserId: string;
  vehicleTitle: string;
  otherUserName: string;
}

export default function Messaging({ vehicleId, userId, otherUserId, vehicleTitle, otherUserName }: MessagingProps) {
  console.log('🎯 Messaging component MOUNTED!', { vehicleId, userId, otherUserId });

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<VehicleMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.log('📊 Messaging component state:', {
    messagesCount: messages.length,
    loading,
    sending,
    error
  });

  const formatTime = (timestamp: string) => {
    try {
      // Parse timestamp safely without creating Date object in render
      const timeStr = timestamp || '';
      if (!timeStr) return 'Invalid time';
      
      // Simple time formatting without Date object
      const timeMatch = timeStr.match(/(\d{2}):(\d{2}):(\d{2})/);
      if (timeMatch) {
        const [, hours, minutes] = timeMatch;
        return `${hours}:${minutes}`;
      }
      
      // Fallback to simple string manipulation
      const dateStr = timeStr.split('T')[1] || timeStr;
      const timePart = dateStr.split('.')[0];
      return timePart || 'Invalid time';
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid time';
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching messages...');

      const response = await fetch(
        `/api/messages?vehicleId=${vehicleId}&userId=${userId}&otherUserId=${otherUserId}`
      );
      const data = await response.json();

      console.log('📨 API Response:', data);

      if (response.ok && data.messages) {
        console.log('✅ Messages fetched successfully:', data.messages.length);
        setMessages(data.messages);
      } else {
        console.error('❌ Failed to fetch messages:', data.error);
        setError(data.error || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    setSending(true);
    setError(null);

    try {
      console.log('📤 Sending message:', content);

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: userId,
          receiver_id: otherUserId,
          vehicle_id: vehicleId,
          content: content.trim()
        })
      });

      const data = await response.json();
      console.log('📤 Message API response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      console.log('✅ Message sent successfully!');

      // Refresh messages after sending
      setTimeout(() => {
        console.log('🔄 Refreshing messages after send...');
        fetchMessages();
      }, 500);

    } catch (error) {
      console.error('❌ Error sending message:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    console.log('📤 Submitting message:', message);
    await sendMessage(message);
    setMessage('');
  };

  // Manual refresh function
  const handleRefresh = async () => {
    console.log('🔄 Manual refresh requested');
    await fetchMessages();
  };

  // Initial fetch
  useEffect(() => {
    console.log('🔄 Initial fetch...');
    fetchMessages();
  }, [vehicleId, userId, otherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Chat about {vehicleTitle} with {otherUserName}
        </h3>
        <button
          onClick={handleRefresh}
          className="p-2 text-gray-500 hover:text-green-600 transition-colors"
          title="Refresh messages"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No messages yet. Start the conversation!</p>
            <p className="text-sm mt-2">Click the refresh button above to check for new messages.</p>
          </div>
        ) : (
          messages.map((msg) => {
            // Check if this message was sent by the current user
            // We'll use a simple approach: if sender_id is a UUID (Supabase ID), 
            // we need to check if it matches the current user's Supabase ID
            // For now, let's assume all messages are from the other user for testing
            const isOwnMessage = false; // Temporarily set to false to test
            
            console.log('Rendering message:', {
              messageId: msg.id,
              messageSenderId: msg.sender_id,
              currentUserId: userId,
              isOwnMessage
            });
            
            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwnMessage
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <div className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    {formatTime(msg.created_at)}
                    {!msg.is_read && isOwnMessage && (
                      <span className="ml-2">•</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border-t">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!message.trim() || sending}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
} 