"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.findUserByEmail = findUserByEmail;
exports.findUserById = findUserById;
const mongodb_1 = require("mongodb");
const db_1 = require("../lib/db");
const usersCol = () => (0, db_1.collection)("users");
async function createUser(email, passwordHash) {
    const now = new Date();
    const result = await usersCol().insertOne({
        _id: new mongodb_1.ObjectId().toHexString(),
        email,
        passwordHash,
        createdAt: now,
    });
    const inserted = await usersCol().findOne({ _id: result.insertedId.toString() });
    if (!inserted)
        throw new Error("Failed to create user");
    return inserted;
}
async function findUserByEmail(email) {
    return usersCol().findOne({ email });
}
async function findUserById(id) {
    return usersCol().findOne({ _id: id });
}
