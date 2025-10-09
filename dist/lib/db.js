"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongo = connectMongo;
exports.getDb = getDb;
exports.collection = collection;
const mongodb_1 = require("mongodb");
let client = null;
let db = null;
async function connectMongo(uri, dbName) {
    if (db && client)
        return db; // return if already connected
    try {
        client = new mongodb_1.MongoClient(uri, {
            tls: true,
            retryWrites: true,
            serverSelectionTimeoutMS: 10000,
        });
        console.log("[MongoDB] Connecting to MongoDB...");
        let result = await client.connect();
        console.log(result);
        db = client.db(dbName);
        console.log(`[MongoDB] Connected successfully to database: ${dbName} ✅`);
        // ensure indexes
        await Promise.all([
            db.collection("users").createIndex({ email: 1 }, { unique: true }),
            db.collection("pdfs").createIndex({ ownerId: 1, createdAt: -1 }),
            db.collection("quizzes").createIndex({ ownerId: 1, createdAt: -1 }),
            db.collection("attempts").createIndex({ ownerId: 1, createdAt: -1 }),
        ]);
        console.log("[MongoDB] Indexes ensured successfully ✅");
        return db;
    }
    catch (error) {
        console.error("[MongoDB] Connection failed:", error);
        throw error;
    }
}
function getDb() {
    if (!db)
        throw new Error("DB not initialized. Call connectMongo first.");
    return db;
}
function collection(name) {
    return getDb().collection(name);
}
