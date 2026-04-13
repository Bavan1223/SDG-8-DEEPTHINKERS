/* ============================================================
   AgriAgent – App.tsx
   Root component: layout shell with Navbar + Sidebar + content
   ============================================================ */

import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AppRouter } from './router/AppRouter';
import { ChatBot } from './components/ai/ChatBot';
import { VoiceAssistant } from './components/ai/VoiceAssistant';

const App: React.FC = () => {
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [chatOpen,     setChatOpen]     = useState(false);
  const [voiceInput,   setVoiceInput]   = useState('');

  // When voice input is received, open chatbot with the transcript
  const handleVoiceTranscript = (text: string) => {
    setVoiceInput(text);
    setChatOpen(true);
    // Clear after a tick so ChatBot can pick it up
    setTimeout(() => setVoiceInput(''), 100);
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          {/* ── Navigation ─────────────────────────────────── */}
          <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* ── Main content area ──────────────────────────── */}
          <main className="ml-0 md:ml-64 pt-16 min-h-screen">
            <AppRouter />
          </main>

          {/* ── Floating Chat Button ────────────────────────── */}
          {!chatOpen && (
            <button
              id="open-chat-btn"
              onClick={() => setChatOpen(true)}
              className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full
                         bg-primary-600 hover:bg-primary-500 text-white text-2xl
                         shadow-2xl shadow-primary-900/50 transition-all duration-200
                         hover:scale-110 active:scale-95 flex items-center justify-center"
              aria-label="Open AgriBot"
            >
              🤖
            </button>
          )}

          {/* ── Floating Voice button ────────────────────────── */}
          {!chatOpen && (
            <div className="fixed bottom-6 right-24 z-50">
              <VoiceAssistant onTranscript={handleVoiceTranscript} />
            </div>
          )}

          {/* ── Chat panel (slide-up) ────────────────────────── */}
          {chatOpen && (
            <div
              className="fixed bottom-4 right-4 z-50 w-[360px] h-[520px] glass-card
                         shadow-2xl animate-slide-up flex flex-col overflow-hidden"
            >
              <ChatBot
                onClose={() => setChatOpen(false)}
                initialMessage={voiceInput || undefined}
              />
            </div>
          )}
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
