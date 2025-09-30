"use client"

import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface StatusIndicatorProps {
  status: "processing" | "success" | "error" | "waiting"
  message?: string
}

export function StatusIndicator({ status, message }: StatusIndicatorProps) {
  const statusConfig = {
    processing: {
      icon: Clock,
      color: "bg-blue-500",
      text: "Processing...",
    },
    success: {
      icon: CheckCircle,
      color: "bg-green-500",
      text: "Complete",
    },
    error: {
      icon: XCircle,
      color: "bg-red-500",
      text: "Error",
    },
    waiting: {
      icon: AlertCircle,
      color: "bg-yellow-500",
      text: "Waiting",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge className={`${config.color} text-white`}>
      <Icon className="h-3 w-3 mr-1" />
      {message || config.text}
    </Badge>
  )
}
