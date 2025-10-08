import { ObjectId } from "mongodb"
import { collection } from "../lib/db.js"
import type { User } from "../types/entities.js"

const usersCol = () => collection<User>("users")

export async function createUser(email: string, passwordHash: string): Promise<User> {
  const now = new Date()
  const result = await usersCol().insertOne({
    _id: new ObjectId().toHexString(),
    email,
    passwordHash,
    createdAt: now,
  })
  const inserted = await usersCol().findOne({ _id: result.insertedId.toString() })
  if (!inserted) throw new Error("Failed to create user")
  return inserted
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return usersCol().findOne({ email })
}

export async function findUserById(id: string): Promise<User | null> {
  return usersCol().findOne({ _id: id })
}
