import type { Request, Response } from "express"
import type { Env } from "../lib/env"
import { findUserByEmail, createUser } from "../repositories/user.repository"
import { hashPassword, verifyPassword } from "../lib/hash"
import { signJwt } from "../lib/jwt"
import type { AuthedRequest } from "../middleware/auth"

export function registerController(_env: Env) {
  return async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as { email?: string; password?: string }
    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" })
      return
    }
    const existing = await findUserByEmail(email)
    if (existing) {
      res.status(409).json({ error: "Email already registered" })
      return
    }
    const passwordHash = await hashPassword(password)
    const user = await createUser(email, passwordHash)
    res.status(201).json({ id: user._id, email: user.email })
  }
}

export function loginController(env: Env) {
  return async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as { email?: string; password?: string }
    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" })
      return
    }
    const user = await findUserByEmail(email)
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" })
      return
    }
    const ok = await verifyPassword(password, user.passwordHash)
    if (!ok) {
      res.status(401).json({ error: "Invalid credentials" })
      return
    }

    const token = signJwt(env, { sub: user._id, email: user.email })
    res.cookie("token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.json({ id: user._id, email: user.email })
  }
}

export function logoutController(_env: Env) {
  return async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie("token", { httpOnly: true, sameSite: "lax" })
    res.json({ ok: true })
  }
}

export function meController(_env: Env) {
  return async (req: AuthedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }
    res.json({ id: req.user.id, email: req.user.email })
  }
}
