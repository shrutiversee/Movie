import type { ObjectId } from "mongodb"

export interface Movie {
  _id?: ObjectId
  title: string
  publishingYear: number
  poster?: string
  userId: ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface MovieResponse {
  _id: string
  title: string
  publishingYear: number
  poster?: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface MovieListResponse {
  movies: MovieResponse[]
  total: number
  page: number
  limit: number
  totalPages: number
}
