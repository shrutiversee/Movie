"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Calendar } from "lucide-react"
import type { Movie } from "@/lib/types"
import Image from "next/image"

interface MovieCardProps {
  movie: Movie
  onEdit: (movie: Movie) => void
  onDelete: (movieId: string) => void
}

export function MovieCard({ movie, onEdit, onDelete }: MovieCardProps) {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      onDelete(movie._id!.toString())
    }
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl border border-red-400/20 bg-gradient-to-b from-[#111] to-[#1a1a1a]">
      {/* Poster section */}
      <div className="aspect-[2/3] relative bg-neutral-900 overflow-hidden rounded-t-2xl">
        {movie.poster ? (
          <Image
            src={movie.poster || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              WebkitMaskImage: "-webkit-radial-gradient(white, black)", // Safari rounded fix
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-neutral-800 rounded-xl flex items-center justify-center">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-400">No Poster</p>
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEdit(movie)}
            className="flex items-center gap-1 rounded-lg shadow-md bg-white/90 hover:bg-white text-gray-800"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            className="flex items-center gap-1 rounded-lg shadow-md"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h3
          className="font-semibold text-lg mb-2 line-clamp-2 text-white dark:text-white"
          title={movie.title}
        >
          {movie.title}
        </h3>
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          <Calendar className="h-4 w-4 mr-1 text-gray-300" />
          <span className="text-gray-300">{movie.publishingYear}</span>
        </div>
      </CardContent>
    </Card>
  )
}
