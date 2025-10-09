"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = registerController;
exports.loginController = loginController;
exports.logoutController = logoutController;
exports.meController = meController;
const user_repository_1 = require("../repositories/user.repository");
const hash_1 = require("../lib/hash");
const jwt_1 = require("../lib/jwt");
function registerController(_env) {
    return async (req, res) => {
        const { email, password } = req.body;
        console.log(email, password, 'the email and password is comming');
        if (!email || !password) {
            res.status(400).json({ error: "Email and password required" });
            return;
        }
        const existing = await (0, user_repository_1.findUserByEmail)(email);
        if (existing) {
            res.status(409).json({ error: "Email already registered" });
            return;
        }
        const passwordHash = await (0, hash_1.hashPassword)(password);
        const user = await (0, user_repository_1.createUser)(email, passwordHash);
        res.status(201).json({ id: user._id, email: user.email });
    };
}
function loginController(env) {
    return async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password required" });
            return;
        }
        const user = await (0, user_repository_1.findUserByEmail)(email);
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const ok = await (0, hash_1.verifyPassword)(password, user.passwordHash);
        if (!ok) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const token = (0, jwt_1.signJwt)(env, { sub: user._id, email: user.email });
        res.cookie("token", token, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({ id: user._id, email: user.email });
    };
}
function logoutController(_env) {
    return async (_req, res) => {
        res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
        res.json({ ok: true });
    };
}
function meController(_env) {
    return async (req, res) => {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        res.json({ id: req.user.id, email: req.user.email });
    };
}
