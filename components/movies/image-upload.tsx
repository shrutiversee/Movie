"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"
import { apiClient } from "@/lib/api-client"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove: () => void
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (!file) return

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, or WebP)")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    setIsUploading(true)
    try {
      const response = await apiClient.uploadImage(file)
      onChange(response.url)
    } catch (error) {
      console.error("Upload error:", error)
      alert(error instanceof Error ? error.message : "Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) handleUpload(file)
  }

  if (value) {
    return (
      <div className="relative">
        <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border-2 border-gray-300 shadow-md">
          <Image
            src={value || "/placeholder.svg"}
            alt="Movie poster"
            fill
            className="object-cover"
            style={{
              WebkitMaskImage: "-webkit-radial-gradient(white, black)", // Safari rounded fix
            }}
          />
          <Button
            type="button"
            onClick={onRemove}
            variant="destructive"
            size="sm"
            className="absolute top-3 right-3 rounded-full shadow-md"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all
          ${dragActive ? "border-[#60eccb] bg-[#60eccb]/10" : "border-gray-400 hover:border-[#60eccb]"}
          ${isUploading ? "pointer-events-none opacity-50" : ""}
        `}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-full">
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#60eccb]" />
            ) : (
              <ImageIcon className="h-8 w-8 text-[#60eccb]" />
            )}
          </div>

          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {isUploading ? "Uploading..." : "Upload movie poster"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Drag & drop or click to select
            </p>
            <p className="text-xs text-gray-400">JPEG, PNG, WebP — Max 5MB</p>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            className="rounded-xl border border-[#60eccb] text-[#0f172a] dark:text-white hover:bg-[#60eccb]/20 transition"
          >
            <Upload className="h-4 w-4 mr-2 text-[#60eccb]" />
            Choose File
          </Button>
        </div>
      </div>
    </div>
  )
}
