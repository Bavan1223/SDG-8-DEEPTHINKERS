/* ============================================================
   AgriAgent – Speech Service
   Web Speech API wrapper for voice input/output
   ============================================================ */

/** Check if browser supports speech recognition */
export function isSpeechRecognitionSupported(): boolean {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

/** Check if browser supports speech synthesis */
export function isSpeechSynthesisSupported(): boolean {
  return 'speechSynthesis' in window;
}

/** Map app language codes to BCP-47 locales for speech APIs */
const LANG_LOCALE_MAP: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  pa: 'pa-IN',
  gu: 'gu-IN',
  or: 'or-IN',
};

/**
 * Start voice recognition and return the transcript.
 * @param lang  App language code (e.g. 'hi')
 * @returns     Recognised text string
 */
export function startSpeechRecognition(lang = 'en'): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isSpeechRecognitionSupported()) {
      reject(new Error('Speech recognition not supported in this browser.'));
      return;
    }

    // Use prefixed version for older Chrome
    const SpeechRecognitionAPI =
      (window as typeof window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ??
      (window as typeof window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      reject(new Error('SpeechRecognition API unavailable'));
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang             = LANG_LOCALE_MAP[lang] ?? 'en-IN';
    recognition.interimResults   = false;
    recognition.maxAlternatives  = 1;
    recognition.continuous       = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      reject(new Error(event.error));
    };

    recognition.start();
  });
}

/**
 * Speak text aloud using the Web Speech API.
 * @param text  Text to synthesise
 * @param lang  App language code
 */
export function speakText(text: string, lang = 'en'): void {
  if (!isSpeechSynthesisSupported()) return;

  // Cancel any ongoing speech first
  window.speechSynthesis.cancel();

  const utterance  = new SpeechSynthesisUtterance(text);
  utterance.lang   = LANG_LOCALE_MAP[lang] ?? 'en-IN';
  utterance.rate   = 0.95;
  utterance.pitch  = 1;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
}

/** Stop any ongoing speech */
export function stopSpeech(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}
