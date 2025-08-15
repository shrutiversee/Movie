// Frontend types for the movie database application
// These match the data structures returned by the Next.js API routes

export interface User {
  _id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface Movie {
  _id: string
  title: string
  publishingYear: number
  poster?: string
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface MovieListResponse {
  movies: Movie[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext?: boolean
  hasPrev?: boolean
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}

export interface ApiError {
  error: string
  status?: number
}

export interface UploadResponse {
  message: string
  url: string
  publicId: string
}

export interface MovieStats {
  totalMovies: number
  recentMovies: number
  yearDistribution: Array<{
    year: number
    count: number
  }>
}
