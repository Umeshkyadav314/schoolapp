import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const schools = await sql`SELECT * FROM schools ORDER BY created_at DESC`
    return NextResponse.json(schools)
  } catch (error) {
    console.error("Error fetching schools:", error)
    return NextResponse.json({ error: "Failed to fetch schools" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please login to add a school." }, { status: 401 })
    }

    const body = await request.json()
    const { name, address, city, state, contact, image, email_id } = body

    // Validate required fields
    if (!name || !address || !city || !state || !contact || !email_id) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO schools (name, address, city, state, contact, image, email_id, user_id)
      VALUES (${name}, ${address}, ${city}, ${state}, ${contact}, ${image || null}, ${email_id}, ${session.userId})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating school:", error)
    return NextResponse.json({ error: "Failed to create school" }, { status: 500 })
  }
}
