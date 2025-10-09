import { Router } from "express"
import type { Env } from "../lib/env.js"
import { registerController, loginController, logoutController, meController } from "../controllers/auth.controller.js"
import { requireAuth } from "../middleware/auth.js"

export function authRouter(env: Env): Router {
  const r = Router()
  r.post("/register", registerController(env))
  r.post("/login", loginController(env))
  r.post("/logout", logoutController(env))
  r.get("/me", requireAuth(env), meController(env))
  return r
}
