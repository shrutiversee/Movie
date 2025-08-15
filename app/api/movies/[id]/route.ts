import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import type { Movie, MovieResponse } from "@/lib/models/Movie"
import { ObjectId } from "mongodb"

/**
 * GET /api/movies/:id
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const user = await getCurrentUser(request)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const db = await getDatabase()
    const movie = await db.collection<Movie>("movies").findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(user._id),
    })

    if (!movie) return NextResponse.json({ error: "Movie not found" }, { status: 404 })

    const movieResponse: MovieResponse = {
      _id: movie._id!.toString(),
      title: movie.title,
      publishingYear: movie.publishingYear,
      poster: movie.poster,
      userId: movie.userId.toString(),
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
    }

    return NextResponse.json({ movie: movieResponse })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * PUT /api/movies/:id
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const user = await getCurrentUser(request)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { title, publishingYear, poster } = body

    if (!title || !publishingYear)
      return NextResponse.json(
        { error: "Title and publishing year are required" },
        { status: 400 }
      )

    const db = await getDatabase()
    const userIdQuery = [new ObjectId(user._id), user._id]

    const result = await db.collection<Movie>("movies").findOneAndUpdate(
      {
        _id: new ObjectId(id),
        userId: { $in: userIdQuery },
      },
      {
        $set: {
          title,
          publishingYear: Number(publishingYear),
          poster,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    )

    const movieResponse: MovieResponse = {
      _id: result.value?._id?.toString() || id,
      title,
      publishingYear: Number(publishingYear),
      poster,
      userId: user._id.toString(),
      createdAt: result.value?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json({
      message: "Movie updated successfully",
      movie: movieResponse,
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * DELETE /api/movies/:id
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  try {
    const user = await getCurrentUser(request)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const db = await getDatabase()
    const result = await db.collection<Movie>("movies").deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(user._id),
    })

    if (result.deletedCount === 0)
      return NextResponse.json({ error: "Movie not found" }, { status: 404 })

    return NextResponse.json({ message: "Movie deleted successfully" })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
