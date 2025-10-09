"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const db_1 = require("./lib/db");
const env_1 = require("./lib/env");
async function main() {
    try {
        const env = (0, env_1.loadEnv)();
        console.log("[server] Starting server...");
        console.log("[server] Connecting to MongoDB...");
        const db = await (0, db_1.connectMongo)(env.MONGODB_URI, env.MONGODB_DB_NAME);
        console.log(`[MongoDB] Connected successfully to database: ${env.MONGODB_DB_NAME} ✅`);
        const app = (0, server_1.createServer)(env);
        app.listen(env.PORT, () => {
            console.log(`[server] Listening on http://localhost:${env.PORT}`);
        });
    }
    catch (err) {
        console.error("[server] Fatal startup error:", err);
        process.exit(1);
    }
}
main();
