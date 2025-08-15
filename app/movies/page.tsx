"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/layout/navbar"
import { MovieGrid } from "@/components/movies/movie-grid"
import { Pagination } from "@/components/movies/pagination"
import type { Movie, MovieListResponse } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"

export default function MoviesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [movies, setMovies] = useState<Movie[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
    total: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  // Fetch movies
  const fetchMovies = async (page = 1, query = "") => {
    try {
      setIsLoading(true)
      const data: MovieListResponse = await apiClient.getMovies({
        page,
        limit: 12,
        search: query.trim() || undefined,
      })

      setMovies(data.movies)
      setPagination({
        page: data.page,
        totalPages: data.totalPages,
        hasNext: data.hasNext || data.page < data.totalPages,
        hasPrev: data.hasPrev || data.page > 1,
        total: data.total,
      })
    } catch (error) {
      console.error("Error fetching movies:", error)
      toast({
        title: "Error",
        description: "Failed to load movies. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    if (user) {
      fetchMovies()
    }
  }, [user])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    fetchMovies(1, query)
  }

  const handlePageChange = (page: number) => {
    fetchMovies(page, searchQuery)
  }

  const handleAddMovie = () => {
    router.push("/movies/new")
  }

  const handleEditMovie = (movie: Movie) => {
    router.push(`/movies/edit/${movie._id}`)
  }

  const handleDeleteMovie = async (movieId: string) => {
    try {
      await apiClient.deleteMovie(movieId)
      toast({
        title: "Success",
        description: "Movie deleted successfully.",
      })

      // Refresh the current page
      fetchMovies(pagination.page, searchQuery)
    } catch (error) {
      console.error("Error deleting movie:", error)
      toast({
        title: "Error",
        description: "Failed to delete movie. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(circle_at_right_bottom,rgba(16,185,129,0.35),transparent)]">
      <Navbar onSearch={handleSearch} onAddMovie={handleAddMovie} searchQuery={searchQuery} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-[#60eccb] 
            to-[#a8b8ae] mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : "My Movies"}
          </h1>
          <p className="text-amber-50/60">
            {pagination.total} {pagination.total === 1 ? "movie" : "movies"} in your collection
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Movie Grid */}
            <MovieGrid movies={movies} onEdit={handleEditMovie} onDelete={handleDeleteMovie} />

            {/* Pagination */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              hasNext={pagination.hasNext}
              hasPrev={pagination.hasPrev}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
    </div>
  )
}
