"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jwt_js_1 = require("../lib/jwt.js");
function requireAuth(env) {
    return (req, res, next) => {
        const token = req.cookies?.token;
        if (!token) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        try {
            const payload = (0, jwt_js_1.verifyJwt)(env, token);
            req.user = { id: payload.sub, email: payload.email };
            next();
        }
        catch {
            res.status(401).json({ error: "Unauthorized" });
        }
    };
}
