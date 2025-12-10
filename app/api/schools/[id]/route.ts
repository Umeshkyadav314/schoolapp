import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const schools = await sql`SELECT * FROM schools WHERE id = ${id}`

    if (schools.length === 0) {
      return NextResponse.json({ error: "School not found" }, { status: 404 })
    }

    return NextResponse.json(schools[0])
  } catch (error) {
    console.error("Error fetching school:", error)
    return NextResponse.json({ error: "Failed to fetch school" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check if user owns this school
    const existing = await sql`SELECT * FROM schools WHERE id = ${id}`
    if (existing.length === 0) {
      return NextResponse.json({ error: "School not found" }, { status: 404 })
    }

    if (existing[0].user_id && existing[0].user_id !== session.userId) {
      return NextResponse.json({ error: "You can only edit your own schools" }, { status: 403 })
    }

    const body = await request.json()
    const { name, address, city, state, contact, image, email_id } = body

    const result = await sql`
      UPDATE schools 
      SET name = ${name}, address = ${address}, city = ${city}, state = ${state}, 
          contact = ${contact}, image = ${image || null}, email_id = ${email_id}
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating school:", error)
    return NextResponse.json({ error: "Failed to update school" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check if user owns this school
    const existing = await sql`SELECT * FROM schools WHERE id = ${id}`
    if (existing.length === 0) {
      return NextResponse.json({ error: "School not found" }, { status: 404 })
    }

    if (existing[0].user_id && existing[0].user_id !== session.userId) {
      return NextResponse.json({ error: "You can only delete your own schools" }, { status: 403 })
    }

    await sql`DELETE FROM schools WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting school:", error)
    return NextResponse.json({ error: "Failed to delete school" }, { status: 500 })
  }
}
