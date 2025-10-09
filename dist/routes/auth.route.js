"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = authRouter;
const express_1 = require("express");
const auth_controller_js_1 = require("../controllers/auth.controller.js");
const auth_js_1 = require("../middleware/auth.js");
function authRouter(env) {
    const r = (0, express_1.Router)();
    r.post("/register", (0, auth_controller_js_1.registerController)(env));
    r.post("/login", (0, auth_controller_js_1.loginController)(env));
    r.post("/logout", (0, auth_controller_js_1.logoutController)(env));
    r.get("/me", (0, auth_js_1.requireAuth)(env), (0, auth_controller_js_1.meController)(env));
    return r;
}
