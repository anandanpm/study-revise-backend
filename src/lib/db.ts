import { MongoClient, type Db, type Collection, Document } from "mongodb"

let client: MongoClient | null = null
let db: Db | null = null

export async function connectMongo(uri: string, dbName: string): Promise<Db> {
  if (db && client) return db
  client = new MongoClient(uri)
  await client.connect()
  db = client.db(dbName)
  // ensure basic indexes
  await Promise.all([
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
    db.collection("pdfs").createIndex({ ownerId: 1, createdAt: -1 }),
    db.collection("quizzes").createIndex({ ownerId: 1, createdAt: -1 }),
    db.collection("attempts").createIndex({ ownerId: 1, createdAt: -1 }),
  ])
  return db
}

export function getDb(): Db {
  if (!db) throw new Error("DB not initialized")
  return db
}

export function collection<T extends Document>(name: string): Collection<T> {
  return getDb().collection<T>(name)
}
