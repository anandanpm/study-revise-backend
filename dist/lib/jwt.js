"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function signJwt(env, payload) {
    return jsonwebtoken_1.default.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}
function verifyJwt(env, token) {
    const decoded = jsonwebtoken_1.default.verify(token, env.JWT_SECRET);
    if (typeof decoded === "string")
        throw new Error("Invalid token");
    return decoded;
}
