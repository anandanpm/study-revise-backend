import { MongoClient, type Db, type Collection, Document } from "mongodb"

let client: MongoClient | null = null
let db: Db | null = null

export async function connectMongo(uri: string, dbName: string): Promise<Db> {
  if (db && client) return db // return if already connected

  try {
    client = new MongoClient(uri, {
      tls: true,
      retryWrites: true,
      serverSelectionTimeoutMS: 10000,
    })

    console.log("[MongoDB] Connecting to MongoDB...")
    let result =await client.connect() 
    console.log(result)
    db = client.db(dbName)

    console.log(`[MongoDB] Connected successfully to database: ${dbName} ✅`)

    // ensure indexes
    await Promise.all([
      db.collection("users").createIndex({ email: 1 }, { unique: true }),
      db.collection("pdfs").createIndex({ ownerId: 1, createdAt: -1 }),
      db.collection("quizzes").createIndex({ ownerId: 1, createdAt: -1 }),
      db.collection("attempts").createIndex({ ownerId: 1, createdAt: -1 }),
    ])
    console.log("[MongoDB] Indexes ensured successfully ✅")

    return db
  } catch (error) {
    console.error("[MongoDB] Connection failed:", error)
    throw error
  }
}

export function getDb(): Db {
  if (!db) throw new Error("DB not initialized. Call connectMongo first.")
  return db
}

export function collection<T extends Document>(name: string): Collection<T> {
  return getDb().collection<T>(name)
}
