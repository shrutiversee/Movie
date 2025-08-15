import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyPassword, generateToken } from "@/lib/auth"
import type { User } from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const db = await getDatabase()
    const user = await db.collection<User>("users").findOne({ email })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = generateToken(user._id!.toString())

    // return NextResponse.json({
    //   message: "Login successful",
    //   token,
    //   user: {
    //     _id: user._id!.toString(),
    //     name: user.name,
    //     email: user.email,
    //     createdAt: user.createdAt,
    //     updatedAt: user.updatedAt,
    //   },
    // })

     const response = NextResponse.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id!.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
    response.cookies.set("auth_token", token, {
  httpOnly: true,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
})

return response
    
    
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
