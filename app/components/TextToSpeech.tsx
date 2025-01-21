'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX } from 'lucide-react'

interface TextToSpeechProps {
  text: string
}

export function TextToSpeech({ text }: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
      }
    }
  }, [isSpeaking])

  const speak = () => {
    setError(null)
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = (event) => {
        setError('Error occurred in speech synthesis: ' + event.error)
        setIsSpeaking(false)
      }
      window.speechSynthesis.speak(utterance)
    } else {
      setError('Text-to-speech is not supported in this browser.')
    }
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  return (
    <div>
      <Button
        onClick={isSpeaking ? stop : speak}
        variant="outline"
        size="icon"
      >
        {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}

