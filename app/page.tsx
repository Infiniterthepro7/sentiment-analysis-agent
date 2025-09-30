"use client"

import type React from "react"

import { useState } from "react"
import { Upload, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AudioPlayer } from "@/components/audio-player"
import { EmotionChart } from "@/components/emotion-chart"
import { TranscriptionView } from "@/components/transcription-view"
import { ThemeToggle } from "@/components/theme-toggle"

interface ProcessedRecording {
  id: string
  filename: string
  duration: number
  transcription: {
    client: Array<{ text: string; timestamp: number; emotion: string }>
    official: Array<{ text: string; timestamp: number; emotion: string }>
  }
  emotionAnalysis: {
    happy: number
    angry: number
    frustrated: number
    confused: number
    sad: number
    surprised: number
    neutral: number
    hopeful: number
    bored: number
  }
  processingTime: number
  audioUrl: string
}

export default function SentimentAnalysisAgent() {
  const [recordings, setRecordings] = useState<ProcessedRecording[]>([])
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)
  const [selectedRecording, setSelectedRecording] = useState<ProcessedRecording | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setUploading(true)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setUploadProgress((i / files.length) * 100)

      // Validate file size (25MB limit)
      if (file.size > 25 * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Maximum size is 25MB.`)
        continue
      }

      // Validate file type
      const allowedTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/m4a", "audio/mp4", "audio/webm"]
      const isValidType = allowedTypes.includes(file.type) || file.name.match(/\.(mp3|wav|m4a|mp4|webm)$/i)

      if (!isValidType) {
        alert(`File "${file.name}" is not a supported audio format. Please use MP3, WAV, M4A, MP4, or WebM files.`)
        continue
      }

      const formData = new FormData()
      formData.append("audio", file)

      try {
        setProcessing(file.name)
        const response = await fetch("/api/process-audio", {
          method: "POST",
          body: formData,
        })

        const result = await response.json()

        if (response.ok) {
          setRecordings((prev) => [...prev, result])
        } else {
          console.error("Processing error:", result.error)
          alert(`Error processing "${file.name}": ${result.error}`)
        }
      } catch (error) {
        console.error("Network error:", error)
        alert(`Network error processing "${file.name}". Please check your connection and try again.`)
      }
    }

    setUploading(false)
    setProcessing(null)
    setUploadProgress(0)
    event.target.value = ""
  }

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

  const getDominantEmotion = (emotions: ProcessedRecording["emotionAnalysis"]) => {
    return Object.entries(emotions).reduce((a, b) => (emotions[a[0]] > emotions[b[0]] ? a : b))[0]
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">AI Sentiment Analysis Agent</h1>
            <p className="text-muted-foreground">
              Upload call recordings for automatic transcription and emotion analysis
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Call Recordings
            </CardTitle>
            <CardDescription>
              Support for MP3, WAV, M4A files. Processing time: {"<50s"} for 5-minute recordings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                accept="audio/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="audio-upload"
              />
              <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center gap-4">
                <Upload className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">
                    {uploading ? "Processing recordings..." : "Click to upload audio files"}
                  </p>
                  <p className="text-sm text-muted-foreground">Drag and drop or click to select multiple files</p>
                </div>
              </label>
            </div>

            {uploading && (
              <div className="mt-4 space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                {processing && <p className="text-sm text-muted-foreground">Processing: {processing}</p>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recordings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {recordings.map((recording) => {
            const dominantEmotion = getDominantEmotion(recording.emotionAnalysis)
            return (
              <Card
                key={recording.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedRecording(recording)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg truncate">{recording.filename}</CardTitle>
                  <CardDescription>
                    Duration: {Math.round(recording.duration)}s • Processed in: {recording.processingTime}s
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getEmotionColor(dominantEmotion)} text-white`}>{dominantEmotion}</Badge>
                      <span className="text-sm text-muted-foreground">Dominant emotion</span>
                    </div>

                    <AudioPlayer audioUrl={recording.audioUrl} />

                    <div className="flex justify-between items-center pt-2">
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analysis
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {recording.transcription.client.length + recording.transcription.official.length} segments
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Detailed View Modal */}
        {selectedRecording && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold">{selectedRecording.filename}</h2>
                <Button variant="outline" onClick={() => setSelectedRecording(null)}>
                  Close
                </Button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Emotion Analysis</h3>
                    <EmotionChart emotions={selectedRecording.emotionAnalysis} />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Transcription</h3>
                    <TranscriptionView transcription={selectedRecording.transcription} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {recordings.length === 0 && !uploading && (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No recordings yet</h3>
            <p className="text-muted-foreground">
              Upload your first call recording to get started with sentiment analysis
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
