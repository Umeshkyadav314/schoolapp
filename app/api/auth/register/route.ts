import { sql } from "@/lib/db"
import { hashPassword, createSession, SESSION_COOKIE_NAME } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, country_code, password } = body

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate phone (10 digits only)
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json({ error: "Phone number must be exactly 10 digits" }, { status: 400 })
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Check if user exists
    const existingUsers = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Hash password
    const password_hash = await hashPassword(password)

    // Create user
    const result = await sql`
      INSERT INTO users (name, email, phone, country_code, password_hash)
      VALUES (${name}, ${email}, ${phone}, ${country_code || "+91"}, ${password_hash})
      RETURNING id, name, email, phone, country_code, created_at
    `

    const user = result[0]

    // Create session
    const sessionData = await createSession(user as any)

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } }, { status: 201 })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
