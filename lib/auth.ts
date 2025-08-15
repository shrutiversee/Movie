import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import type { NextRequest } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { User, UserResponse } from "@/lib/models/User"
import { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}



export async function getCurrentUser(request: NextRequest) {
  try {
    // First check Authorization header
    let token = request.headers.get("authorization")?.replace("Bearer ", "")

    // If not found, check cookies
    if (!token) {
      token = request.cookies.get("auth_token")?.value
    }

    if (!token) return null

    const decoded = verifyToken(token)
    if (!decoded) return null

    const db = await getDatabase()
    const user = await db
      .collection<User>("users")
      .findOne({ _id: new ObjectId(decoded.userId) }, { projection: { password: 0 } })

    if (!user) return null

    return {
      _id: user._id!.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  } catch (error) {
    console.error("getCurrentUser error:", error)
    return null
  }
}



