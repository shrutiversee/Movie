import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import type { Movie, MovieResponse } from "@/lib/models/Movie"
import { ObjectId } from "mongodb"

/**
 * GET /api/movies
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "8")
    const search = searchParams.get("search") || ""

    const db = await getDatabase()
    const skip = (page - 1) * limit

    const query: any = { userId: new ObjectId(user._id) }
    if (search) query.title = { $regex: search, $options: "i" }

    const movies = await db
      .collection<Movie>("movies")
      .find(query)
      .sort({ title: 1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await db.collection<Movie>("movies").countDocuments(query)

    const movieResponses: MovieResponse[] = movies.map((movie) => ({
      _id: movie._id!.toString(),
      title: movie.title,
      publishingYear: movie.publishingYear,
      poster: movie.poster,
      userId: movie.userId.toString(),
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
    }))

    return NextResponse.json({
      movies: movieResponses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/movies
 * Create a new movie
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { title, publishingYear, poster } = await request.json()
    if (!title || !publishingYear)
      return NextResponse.json({ error: "Title and publishing year are required" }, { status: 400 })

    const db = await getDatabase()

    const newMovie: Omit<Movie, "_id"> = {
      title,
      publishingYear: Number(publishingYear),
      poster,
      userId: new ObjectId(user._id),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Movie>("movies").insertOne(newMovie)

    const movieResponse: MovieResponse = {
      _id: result.insertedId.toString(),
      title: newMovie.title,
      publishingYear: newMovie.publishingYear,
      poster: newMovie.poster,
      userId: newMovie.userId.toString(),
      createdAt: newMovie.createdAt,
      updatedAt: newMovie.updatedAt,
    }

    return NextResponse.json({
      message: "Movie created successfully",
      movie: movieResponse,
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
