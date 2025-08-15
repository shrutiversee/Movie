"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MovieForm } from "@/components/movies/movie-form"
import type { Movie } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface EditMoviePageProps {
  params: Promise<{ id: string }>
}

export default function EditMoviePage({ params }: EditMoviePageProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [movie, setMovie] = useState<Movie | null>(null)
  const [movieLoading, setMovieLoading] = useState(true)
  const [movieId, setMovieId] = useState<string | null>(null)

  // Unwrap the promise to get movieId
  useEffect(() => {
    params
      .then((p) => setMovieId(p.id))
      .catch(() => router.push("/movies"))
  }, [params, router])

  // Redirect if no user
  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  // Fetch movie details
  useEffect(() => {
    if (user && movieId) {
      fetchMovie(movieId)
    }
  }, [user, movieId])

  const fetchMovie = async (id: string) => {
    try {
      setMovieLoading(true)

      const response = await fetch(`/api/movies/${id}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "Movie Not Found",
            description: "The movie you're trying to edit doesn't exist.",
            variant: "destructive",
          })
          router.push("/movies")
          return
        }
        throw new Error("Failed to fetch movie")
      }

      const data = await response.json()
      setMovie(data.movie)
    } catch {
      toast({
        title: "Error",
        description: "Failed to load movie details. Please try again.",
        variant: "destructive",
      })
      router.push("/movies")
    } finally {
      setMovieLoading(false)
    }
  }

  if (loading || movieLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_500px_at_50%_300px,rgba(16,185,129,0.35),transparent)]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_500px_at_50%_300px,rgba(16,185,129,0.35),transparent)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Movie Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The movie you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/movies")}
            className="text-primary hover:underline"
          >
            Back to Movies
          </button>
        </div>
      </div>
    )
  }

  return <MovieForm movie={movie} isEditing={true} />
}
