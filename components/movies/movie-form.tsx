"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowLeft, Save, ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { Movie } from "@/lib/types"
import Image from "next/image"
import { ImageUpload } from "./image-upload"
import { apiClient } from "@/lib/api-client"

interface MovieFormProps {
  movie?: Movie
  isEditing?: boolean
}

export function MovieForm({ movie, isEditing = false }: MovieFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: movie?.title || "",
    publishingYear: movie?.publishingYear || new Date().getFullYear(),
    poster: movie?.poster || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    } else if (formData.title.trim().length < 2) {
      newErrors.title = "Title must be at least 2 characters long"
    }

    const currentYear = new Date().getFullYear()
    if (!formData.publishingYear) {
      newErrors.publishingYear = "Publishing year is required"
    } else if (formData.publishingYear < 1800) {
      newErrors.publishingYear = "Publishing year must be 1800 or later"
    } else if (formData.publishingYear > currentYear + 10) {
      newErrors.publishingYear = `Publishing year cannot be more than ${currentYear + 10}`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)

    try {
      const movieData = {
        title: formData.title.trim(),
        publishingYear: formData.publishingYear,
        poster: formData.poster.trim(),
      }

      if (isEditing && movie) {
        await apiClient.updateMovie(movie._id, movieData)
      } else {
        await apiClient.createMovie(movieData)
      }

      toast({
        title: "Success",
        description: `Movie ${isEditing ? "updated" : "created"} successfully.`,
      })
      router.push("/movies")
    } catch (error: any) {
      console.error("Form submission error:", error)
      toast({
        title: "Error",
        description:
          error.message ||
          `Failed to ${isEditing ? "update" : "create"} movie.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse 60% 30% at 50% 0%, rgba(34,197,94,0.2), transparent 70%), #0a0a0a",
      }}
    >
      {/* Header */}
      <div className="bg-transparent border-b border-gray-700/40 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <h1 className="text-2xl font-bold text-white">
              {isEditing ? "Edit Movie" : "Add New Movie"}
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Fields */}
          <Card className="bg-gradient-to-b from-neutral-900 to-neutral-950 border border-gray-700/30 text-white shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle>
                {isEditing ? "Update Movie Details" : "Movie Information"}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {isEditing
                  ? "Update the movie information below."
                  : "Enter the details for your new movie."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter movie title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={`text-black placeholder-gray-400 ${
                      errors.title ? "border-destructive" : ""
                    }`}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publishingYear">Publishing Year *</Label>
                  <Input
                    id="publishingYear"
                    type="number"
                    placeholder="Enter publishing year"
                    value={formData.publishingYear}
                    onChange={(e) =>
                      handleInputChange(
                        "publishingYear",
                        Number.parseInt(e.target.value) || 0
                      )
                    }
                    min="1800"
                    max={new Date().getFullYear() + 10}
                    className={`text-black placeholder-gray-400 ${
                      errors.publishingYear ? "border-destructive" : ""
                    }`}
                  />
                  {errors.publishingYear && (
                    <p className="text-sm text-destructive">
                      {errors.publishingYear}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Movie Poster</Label>
                  <ImageUpload
                    value={formData.poster}
                    onChange={(url) => handleInputChange("poster", url)}
                    onRemove={() => handleInputChange("poster", "")}
                  />
                  <p className="text-sm text-gray-500">
                    Upload a poster image for your movie
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white shadow-md"
                  >
                    <Save className="h-4 w-4" />
                    <span>
                      {loading
                        ? "Saving..."
                        : isEditing
                        ? "Update Movie"
                        : "Create Movie"}
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="bg-gradient-to-b from-neutral-900 to-neutral-950 border border-gray-700/30 text-white shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription className="text-gray-400">
                This is how your movie will appear in the collection.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Movie Card Preview */}
                <div className="border border-gray-700/40 rounded-xl overflow-hidden">
                  <div className="aspect-[2/3] relative bg-neutral-800">
                    {formData.poster ? (
                      <Image
                        src={formData.poster || "/placeholder.svg"}
                        alt={formData.title || "Movie poster"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                          <p className="text-sm">No poster uploaded</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">
                      {formData.title || "Movie Title"}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {formData.publishingYear || "Year"}
                    </p>
                  </div>
                </div>

                {/* Form Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Title:</span>
                    <span className="font-medium">
                      {formData.title || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Year:</span>
                    <span className="font-medium">
                      {formData.publishingYear || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Poster:</span>
                    <span className="font-medium">
                      {formData.poster ? "Uploaded" : "Not uploaded"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
