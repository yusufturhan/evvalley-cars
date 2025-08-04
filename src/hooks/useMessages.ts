"use client";

import { useState, useEffect, useCallback } from 'react';
import { VehicleMessage } from '@/lib/database';

interface UseMessagesProps {
  vehicleId: string;
  userId: string; // Clerk user ID
  otherUserId: string; // Supabase UUID
}

export function useMessages({ vehicleId, userId, otherUserId }: UseMessagesProps) {
  console.log('🎯 useMessages hook CALLED!', { vehicleId, userId, otherUserId });

  const [messages, setMessages] = useState<VehicleMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple fetch function
  const fetchMessages = useCallback(async () => {
    if (!vehicleId || !userId || !otherUserId) return;

    try {
      console.log('🔄 Fetching messages...');
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/messages?vehicleId=${vehicleId}&userId=${userId}&otherUserId=${otherUserId}`
      );
      const data = await response.json();

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
  }, [vehicleId, userId, otherUserId]);

  // Initial fetch
  useEffect(() => {
    console.log('🔄 useMessages: Initial fetch...');
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = useCallback(async (content: string) => {
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
  }, [vehicleId, userId, otherUserId, fetchMessages]);

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      await fetch(`/api/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: true })
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }, []);

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    markAsRead,
    refreshMessages: fetchMessages
  };
} 