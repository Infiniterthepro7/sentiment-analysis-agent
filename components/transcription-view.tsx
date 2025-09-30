"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Headphones } from "lucide-react"

interface TranscriptionSegment {
  text: string
  timestamp: number
  emotion: string
}

interface TranscriptionViewProps {
  transcription: {
    client: TranscriptionSegment[]
    official: TranscriptionSegment[]
  }
}

export function TranscriptionView({ transcription }: TranscriptionViewProps) {
  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: "bg-green-500",
      angry: "bg-red-500",
      frustrated: "bg-orange-500",
      confused: "bg-purple-500",
      sad: "bg-blue-500",
      surprised: "bg-yellow-500",
      neutral: "bg-gray-500",
      hopeful: "bg-emerald-500",
      bored: "bg-slate-500",
    }
    return colors[emotion] || "bg-gray-500"
  }

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Combine and sort all segments by timestamp
  const allSegments = [
    ...transcription.client.map((seg) => ({ ...seg, speaker: "client" })),
    ...transcription.official.map((seg) => ({ ...seg, speaker: "official" })),
  ].sort((a, b) => a.timestamp - b.timestamp)

  return (
    <ScrollArea className="h-80">
      <div className="space-y-4">
        {allSegments.map((segment, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 min-w-0">
                {segment.speaker === "client" ? (
                  <User className="h-4 w-4 text-blue-500" />
                ) : (
                  <Headphones className="h-4 w-4 text-green-500" />
                )}
                <span className="text-sm font-medium">{segment.speaker === "client" ? "Client" : "Official"}</span>
                <span className="text-xs text-muted-foreground">{formatTimestamp(segment.timestamp)}</span>
              </div>
              <Badge className={`${getEmotionColor(segment.emotion)} text-white text-xs`}>{segment.emotion}</Badge>
            </div>
            <p className="mt-2 text-sm leading-relaxed">{segment.text}</p>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
