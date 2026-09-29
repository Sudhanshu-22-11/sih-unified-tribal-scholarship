// ============================================================
// JAGO AI SCHOLARSHIP ASSISTANT COMPONENT
// Tool-based deterministic AI assistant for tribal scholars
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import {
  MessageSquare, X, Send, Bot, User, Sparkles,
  Wrench, ShieldAlert, Minimize2, Maximize2, RefreshCw
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'jago';
  text: string;
  toolsUsed?: string[];
  timestamp: string;
}

const SUGGESTIONS = [
  "Where is my scholarship application?",
  "Am I eligible for Post-Matric scholarship?",
  "What documents are missing?",
  "When will I receive payment?",
  "Why is my application pending?",
  "What should I do next?"
];

export const JagoAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'jago',
      text: "Namaste! I am **JAGO**, your personal scholarship assistant under the Ministry of Tribal Affairs.\n\nI can check your live application status, verify document requirements, evaluate your eligibility across all 5 schemes, and track your DBT payments.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || loading) return;

    const userMsgId = `usr-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.askJago(query);
      if (res.success && res.data) {
        const jagoMsg: ChatMessage = {
          id: `jago-${Date.now()}`,
          sender: 'jago',
          text: res.data.response,
          toolsUsed: res.data.toolsUsed,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, jagoMsg]);
      } else {
        throw new Error('No data');
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'jago',
          text: "I am having trouble accessing the server records right now. Please verify your connection or try again shortly.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'jago',
        text: "Conversation refreshed. How may I guide you with your tribal scholarships today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#064E3B] hover:bg-[#04382A] text-white pl-4 pr-5 py-3 rounded-full shadow-2xl hover:scale-105 transition-all duration-200 border-2 border-[#F8E7C9] group"
          aria-label="Ask JAGO Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-[#F8E7C9] group-hover:rotate-6 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold tracking-wider text-[#F8E7C9] uppercase">
              Ask JAGO
            </span>
            <span className="block text-[10px] text-gray-200">
              Scholarship AI Guide
            </span>
          </div>
        </button>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className={`fixed z-50 transition-all duration-300 ${
          isMinimized
            ? 'bottom-4 right-4 w-72'
            : 'bottom-4 right-4 w-[92vw] sm:w-[420px] h-[600px] max-h-[85vh]'
        } bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden`}>
          
          {/* Header */}
          <div className="bg-[#064E3B] text-white p-3.5 flex items-center justify-between border-b border-[#F8E7C9]/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F8E7C9] text-[#064E3B] flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-wide text-[#F8E7C9]">JAGO Assistant</span>
                  <span className="text-[10px] bg-emerald-800 text-emerald-100 px-1.5 py-0.2 rounded font-medium">
                    MoTA Tools
                  </span>
                </div>
                <p className="text-[10px] text-gray-300">
                  Tribal Scholarship Guidance & Tracking
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-gray-300">
              <button
                onClick={clearChat}
                className="p-1 hover:text-white hover:bg-emerald-900 rounded transition"
                title="Clear conversation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:text-white hover:bg-emerald-900 rounded transition"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:text-white hover:bg-emerald-900 rounded transition"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Architecture & Truth Notice */}
              <div className="bg-[#F8E7C9]/40 border-b border-[#F8E7C9] px-3 py-1.5 flex items-center gap-2 text-[10px] text-[#064E3B]">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-[#064E3B]" />
                <span className="leading-tight">
                  Deterministic tool-based engine: Pulls factual records from local & adapter systems.
                </span>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#FAFBFB] text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-end gap-1.5 max-w-[88%]">
                      {m.sender === 'jago' && (
                        <div className="w-6 h-6 rounded-full bg-[#064E3B] text-[#F8E7C9] flex items-center justify-center shrink-0 mb-1">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                          m.sender === 'user'
                            ? 'bg-[#064E3B] text-white rounded-br-none shadow-sm'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                        }`}
                      >
                        {m.text}

                        {/* Tool execution badge if JAGO called backend APIs */}
                        {m.toolsUsed && m.toolsUsed.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-gray-100 text-[10px] text-gray-500">
                            <span className="font-semibold text-[#064E3B] flex items-center gap-1 mb-1">
                              <Wrench className="w-3 h-3 text-emerald-600" />
                              Backend Tools Executed:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {m.toolsUsed.map(tool => (
                                <span
                                  key={tool}
                                  className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-mono text-[9px] border border-gray-200"
                                >
                                  {tool}()
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {m.sender === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-[#F8E7C9] text-[#064E3B] flex items-center justify-center shrink-0 mb-1">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-gray-400 mt-1 px-1">{m.timestamp}</span>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-gray-500 text-xs p-2 bg-white rounded-lg border border-gray-100 max-w-[200px]">
                    <Sparkles className="w-3.5 h-3.5 text-[#064E3B] animate-spin" />
                    <span>JAGO is querying records...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Clickable Quick Suggestions */}
              <div className="p-2 bg-white border-t border-gray-100 overflow-x-auto flex gap-1.5 no-scrollbar">
                {SUGGESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(item)}
                    className="whitespace-nowrap bg-emerald-50 hover:bg-[#F8E7C9] text-[#064E3B] hover:text-[#064E3B] text-[11px] px-2.5 py-1 rounded-full border border-emerald-200/80 transition-all font-medium shrink-0"
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-2.5 bg-white border-t border-gray-200 flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about eligibility, documents, status..."
                  className="flex-1 text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#064E3B] focus:border-[#064E3B]"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="bg-[#064E3B] hover:bg-[#04382A] disabled:opacity-50 text-white p-2.5 rounded-xl transition shadow-sm"
                  aria-label="Send Message"
                >
                  <Send className="w-4 h-4 text-[#F8E7C9]" />
                </button>
              </div>

              {/* Mandatory Government Disclaimer */}
              <div className="bg-gray-50 px-3 py-1 border-t border-gray-100 text-[9px] text-gray-500 text-center">
                JAGO provides guidance based on available system information. Final decisions are made through official scholarship processes.
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
