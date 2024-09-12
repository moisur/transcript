import { NextResponse } from 'next/server'
import { YoutubeTranscript } from 'youtube-transcript'

function extractVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[7].length === 11) ? match[7] : null
}

export async function POST(request: Request) {
  try {
    const { url, language } = await request.json()
    const videoId = extractVideoId(url)

    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: language,
    })

    const fullTranscript = transcript.map(entry => entry.text).join(' ')

    return NextResponse.json({ transcript: fullTranscript })
  } catch (error) {
    console.error('Error fetching transcript:', error)
    return NextResponse.json({ error: 'Failed to fetch transcript' }, { status: 500 })
  }
}