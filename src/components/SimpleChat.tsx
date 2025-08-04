"use client";

import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/database';

interface SimpleChatProps {
  vehicleId: string;
  currentUserEmail: string;
  sellerEmail: string;
  isCurrentUserSeller: boolean;
}

interface Message {
  id: string;
  vehicle_id: string;
  sender_email: string;
  receiver_email: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender_name?: string;
  receiver_name?: string;
}

interface Conversation {
  email: string;
  name: string;
  unreadCount: number;
}

export default function SimpleChat({ vehicleId, currentUserEmail, sellerEmail, isCurrentUserSeller }: SimpleChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get unique conversations for seller with unread counts
  const getConversations = () => {
    if (!isCurrentUserSeller) return [];
    
    const conversations = new Map<string, { name: string; unreadCount: number }>();
    
    // Group messages by sender email
    const messagesBySender = new Map<string, any[]>();
    messages.forEach(msg => {
      if (msg.sender_email !== sellerEmail) {
        const email = msg.sender_email;
        if (!messagesBySender.has(email)) {
          messagesBySender.set(email, []);
        }
        messagesBySender.get(email)!.push(msg);
      }
    });
    
    // Process each sender's messages
    messagesBySender.forEach((senderMessages, email) => {
      // Get the most recent message to get the correct name
      const mostRecentMessage = senderMessages.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];
      
      const name = mostRecentMessage.sender_name || email.split('@')[0];
      const unreadCount = senderMessages.filter(msg => 
        msg.receiver_email === sellerEmail && !msg.is_read
      ).length;
      
      conversations.set(email, { name, unreadCount });
    });
    
    return Array.from(conversations.entries()).map(([email, data]) => ({ 
      email, 
      name: data.name, 
      unreadCount: data.unreadCount 
    }));
  };

  // Get conversation name
  const getConversationName = (email: string) => {
    const message = messages.find(msg => msg.sender_email === email || msg.receiver_email === email);
    if (message) {
      return message.sender_email === email ? message.sender_name : message.receiver_name;
    }
    return email.split('@')[0]; // Fallback to email username
  };

  // Filter messages for current conversation
  const getFilteredMessages = () => {
    if (isCurrentUserSeller && selectedConversation) {
      // Seller sees conversation with specific buyer
      return messages.filter(msg => 
        (msg.sender_email === selectedConversation && msg.receiver_email === sellerEmail) ||
        (msg.sender_email === sellerEmail && msg.receiver_email === selectedConversation)
      );
    } else if (!isCurrentUserSeller) {
      // Buyer sees conversation with seller
      return messages.filter(msg => 
        (msg.sender_email === currentUserEmail && msg.receiver_email === sellerEmail) ||
        (msg.sender_email === sellerEmail && msg.receiver_email === currentUserEmail)
      );
    }
    return messages;
  };

  // Handle typing status
  const updateTypingStatus = async (isTyping: boolean) => {
    try {
      console.log('⌨️ Updating typing status:', { vehicleId, userEmail: currentUserEmail, isTyping });
      
      // For now, just log the typing status
      // We'll implement database later
      console.log('⌨️ Typing status would be updated:', { isTyping });
    } catch (error) {
      console.error('❌ Error updating typing status:', error);
    }
  };

  // Handle input change with typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    // Update typing status
    updateTypingStatus(true);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(false);
    }, 2000); // Stop typing indicator after 2 seconds of no input
  };

  // Set up realtime subscription for messages
  useEffect(() => {
    console.log('🔄 Setting up realtime subscription for vehicle:', vehicleId);
    
    const channel = supabase
      .channel(`messages-${vehicleId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'simple_messages',
          filter: `vehicle_id=eq.${vehicleId}`
        },
        (payload) => {
          console.log('📨 Realtime message received:', payload);
          
          if (payload.eventType === 'INSERT') {
            // New message received
            const newMessage: Message = {
              id: payload.new.id,
              vehicle_id: payload.new.vehicle_id,
              sender_email: payload.new.sender_email,
              receiver_email: payload.new.receiver_email,
              content: payload.new.content,
              is_read: payload.new.is_read,
              created_at: payload.new.created_at?.toString() || new Date().toISOString(),
              updated_at: payload.new.updated_at?.toString() || new Date().toISOString(),
              sender_name: payload.new.sender_name,
              receiver_name: payload.new.receiver_name
            };
            
            setMessages(prev => {
              // Check if message already exists
              const exists = prev.some(msg => msg.id === newMessage.id);
              if (!exists) {
                return [...prev, newMessage];
              }
              return prev;
            });
          } else if (payload.eventType === 'UPDATE') {
            // Message updated (e.g., marked as read)
            const updatedMessage: Message = {
              id: payload.new.id,
              vehicle_id: payload.new.vehicle_id,
              sender_email: payload.new.sender_email,
              receiver_email: payload.new.receiver_email,
              content: payload.new.content,
              is_read: payload.new.is_read,
              created_at: payload.new.created_at?.toString() || new Date().toISOString(),
              updated_at: payload.new.updated_at?.toString() || new Date().toISOString(),
              sender_name: payload.new.sender_name,
              receiver_name: payload.new.receiver_name
            };
            
            setMessages(prev => 
              prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
            );
          }
        }
      )
      .subscribe();

    return () => {
      console.log('🔄 Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [vehicleId]);

  // Set up realtime subscription for typing status
  useEffect(() => {
    console.log('⌨️ Setting up typing status subscription for vehicle:', vehicleId);
    
    const channel = supabase
      .channel(`typing-${vehicleId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_status',
          filter: `vehicle_id=eq.${vehicleId}`
        },
        (payload) => {
          console.log('⌨️ Typing status received:', payload);
          
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const typingStatus = payload.new;
            
            if (typingStatus.user_email !== currentUserEmail) {
              if (typingStatus.is_typing) {
                setTypingUsers(prev => {
                  if (!prev.includes(typingStatus.user_email)) {
                    return [...prev, typingStatus.user_email];
                  }
                  return prev;
                });
              } else {
                setTypingUsers(prev => 
                  prev.filter(email => email !== typingStatus.user_email)
                );
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      console.log('⌨️ Cleaning up typing status subscription');
      supabase.removeChannel(channel);
    };
  }, [vehicleId, currentUserEmail]);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversation && isCurrentUserSeller) {
      // Mark messages from selected conversation as read
      const unreadMessages = messages.filter(msg => 
        msg.sender_email === selectedConversation && 
        msg.receiver_email === sellerEmail && 
        !msg.is_read
      );
      
      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map(msg => msg.id);
        
        // Update messages locally first for immediate UI update
        setMessages(prev => 
          prev.map(msg => 
            messageIds.includes(msg.id) ? { ...msg, is_read: true } : msg
          )
        );
        
        // Then update in database
        fetch('/api/simple-messages/mark-read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messageIds })
        }).catch(error => {
          console.error('❌ Error marking messages as read:', error);
        });
      }
    }
  }, [selectedConversation, messages, isCurrentUserSeller, sellerEmail]);

  // Simple fetch messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching messages for vehicle:', vehicleId);
      console.log('👤 Current user:', currentUserEmail, 'Seller:', sellerEmail, 'Is seller:', isCurrentUserSeller);
      
      const response = await fetch(`/api/simple-messages?vehicleId=${vehicleId}&currentUserEmail=${currentUserEmail}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Messages fetched:', data.messages?.length || 0);
        setMessages(data.messages || []);
      } else {
        console.error('❌ Failed to fetch messages:', data.error);
      }
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simple send message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const receiverEmail = isCurrentUserSeller ? selectedConversation : sellerEmail;
    if (!receiverEmail) return;
    
    try {
      console.log('�� Sending message:', newMessage);
      console.log('👤 From:', currentUserEmail, 'To:', receiverEmail);
      
      // Stop typing indicator
      updateTypingStatus(false);
      
      const response = await fetch('/api/simple-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId,
          senderEmail: currentUserEmail,
          receiverEmail: receiverEmail,
          content: newMessage.trim()
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Message sent successfully!');
        setNewMessage('');
        // No need to refresh - realtime will handle it
      } else {
        console.error('❌ Failed to send message:', data.error);
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  // Initial fetch
  useEffect(() => {
    console.log('🎯 SimpleChat mounted with:', { vehicleId, currentUserEmail, sellerEmail, isCurrentUserSeller });
    fetchMessages();
  }, [vehicleId]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const conversations = getConversations();
  const filteredMessages = getFilteredMessages();

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {isCurrentUserSeller ? 'Messages about your vehicle' : 'Contact seller about this vehicle'}
        </h3>
        <button
          onClick={fetchMessages}
          className="p-2 text-gray-500 hover:text-green-600 transition-colors"
          title="Refresh messages"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Seller conversation selector */}
      {isCurrentUserSeller && conversations.length > 0 && (
        <div className="p-4 border-b bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Conversations:</h4>
          <div className="flex flex-wrap gap-2">
            {conversations.map(({ email, name, unreadCount }) => (
              <button
                key={email}
                onClick={() => setSelectedConversation(email)}
                className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${
                  selectedConversation === email
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {name}
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>
              {isCurrentUserSeller 
                ? selectedConversation 
                  ? `No messages with ${getConversationName(selectedConversation)} yet.`
                  : 'Select a conversation to view messages.'
                : 'Start the conversation with the seller!'
              }
            </p>
          </div>
        ) : (
          <>
            {filteredMessages.map((msg, index) => {
              const isOwnMessage = msg.sender_email === currentUserEmail;
              
              return (
                <div
                  key={msg.id || index}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isOwnMessage
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm font-medium">{msg.content}</p>
                    <div className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-green-100' : 'text-gray-600'
                    }`}>
                      {msg.sender_name} • {new Date(msg.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Typing indicator - temporarily disabled */}
            {typingUsers.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-600 ml-2">
                      {typingUsers.length === 1 
                        ? `${typingUsers[0].split('@')[0]} is typing...`
                        : 'Someone is typing...'
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            id="message-input"
            name="message"
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder={
              isCurrentUserSeller 
                ? selectedConversation 
                  ? `Reply to ${getConversationName(selectedConversation)}...`
                  : "Select a conversation to reply..."
                : "Ask seller about this vehicle..."
            }
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 font-medium"
            disabled={loading || (isCurrentUserSeller && !selectedConversation)}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || loading || (isCurrentUserSeller && !selectedConversation)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
} 