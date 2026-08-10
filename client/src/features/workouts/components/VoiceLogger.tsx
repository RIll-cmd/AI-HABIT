"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Loader2, StopCircle } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceLoggerProps {
  onParsedResult: (text: string) => void;
  isProcessing?: boolean;
}

export function VoiceLogger({ onParsedResult, isProcessing = false }: VoiceLoggerProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("");
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setTranscript(event.results[i][0].transcript);
          } else {
            interimTranscript += event.results[i][0].transcript;
            setTranscript(interimTranscript);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== 'no-speech') {
          toast.error(`Mic error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Only trigger result if we actually captured something
        if (recognitionRef.current?.finalTranscript) {
           onParsedResult(recognitionRef.current.finalTranscript);
        }
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }
    
    return () => {
        if (recognitionRef.current) {
            try { recognitionRef.current.abort(); } catch(e) {}
        }
    }
  }, [onParsedResult]);

  // Keep track of final transcript to use in onend
  useEffect(() => {
      if (recognitionRef.current) {
          recognitionRef.current.finalTranscript = transcript;
      }
  }, [transcript]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Start error", e);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Button
        variant={isListening ? "destructive" : "default"}
        className={`w-full h-12 rounded-xl transition-all shadow-lg font-bold tracking-widest ${
          isListening 
            ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/50" 
            : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"
        }`}
        onClick={toggleListening}
        disabled={isProcessing || !isSupported}
      >
        {!isSupported ? (
          <><Mic className="w-5 h-5 mr-2 opacity-50" /> UNSUPPORTED BROWSER</>
        ) : isProcessing ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> PARSING...</>
        ) : isListening ? (
          <><StopCircle className="w-5 h-5 mr-2" /> STOP RECORDING</>
        ) : (
          <><Mic className="w-5 h-5 mr-2" /> TAP TO SPEAK</>
        )}
      </Button>

      {isListening && transcript && (
        <div className="w-full bg-slate-900/80 p-3 rounded-lg border border-indigo-500/30 text-sm font-mono text-center text-indigo-300 animate-in fade-in slide-in-from-top-2">
          "{transcript}"
        </div>
      )}
    </div>
  );
}
