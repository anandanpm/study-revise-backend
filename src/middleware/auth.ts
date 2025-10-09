import type { Request, Response, NextFunction } from "express"
import type { Env } from "../lib/env.js"
import { verifyJwt } from "../lib/jwt.js"

export interface AuthedRequest extends Request {
  user?: { id: string; email: string }
}

export function requireAuth(env: Env) {
  return (req: AuthedRequest, res: Response, next: NextFunction): void => {
    const token = req.cookies?.token as string | undefined
    if (!token) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }
    try {
      const payload = verifyJwt(env, token)
      req.user = { id: payload.sub, email: payload.email }
      next()
    } catch {
      res.status(401).json({ error: "Unauthorized" })
    }
  }
}
