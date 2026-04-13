/* ============================================================
   AgriAgent – VoiceAssistant Component
   Floating microphone button for voice input
   ============================================================ */

import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { startSpeechRecognition, speakText, isSpeechRecognitionSupported } from '../../services/speech';

interface VoiceAssistantProps {
  onTranscript: (text: string) => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onTranscript }) => {
  const { language }           = useLanguage();
  const [listening, setListening] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const supported = isSpeechRecognitionSupported();

  const handleToggle = async () => {
    if (listening) return;

    setError(null);
    setListening(true);

    try {
      const transcript = await startSpeechRecognition(language);
      onTranscript(transcript);
      // Speak back confirmation
      speakText(`You said: ${transcript}`, language);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Voice recognition failed';
      setError(msg);
    } finally {
      setListening(false);
    }
  };

  if (!supported) {
    return (
      <button
        disabled
        title="Voice input not supported in this browser"
        className="p-2 rounded-full bg-surface-border text-slate-500 cursor-not-allowed"
      >
        🎤
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        id="voice-assistant-btn"
        onClick={handleToggle}
        disabled={listening}
        title={listening ? 'Listening…' : 'Click to speak'}
        className={[
          'p-3 rounded-full transition-all duration-200 text-xl',
          listening
            ? 'bg-red-600 text-white animate-pulse-slow scale-110 shadow-lg shadow-red-600/40'
            : 'bg-primary-700 hover:bg-primary-600 text-white shadow-lg shadow-primary-900/30',
        ].join(' ')}
      >
        🎤
      </button>

      {listening && (
        <p className="text-xs text-red-400 animate-pulse">Listening…</p>
      )}
      {error && (
        <p className="text-xs text-red-400 max-w-[120px] text-center">{error}</p>
      )}
    </div>
  );
};
