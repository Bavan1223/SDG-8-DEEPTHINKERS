/* ============================================================
   AgriAgent – ChatBot Component
   AI-powered chatbot with multi-language support
   ============================================================ */

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../hooks/useLanguage';
import { sendChatMessage } from '../../services/api';
import { Button } from '../common/Button';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

/** Generate simple chatbot replies locally (fallback when API is offline) */
function localReply(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('crop') || m.includes('recommend')) {
    return '🌾 Based on your location and soil type, I recommend Rice or Maize this Kharif season. Would you like detailed crop insights?';
  }
  if (m.includes('water') || m.includes('irrigat')) {
    return '💧 Current soil moisture is moderate. Irrigation is scheduled for tomorrow 6 AM for 45 minutes.';
  }
  if (m.includes('market') || m.includes('price')) {
    return '📊 Tomato prices are trending UP in your nearby Mysore market — ₹2,800/quintal. Best time to sell!';
  }
  if (m.includes('weather') || m.includes('rain')) {
    return '🌤️ Partly cloudy today, 28°C. Light rainfall (3mm) expected in 2 days. No irrigation needed tomorrow.';
  }
  if (m.includes('alert') || m.includes('flood') || m.includes('drought')) {
    return '🚨 No active disaster alerts for your district. Stay prepared — monitor the Alerts page for updates.';
  }
  return '🌱 I can help with crop recommendations, weather updates, market prices, irrigation planning, and disaster alerts. What would you like to know?';
}

export const ChatBot: React.FC<{ onClose?: () => void; initialMessage?: string }> = ({ onClose, initialMessage }) => {
  const { t }                     = useTranslation();
  const { language, location }    = useLanguage();
  const [messages, setMessages]   = useState<Message[]>([
    { id: '0', role: 'bot', text: t('chatbot.greeting'), timestamp: new Date() },
  ]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const bottomRef                 = useRef<HTMLDivElement>(null);
  const inputRef                  = useRef<HTMLInputElement>(null);
  const initialMessageProcessed   = useRef<string | null>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    if (!overrideText) setInput('');
    setLoading(true);

    try {
      const reply = await sendChatMessage(text, language, location);
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'bot', text: reply, timestamp: new Date() }]);
    } catch {
      // Fallback to local replies when API is offline
      const fallback = localReply(text);
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'bot', text: fallback, timestamp: new Date() }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // Process voice input automatically if opened via the microphone button
  useEffect(() => {
    if (initialMessage && initialMessageProcessed.current !== initialMessage) {
      initialMessageProcessed.current = initialMessage;
      sendMessage(initialMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <div>
            <p className="text-sm font-semibold text-white">{t('chatbot.title')}</p>
            <p className="text-xs text-primary-400">● Online</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">×</button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={[
                'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                msg.role === 'user'
                  ? 'bg-primary-700 text-white rounded-br-sm'
                  : 'bg-surface-border text-slate-200 rounded-bl-sm',
              ].join(' ')}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface-border rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 p-3 border-t border-surface-border flex-shrink-0">
        <input
          ref={inputRef}
          id="chatbot-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={t('chatbot.placeholder')}
          className="flex-1 bg-surface-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary-500/30"
        />
        <Button
          id="chatbot-send-btn"
          onClick={() => sendMessage()}
          loading={loading}
          size="sm"
          icon={<span>➤</span>}
        >
          {t('chatbot.send')}
        </Button>
      </div>
    </div>
  );
};
