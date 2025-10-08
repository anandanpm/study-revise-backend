import jwt from "jsonwebtoken"
import type { Env } from "./env.js"

export interface JwtPayload {
  sub: string
  email: string
}

export function signJwt(env: Env, payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" })
}

export function verifyJwt(env: Env, token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET)
  if (typeof decoded === "string") throw new Error("Invalid token")
  return decoded as JwtPayload
}
