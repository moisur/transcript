'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ClipboardCopyIcon } from "@radix-ui/react-icons"

export default function Home() {
  const [url, setUrl] = useState('')
  const [language, setLanguage] = useState('fr')
  const [transcript, setTranscript] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, language }),
      })
      const data = await response.json()
      if (response.ok) {
        setTranscript(data.transcript)
      } else {
        throw new Error(data.error || 'Failed to fetch transcript')
      }
    } catch (error) {
      console.error('Error fetching transcript:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch transcript. Please try again.",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript)
      .then(() => toast({ title: "Copied!", description: "Transcript copied to clipboard." }))
      .catch(() => toast({ title: "Failed to copy", description: "Please try again.", variant: "destructive" }))
  }

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">YouTube Transcript Fetcher</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />
        </div>
        <div className="flex space-x-4">
          <Button
            type="button"
            variant={language === 'fr' ? 'default' : 'outline'}
            onClick={() => setLanguage('fr')}
          >
            French
          </Button>
          <Button
            type="button"
            variant={language === 'en' ? 'default' : 'outline'}
            onClick={() => setLanguage('en')}
          >
            English
          </Button>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Fetching...' : 'Get Transcript'}
        </Button>
      </form>
      {transcript && (
        <div className="mt-4">
          <Textarea
            value={transcript}
            readOnly
            className="w-full h-64 mt-2"
          />
          <Button onClick={copyToClipboard} className="mt-2">
            <ClipboardCopyIcon className="mr-2 h-4 w-4" /> Copy Transcript
          </Button>
        </div>
      )}
    </main>
  )
}