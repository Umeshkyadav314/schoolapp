import { sql } from "./db"
import { cookies } from "next/headers"

export interface User {
  id: number
  name: string
  email: string
  phone: string
  country_code: string
  created_at: Date
}

export interface Session {
  userId: number
  email: string
  name: string
}

const SESSION_COOKIE_NAME = "school_hub_session"

// Simple hash function for password (in production, use bcrypt)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + process.env.DATABASE_URL)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

export async function createSession(user: User): Promise<string> {
  const session: Session = {
    userId: user.id,
    email: user.email,
    name: user.name,
  }
  const sessionData = Buffer.from(JSON.stringify(session)).toString("base64")
  return sessionData
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!sessionCookie?.value) {
    return null
  }

  try {
    const session = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString())
    return session as Session
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  if (!session) return null

  try {
    const users =
      await sql`SELECT id, name, email, phone, country_code, created_at FROM users WHERE id = ${session.userId}`
    return (users[0] as User) || null
  } catch {
    return null
  }
}

export { SESSION_COOKIE_NAME }
