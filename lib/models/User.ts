import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export interface UserResponse {
  _id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}
