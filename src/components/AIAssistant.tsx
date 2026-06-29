/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Loader2, 
  User, 
  Bot, 
  MessageSquare,
  HelpCircle,
  HelpCircle as ShieldAlert,
  MapPin
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

interface AIAssistantProps {
  onClose: () => void;
}

export default function AIAssistant({ onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am your AI Civic Guardian Assistant. I can help you report local road damage, water leaks, or unlit streetlights, explain Greenwood's current health score metrics, and look up existing ticket updates. What can I do for you today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick suggestions for users
  const suggestions = [
    "Check status of ticket #comp_1",
    "How does AI calculate Ward Health Score?",
    "How can I report a water leak?",
    "What department handles illegal waste?"
  ];

  // Auto scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Map history to server schema
      const chatHistory = messages.map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          chatHistory
        })
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: Message = {
          id: `msg_assistant_${Date.now()}`,
          sender: 'assistant',
          text: data.text || "I apologize, I didn't catch that. Could you please rephrase?",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error('Chat API returned an error');
      }
    } catch (err) {
      console.error('Error during chatbot response:', err);
      const errorMsg: Message = {
        id: `msg_error_${Date.now()}`,
        sender: 'assistant',
        text: "I am having trouble connecting to the smart municipal server right now. Please ensure your internet connection is active, or try manually filing a report.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  return (
    <div 
      className="fixed bottom-24 right-6 z-50 bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-sm sm:max-w-md h-[550px] overflow-hidden flex flex-col transition-all animate-in slide-in-from-bottom-5 duration-200" 
      id="ai_assistant_panel"
    >
      
      {/* Header Panel */}
      <div className="bg-emerald-950 text-white p-4 flex items-center justify-between border-b border-emerald-800" id="assistant_header">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm">Civic AI Guardian</h3>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mr-1 animate-ping"></span>
              Gemini-powered municipal deputy
            </span>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          title="Minimize Chat"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Messages Scrolling Grid */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" id="assistant_messages_list">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div 
              key={msg.id} 
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
              id={`chat_bubble_${msg.id}`}
            >
              {/* Avatar */}
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                isUser 
                  ? 'bg-slate-900 border-slate-950 text-white' 
                  : 'bg-emerald-50 border-emerald-200/50 text-emerald-700'
              }`}>
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message text card */}
              <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                isUser 
                  ? 'bg-slate-900 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }`}>
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className={`text-[9px] block mt-1 text-right ${isUser ? 'text-slate-400' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading typing state */}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-50 border border-emerald-200/50 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 animate-spin" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-none p-3.5 border border-slate-100 shadow-sm flex items-center space-x-1.5">
              <span className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
              <span className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions Tray */}
      <div className="px-4 py-2 border-t border-slate-100 bg-white" id="assistant_suggestions">
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Suggested Inquiries</p>
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(s)}
              className="text-[10px] font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-800 border border-slate-200/40 px-2 py-1 rounded-lg transition text-left leading-tight cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Text Input Footer Bar */}
      <div className="p-3 bg-white border-t border-slate-100" id="assistant_input_area">
        <form onSubmit={handleFormSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type a query or ticket id..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs focus:border-emerald-600 focus:outline-none focus:bg-white transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
