"use client";

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';

interface SimpleMessagingProps {
  vehicleId: string;
  userId: string;
  otherUserId: string;
}

export default function SimpleMessaging({ vehicleId, userId, otherUserId }: SimpleMessagingProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching messages...');
      
      const response = await fetch(
        `/api/messages?vehicleId=${vehicleId}&userId=${userId}&otherUserId=${otherUserId}`
      );
      const data = await response.json();
      
      console.log('📨 API Response:', data);
      
      if (response.ok && data.messages) {
        console.log('✅ Messages fetched:', data.messages.length);
        setMessages(data.messages);
      } else {
        console.error('❌ Failed to fetch messages:', data.error);
      }
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      console.log('📤 Sending message:', message);
      
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: userId,
          receiver_id: otherUserId,
          vehicle_id: vehicleId,
          content: message.trim()
        })
      });
      
      const data = await response.json();
      console.log('📤 Send response:', data);
      
      if (response.ok) {
        console.log('✅ Message sent!');
        setMessage('');
        // Refresh messages
        setTimeout(fetchMessages, 500);
      }
    } catch (error) {
      console.error('❌ Send error:', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    console.log('🎯 SimpleMessaging mounted with:', { vehicleId, userId, otherUserId });
    fetchMessages();
  }, [vehicleId, userId, otherUserId]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Simple Messaging Test</h3>
      
      <div className="mb-4">
        <button 
          onClick={fetchMessages}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? 'Loading...' : 'Refresh Messages'}
        </button>
      </div>
      
      <div className="mb-4">
        <p>Messages count: {messages.length}</p>
        {messages.map((msg, index) => (
          <div key={msg.id || index} className="p-2 bg-gray-100 mb-2 rounded">
            <p><strong>Content:</strong> {msg.content}</p>
            <p><strong>Sender:</strong> {msg.sender_id}</p>
            <p><strong>Time:</strong> {msg.created_at}</p>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
          className="flex-1 px-3 py-2 border rounded"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 