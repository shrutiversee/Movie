"use client"

import { MovieCard } from "./movie-card"
import type { Movie } from "@/lib/types"

interface MovieGridProps {
  movies: Movie[]
  onEdit: (movie: Movie) => void
  onDelete: (movieId: string) => void
}

export function MovieGrid({ movies, onEdit, onDelete }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800 flex items-center justify-center shadow-md">
          <svg
            className="w-12 h-12 text-indigo-500 dark:text-indigo-300"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM3 8v11a2 2 0 002 2h14a2 2 0 002-2V8H3z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No movies yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-sm">
          Start building your collection by adding your first movie.
        </p>
      </div>
    )
  }

  return (
    <div
      className="
        grid gap-6 px-2 sm:px-4 lg:px-6
        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
      "
      // Safari fix: ensure flex-basis is respected
      style={{ WebkitFlex: "1 0 auto" }}
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie._id!.toString()}
          movie={movie}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
